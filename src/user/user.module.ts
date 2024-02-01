import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryService } from 'src/helper/query.service';
import { ShiftModule } from 'src/shift/shift.module';
import { AttendanceModule } from 'src/attendance/attendance/attendance.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ShiftModule],
  controllers: [UserController],
  providers: [UserService, QueryService],
  exports: [UserService],
})
export class UserModule { }
