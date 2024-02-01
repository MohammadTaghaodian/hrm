import { Module } from '@nestjs/common';
import { AttendanceCorrectionService } from './attendance_correction.service';
import { AttendanceCorrectionController } from './attendance_correction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../attendance/entities/attendance.entity';
import { AttendanceCorrection } from './entities/attendance_correction.entity';
import { AttendanceService } from '../attendance/attendance.service';
import { QueryService } from 'src/helper/query.service';
import { UserModule } from 'src/user/user.module';
import { ShiftModule } from 'src/shift/shift.module';
import { ShiftDay } from 'src/shift/entities/shift_day.entity';
import { WorkTrackModule } from 'src/projects/work_track/work_track.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, AttendanceCorrection, ShiftDay]), UserModule, ShiftModule, WorkTrackModule, AttendanceModule],
  controllers: [AttendanceCorrectionController],
  providers: [AttendanceCorrectionService, QueryService],
  exports: [AttendanceCorrectionService]
})
export class AttendanceCorrectionModule { }
