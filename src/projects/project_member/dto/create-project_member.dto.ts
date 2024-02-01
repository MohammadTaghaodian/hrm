import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectMemberDto {
    @ApiProperty()
    user_id: number

    @ApiProperty()
    project_id: number
}
