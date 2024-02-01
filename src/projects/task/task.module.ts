import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Activity } from '../activity/entities/activity.entity';
import { UserModule } from 'src/user/user.module';
import { QueryService } from 'src/helper/query.service';
import { ProjectMemberModule } from '../project_member/project_member.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Activity]), UserModule, ProjectMemberModule],
  controllers: [TaskController],
  providers: [TaskService, QueryService],
  exports: [TaskService]
})
export class TaskModule { }
