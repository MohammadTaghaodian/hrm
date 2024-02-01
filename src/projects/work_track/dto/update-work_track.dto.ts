import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWorkTrackDto } from './create-work_track.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateWorkTrackDto extends PartialType(CreateWorkTrackDto) {
    @ApiProperty({
        description: 'زمان انجام تسک',
        example: 50000,
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    time: number
}
