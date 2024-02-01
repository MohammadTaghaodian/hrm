import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateLeavesDto } from './create-leaves.dto';
import { IsNumber, IsPositive, IsDateString, IsString, IsOptional, IsEnum } from 'class-validator';
import { Leaves } from '../entities/leaves.entity';
import LeavesStatus from '../enum/LeavesStatusEnum';
export class UpdateleavesDto{
    // @ApiProperty({
    //     description: 'شناسه مرخصی',
    //     example: 1,
    //     type: 'integer',
    //     minimum: 1,
    //     required: true,
    //   })
    //   @IsNumber({}, { message: 'شناسه مرخصی باید یک عدد صحیح باشد' })
    //   @IsPositive({ message: 'شناسه مرخصی باید مقدار مثبت داشته باشد' })
    //   id: number;
    
      @ApiProperty({
        description: 'شناسه کاربر',
        example: 1,
        type: 'integer',
        minimum: 1,
        required: true,
      })
      @IsOptional()
      @IsNumber({}, { message: 'شناسه کاربر باید یک عدد صحیح باشد' })
      @IsPositive({ message: 'شناسه کاربر باید مقدار مثبت داشته باشد' })
      user_id: number;
    
      @ApiProperty({
        description: 'شناسه مدیر',
        example: 1,
        type: 'integer',
        minimum: 1,
        required: true,
      })
      @IsOptional()
      @IsNumber({}, { message: 'شناسه مدیر باید یک عدد صحیح باشد' })
      @IsPositive({ message: 'شناسه مدیر باید مقدار مثبت داشته باشد' })
      manager_id: number;
    
      @ApiProperty({
        description: 'تاریخ شروع مرخصی',
        example: "2023-09-03T14:00:36.278Z",
        required: false,
        type: Date, // از نوع Date بودن به عنوان تاریخ معتبر کافیست
      })
      @IsOptional()
      from_date: Date;
    
      @ApiProperty({
        description: 'تاریخ پایان مرخصی',
        example: "2023-09-03T14:00:36.278Z",
        required: false,
        type: Date, // از نوع Date بودن به عنوان تاریخ معتبر کافیست
      })
      @IsOptional()
      until_date: Date;
    
      @ApiProperty({
        description: 'نوع مرخصی',
        example: 'ازدواج',
        type: 'string',
        required: false,
      })
      @IsOptional()
      type: string;
    
      @ApiProperty({
        description: 'توضیحات',
        example: 'مرخصی مربوط به ملاقات پزشک',
        required: false, // توضیحات اختیاری است
      })
      @IsOptional()
      @IsString({ message: 'توضیحات باید یک رشته معتبر باشد' })
      description: string;
    
      @ApiProperty({
        description: 'وضعیت',
        enum: LeavesStatus,
        default: LeavesStatus.SET, // یک مقدار پیشفرض می‌توانید تعیین کنید
    })
    @IsEnum(LeavesStatus, { message: 'وضعیت نامعتبر است' })
    @IsOptional()
    status: LeavesStatus;
    
      @ApiProperty({
        description: 'نظر مدیر',
        example: 'مرخصی تایید شده',
        required: false, // نظر مدیر اختیاری است
      })
      @IsOptional()
      @IsString({ message: 'نظر مدیر باید یک رشته معتبر باشد' })
      manager_comment: string;
}
