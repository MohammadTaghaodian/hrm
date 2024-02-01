import { PartialType } from '@nestjs/swagger';
import { CreateTeleworkingDto } from './create-teleworking.dto';
import { IsNumber, IsDateString, IsString, IsPositive, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import TeleworkingStatus from '../enum/TeleworkingStatusEnum';

export class UpdateTeleworkingDto  {
    // @ApiProperty({
    //     description: 'شناسه کاربر',
    //     example: 1,
    //     type: 'integer',
    //     minimum: 1,
    //     required: true,
    //   })
    //   @IsNumber({}, { message: 'شناسه کاربر باید یک عدد صحیح باشد' })
    //   user_id: number;
    
      @ApiProperty({
        description: 'تاریخ شروع دورکاری',
        example: "2023-09-03T09:00:00.000Z",
        required: true,
        type: Date,
      })
      @IsOptional()
      @IsDateString({},{ message: 'تاریخ شروع باید یک تاریخ معتبر باشد' })
      from_date: Date;
    
      @ApiProperty({
        description: 'تاریخ پایان دورکاری',
        example: "2023-09-03T17:00:00.000Z",
        required: true,
        type: Date,
      })
      @IsOptional()
      @IsDateString({},{ message: 'تاریخ پایان باید یک تاریخ معتبر باشد' })
      until_date: Date;
    
      @ApiProperty({
        description: 'توضیحات دورکاری',
        example: 'دورکاری در پروژه مشتری X',
        required: false,
      })
      @IsOptional()
      @IsString({ message: 'توضیحات باید یک رشته معتبر باشد' })
      description: string;
    
      @ApiProperty({
        description: 'شناسه مدیر',
        example: 2,
        type: 'integer',
        minimum: 1,
        required: false,
      })
      @IsOptional()
      @IsNumber({}, { message: 'شناسه مدیر باید یک عدد صحیح باشد' })
      manager_id: number;
    
      @ApiProperty({
        description: 'تاریخ شروع مدیریت دورکاری',
        example: "2023-09-03T08:00:00.000Z",
        required: false,
        type: Date,
      })
      @IsOptional()
      @IsDateString({},{ message: 'تاریخ شروع مدیریت باید یک تاریخ معتبر باشد' })
      manager_from_date: Date;
    
      @ApiProperty({
        description: 'تاریخ پایان مدیریت دورکاری',
        example: "2023-09-03T18:00:00.000Z",
        required: false,
        type: Date,
      })
      @IsOptional()
      @IsDateString({},{ message: 'تاریخ پایان مدیریت باید یک تاریخ معتبر باشد' })
      manager_until_date: Date;
    
      @ApiProperty({
        description: 'توضیحات مدیریت دورکاری',
        example: 'دورکاری در پروژه مشتری X تایید شد',
        required: false,
      })
      @IsOptional()
      @IsString({ message: 'توضیحات باید یک رشته معتبر باشد' })
      manager_description: string;
    
      @ApiProperty({
        description: 'شناسه پروژه',
        example: 3,
        type: 'integer',
        minimum: 1,
        required: false,
      })
      @IsOptional()
      @IsNumber({}, { message: 'شناسه پروژه باید یک عدد صحیح باشد' })
      project: number;
    
      @ApiProperty({
        description: 'وضعیت',
        enum: TeleworkingStatus,
        default: TeleworkingStatus.SET, // یک مقدار پیشفرض می‌توانید تعیین کنید
    })
    @IsEnum(TeleworkingStatus, { message: 'وضعیت نامعتبر است' })
    @IsOptional()
    status: TeleworkingStatus;
}
