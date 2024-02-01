import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsDate, IsNotEmpty, IsNumber, Min, Max, IsEnum, IsOptional } from 'class-validator';
import MissionStatus from '../enum/MissionStatusEnum';
import MissionType from '../enum/MissionTypeEnum';

export class CreateMissionDto {
    @ApiProperty()
    // @IsInt({ message: 'user_id باید یک عدد صحیح باشد' })
    user_id: number;

    @ApiProperty()
    @IsOptional()
    @IsInt({ message: 'manager_id باید یک عدد صحیح باشد' })
    manager_id: number;

    @ApiProperty()
    @IsOptional()
    @IsInt({ message: 'project_id باید یک عدد صحیح باشد' })
    project_id: number;

    @ApiProperty({
        description: 'نوع ماموریت',
        enum: MissionType,
        default: MissionType.INTERNAL, // یک مقدار پیشفرض می‌توانید تعیین کنید
    })
    @IsOptional()
    @IsEnum(MissionType, { message: 'نوع ماموریت نامعتبر است' })
    type: MissionType;

    @ApiProperty()
    @IsOptional()
    @IsString({ message: 'place باید یک رشته معتبر باشد' })
    @IsNotEmpty({ message: 'place نمی‌تواند خالی باشد' })
    place: string;

    // @IsDate({ message: 'from_date باید یک تاریخ معتبر باشد' })
    @ApiProperty()
    @IsOptional()
    from_date: Date;

    // @IsDate({ message: 'until_date باید یک تاریخ معتبر باشد' })
    @ApiProperty()
    @IsOptional()
    until_date: Date;

    @ApiProperty()
    @IsOptional()
    traffic_time: number;

    @ApiProperty()
    @IsOptional()
    @IsString({ message: 'behest باید یک رشته معتبر باشد' })
    @IsNotEmpty({ message: 'behest نمی‌تواند خالی باشد' })
    behest: string;

    @ApiProperty()
    @IsOptional()
    @IsString({ message: 'manager_description باید یک رشته معتبر باشد' })
    manager_description: string;

    @ApiProperty()
    @IsOptional()
    @IsInt({ message: 'commission باید یک عدد صحیح باشد' })
    @Min(0, { message: 'commission نمی‌تواند منفی باشد' })
    commission: number;

    @ApiProperty()
    @IsOptional()
    @IsInt({ message: 'salary باید یک عدد صحیح باشد' })
    @Min(0, { message: 'salary نمی‌تواند منفی باشد' })
    salary: number;

    @ApiProperty({
        description: 'وضعیت',
        enum: MissionStatus,
        default: MissionStatus.SET, // یک مقدار پیشفرض می‌توانید تعیین کنید
    })
    @IsEnum(MissionStatus, { message: 'وضعیت نامعتبر است' })
    @IsOptional()
    status: MissionStatus;
}
