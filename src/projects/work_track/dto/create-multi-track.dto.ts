// file: create-multiple-work-tracks.dto.ts

import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWorkTrackDto } from './create-work_track.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMultipleWorkTracksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkTrackDto)
  @ApiProperty({ type: [CreateWorkTrackDto] }) // افزودن توضیحات Swagger
  tracks: CreateWorkTrackDto[];
}
