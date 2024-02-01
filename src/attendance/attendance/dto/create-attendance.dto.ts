import { IsNumber, IsDate, IsPositive, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import AttendanceStatus from '../enum/AttendanceStatusEnum';
import AttendanceType from '../enum/AttendanceTypeEnum';

export class CreateAttendanceDto {
  @ApiProperty({
    description: 'شناسه کاربر',
    example: 1,
    type: 'integer',
    minimum: 1
  })
  // @IsNumber({}, { message: 'شناسه کاربر باید یک عدد صحیح باشد' })
  // @IsPositive({ message: 'شناسه کاربر باید مقدار مثبت داشته باشد' })
  user_id: number;

  @ApiProperty({
    description: 'شناسه تسک',
    example: 1,
    type: 'integer',
    minimum: 1
  })
  task_id: number

  // @ApiProperty({
  //   description: 'تاریخ حضور',
  //   example: "2023-09-03T14:00:36.278Z",
  //   required: true,
  //   type: Date, // از نوع Date بودن به عنوان تاریخ معتبر کافیست
  // })
  // @IsDateString({}, { message: 'تاریخ باید یک تاریخ معتبر باشد' })
  // date: any;

  @ApiProperty({
    description: 'زمان شروع حضور',
    example: "2023-09-03T14:00:36.278Z",
    required: true,
  })
  // @IsDateString({}, { message: 'زمان شروع باید یک زمان معتبر باشد' })
  start_time: any;

  @ApiProperty({
    description: 'زمان پایان حضور',
    example: "2023-09-03T14:00:36.278Z",
    required: true,
  })
  @IsOptional()
  @IsDateString({}, { message: 'زمان پایان باید یک زمان معتبر باشد' })
  end_time: any;

  @ApiProperty({
    description: 'نوع حضور و غیاب',
    enum: AttendanceType,
    default: AttendanceType.DEVICE, // یک مقدار پیشفرض می‌توانید تعیین کنید
    required: true,
  })
  @IsEnum(AttendanceType, { message: 'وضعیت حضور و غیاب نامعتبر است' })
  type: AttendanceType;

  @ApiProperty({
    description: 'وضعیت حضور و غیاب',
    enum: AttendanceStatus,
    default: AttendanceStatus.UNFINISHED, // یک مقدار پیشفرض می‌توانید تعیین کنید
    required: true,
  })
  @IsOptional()
  @IsEnum(AttendanceStatus, { message: 'وضعیت حضور و غیاب نامعتبر است' })
  status: AttendanceStatus;
}