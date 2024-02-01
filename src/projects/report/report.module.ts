import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Task } from '../task/entities/task.entity';
import { QueryService } from 'src/helper/query.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Task])],
  controllers: [ReportController],
  providers: [ReportService, QueryService],
})
export class ReportModule { }
