import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMissionDto } from './create-mission.dto';
import { IsInt, IsString, IsDate, IsNotEmpty, IsNumber, Min, Max, IsEnum, IsOptional } from 'class-validator';
import MissionType from '../enum/MissionTypeEnum';
import MissionStatus from '../enum/MissionStatusEnum';

export class UpdateMissionDto {
    // @IsInt({ message: 'user_id باید یک عدد صحیح باشد' })
    // user_id: number;

    @IsInt({ message: 'manager_id باید یک عدد صحیح باشد' })
    manager_id: number;

    @IsInt({ message: 'project_id باید یک عدد صحیح باشد' })
    @IsOptional()
    project_id: number;

    @ApiProperty({
        description: 'نوع ماموریت',
        enum: MissionType,
        default: MissionType.INTERNAL, // یک مقدار پیشفرض می‌توانید تعیین کنید
        required: true,
    })
    @IsOptional()
    @IsEnum(MissionType, { message: 'نوع ماموریت نامعتبر است' })
    type: MissionType;

    @IsString({ message: 'place باید یک رشته معتبر باشد' })
    @IsNotEmpty({ message: 'place نمی‌تواند خالی باشد' })
    @IsOptional()
    place: string;

    // @IsDate({ message: 'from_date باید یک تاریخ معتبر باشد' })
    @IsOptional()
    from_date: Date;

    // @IsDate({ message: 'until_date باید یک تاریخ معتبر باشد' })
    @IsOptional()
    until_date: Date;

    @ApiProperty()
    @IsOptional()
    traffic_time: number;

    @IsString({ message: 'behest باید یک رشته معتبر باشد' })
    @IsNotEmpty({ message: 'behest نمی‌تواند خالی باشد' })
    @IsOptional()
    behest: string;

    @IsString({ message: 'manager_description باید یک رشته معتبر باشد' })
    @IsOptional()
    manager_description: string;

    @IsInt({ message: 'commission باید یک عدد صحیح باشد' })
    @Min(0, { message: 'commission نمی‌تواند منفی باشد' })
    @IsOptional()
    commission: number;

    @IsInt({ message: 'salary باید یک عدد صحیح باشد' })
    @Min(0, { message: 'salary نمی‌تواند منفی باشد' })
    @IsOptional()
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
