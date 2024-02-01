import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { TeleworkingService } from './teleworking.service';
import { AttendanceService } from '../attendance/attendance/attendance.service';
import { CreateTeleworkingDto } from './dto/create-teleworking.dto';
import { UpdateTeleworkingDto } from './dto/update-teleworking.dto';
import ResponseFormat, { ResponseFormatType } from 'src/utils/Addons/response-formats';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { ChangeStatusDto } from 'src/public/dto/change-status.dto';
import UserType from 'src/user/enum/UserTypeEnum';
import { CreateAttendanceDto } from 'src/attendance/attendance/dto/create-attendance.dto';
import AttendanceType from 'src/attendance/attendance/enum/AttendanceTypeEnum';
import AttendanceStatus from 'src/attendance/attendance/enum/AttendanceStatusEnum';

@ApiTags('teleworking - درخواست دورکاری')
@Controller('teleworking')
export class TeleworkingController {
  constructor(private readonly teleworkingService: TeleworkingService, private readonly attendanceService: AttendanceService) { }

  @ApiBearerAuth('BearerAuth')
  @Post()
  async create(@Body() createTeleworkingDto: CreateTeleworkingDto, @Request() req) {
    try {
      // await req.user.role != UserType.ADMIN ? createTeleworkingDto.user_id = req.user.id : false
      createTeleworkingDto.user_id = req.user.id
      const data = await this.teleworkingService.create(createTeleworkingDto);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get()
  async findAll(@Request() req): Promise<ResponseFormatType> {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id } : {}
      const data = await this.teleworkingService.findAll(condition);
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
      const data = await this.teleworkingService.findAllByFilter(filter, condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id } : { id }
      const data = await this.teleworkingService.findOne(condition);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTeleworkingDto: UpdateTeleworkingDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id } : { id }
      const data = await this.teleworkingService.update(condition, updateTeleworkingDto);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/set')
  async setStatusteleworking(@Body() teleworking: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: teleworking.id } : { id: teleworking.id }
      const data = await this.teleworkingService.changeStatusSET(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/confirm')
  async confirmStatusteleworking(@Body() teleworking: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: teleworking.id } : { id: teleworking.id }
      const data = await this.teleworkingService.changeStatusCONFIRM(condition);
      if(data){
        const createAttendanceDto: CreateAttendanceDto = {
          user_id: data.user_id,
          task_id: 0,
          start_time: data.from_date,
          end_time: data.until_date,
          type: AttendanceType.DEVICE,
          status: AttendanceStatus.SET
        };

        const rec = await this.attendanceService.create(createAttendanceDto);
      } 

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/reject')
  async rejectStatusteleworking(@Body() teleworking: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: teleworking.id } : { id: teleworking.id }
      const data = await this.teleworkingService.changeStatusREJECT(condition);

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
  //     const data = await this.teleworkingService.remove(+id);
  //     return ResponseFormat(true, 200, "OK", data);

  //   } catch (error) {
  //     // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
  //     return ResponseFormat(false, 500, "SERVER-ERROR", null);
  //   }
  // }
}
