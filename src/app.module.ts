// وارد کردن ماژول‌های مورد نیاز از NestJS
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// وارد کردن ماژول‌های میکروسرویس‌ها و موجودیت‌ها
import { AttendanceCorrectionModule } from './attendance/attendance_correction/attendance_correction.module';
import { AttendanceModule } from './attendance/attendance/attendance.module';
import { MissionModule } from './mission/mission/mission.module';
import { MissionHistoryModule } from './mission/mission_history/mission_history.module';
import { MissionReportModule } from './mission/mission_report/mission_report.module';
import { LeavesModule } from './leaves/leaves.module';
import { TeleworkingModule } from './teleworking/teleworking.module';

// وارد کردن موجودیت‌های مورد نیاز
import { Attendance } from './attendance/attendance/entities/attendance.entity';
import { AttendanceCorrection } from './attendance/attendance_correction/entities/attendance_correction.entity';
import { Mission } from './mission/mission/entities/mission.entity';
import { MissionHistory } from './mission/mission_history/entities/mission_history.entity';
import { MissionReport } from './mission/mission_report/entities/mission_report.entity';
import { Leaves } from './leaves/entities/leaves.entity';
import { Teleworking } from './teleworking/entities/teleworking.entity';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { HelperModule } from './helper/helper.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './projects/project/project.module';
import { ProjectMemberModule } from './projects/project_member/project_member.module';
import { ProjectResultModule } from './projects/project_result/project_result.module';
import { TaskModule } from './projects/task/task.module';
import { ReportModule } from './projects/report/report.module';
import { WorkTrackModule } from './projects/work_track/work_track.module';
import { Project } from './projects/project/entities/project.entity';
import { ProjectMember } from './projects/project_member/entities/project_member.entity';
import { ActivityModule } from './projects/activity/activity.module';
import { Activity } from './projects/activity/entities/activity.entity';
import { ShiftModule } from './shift/shift.module';
import { Shift } from './shift/entities/shift.entity';
import { ShiftDay } from './shift/entities/shift_day.entity';
import { Task } from './projects/task/entities/task.entity';
import { ProjectResult } from './projects/project_result/entities/project_result.entity';
import { Report } from './projects/report/entities/report.entity';
import { WorkTrack } from './projects/work_track/entities/work_track.entity';
import { SettingModule } from './setting/setting.module';
import { Setting } from './setting/entities/setting.entity';

@Module({
  imports: [ // وارد کردن ماژول‌های NestJS به عنوان ورودی ماژول اصلی
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres', // نوع پایگاه داده PostgreSQL
      host: process.env.DB_HOST, // آدرس میزبان پایگاه داده
      port: process.env.PORT ? parseInt(process.env.DB_PORT) : 5432, // پورت پایگاه داده
      username: process.env.DB_USERNAME, // نام کاربری برای ورود به پایگاه داده
      password: process.env.DB_PASSWORD, // رمز عبور برای ورود به پایگاه داده (در اینجا خالی است)
      database: process.env.DB_NAME, // نام پایگاه داده
      entities: [Attendance, AttendanceCorrection, Mission, MissionHistory, MissionReport, Leaves, Teleworking, User, Project, ProjectMember, Activity, Shift, ShiftDay, Activity, Task, ProjectResult, Report, WorkTrack , Setting], // لیست موجودیت‌های مورد استفاده در پایگاه داده
      synchronize: true, // همگام‌سازی خودکار پایگاه داده (در محیط توسعهی مفید است)
    }),
    AttendanceModule,
    ProjectModule,
    ProjectMemberModule,
    AttendanceCorrectionModule,
    MissionModule,
    MissionHistoryModule,
    MissionReportModule,
    LeavesModule,
    TeleworkingModule,
    UserModule,
    AuthModule,
    HelperModule,
    ProjectMemberModule,
    ProjectResultModule,
    TaskModule,
    ReportModule,
    WorkTrackModule,
    ActivityModule,
    ShiftModule,
    TaskModule,
    ActivityModule,
    ProjectResultModule,
    ReportModule,
    WorkTrackModule,
    SettingModule
  ],
})
export class AppModule { }