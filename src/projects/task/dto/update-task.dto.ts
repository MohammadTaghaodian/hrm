import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, MinLength, IsDateString, IsEnum, IsOptional } from 'class-validator';
import TaskStatus from '../enum/TaskStatusEnum';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto {
    @ApiProperty({
        description: 'عنوان تسک',
        example: 'تسک تست',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @IsOptional()
    title: string;

    @ApiProperty({
        description: 'شناسه کاربر',
        example: 1,
        required: true,
      })
      @IsNotEmpty()
      @IsNumber()
      @IsOptional()
      user_id: number;

    @ApiProperty({
        description: 'توضیحات تسک',
        example: 'توضیحات تستی برای تسک',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({
        description: ' زمان انجام تسک (ساعت)',
        example: 5,
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @IsOptional()
    time_range: number;

    @ApiProperty({
        description: 'هزینه ساعتی',
        example: 100000,
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @IsOptional()
    hourly_fee: number;
    
    @ApiProperty({
        description: 'وضعیت',
        enum: TaskStatus,
        default: TaskStatus.SET, // یک مقدار پیشفرض می‌توانید تعیین کنید
    })
    @IsEnum(TaskStatus, { message: 'وضعیت نامعتبر است' })
    @IsOptional()
    status: TaskStatus;
 
}