import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ResponseFormat from 'src/utils/Addons/response-formats';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import UserType from 'src/user/enum/UserTypeEnum';
import { isArray } from 'class-validator';

@Controller('shift')
@ApiTags('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) { }

  @ApiBearerAuth('BearerAuth')
  @Post()
  async create(@Request() req, @Body() createShiftDto: CreateShiftDto) {
    try {
      const data = await this.shiftService.create(createShiftDto, createShiftDto.user_id);

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
      const data = await this.shiftService.findAll({ relations:['shifts']});

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get('byuser/:user_id')
  async findAllByUser(@Param('user_id') user_id: number) {
    try {
      const data = await this.shiftService.findAllShift(user_id);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/getByFilter')
  async findAllByFilter(@Body() filter: FilterParamsDto, @Request() req) {
    try {
      let condition = await req.user.role != UserType.ADMIN ? "shift.user_id = " + req.user.id : false
      filter.fields.forEach(element => {
        if(isArray(element["key"])){
          if(element["key"][0] == "user_id") condition = "shift.user_id = "  + element["value"]
        }else if(element["key"] == "user_id") condition = "shift.user_id = " + element["value"]
      });
      filter.fields = []

      const data = await this.shiftService.findAllByFilter(filter, condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.shiftService.findOne(+id);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto) {
    try {
      const data = await this.shiftService.update(+id, updateShiftDto);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const data = await this.shiftService.remove(+id);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }
}
