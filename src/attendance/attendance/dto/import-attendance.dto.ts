import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

class AttendanceRecordDto {
    @ApiProperty({ type: Number, description: 'شماره ماشین' })
    uid: number;
  
    @ApiProperty({ type: Number, description: 'شناسه ثبت اثر انگشت' })
    id: number;

    @ApiProperty({ type: Number, description: 'state' })
    state: number;

    @ApiProperty({ type: String, description: 'ساعت ثبت (بدون تاریخ)' })
    timestamp: string;
  }

  
export class AttendanceRecordsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  @ApiProperty({ type: [AttendanceRecordDto], description: 'آرایه‌ای از ثبت‌های حضور' })
  records: AttendanceRecordDto[];
}