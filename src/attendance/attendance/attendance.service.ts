import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { QueryService } from 'src/helper/query.service';
import { UserService } from 'src/user/user.service';
import AttendanceStatus from './enum/AttendanceStatusEnum';
import moment, * as JalaliMoment from 'jalali-moment';
import { ConnectableObservable } from 'rxjs';
import { ShiftService } from 'src/shift/shift.service';
import { ShiftDay } from 'src/shift/entities/shift_day.entity';
import * as jalaali from 'jalaali-js'
import { WorkTrack } from 'src/projects/work_track/entities/work_track.entity';
import { TaskService } from 'src/projects/task/task.service';
import { WorkTrackService } from 'src/projects/work_track/work_track.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateWorkTrackDto } from 'src/projects/work_track/dto/create-work_track.dto';
import { SettingService } from 'src/setting/setting.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance) private AttendanceRepository: Repository<Attendance>,
    @InjectRepository(ShiftDay) private shiftDayRepository: Repository<ShiftDay>,
    // @InjectRepository(WorkTrack) private workTrackRepository: Repository<WorkTrack>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly queryService: QueryService,
    private userService: UserService,
    private workTrackService: WorkTrackService,
    private shiftService: ShiftService,
    private settingService: SettingService
  ) { }

  async onlineAttendance(createAttendanceDto: CreateAttendanceDto) {
    const onlineAttendance = await this.settingService.findOne('online-attendance')
    if (createAttendanceDto.type == 'APP' && onlineAttendance.value == 'false') {
      return false
    }
  }

  async minimumAttendance(createAttendanceDto: CreateAttendanceDto) {
    const minimumAttendance = +await this.settingService.findOne('minimum-attendance')
    if (createAttendanceDto.end_time - minimumAttendance < createAttendanceDto.start_time) {
      return false
    }
  }

  // ایجاد یک رکورد حضور و غیاب جدید
  async create(createAttendanceDto: CreateAttendanceDto) {
    if (createAttendanceDto.start_time == "now") createAttendanceDto.start_time = Math.floor(Date.now() / 1000);
    else if (createAttendanceDto.start_time) createAttendanceDto.start_time = Math.floor(Date.parse(createAttendanceDto.start_time) / 1000)
    if (createAttendanceDto.end_time) createAttendanceDto.end_time = Math.floor(Date.parse(createAttendanceDto.end_time) / 1000)

    const attendance = this.AttendanceRepository.create({
      ...createAttendanceDto
    })
    const createAttendance = await this.AttendanceRepository.save(attendance)

    if (createAttendanceDto.end_time) {
      // const attendanceShift = await this.attendanceShift(createAttendance.id, createAttendance.user_id)
      // createAttendance['Shift'] = attendanceShift

      if (createAttendanceDto.task_id) {
        const timeAttendance = createAttendanceDto.end_time - createAttendanceDto.start_time
        const createWorkTrack: any = { task_id: createAttendanceDto.task_id, attendance_id: createAttendance.id, time: timeAttendance }
        console.log(createWorkTrack)
        const workTrack = await this.workTrackService.create(createWorkTrack)
      }
    }

    if (createAttendanceDto.task_id && !createAttendanceDto.end_time) {
      console.log(createAttendance.id.toString())
      this.cacheManager.set(createAttendance.id.toString(), createAttendanceDto.task_id, 86400)
    }
    createAttendance['start_time_date'] = createAttendance.start_time ? new Date(createAttendance?.start_time * 1000) : null
    createAttendance['end_time_date'] = createAttendance.end_time ? new Date(createAttendance.end_time * 1000) : null

    return createAttendance

  }

  async checkValidTimeAttendance(start_time: number, end_time: number) {
    const max_time = await this.settingService.findOne("maximum-attendance-time");

    if (max_time.value) {
      let max_valid = parseInt(max_time.value)

      if (start_time && end_time) {
        let max_submited = end_time - start_time
        if (max_submited > max_valid) return { success: false, msg: "تایم تردد شما بیش از حد مجاز است!" }
      }
    }
    return { success: true, msg: "SUCCESS" }
  }
  // بازیابی تمام رکوردهای حضور و غیاب
  async findAll(condition: any) {
    const data = await this.AttendanceRepository.find({ where: condition, order: { id: 'DESC' } });

    await Promise.all(data.map(async (element) => {
      element['start_time_date'] = element.start_time ? new Date(element?.start_time * 1000) : null
      element['end_time_date'] = element.end_time ? new Date(element.end_time * 1000) : null
    }));
    return data;
  }

  async findAllByFilter(filter: any, condition: any) {
    console.log("---------------------")
    console.log(filter)
    console.log("---------------------")
    await this.convertDateToTimestamp(filter)
    const queryBuilder = this.queryService.createFilterQuery(this.AttendanceRepository, filter, "attendance", condition);
    const data = await queryBuilder.getMany();
    // console.log(queryBuilder.getQueryAndParameters())
    // انتظار می‌رود که userService.findOne از نوع Promise باشد
    await Promise.all(data.map(async (element) => {
      // const user = await this.userService.findOne(element['user_id']);
      // element['user'] = user;
      element['start_time_date'] = element.start_time ? new Date(element?.start_time * 1000) : null
      element['end_time_date'] = element.end_time ? new Date(element.end_time * 1000) : null

      // work_trackc
      const work_track = await this.workTrackService.findProjectAndTaskByAttendance(element["id"])

      const transformedData = work_track.map(workTrackItem => {
        const transformedTask = {
          id: workTrackItem.tasks.id,
          user_id: workTrackItem.tasks.user_id,
          title: workTrackItem.tasks.title,
          description: workTrackItem.tasks.description,
          time_range: workTrackItem.tasks.time_range,
          hourly_fee: workTrackItem.tasks.hourly_fee,
          status: workTrackItem.tasks.status,
          createdAt: workTrackItem.tasks.createdAt,
          updatedAt: workTrackItem.tasks.updatedAt,
        };

        const transformedActivity = {
          id: workTrackItem.tasks.activities.id,
          title: workTrackItem.tasks.activities.title,
          createdAt: workTrackItem.tasks.activities.createdAt,
          updatedAt: workTrackItem.tasks.activities.updatedAt,
        };

        const transformedProject = {
          id: workTrackItem.tasks.activities.projects.id,
          code: workTrackItem.tasks.activities.projects.code,
          name: workTrackItem.tasks.activities.projects.name,
          manager_id: workTrackItem.tasks.activities.projects.manager_id,
          employer: workTrackItem.tasks.activities.projects.employer,
          from_date: workTrackItem.tasks.activities.projects.from_date,
          until_date: workTrackItem.tasks.activities.projects.until_date,
          cost: workTrackItem.tasks.activities.projects.cost,
          status: workTrackItem.tasks.activities.projects.status,
          createdAt: workTrackItem.tasks.activities.projects.createdAt,
          updatedAt: workTrackItem.tasks.activities.projects.updatedAt,
        };

        return {
          id: workTrackItem.id,
          attendance_id: workTrackItem.attendance_id,
          time: workTrackItem.time,
          createdAt: workTrackItem.createdAt,
          updatedAt: workTrackItem.updatedAt,
          tasks: transformedTask,
          activities: transformedActivity,
          projects: transformedProject,
        };
      });

      element['work_track'] = transformedData
    }));
    return data;
  }

  // تابعی برای تبدیل تاریخ به تایم استمپ
  convertDateToTimestamp(filter: any) {
    if (filter.fields && filter.fields.length > 0) {
      filter.fields.forEach((field) => {
        if (field.key === "start_time" && field.value) {
          field.value = new Date(field.value).getTime() / 1000;
        }
        if (field.key === "end_time" && field.value) {
          field.value = new Date(field.value).getTime() / 1000;
        }
      });
    }
    console.log(filter)
    return filter;
  }

  async findOneOrginal(id: number) {
    return this.AttendanceRepository.findOneBy({ id })
  }

  // بازیابی یک رکورد حضور و غیاب بر اساس شناسه
  async findOne(condition: any) {
    const data = await this.AttendanceRepository.findOneBy(condition)
    data['start_time_date'] = data.start_time ? new Date(data?.start_time * 1000) : null
    data['end_time_date'] = data.end_time ? new Date(data.end_time * 1000) : null

    // work_track
    const work_track = await this.workTrackService.findProjectAndTaskByAttendance(data.id)

    const transformedData = work_track.map(workTrackItem => {
      const transformedTask = {
        id: workTrackItem.tasks.id,
        user_id: workTrackItem.tasks.user_id,
        title: workTrackItem.tasks.title,
        description: workTrackItem.tasks.description,
        time_range: workTrackItem.tasks.time_range,
        hourly_fee: workTrackItem.tasks.hourly_fee,
        status: workTrackItem.tasks.status,
        createdAt: workTrackItem.tasks.createdAt,
        updatedAt: workTrackItem.tasks.updatedAt,
      };

      const transformedActivity = {
        id: workTrackItem.tasks.activities.id,
        title: workTrackItem.tasks.activities.title,
        createdAt: workTrackItem.tasks.activities.createdAt,
        updatedAt: workTrackItem.tasks.activities.updatedAt,
      };

      const transformedProject = {
        id: workTrackItem.tasks.activities.projects.id,
        code: workTrackItem.tasks.activities.projects.code,
        name: workTrackItem.tasks.activities.projects.name,
        manager_id: workTrackItem.tasks.activities.projects.manager_id,
        employer: workTrackItem.tasks.activities.projects.employer,
        from_date: workTrackItem.tasks.activities.projects.from_date,
        until_date: workTrackItem.tasks.activities.projects.until_date,
        cost: workTrackItem.tasks.activities.projects.cost,
        status: workTrackItem.tasks.activities.projects.status,
        createdAt: workTrackItem.tasks.activities.projects.createdAt,
        updatedAt: workTrackItem.tasks.activities.projects.updatedAt,
      };


      return {
        id: workTrackItem.id,
        attendance_id: workTrackItem.attendance_id,
        time: workTrackItem.time,
        createdAt: workTrackItem.createdAt,
        updatedAt: workTrackItem.updatedAt,
        tasks: transformedTask,
        activities: transformedActivity,
        projects: transformedProject,
      };
    });

    data['work_track'] = transformedData

    return data
  }

  // به‌روزرسانی یک رکورد حضور و غیاب بر اساس درخواست ارسالی
  async update(condition: any, updateRequest: any) {
    const cache = await this.cacheManager.get(condition['id'])
    if (cache) {
      const attendance = await this.AttendanceRepository.findOneBy(condition['id'])
      const timeAttendance = attendance.end_time - attendance.start_time
      const createWorkTrack: any = { task_id: parseInt(cache.toString()), attendance_id: condition['id'], time: timeAttendance }
      const workTrack = await this.workTrackService.create(createWorkTrack)
    }

    return this.AttendanceRepository.update(condition, updateRequest)
  }

  async updateLatestRecordByUserId(user_id: number, updateRequest: any) {
    if (updateRequest.end_time) updateRequest.end_time = Math.floor(Date.parse(updateRequest.end_time) / 1000)
    // به دست آوردن آخرین رکورد بر اساس user_id
    const latestRecord = await this.AttendanceRepository
      .createQueryBuilder("attendance")
      .where("attendance.user_id = :user_id", { user_id })
      .orderBy("attendance.id", "DESC")
      .take(1)
      .getOne();

    if (latestRecord) {
      // آپدیت کردن آخرین رکورد
      return this.AttendanceRepository.update(latestRecord.id, updateRequest);
    } else {
      // اگر رکوردی یافت نشد
      throw new Error("رکوردی برای آپدیت یافت نشد.");
    }
  }

  async checkNonRepetitiveReacord(user_id: number, start_time: any) {
    if (start_time == "now") start_time = Math.floor(Date.now() / 1000);
    else start_time = Math.floor(Date.parse(start_time) / 1000)
    // console.log(start_time)
    const latestRecord = await this.AttendanceRepository
      .createQueryBuilder("attendance")
      .andWhere("attendance.user_id = :user_id", { user_id })
      .andWhere("attendance.start_time <= :start_time", { start_time })
      .andWhere("attendance.end_time >= :start_time", { start_time })
      .take(1)
      .getOne();

    return latestRecord
  }

  async changeStatusSET(condition: any) {
    const attendanceToUpdate = await this.AttendanceRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.AttendanceRepository.update(condition, { status: AttendanceStatus.SET })
  }

  async changeStatusUNFINISHED(condition: any) {
    const attendanceToUpdate = await this.AttendanceRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.AttendanceRepository.update(condition, { status: AttendanceStatus.UNFINISHED })
  }

  async changeStatusABSENCE(condition: any) {
    const attendanceToUpdate = await this.AttendanceRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.AttendanceRepository.update(condition, { status: AttendanceStatus.ABSENCE })
  }

  // حذف یک رکورد حضور و غیاب بر اساس شناسه
  remove(id: number) {
    return this.AttendanceRepository.delete(id)
  }

  removeAll() {
    return this.AttendanceRepository.delete({})
  }

  async calculateWorkTimeInDateRange(userId: number, startDate: any, endDate: any): Promise<any> {
    const attendanceQuery = this.AttendanceRepository
      .createQueryBuilder('attendance')
      .select(['attendance.start_time', 'attendance.end_time'])
      .where('attendance.user_id = :userId', { userId })
      .andWhere('attendance.start_time >= :startDate', { startDate })
      .andWhere('attendance.start_time <= :endDate', { endDate })
      .andWhere('attendance.start_time IS NOT NULL')
      .andWhere('attendance.end_time IS NOT NULL');

    const attendanceData = await attendanceQuery.getRawMany();

    let totalWorkTime = 0;

    attendanceData.forEach((attendance) => {
      console.log(attendance)

      const startTime = new Date(attendance.attendance_start_time);
      const endTime = new Date(attendance.attendance_end_time);
      const workTime = endTime.getTime() - startTime.getTime();
      attendance.attendance_start_time = this.convertTimestampToTime(attendance.attendance_start_time)
      attendance.attendance_end_time = this.convertTimestampToTime(attendance.attendance_end_time)

      totalWorkTime += workTime;
    });

    let workTimeResult = "00:00:00"

    if (totalWorkTime) {
      workTimeResult = this.convertTimestampToTime(totalWorkTime)
    }
    let result = { workTimeResult: workTimeResult, totalWorkTime: totalWorkTime }

    return result;
  }

  async getLatestAttendance(userId: number) {
    const setting = await this.settingService.findOne("maximum-attendance-time")
    let max_time = null
    if (setting.value) max_time = parseInt(setting.value)

    const attendanceData = await this.AttendanceRepository.findOne({
      where: { user_id: userId },
      order: { createdAt: 'DESC' },
    });

    if (attendanceData) attendanceData['start_time_date'] = new Date(attendanceData?.start_time * 1000)

    return { attendance: attendanceData, max_time: max_time };
  }

  convertTimestampToTime(timestamp: number): string {
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp % 3600) / 60);
    const seconds = timestamp % 60;

    const formattedTime = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
    return formattedTime;
  }

  private padZero(value: number): string {
    return value.toString().padStart(2, '0');
  }

  // async attendanceShift(id: number, user_id: number) {
  //   let absence = [], numbrer = 0, convertTimestampToTimeS, convertTimestampToTimeE
  //   // console.log(user_id)
  //   const attendance = await this.AttendanceRepository.findOneByOrFail({ id })

  //   const attendanceTimeStampS = new Date(attendance.start_time * 1000);
  //   const attendanceTimeStampE = new Date(attendance.end_time * 1000);
  //   let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
  //   // let dayName = days[attendanceWeekDay.getDay()];

  //   const shift = await this.shiftService.shiftQuery(user_id, attendanceTimeStampS.getDay() + 1)

  //   if (!shift) {
  //     return 'shift null'
  //   }

  //   //.......................................StartTime
  //   console.log(shift)
  //   const shiftFrom = shift.from
  //   let attendanceHourS = attendanceTimeStampS.getHours() + ':' + attendanceTimeStampS.getMinutes() + ':' + attendanceTimeStampS.getSeconds();
  //   let attendanceSegregatedS = attendanceHourS.split(':')
  //   let attendanceTimeDifferenceS = (+attendanceSegregatedS[0] * 3600) + (+attendanceSegregatedS[1] * 60) + (+attendanceSegregatedS[2])

  //   if (shiftFrom < attendanceTimeDifferenceS) {
  //     convertTimestampToTimeS = attendanceTimeDifferenceS - shiftFrom
  //     absence[numbrer++] = (`absence: from ${await this.convertTimestampToTime(shiftFrom)} to ${await this.convertTimestampToTime(shiftFrom + convertTimestampToTimeS)}`)
  //     const updateAbsence = await this.AttendanceRepository.update({ id }, { status: AttendanceStatus.ABSENCE })
  //   }
  //   //.......................................EndTime
  //   const shiftto = shift.to
  //   let attendanceHourE = attendanceTimeStampE.getHours() + ':' + attendanceTimeStampE.getMinutes() + ':' + attendanceTimeStampE.getSeconds();
  //   let attendanceSegregatedE = attendanceHourE.split(':')
  //   let attendanceTimeDifferenceE = (+attendanceSegregatedE[0] * 3600) + (+attendanceSegregatedE[1] * 60) + (+attendanceSegregatedE[2])

  //   if (shiftto > attendanceTimeDifferenceE) {
  //     convertTimestampToTimeE = attendanceTimeDifferenceE - shiftto
  //     absence[numbrer++] = (`absence: from ${await this.convertTimestampToTime(shiftto + convertTimestampToTimeE)} to ${await this.convertTimestampToTime(shiftto)}`)
  //     const updateAbsence = await this.AttendanceRepository.update({ id }, { status: AttendanceStatus.ABSENCE })
  //   }

  //   return absence

  // }


  async convetHourToTimestamp(hour: string) {
    let attendanceSegregatedS = hour.split(':')
    return (+attendanceSegregatedS[0] * 3600) + (+attendanceSegregatedS[1] * 60) + (+attendanceSegregatedS[2])

  }

  async attendanceShift() {
    let convertTimestampToTimeS, convertTimestampToTimeE
    let attendanceTimeStampS, attendanceTimeStampE, shift
    const attendanceArray = []
    const timestampEndDay = Date.now() - 1
    const weekDay = new Date(timestampEndDay).getDay() + 1
    // console.log(timestampEndDay)
    // console.log(weekDay)
    const timestampStartDay = timestampEndDay / 1000 - 86400
    const shiftArray = await this.shiftService.findAllShiftUser(weekDay)
    // console.log(shiftArray)

    for (const valueArray of shiftArray) {
      // console.log(valueArray)
      const attendance = await this.AttendanceRepository.createQueryBuilder('attendance')
        .where(`attendance.user_id = ${valueArray['shift_user_id']}`)
        .orderBy('attendance.start_time', 'ASC')
        .andWhere(`attendance.start_time > ${Math.floor(timestampStartDay)}`)
        .andWhere(`attendance.start_time < ${Math.floor(timestampEndDay / 1000)}`)
        .andWhere('attendance.end_time > 0')
        .getMany()

      if (attendance.length) {
        let shiftFrom = valueArray['shift_day_from']
        let shiftto = valueArray['shift_day_to']
        // shift = await this.shiftService.shiftQueryBuilder(valueArray['shift_user_id'], weekDay)

        // console.log(attendance)
        for (const value of attendance) {
          // console.log(value)
          let absence, numbrer = 0

          attendanceTimeStampS = new Date(value['start_time'] * 1000)
          // console.log(value['start_time'])
          attendanceTimeStampE = new Date(value['end_time'] * 1000)

          let attendanceHourS = attendanceTimeStampS.getHours() + ':' + attendanceTimeStampS.getMinutes() + ':' + attendanceTimeStampS.getSeconds();
          let attendanceTimeDifferenceS = await this.convetHourToTimestamp(attendanceHourS)

          if (shiftFrom <= attendanceTimeDifferenceS && attendanceTimeDifferenceS <= shiftto) {
            if (!valueArray['startShift'])
              valueArray['startShift'] = shiftFrom
            // console.log(valueArray['startShift'])

            convertTimestampToTimeS = attendanceTimeDifferenceS - valueArray['startShift']
            // console.log(value, convertTimestampToTimeS)
            absence = valueArray['startShift'] + convertTimestampToTimeS

            if (!valueArray['absence'])
              valueArray['absence'] = []

            if (valueArray['startShift'] != absence)
              valueArray['absence'].push({ startAbsence: valueArray['startShift'], endAbsence: absence })
            // console.log(valueArray['absence'])

            // console.log(valueArray['absence'])
            // console.log(absence)
            // absence[numbrer++] = (`absence: from ${await this.convertTimestampToTime(shiftFrom)} to ${await this.convertTimestampToTime(shiftFrom + convertTimestampToTimeS)}`)
            // console.log(valueArray['absenceStartFrom']) //زمانی که باید بیاد
            // console.log(valueArray['absenceStartTo']) //زمانی که اومده
            // valueArray['absenceStartFrom'] = (await this.convertTimestampToTime(shiftFrom))
            // console.log('shiftFrom  ' ,await this.convertTimestampToTime(shiftFrom))
            // valueArray['absenceStartTo'] = (await this.convertTimestampToTime(shiftFrom + convertTimestampToTimeS))
            // console.log(await this.convertTimestampToTime(convertTimestampToTimeS))
            // console.log(await this.convertTimestampToTime(shiftFrom + convertTimestampToTimeS))
          }

          //....................... EndTime

          let attendanceHourE = attendanceTimeStampE.getHours() + ':' + attendanceTimeStampE.getMinutes() + ':' + attendanceTimeStampE.getSeconds();
          let attendanceTimeDifferenceE = await this.convetHourToTimestamp(attendanceHourE)

          if (shiftto >= attendanceTimeDifferenceE) {
            // console.log(valueArray['startShift'])
            valueArray['startShift'] = attendanceTimeDifferenceE
            // console.log(attendanceTimeDifferenceE)
            // console.log(attendanceTimeDifferenceE)
            // console.log(convertTimestampToTimeE)
            // console.log(valueArray['startShift'])
            if (!valueArray['absenceEnd'])
              valueArray['absenceEnd'] = []

            if (valueArray['startShift'] != shiftto)
              valueArray['absenceEnd'] = { startAbsence: valueArray['startShift'], endAbsence: shiftto }
            else
              valueArray['absenceEnd'] = null

            // absence = valueArray['startShift'] + convertTimestampToTimeS
            // if (!valueArray['absence'])
            //   valueArray['absence'] = []
            // valueArray['absence'].push([shiftFrom, absence])
            // valueArray['startShift'] = attendanceTimeDifferenceE
            // convertTimestampToTimeE = attendanceTimeDifferenceE - shiftto
            // console.log('convertTimestampToTimeE  ', convertTimestampToTimeE)
            // valueArray['endAttendanceTime'] = 
            // console.log('convertTimestampToTimeE  ', await this.convertTimestampToTime(shiftto + convertTimestampToTimeE))
            // absence[numbrer++] = (`absence: from ${await this.convertTimestampToTime(shiftto + convertTimestampToTimeE)} to ${await this.convertTimestampToTime(shiftto)}`)
            // console.log(valueArray['absenceEndFrom']) //زمانی که رفته
            // console.log(valueArray['absenceEndTo']) //زمانی که باید بره
            // valueArray['absenceEndFrom'] = (await this.convertTimestampToTime(shiftto))
            // valueArray['absenceEndFrom'] = (await this.convertTimestampToTime(shiftto + convertTimestampToTimeE))
          }

          // console.log(attendanceTimeStampS)
          // console.log(attendanceTimeStampE)
          // console.log(shiftFrom) 
          // console.log(shiftto) 
          // console.log(attendanceHourS)
          // console.log(attendanceHourE)
          // console.log(attendanceTimeDifferenceS)
          // console.log(attendanceTimeDifferenceE)
          // console.log(convertTimestampToTimeS)
          // console.log(convertTimestampToTimeE)
          // value['absence'] = absence
          // console.log(value['absenceEndFrom'])
          // console.log(value['absenceEndTo'])
          // console.log(valueArray)
          // console.log(absence)
          // console.log('..........')
        }
      }
      else {
        valueArray['absence'] = []
        valueArray['absence'].push({ startAbsence: valueArray['shift_day_from'], endAbsence: valueArray['shift_day_to'] })
        // console.log(valueArray['shift_day_from'])
      }


      attendanceArray.push(valueArray)
    }
    // console.log(attendanceArray)

    const attendance = {
      user_id: null,
      start_time: null,
      end_time: null
    }

    // console.log(attendanceArray['absence'])
    for (const valueArray of attendanceArray) {
      if (valueArray['absence']) {
        attendance.user_id = valueArray['shift_user_id']
        for (const value of valueArray['absence']) {
          attendance.start_time = value['startAbsence']
          attendance.end_time = value['endAbsence']
          await this.createAttendanceAbsence(attendance)
        }
      }

      if (valueArray['absenceEnd']) {
        // console.log(valueArray['absenceEnd'])
        if (valueArray['absenceEnd']['startAbsence']) {
          attendance.start_time = valueArray['absenceEnd']['startAbsence']
          attendance.end_time = valueArray['absenceEnd']['endAbsence']
          await this.createAttendanceAbsence(attendance)
        }
      }
    }

    return attendanceArray
  }

  async createAttendanceAbsence(data: any) {
    let { user_id, start_time, end_time } = data
    const timestampStartDay = Math.floor((1704313800000) / 1000 - 86400)
    start_time += timestampStartDay
    end_time += timestampStartDay

    const attendance = await this.AttendanceRepository.create({
      user_id,
      start_time,
      end_time,
      status: AttendanceStatus.ABSENCE,
    })

    return this.AttendanceRepository.save(attendance)
  }

}
