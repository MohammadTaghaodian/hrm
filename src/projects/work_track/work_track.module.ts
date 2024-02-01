import { Module, forwardRef } from '@nestjs/common';
import { WorkTrackService } from './work_track.service';
import { WorkTrackController } from './work_track.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkTrack } from './entities/work_track.entity';
import { TaskModule } from 'src/projects/task/task.module';
import { QueryService } from 'src/helper/query.service';
import { AttendanceModule } from 'src/attendance/attendance/attendance.module';
import { SettingModule } from 'src/setting/setting.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkTrack]), forwardRef(() => AttendanceModule), TaskModule, SettingModule],
  controllers: [WorkTrackController],
  providers: [WorkTrackService, QueryService],
  exports: [WorkTrackService]
})
export class WorkTrackModule { }
