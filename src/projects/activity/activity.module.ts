import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { UserModule } from 'src/user/user.module';
import { ProjectModule } from '../project/project.module';
import { Project } from '../project/entities/project.entity';
import { QueryService } from 'src/helper/query.service';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Project]), UserModule, ProjectModule],
  controllers: [ActivityController],
  providers: [ActivityService, QueryService],
})
export class ActivityModule { }
