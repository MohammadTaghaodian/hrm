import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Request, HttpStatus } from '@nestjs/common';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { firstValueFrom } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ResponseFormat, { ResponseFormatType } from 'src/utils/Addons/response-formats';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { ChangeStatusDto } from 'src/public/dto/change-status.dto';
import UserType from 'src/user/enum/UserTypeEnum';

@ApiTags('mission - ماموریت ها')
@Controller('mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) { }

  // ایجاد ماموریت جدید
  @ApiBearerAuth('BearerAuth')
  @Post()
  async create(@Body() createMissionDto: CreateMissionDto, @Request() req) {
    try {
      // await req.user.role != UserType.ADMIN ? createMissionDto.user_id = req.user.id : false
      createMissionDto.user_id = req.user.id

      const data = await this.missionService.create(createMissionDto);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // دریافت همه‌ی اطلاعات ماموریت‌ها
  @ApiBearerAuth('BearerAuth')
  @Get()
  async findAll(@Request() req): Promise<ResponseFormatType> {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id } : {}
      const data = await this.missionService.findAll(condition);
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

      const data = await this.missionService.findAllByFilter(filter, condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/set')
  async setStatusMission(@Body() mission: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: mission.id } : { id: mission.id }
      const data = await this.missionService.changeStatusSET(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/confirm')
  async confirmStatusMission(@Body() mission: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: mission.id } : { id: mission.id }
      const data = await this.missionService.changeStatusCONFIRM(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/reject')
  async rejectStatusMission(@Body() mission: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: mission.id } : { id: mission.id }
      const data = await this.missionService.changeStatusREJECT(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/done')
  async doneStatusMission(@Body() mission: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: mission.id } : { id: mission.id }
      const data = await this.missionService.changeStatusDONE(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/doneReject')
  async doneRejectStatusMission(@Body() mission: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: mission.id } : { id: mission.id }

      const data = await this.missionService.changeStatusDONE_REJECT(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/doneConfirm')
  async doneConfirmStatusMission(@Body() mission: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: mission.id } : { id: mission.id }
      const data = await this.missionService.changeStatusDONE_CONFIRM(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // دریافت اطلاعات ماموریت بر اساس شناسه
  @ApiBearerAuth('BearerAuth')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<ResponseFormatType> {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id } : { id }
      const data = await this.missionService.findOne(condition);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }


  @ApiBearerAuth('BearerAuth')
  @Get('/report/:id')
  async findAllReport(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<ResponseFormatType> {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id } : { id }
      const data = await this.missionService.findOne(condition);
      return ResponseFormat(true, 200, "OK", data['reports']);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get('/history/:id')
  async findAllHistory(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<ResponseFormatType> {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id } : { id }
      const data = await this.missionService.findOne(condition);
      return ResponseFormat(true, 200, "OK", data['histories']);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // به‌روزرسانی اطلاعات ماموریت بر اساس شناسه
  @ApiBearerAuth('BearerAuth')
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateMissionDto: UpdateMissionDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id } : { id }
      const data = await this.missionService.update(condition, updateMissionDto);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }


  // حذف اطلاعات ماموریت بر اساس شناسه
  // @ApiBearerAuth('BearerAuth')
  // @Delete(':id')
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   try {
  //     const data = await this.missionService.remove(id);
  //     return ResponseFormat(true, 200, "OK", data);

  //   } catch (error) {
  //     // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
  //     return ResponseFormat(false, 500, "SERVER-ERROR",null);
  //   }
  // }

  @ApiBearerAuth('BearerAuth')
  @Post()
  async updaateSet(@Body() createMissionDto: CreateMissionDto) {
    try {
      const data = await this.missionService.create(createMissionDto);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/missionEnd')
  async missionEnd() { 
    const data = await this.missionService.missionEnd();
    return ResponseFormat(true, HttpStatus.OK, 'OK', data);
  } catch(error) {
    return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
  }

}
