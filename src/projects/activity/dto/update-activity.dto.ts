import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateActivityDto {
    @ApiProperty({
        description: 'عنوان فعالیت',
        example: 'فعالیت تستی',
        required: true,
    })
    @IsString({ message: 'عنوان فعالیت باید یک رشته باشد' })
    @IsNotEmpty({ message: 'عنوان فعالیت نمی‌تواند خالی باشد' })
    title: string;
}