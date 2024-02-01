import { Module } from '@nestjs/common';
import { ProjectMemberService } from './project_member.service';
import { ProjectMemberController } from './project_member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMember } from './entities/project_member.entity';
import { Project } from '../project/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMember,Project])],
  controllers: [ProjectMemberController],
  providers: [ProjectMemberService],
  exports:[ProjectMemberService]
})
export class ProjectMemberModule { }
