import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Request } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ResponseFormat from 'src/utils/Addons/response-formats';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import UserType from 'src/user/enum/UserTypeEnum';

@Controller('report')
@ApiTags('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @ApiBearerAuth('BearerAuth')
  @Post()
  async create(@Body() createReportDto: CreateReportDto) {
    try {
      const data = await this.reportService.create(createReportDto);
      return ResponseFormat(true, HttpStatus.CREATED, 'CREATED', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get()
  async findAll() {
    try {
      const data = await this.reportService.findAll();
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

      const data = await this.reportService.findAllByFilter(filter, condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get('/getByTask/:task_id')
  async findAllByProject(@Param('task_id') task_id: number) {
    try {
      const data = await this.reportService.findAllBy(task_id);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    };
  }

  @ApiBearerAuth('BearerAuth')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.reportService.findOne(+id);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    try {
      const data = await this.reportService.update(+id, updateReportDto);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const data = await this.reportService.remove(+id);
      return ResponseFormat(true, HttpStatus.OK, 'OK', data);
    } catch (error) {
      return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
    }
  }

}
