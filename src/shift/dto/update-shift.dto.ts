import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateShiftDto } from './create-shift.dto';
import ShiftDay from '../enum/shiftDayEnum';
import { IsEnum } from 'class-validator';
import ShiftDayType from '../enum/shiftDayEnum';

export class UpdateShiftDto extends PartialType(CreateShiftDto) {
    @ApiProperty({
        description: 'شماره روز هفته',
        enum: ShiftDayType,
        default: ShiftDayType.Saturday, // یک مقدار پیشفرض می‌توانید تعیین کنید
        required: true,
    })
    @IsEnum(ShiftDayType)
    weekDay: ShiftDayType

    @ApiProperty({
        description: 'زمان شروع',
        example: '5000',
        required: true
    })
    from: number

    @ApiProperty({
        description: 'زمان پایان',
        example: '7000',
    })
    to: number
}
