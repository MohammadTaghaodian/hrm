import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsDateString, IsPositive, IsEnum, IsOptional } from 'class-validator';
import ProjectStatus from "../enum/ProjectStatusEnum";

export class CreateProjectDto {
    @ApiProperty({
        description: 'کد پروژه',
        example: 'PRJ123',
        required: true,
    })
    @IsString({ message: 'کد پروژه باید یک رشته معتبر باشد' })
    code: string;

    @ApiProperty({
        description: 'نام پروژه',
        example: 'پروژه نمونه',
        required: true,
    })
    @IsString({ message: 'نام پروژه باید یک رشته معتبر باشد' })
    name: string;

    @ApiProperty({
        description: 'شناسه مدیر پروژه',
        example: 2,
        type: 'integer',
        minimum: 1
    })
    @IsOptional()
    @IsNumber({}, { message: 'شناسه مدیر باید یک عدد صحیح باشد' })
    manager_id: number;

    @ApiProperty({
        description: 'نام کارفرما یا شرکت کارفرما',
        example: 'شرکت نمونه',
        required: true,
    })
    @IsString({ message: 'نام کارفرما باید یک رشته معتبر باشد' })
    employer: string;

    @ApiProperty({
        description: 'تاریخ شروع پروژه',
        example: "2023-09-03T09:00:00.000Z",
        required: true,
        type: Date,
    })
    @IsDateString({}, { message: 'تاریخ شروع باید یک تاریخ معتبر باشد' })
    from_date: Date;

    @ApiProperty({
        description: 'تاریخ پایان پروژه',
        example: "2023-09-03T17:00:00.000Z",
        required: true,
        type: Date,
    })
    @IsDateString({}, { message: 'تاریخ پایان باید یک تاریخ معتبر باشد' })
    until_date: Date;

    @ApiProperty({
        description: 'هزینه پروژه',
        example: 5000,
        type: 'integer',
        minimum: 0,
        required: true,
    })
    @IsNumber({}, { message: 'هزینه باید یک عدد صحیح باشد' })
    @IsPositive({ message: 'هزینه باید مقدار مثبت داشته باشد' })
    cost: number;

    @ApiProperty({
        description: 'وضعیت',
        enum: ProjectStatus,
        default: ProjectStatus.CONFIRM, // یک مقدار پیشفرض می‌توانید تعیین کنید
    })
    @IsEnum(ProjectStatus, { message: 'وضعیت نامعتبر است' })
    @IsOptional()
    status: ProjectStatus;
}
