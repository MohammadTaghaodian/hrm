import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpStatus } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeavesDto } from './dto/create-leaves.dto';
import { UpdateleavesDto } from './dto/update-leaves.dto';
import ResponseFormat, { ResponseFormatType } from 'src/utils/Addons/response-formats';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { ChangeStatusDto } from 'src/public/dto/change-status.dto';
import UserType from 'src/user/enum/UserTypeEnum';

@ApiTags('leaves - مرخصی ها')
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) { }

  // ایجاد یک مرخصی جدید
  @ApiBearerAuth('BearerAuth')
  @Post()
  async create(@Body() createLeavesDto: CreateLeavesDto, @Request() req) {
    try {
      // await req.user.role != UserType.ADMIN ? createLeavesDto.user_id = req.user.id : false
      createLeavesDto.user_id = req.user.id

      const data = await this.leavesService.create(createLeavesDto);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // دریافت تمام مرخصی‌ها
  @ApiBearerAuth('BearerAuth')
  @Get()
  async findAll(@Request() req): Promise<ResponseFormatType> {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id } : {}
      const data = await this.leavesService.findAll(condition);
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

      const data = await this.leavesService.findAllByFilter(filter, condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // دریافت یک مرخصی براساس شناسه
  @ApiBearerAuth('BearerAuth')
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id } : { id }
      const data = await this.leavesService.findOne(condition);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // به‌روزرسانی مرخصی براساس شناسه
  @ApiBearerAuth('BearerAuth')
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateleaveDto: UpdateleavesDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id } : { id }
      const data = await this.leavesService.update(condition, updateleaveDto);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/set')
  async setStatusLeaves(@Body() leaves: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: leaves.id } : { id: leaves.id }
      const data = await this.leavesService.changeStatusSET(leaves.id);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/confirm')
  async confirmStatusLeaves(@Body() leaves: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: leaves.id } : { id: leaves.id }

      const data = await this.leavesService.changeStatusCONFIRM(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/reject')
  async rejectStatusLeaves(@Body() leaves: ChangeStatusDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? { user_id: req.user.id, id: leaves.id } : { id: leaves.id }

      const data = await this.leavesService.changeStatusREJECT(condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // حذف یک مرخصی براساس شناسه
  // @ApiBearerAuth('BearerAuth')
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   try {
  //     const data = await this.leavesService.remove(+id);
  //     return ResponseFormat(true, 200, "OK", data);

  //   } catch (error) {
  //     // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
  //     return ResponseFormat(false, 500, "SERVER-ERROR", null);
  //   }
  // }

  @ApiBearerAuth('BearerAuth')
  @Post('/leavesEnd')
  async leavesEnd() { 
    const data = await this.leavesService.leavesEnd();
    return ResponseFormat(true, HttpStatus.OK, 'OK', data);
  } catch(error) {
    return ResponseFormat(false, HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER-ERROR', null);
  }
}
