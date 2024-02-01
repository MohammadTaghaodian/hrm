import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ResponseFormat from 'src/utils/Addons/response-formats';
import { ChangeStatusDto } from 'src/public/dto/change-status.dto';
import UserType from 'src/user/enum/UserTypeEnum';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';

@Controller('task')
@ApiTags('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @ApiBearerAuth('BearerAuth')
  @Post()
  async create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    try {
      const data = await this.taskService.create(createTaskDto);
      return ResponseFormat(true, HttpStatus.CREATED, 'CREATED', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get()
  async findAll() {
    try {
      const data = await this.taskService.findAll();
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    };
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/getByFilter')
  async findAllByFilter(@Body() filter: FilterParamsDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? req.user.id : false

      const data = await this.taskService.findAllByFilter(filter, condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get('/getByProject/:project_id')
  async findAllByProject(@Param('project_id') project_id: number) {
    try {
      const data = await this.taskService.findAllBy(project_id);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    };
  }

  @ApiBearerAuth('BearerAuth')
  @Get('/getByActivity/:activty_id')
  async findAllByActivity(@Param('activty_id') activty_id: number) {
    try {
      const data = await this.taskService.findAllTaskBy(activty_id);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    };
  }

  @ApiBearerAuth('BearerAuth')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const data = await this.taskService.findOne(id);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    };
  }

  @ApiBearerAuth('BearerAuth')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      const data = await this.taskService.update(+id, updateTaskDto);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    };
  }

  @ApiBearerAuth('BearerAuth')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const data = await this.taskService.remove(+id);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    };
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/taskEnd')
  async taskEnd() {
    const data = await this.taskService.taskEnd();
    return ResponseFormat(true, HttpStatus.OK, 'OK', data);
  } catch(error) {
    return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
  };

}

