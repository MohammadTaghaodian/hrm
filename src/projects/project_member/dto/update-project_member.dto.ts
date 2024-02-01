import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectMemberDto } from './create-project_member.dto';

export class UpdateProjectMemberDto extends PartialType(CreateProjectMemberDto) {
    @ApiProperty()
    user_id: number

    @ApiProperty()
    project_id: number
}
