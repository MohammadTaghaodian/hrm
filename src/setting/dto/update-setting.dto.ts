import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSettingDto } from './create-setting.dto';

export class UpdateSettingDto extends PartialType(CreateSettingDto) {
    @ApiProperty()
    key: string

    @ApiProperty()
    value: string

    @ApiProperty()
    type: string

    @ApiProperty()
    label: string
}
