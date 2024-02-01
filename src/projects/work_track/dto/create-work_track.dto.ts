import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class CreateWorkTrackDto {
    @ApiProperty({
        example: 1,
        type: 'integer',
        required: true
    })
    @IsNumber()
    @IsOptional()
    id: number

    @ApiProperty({
        example: 1,
        type: 'integer',
        required: true
    })
    @IsNumber()
    attendance_id: number

    @ApiProperty({
        example: 1,
        type: 'integer',
        required: true
    })
    @IsNumber()
    task_id: number

    @ApiProperty({
        description: 'زمان انجام تسک',
        example: 50000,
        required: true,
    })
    @IsOptional()
    @IsNumber()
    time: number

    @ApiProperty({
        description: 'تاریخ شروع دورکاری',
        example: "2023-09-03T09:00:00.000Z",
        required: true,
        type: Date,
    })
    @IsDateString({}, { message: 'تاریخ شروع باید یک تاریخ معتبر باشد' })
    from_date: any;

    @ApiProperty({
        description: 'تاریخ پایان دورکاری',
        example: "2023-09-03T17:00:00.000Z",
        required: true,
        type: Date,
    })
    @IsDateString({}, { message: 'تاریخ پایان باید یک تاریخ معتبر باشد' })
    until_date: any;
}
