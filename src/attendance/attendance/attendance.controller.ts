import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Request, HttpStatus, Inject } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import ResponseFormat, { ResponseFormatType } from '../../utils/Addons/response-formats';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Attendance } from './entities/attendance.entity';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { ChangeStatusDto } from 'src/public/dto/change-status.dto';
import UserType from 'src/user/enum/UserTypeEnum';
import moment, * as JalaliMoment from 'jalali-moment'; // برای تبدیل تاریخ شمسی به میلادی
import { Public } from 'src/auth/public.decorator';
import { UserService } from 'src/user/user.service';
import AttendanceType from './enum/AttendanceTypeEnum';
import { AttendanceRecordsDto } from './dto/import-attendance.dto';
import AttendanceStatus from './enum/AttendanceStatusEnum';
import { DateTime } from "luxon";
import { subHours } from 'date-fns';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiTags('attendance - حضور غیاب ها')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService, private readonly userService: UserService, @Inject(CACHE_MANAGER) private cacheManager: Cache,) { }

  @Post("importAttendance")
  @Public()
  async importAttendance(@Body() attendanceArray: AttendanceRecordsDto) {
    try {
      let beforRecords = []
      const createAttendanceDto: CreateAttendanceDto = {
        user_id: 0,
        task_id: 0,
        start_time: "0",
        end_time: null,
        type: AttendanceType.DEVICE,
        status: AttendanceStatus.UNFINISHED
      };

      const updateAttendanceDto = {
        user_id: 0,
        end_time: "0",
        status: AttendanceStatus.SET
      };

      // const getTimeStamp = 

      // const nowTimeStamp =;
      const rec = await this.attendanceService.findAllByFilter({
        "pageNumber": 1,
        "pageSize": 1000,
        "fields": [
          {
            "key": "start_time",
            "condition": ">=",
            "value": (subHours(new Date(), 18)).toString()
          }
        ],
        "sort_field": "id",
        "sort_type": "DESC"
      }, null);
      // console.log(new Date.now()).toString()
      rec.forEach(item => {
        if (item.status == AttendanceStatus.SET) {
          beforRecords.push(item.user.device_id)
          beforRecords.push(item.user.device_id)
        } else beforRecords.push(item.user.device_id)
      });

      // const rec = this.attendanceService.findAllByFilter(await getTimeStamp(), null)
      // console.log({
      //   "pageNumber": 1,
      //   "pageSize": 1000,
      //   "fields": [
      //     {
      //       "key": "start_time",
      //       "condition": "<=",
      //       "value": "1637847600"
      //     }
      //   ],
      //   "sort_field": "id",
      //   "sort_type": "DESC"
      // })
      console.log(rec)
      console.log(new Date())
      let counter = 1;
      for (const element of attendanceArray?.records) {
        console.log("----------- START " + counter + "-------------");

        const id = element.id.toString();
        beforRecords.push(id);

        // const dateTime = DateTime.fromISO(element.timestamp, { zone: "utc" });
        // const formattedString = new Date((Math.floor(Date.parse((dateTime.toFormat("yyyy-MM-dd HH:mm:ss")) + ".000Z")) - 12600000)).toString();
        const formattedString = element.timestamp.toString()
        console.log(Math.floor(Date.parse(formattedString) / 1000))
        // const formattedString2 = new Date(element.timestamp).toString();
        // console.log(formattedString)
        // console.log()
        // console.log(Math.floor(Date.parse(element.timestamp) / 1000))
        // console.log(Math.floor(Date.parse(formattedString2) / 1000))

        // فیلتر کردن بر حسب device_id
        console.log("befor-records: ")
        console.log(beforRecords)
        const deviceCount = beforRecords.filter(num => num === id);
        const deviceCountNumber = deviceCount.length;
        console.log("condition result:" + (deviceCountNumber % 2 == 0));

        const user = await this.userService.findOneByDeviceId(id);
        // console.log(user.id)
        createAttendanceDto.user_id = user.id;
        updateAttendanceDto.user_id = user.id;

        const cache = await this.cacheManager.get(id.toString())
        if (!cache || cache != element.timestamp.toString()) {
          if (deviceCountNumber % 2 == 0) {
            createAttendanceDto.status = AttendanceStatus.SET
            updateAttendanceDto.end_time = formattedString;
            const rec = this.attendanceService.updateLatestRecordByUserId(user.id, { ...updateAttendanceDto });
            console.log("complete attendance : ");
            console.log(user.id, { ...updateAttendanceDto });
          } else {
            createAttendanceDto.start_time = formattedString;
            const rec = await this.attendanceService.create(createAttendanceDto);
            console.log("create attendance : ");
            console.log(rec);
          }
        } else console.log("record is repead!!!")

        this.cacheManager.set(id.toString(), element.timestamp.toString(), 3600)

        console.log("----------- END " + counter + "-------------\n\n");
        counter++;
      }
      return ResponseFormat(true, HttpStatus.OK, 'Import Data');
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', { error: error });
    }
  }

  // @ApiBearerAuth('BearerAuth')
  // @Post('/attendanceShift/:id')
  // async attendanceShift(@Request() req, @Param('id') id: number) {
  //   const data = await this.attendanceService.attendanceShift(id, req.user.id);
  //   return ResponseFormat(true, HttpStatus.OK, "OK", data);
  // }

  // ایجاد حضور و غیاب جدید
  @ApiBearerAuth('BearerAuth')
  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto, @Request() req: any) {
    try {
      // await req.user.role != UserType.ADMIN ? createAttendanceDto.user_id = req.user.id : false
      createAttendanceDto.user_id = req.user.id

      const NonRepetitiveReacord = await this.attendanceService.checkNonRepetitiveReacord(createAttendanceDto.user_id, createAttendanceDto.start_time);
      const onlineAttendance = await this.attendanceService.onlineAttendance(createAttendanceDto)
      const minimumAttendance = await this.attendanceService.minimumAttendance(createAttendanceDto)

      // console.log(NonRepetitiveReacord)
      if (NonRepetitiveReacord) return ResponseFormat(true, 400, "زمان ورودتان معتبر نیست!");
      if (onlineAttendance) return ResponseFormat(true, 400, "تردد آنلاین ثبت نمیشود")
      if (minimumAttendance) return ResponseFormat(true, 400, "زمان تردد کمتر از حد است")

      const data = await this.attendanceService.create(createAttendanceDto);
      if (data) {
        const valid = await this.attendanceService.checkValidTimeAttendance(data.start_time, data.end_time);
        if (!valid.success) return ResponseFormat(true, 400, valid.msg);

        return ResponseFormat(true, 200, "OK", data);
      }

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // دریافت همه‌ی اطلاعات حضور و غیاب
  @ApiBearerAuth('BearerAuth')
  @Get()
  async findAll(@Request() req: any) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id } : {}
      const data = await this.attendanceService.findAll(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/getByFilter')
  async findAllByFilter(@Body() filter: FilterParamsDto, @Request() req: any) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? req.user.id : false

      const data = await this.attendanceService.findAllByFilter(filter, condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // دریافت اطلاعات حضور و غیاب بر اساس شناسه
  @ApiBearerAuth('BearerAuth')
  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req: any) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id } : { id }
      const data = await this.attendanceService.findOne(condition);

      if (!data) return ResponseFormat(true, 204, "NOT-FOUND", data)
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // به‌روزرسانی اطلاعات حضور و غیاب بر اساس شناسه
  @ApiBearerAuth('BearerAuth')
  @Post('/completeRecord')
  async update(@Body() updateAttendanceDto: UpdateAttendanceDto, @Request() req: any) {
    try {
      const id = updateAttendanceDto.attendance_id
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: id } : { id: id }
      updateAttendanceDto.user_id = req.user.id

      if (updateAttendanceDto.end_time) updateAttendanceDto.end_time = Math.floor(Date.parse(updateAttendanceDto.end_time) / 1000)

      // const attendanceShift = await this.attendanceService.attendanceShift(updateAttendanceDto.attendance_id, req.user.id)
      const attendance = await this.attendanceService.findOne({ id: id })
      // attendance['Shift'] = attendanceShift
      if (!attendance) return ResponseFormat(false, 204, "NOT-FOUND", attendance)

      const valid = await this.attendanceService.checkValidTimeAttendance(attendance.start_time, updateAttendanceDto.end_time);
      if (!valid.success) return ResponseFormat(true, 400, valid.msg);

      const NonRepetitiveReacord = await this.attendanceService.checkNonRepetitiveReacord(updateAttendanceDto.user_id, new Date(attendance.start_time * 1000));
      if (NonRepetitiveReacord) return ResponseFormat(true, 400, "زمان ورودتان معتبر نیست!");

      await this.attendanceService.update(condition, { end_time: updateAttendanceDto.end_time, status: AttendanceStatus.SET });
      // const attendanceShift = await this.attendanceService.attendanceShift(updateAttendanceDto.attendance_id, req.user.id)
      const after_attendance = await this.attendanceService.findOne({ id: id })
      // attendance['Shift'] = attendanceShift
      if (!attendance) return ResponseFormat(false, 204, "NOT-FOUND", attendance)

      return ResponseFormat(true, 200, "OK", after_attendance);
    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log("error:")
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/set')
  async setStatusAttendance(@Body() attendance: ChangeStatusDto, @Request() req: any) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: attendance.id } : { id: attendance.id }

      const data = await this.attendanceService.changeStatusSET(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/absence')
  async absenceStatusAttendance(@Body() attendance: ChangeStatusDto, @Request() req: any) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: attendance.id } : { id: attendance.id }

      const data = await this.attendanceService.changeStatusABSENCE(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/unfinished')
  async unfinishedStatusAttendance(@Body() attendance: ChangeStatusDto, @Request() req: any) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: attendance.id } : { id: attendance.id }

      const data = await this.attendanceService.changeStatusUNFINISHED(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/getMonthWorkTime')
  async getMonthWorkTime(@Request() req: any) {
    try {
      const userId = req.user.id

      // تاریخ ماه جاری در تقویم شمسی
      const jalaliCurrentDateS = JalaliMoment().locale('fa');
      const jalaliCurrentDateE = JalaliMoment().locale('fa');
      const start = jalaliCurrentDateS.startOf('jMonth');
      const end = jalaliCurrentDateE.add(1, 'jMonth').startOf('jMonth');

      // اولین روز ماه شمسی
      const firstDayOfMonth = start.format('YYYY-M-D');

      const firstDayOfNextMonth = end.format('YYYY-M-D');

      console.log('اولین روز ماه شمسی: ' + firstDayOfMonth);
      console.log('آخرین روز ماه شمسی: ' + firstDayOfNextMonth);

      // تبدیل تاریخ‌ها به تایم استمپ میلی‌ثانیه
      const firstDayTimestamp = start.valueOf() / 1000;
      const lastDayTimestamp = end.valueOf() / 1000;

      console.log('اولین تایم ماه شمسی: ' + firstDayTimestamp);
      console.log('آخرین تایم ماه شمسی: ' + lastDayTimestamp);

      // 5. استفاده از سرویس برای محاسبه زمان کارکرد در بازه زمانی مشخص
      const workTime = await this.attendanceService.calculateWorkTimeInDateRange(userId, firstDayTimestamp, lastDayTimestamp);

      if (!workTime) return ResponseFormat(true, 204, "NOT-FOUND")
      return ResponseFormat(true, 200, "OK", { workTime, from: firstDayOfMonth, to: firstDayOfNextMonth });
    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/latest')
  async getLatestAttendanceInfo(@Request() req: any) {
    try {
      const userId = req.user.id;
      const latestAttendance = await this.attendanceService.getLatestAttendance(userId);

      if (latestAttendance) {
        const nowTime = Math.floor(Date.now() / 1000);
        const hoursSinceLastAttendance = this.attendanceService.convertTimestampToTime(nowTime - latestAttendance.attendance.start_time)
        const limitHour = (nowTime - latestAttendance.attendance.start_time) / 3600
        const max_time = (latestAttendance.max_time) / 3600
        console.log(max_time)
        if (limitHour <= max_time && latestAttendance.attendance.end_time == null) {
          return ResponseFormat(true, 200, "OK", { latestAttendance, message: `آخرین ورود ${hoursSinceLastAttendance} ساعت قبل بود.`, accessCompleteRecord: true });
        } else {
          return ResponseFormat(true, 200, "OK", { latestAttendance, message: `آخرین ورود ${hoursSinceLastAttendance} ساعت یا بیشتر قبل بود.`, accessCompleteRecord: false });
        }
      } else {
        return ResponseFormat(true, 200, "OK", { message: 'هیچ حضور و غیابی یافت نشد.' });
      }
    } catch (error) {
      return ResponseFormat(true, 200, "OK", { message: 'خطا در بازیابی اطلاعات.' });
    }
  }

  // حذف اطلاعات حضور و غیاب بر اساس شناسه
  @ApiBearerAuth('BearerAuth')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const data = id != 0 ? await this.attendanceService.remove(+id) : await this.attendanceService.removeAll();
      return ResponseFormat(true, 200, "OK", data);
    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/attendanceShiftAbsence')
  async attendanceShift() {
    const data = await this.attendanceService.attendanceShift();
    return ResponseFormat(true, HttpStatus.OK, 'OK', data);
  }

}