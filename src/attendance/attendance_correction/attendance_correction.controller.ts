import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AttendanceCorrectionService } from './attendance_correction.service';
import { CreateAttendanceCorrectionDto } from './dto/create-attendance_correction.dto';
import ResponseFormat, { ResponseFormatType } from 'src/utils/Addons/response-formats';
import { UpdateAttendanceCorrectionDto } from './dto/update-attendance_correction.dto';
import { AttendanceService } from '../attendance/attendance.service';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { ChangeStatusDto } from 'src/public/dto/change-status.dto';
import UserType from 'src/user/enum/UserTypeEnum';

@ApiTags('attendanceCorrection - درخواست اصلاح حضورغیاب')
@Controller('attendanceCorrection')
export class AttendanceCorrectionController {
  constructor(private readonly attendanceCorrectionService: AttendanceCorrectionService, private readonly attendanceService: AttendanceService) { }

  @ApiBearerAuth('BearerAuth')
  @Post()
  async create(@Body() createAttendanceCorrectionDto: CreateAttendanceCorrectionDto, @Request() req) {
    try {
      // await req.user.role != UserType.ADMIN ? createAttendanceCorrectionDto.user_id = req.user.id : false

      const condition = { id: createAttendanceCorrectionDto.attendance_id }
      const attendance = await this.attendanceService.findOne(condition)
      // console.log('gg')
      // اگر رکورد مرخصی پیدا نشود، خطای مناسب را برمیگردانیم
      if (!attendance)
        throw new HttpException('مرخصی پیدا نشد', HttpStatus.NOT_FOUND)
      const data = await this.attendanceCorrectionService.create(createAttendanceCorrectionDto, attendance);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      console.log(error)
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get()
  async findAll(@Request() req): Promise<ResponseFormatType> {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id } : {}

      const data = await this.attendanceCorrectionService.findAll(condition);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id } : { id }

      const data = await this.attendanceCorrectionService.findOne(condition);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/getByFilter')
  async findAllByFilter(@Body() filter: FilterParamsDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? req.user.id : false

      const data = await this.attendanceCorrectionService.findAllByFilter(filter, condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateAttendanceCorrectionDto: UpdateAttendanceCorrectionDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id } : { id }

      const data = await this.attendanceCorrectionService.update(condition, updateAttendanceCorrectionDto);
      return ResponseFormat(true, 200, "OK", data);
    } catch (error) {console.log(error)
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/set')
  async setStatusAttendance(@Body() attendance: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: attendance.id } : { id: attendance.id }

      const data = await this.attendanceCorrectionService.changeStatusSET(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/confirm')
  async absenceStatusAttendance(@Body() attendance: ChangeStatusDto) {
    try {
      const data = await this.attendanceCorrectionService.changeStatusCONFIRM(attendance.id);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/reject')
  async unfinishedStatusAttendance(@Body() attendance: ChangeStatusDto) {
    try {
      const data = await this.attendanceCorrectionService.changeStatusREJECT(attendance.id);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // @ApiBearerAuth('BearerAuth')
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   try {
  //     const data = await this.attendanceCorrectionService.remove(+id);
  //     return ResponseFormat(true, 200, "OK", data);

  //   } catch (error) {
  //     // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
  //     return ResponseFormat(false, 500, "SERVER-ERROR", null);
  //   }
  // }
}
