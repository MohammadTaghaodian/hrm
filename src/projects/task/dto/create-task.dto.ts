import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, MinLength, IsDateString, IsEnum, IsOptional } from 'class-validator';
import TaskStatusType from '../enum/TaskStatusEnum';

export class CreateTaskDto {
  @ApiProperty({
    description: 'شناسه فعالیت',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  activity_id: number;

  @ApiProperty({
    description: 'شناسه کاربر',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'عنوان تسک',
    example: 'تسک تست',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'توضیحات تسک',
    example: 'توضیحات تستی برای تسک',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  from_date: Date;

  @ApiProperty()
  @IsOptional()
  until_date: Date;

  @ApiProperty({
    description: ' زمان انجام تسک (ساعت)',
    example: 5,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  time_range: number;

  @ApiProperty({
    description: 'هزینه ساعتی',
    example: 100000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  hourly_fee: number;

  @ApiProperty({
    description: 'وضعیت ',
    enum: TaskStatusType,
    default: TaskStatusType.SET, // یک مقدار پیشفرض می‌توانید تعیین کنید
    required: true,
  })
  @IsOptional()
  @IsEnum(TaskStatusType, { message: 'وضعیت نامعتبر است' })
  status: TaskStatusType;
}