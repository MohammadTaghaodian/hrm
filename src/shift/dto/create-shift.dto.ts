import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNumber, isNumber } from "class-validator"
import ShiftDayType from "../enum/shiftDayEnum"

export class CreateShiftDto {
    @ApiProperty({
        description: 'شناسه کاربر',
        example: 1,
        type: 'integer',
        minimum: 1
    })
    user_id: number;

    @ApiProperty({
        description: 'شماره روز هفته',
        enum: ShiftDayType,
        default: ShiftDayType.Saturday, // یک مقدار پیشفرض می‌توانید تعیین کنید
        type: ShiftDayType,
        required: true,
    })
    @IsEnum(ShiftDayType)
    @IsNumber({}, { message: 'روز هفته به عدد وارد کنید' })
    weekDay: ShiftDayType

    @ApiProperty({
        description: 'زمان شروع',
        example: '5000',
        type: 'int',
        required: true
    })
    @IsNumber({}, { message: 'لطفا عدد وارد کنید' })
    from: number

    @ApiProperty({
        description: 'زمان پایان',
        type: 'int',
        example: '7000',
    })
    @IsNumber({}, { message: 'لطفا عدد وارد کنید' })
    to: number
}
