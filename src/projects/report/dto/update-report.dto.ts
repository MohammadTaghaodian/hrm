import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReportDto } from './create-report.dto';
import { IsString } from 'class-validator';

export class UpdateReportDto extends PartialType(CreateReportDto) {
    @ApiProperty({
        description: 'توضیحات ریپورت',
        example: 'تست توضیحات',
        type: 'varchar'
    })
    @IsString()
    comment: string
}
