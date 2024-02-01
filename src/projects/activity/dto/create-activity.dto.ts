import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateActivityDto {

    @ApiProperty({
        description: 'شناسه پروژه',
        example: 1,
        type: 'integer',
        minimum: 1,
        required: true,
    })
    @IsNumber({}, { message: 'شناسه پروژه باید یک عدد صحیح باشد' })
    @IsNotEmpty({ message: 'شناسه پروژه نمی‌تواند خالی باشد' })
    project_id: number;

    @ApiProperty({
        description: 'عنوان فعالیت',
        example: 'فعالیت تستی',
        required: true,
    })
    @IsString({ message: 'عنوان فعالیت باید یک رشته باشد' })
    @IsNotEmpty({ message: 'عنوان فعالیت نمی‌تواند خالی باشد' })
    title: string;
}