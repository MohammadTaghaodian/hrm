import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Request } from '@nestjs/common';
import { WorkTrackService } from './work_track.service';
import { CreateWorkTrackDto } from './dto/create-work_track.dto';
import { UpdateWorkTrackDto } from './dto/update-work_track.dto';
import ResponseFormat from 'src/utils/Addons/response-formats';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMultipleWorkTracksDto } from './dto/create-multi-track.dto';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import UserType from 'src/user/enum/UserTypeEnum';

@ApiTags('work-track')
@Controller('work-track')
export class WorkTrackController {
  constructor(private readonly workTrackService: WorkTrackService) { }

  @ApiBearerAuth('BearerAuth')
  @Post()
  async create(@Body() createWorkTrackDto: CreateWorkTrackDto) {
    try {

      const addWorktrackDate = await this.workTrackService.addWorktrackDate(createWorkTrackDto)
      if (addWorktrackDate) return ResponseFormat(true, 400, "ثبت کارکرد امکان پذیر نیست")

      const data = await this.workTrackService.create(createWorkTrackDto);
      return ResponseFormat(true, HttpStatus.CREATED, 'CREATED', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post("completeTrack")
  async completeTrack(@Body() createMultipleWorkTracksDto: CreateMultipleWorkTracksDto) {
    try {
      await Promise.all(createMultipleWorkTracksDto?.tracks.map(async (element) => {
        if (!element.id) await this.workTrackService.create(element);
        else await this.workTrackService.update(element.id, element);
      }));
      return ResponseFormat(true, HttpStatus.CREATED, 'CREATED');
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/getByFilter')
  async findAllByFilter(@Body() filter: FilterParamsDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? req.user.id : false

      const data = await this.workTrackService.findAllByFilter(filter, condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get()
  async findAll() {
    try {
      const data = await this.workTrackService.findAll();
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.workTrackService.findOne(+id);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get('attendance/:attendance_id')
  async findOneByAttendance(@Param('attendance_id') attendance_id: number) {
    try {
      const data = await this.workTrackService.findProjectAndTaskByAttendance(attendance_id);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get('task/:task_id')
  async findOneByTask(@Param('task_id') task_id: number) {
    try {
      const data = await this.workTrackService.findTrackTaskBy(task_id);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      console.log(error)
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateWorkTrackDto: UpdateWorkTrackDto) {
    try {
      const data = await this.workTrackService.update(+id, updateWorkTrackDto);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const data = await this.workTrackService.remove(+id);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

}
