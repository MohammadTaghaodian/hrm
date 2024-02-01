import { Module, forwardRef } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from './entities/attendance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryService } from 'src/helper/query.service';
import { UserModule } from 'src/user/user.module';
import { ShiftModule } from 'src/shift/shift.module';
import { ShiftDay } from 'src/shift/entities/shift_day.entity';
import { WorkTrackModule } from 'src/projects/work_track/work_track.module';
import { SettingModule } from 'src/setting/setting.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, ShiftDay]), forwardRef(() => WorkTrackModule), UserModule, ShiftModule, SettingModule],
  controllers: [AttendanceController],
  providers: [AttendanceService, QueryService],
  exports: [AttendanceService]
})
export class AttendanceModule { }
