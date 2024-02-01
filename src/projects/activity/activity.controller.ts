import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import ResponseFormat, { ResponseFormatType } from 'src/utils/Addons/response-formats';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import UserType from 'src/user/enum/UserTypeEnum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('activity - فعالیت ها')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) { }

  @ApiBearerAuth('BearerAuth')
  @Post()
  async create(@Body() createActivityDto: CreateActivityDto, @Request() req): Promise<ResponseFormatType> {
    try {
      const data = await this.activityService.create(createActivityDto);
      return ResponseFormat(true, 200, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, 500, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get()
  async findAll() {
    try {
      const data = await this.activityService.findAll();
      return ResponseFormat(true, 200, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, 500, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/getByFilter')
  async findAllByFilter(@Body() filter: FilterParamsDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? req.user.id : false

      const data = await this.activityService.findAllByFilter(filter, condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }


  @ApiBearerAuth('BearerAuth')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const data = await this.activityService.findOne(id);
      return ResponseFormat(true, 200, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, 500, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get('getByProject/:project_id')
  async findAllByProject(@Param('project_id') project_id: number) {
    try {
      const data = await this.activityService.findAllBy(project_id);
      return ResponseFormat(true, 200, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, 500, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateActivityDto: UpdateActivityDto,
    @Request() req,
  ): Promise<ResponseFormatType> {
    try {
      const data = await this.activityService.update(id, updateActivityDto);
      return ResponseFormat(true, 200, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, 500, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const data = await this.activityService.remove(id);
      return ResponseFormat(true, 200, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, 500, 'SERVER-ERROR', null);
    }
  }
}
