import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class CreateReportDto {
    @ApiProperty({
        example: 1,
        type: 'integer',
        required:true
    })
    @IsNumber()
    task_id: number

    @ApiProperty({
        description: 'توضیحات ریپورت',
        example: 'تست توضیحات',
        type: 'varchar'
    })
    @IsString()
    comment: string
}
