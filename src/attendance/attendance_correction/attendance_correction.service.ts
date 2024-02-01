import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAttendanceCorrectionDto } from './dto/create-attendance_correction.dto';
import { UpdateAttendanceCorrectionDto } from './dto/update-attendance_correction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceCorrection } from './entities/attendance_correction.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { QueryService } from 'src/helper/query.service';
import { UserService } from 'src/user/user.service';
import AttendanceCorrectionStatus from './enum/AttendanceCorrectionStatusEnum';

@Injectable()
export class AttendanceCorrectionService {
  constructor(
    @InjectRepository(AttendanceCorrection) private AttendanceCorrectionRepository: Repository<AttendanceCorrection>,
    @InjectRepository(Attendance) private AttendanceRepository: Repository<Attendance>,
    private readonly queryService: QueryService, private userService: UserService
  ) { }

  // تابع برای ایجاد درخواست ویرایش مرخصی
  async create(createAttendanceCorrectionDto: CreateAttendanceCorrectionDto, attendance) {
    // ایجاد یک درخواست ویرایش مرخصی جدید با استفاده از اطلاعات ارسالی و مرخصی یافته شده
    const attendance_corr = this.AttendanceCorrectionRepository.create({
      ...createAttendanceCorrectionDto,
      attendance
    })
    return this.AttendanceCorrectionRepository.save(attendance_corr)
  }

  // بازیابی تمام رکوردهای حضور و غیاب
  async findAll(condition: any) {
    const data = await this.AttendanceCorrectionRepository.findBy(condition);

    return data;
  }


  // بازیابی تمام رکوردهای حضور و غیاب
  async findAllByFilter(filter: FilterParamsDto, condition: any) {
    const queryBuilder = this.queryService.createFilterQuery(this.AttendanceCorrectionRepository, filter, "attendance_correction", condition)
      .leftJoinAndSelect('attendance_correction.attendance', 'attendances');
    const data = await queryBuilder.getMany();

    // انتظار می‌رود که userService.findOne از نوع Promise باشد
    await Promise.all(data.map(async (element) => {
      // element['user'] = null
      // console.log(element)
      element['attendance']['start_time_date'] = null
      element['attendance']['end_time_date'] = null

      if(element['attendance']['start_time']) element['attendance']['start_time_date'] = new Date(element['attendance']['start_time'] * 1000)
      if(element['attendance']['end_time']) element['attendance']['end_time_date'] = new Date(element['attendance']['end_time'] * 1000)

      const user = await this.userService.findOne(element['attendance']['user_id']);
      // if(user) element['user'] = user;
    }));
    return data;
  }

  // تابع برای گرفتن یک درخواست ویرایش مرخصی خاص بر اساس شناسه
  findOne(condition: any) {
    return this.AttendanceCorrectionRepository.findOneBy(condition);
  }

  // تابع برای به‌روزرسانی یک درخواست ویرایش مرخصی
  update(condition: any, updateRequest: UpdateAttendanceCorrectionDto) {
    console.log(condition)
    return this.AttendanceCorrectionRepository.update(condition, updateRequest )
  }

  async changeStatusSET(condition: any) {
    const attendanceToUpdate = await this.AttendanceCorrectionRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.AttendanceCorrectionRepository.update(condition, { status: AttendanceCorrectionStatus.SET })
  }

  async changeStatusCONFIRM(condition: any) {
    const attendanceCorrectionToUpdate = await this.AttendanceCorrectionRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.AttendanceCorrectionRepository.update(condition, { status: AttendanceCorrectionStatus.CONFIRM })
  }

  async changeStatusREJECT(condition: any) {
    const attendanceCorrectionToUpdate = await this.AttendanceCorrectionRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.AttendanceCorrectionRepository.update(condition, { status: AttendanceCorrectionStatus.REJECT })
  }

  // تابع برای حذف یک درخواست ویرایش مرخصی بر اساس شناسه
  remove(id: number) {
    return this.AttendanceCorrectionRepository.delete(id)
  }
}
