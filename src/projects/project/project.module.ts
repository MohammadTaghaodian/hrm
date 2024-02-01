import { Module } from '@nestjs/common';
import { ProjectAdminService } from './project-admin.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectMemberService } from '../project_member/project_member.service';
import { ProjectMember } from '../project_member/entities/project_member.entity';
import { ProjectUserService } from './project-user.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { QueryService } from 'src/helper/query.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectMember]), UserModule],
  controllers: [ProjectController],
  providers: [ProjectUserService, ProjectAdminService, ProjectMemberService, QueryService],
  exports: [ProjectUserService, ProjectAdminService]
})
export class ProjectModule { }
