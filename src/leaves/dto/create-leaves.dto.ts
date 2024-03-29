import { IsNumber, IsPositive, IsDateString, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeavesDto {
  // @ApiProperty({
  //   description: 'شناسه مرخصی',
  //   example: 1,
  //   type: 'integer',
  //   minimum: 1,
  //   required: true,
  // })
  // @IsNumber({}, { message: 'شناسه مرخصی باید یک عدد صحیح باشد' })
  // @IsPositive({ message: 'شناسه مرخصی باید مقدار مثبت داشته باشد' })
  // id: number;

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
    description: 'شناسه مدیر',
    example: 1,
    type: 'integer',
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'شناسه مدیر باید یک عدد صحیح باشد' })
  @IsPositive({ message: 'شناسه مدیر باید مقدار مثبت داشته باشد' })
  manager_id: number;

  @ApiProperty({
    description: 'تاریخ شروع مرخصی',
    example: "2023-09-03T14:00:36.278Z",
    required: true,
    type: Date, // از نوع Date بودن به عنوان تاریخ معتبر کافیست
  })
  @IsDateString({}, { message: 'تاریخ شروع مرخصی باید یک تاریخ معتبر باشد' })
  from_date: Date;

  @ApiProperty({
    description: 'تاریخ پایان مرخصی',
    example: "2023-09-03T14:00:36.278Z",
    required: true,
    type: Date, // از نوع Date بودن به عنوان تاریخ معتبر کافیست
  })
  @IsDateString({}, { message: 'تاریخ پایان مرخصی باید یک تاریخ معتبر باشد' })
  until_date: Date;

  @ApiProperty({
    description: 'از ساعت',
    example: '10:00:00',
    type: 'string',
    required: false,
  })
  from_hour: string;

  @ApiProperty({
    description: 'تا ساعت',
    example: '18:00:00',
    type: 'string',
    required: false,
  })
  until_hour: string;

  @ApiProperty({
    description: 'نوع مرخصی',
    example: 'ازدواج',
    type: 'string',
    required: true,
  })
  @IsString({ message: "نوع مرخصی اجباری است" })
  type: string;

  @ApiProperty({
    description: 'توضیحات',
    example: 'مرخصی مربوط به ملاقات پزشک',
    required: false, // توضیحات اختیاری است
  })
  @IsOptional()
  @IsString({ message: 'توضیحات باید یک رشته معتبر باشد' })
  description: string;

  // @ApiProperty({
  //   description: 'وضعیت مرخصی',
  //   example: 1,
  //   type: 'integer',
  //   minimum: 0,
  //   required: true,
  // })
  // @IsNumber({}, { message: 'وضعیت مرخصی باید یک عدد صحیح باشد' })
  // @IsPositive({ message: 'وضعیت مرخصی باید مقدار مثبت داشته باشد' })
  // status: number;

  @ApiProperty({
    description: 'نظر مدیر',
    example: 'مرخصی تایید شده',
    required: false, // نظر مدیر اختیاری است
  })
  @IsOptional()
  @IsString({ message: 'نظر مدیر باید یک رشته معتبر باشد' })
  manager_comment: string;
}
