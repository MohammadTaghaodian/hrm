import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from './create-attendance.dto';
import { IsNumber, IsDate, IsPositive, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import AttendanceStatus from '../enum/AttendanceStatusEnum';
import AttendanceType from '../enum/AttendanceTypeEnum';

export class UpdateAttendanceDto {
  @ApiProperty({
    description: 'شناسه کاربر',
    example: 1,
    type: 'integer',
    minimum: 1
  })
  user_id: number;

  @ApiProperty({
    description: 'شناسه حضورغیاب',
    example: 1,
    type: 'integer',
    minimum: 1
  })
  @IsNumber({}, { message: 'شناسه کاربر باید یک عدد صحیح باشد' })
  @IsPositive({ message: 'شناسه کاربر باید مقدار مثبت داشته باشد' })
  attendance_id: number;

  // @ApiProperty({
  //   description: 'تاریخ حضور',
  //   example: "2023-09-03T14:00:36.278Z",
  //   required: true,
  //   type: Date, // از نوع Date بودن به عنوان تاریخ معتبر کافیست
  // })
  // @IsDateString({}, { message: 'تاریخ باید یک تاریخ معتبر باشد' })
  // date: Date;

  @ApiProperty({
    description: 'زمان پایان حضور',
    example: "2023-09-03T14:00:36.278Z",
    required: true,
  })
  @IsDateString({}, { message: 'زمان پایان باید یک زمان معتبر باشد' })
  end_time: any;

  // @ApiProperty({
  //   description: 'نوع حضور و غیاب',
  //   enum: AttendanceType,
  //   default: AttendanceType.DEVICE, // یک مقدار پیشفرض می‌توانید تعیین کنید
  //   required: true,
  // })
  // @IsEnum(AttendanceType, { message: 'وضعیت حضور و غیاب نامعتبر است' })
  // type: AttendanceType;

  @ApiProperty({
    description: 'وضعیت حضور و غیاب',
    enum: AttendanceStatus,
    default: AttendanceStatus.SET, // یک مقدار پیشفرض می‌توانید تعیین کنید
    required: true,
  })
  @IsEnum(AttendanceStatus, { message: 'وضعیت حضور و غیاب نامعتبر است' })
  status: AttendanceStatus;
}