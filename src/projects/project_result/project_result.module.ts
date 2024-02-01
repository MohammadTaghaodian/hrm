import { Module } from '@nestjs/common';
import { ProjectResultService } from './project_result.service';
import { ProjectResultController } from './project_result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectResult } from './entities/project_result.entity';
import { QueryService } from 'src/helper/query.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectResult])],
  controllers: [ProjectResultController],
  providers: [ProjectResultService, QueryService],
})
export class ProjectResultModule { }
