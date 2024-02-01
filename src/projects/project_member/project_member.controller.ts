import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectMemberService } from './project_member.service';
import { CreateProjectMemberDto } from './dto/create-project_member.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('project-member - اعضای پروژه')
@Controller('project-member')
export class ProjectMemberController {
  constructor(private readonly projectMemberService: ProjectMemberService) { }
}
