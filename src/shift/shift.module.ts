import { Module } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './entities/shift.entity';
import { ShiftDay } from './entities/shift_day.entity';
import { QueryService } from 'src/helper/query.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, ShiftDay])],
  controllers: [ShiftController],
  providers: [ShiftService, QueryService],
  exports: [ShiftService]
})
export class ShiftModule { }