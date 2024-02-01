import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import ResponseFormat from 'src/utils/Addons/response-formats';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('setting')
@ApiTags('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) { }

  @ApiBearerAuth('BearerAuth')
  @Post()
  async create(@Body() createSettingDto: CreateSettingDto) {
    const data = await this.settingService.create(createSettingDto);
    return ResponseFormat(true, HttpStatus.CREATED, 'CREATED', data);
  }

  @ApiBearerAuth('BearerAuth')
  @Post('seed')
  async seed() {
    let setting = [
      {
        key: 'between-attendance',
        value: 'true',
        label: 'تردد بین روز ثبت شود یا نه',
        type: 'boolean'
      },
      {
        key: 'maximum-attendance-time',
        value: '50400',
        label: 'تایم حداکثری تردد چقدر باشد',
        type: 'timestamp'
      },
      {
        key: 'online-attendance',
        value: 'false',
        label: 'تردد آنلاین ثبت شود یا نه',
        type: 'boolean'
      },
      {
        key: 'add-worktrack-date',
        value: '5',
        label: 'ثبت کارکرد برای تردد تا (روز از ماه بعد',
        type: 'number'
      },
      {
        key: 'attachment-limit-count',
        value: '30',
        label: 'محدودیت تعداد پیوست',
        type: 'number'
      },
      {
        key: 'attachment-limit-weight',
        value: '10',
        label: 'محدودیت حجم پیوست (مگابایت)',
        type: 'number'
      },
      {
        key: 'floating-shift',
        value: 'true',
        label: 'شناور بودن ساعت کارکرد نسبت به برنامه حضور روزانه',
        type: 'boolean'
      },
      {
        key: 'leaves-maxtime',
        value: '57600',
        label: 'حداکثر تایم مرخصی در ماه',
        type: 'timestamp'
      },
      {
        key: 'overtime-type',
        value: 'روزانه',
        label: 'نحوه محاسبه اضافه کاری : روزانه / ماهانه',
        type: 'string'
      },
    ]

    const settingFind = await this.settingService.findAll()

    if (!settingFind.length) {
      for (const value of setting) {
        await this.settingService.create(value)
      }
    }
    return ResponseFormat(true, HttpStatus.OK, 'OK');
  }

  @ApiBearerAuth('BearerAuth')
  @Get()
  async findAll() {
    const data = await this.settingService.findAll();
    return ResponseFormat(true, HttpStatus.OK, 'OK', data);
  }

  @ApiBearerAuth('BearerAuth')
  @Get(':key')
  async findOne(@Param('id') key: string) {
    const data = await this.settingService.findOne(key);
    return ResponseFormat(true, HttpStatus.OK, 'OK', data);
  }

  @ApiBearerAuth('BearerAuth')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    const data = await this.settingService.update(+id, updateSettingDto);
    return ResponseFormat(true, HttpStatus.OK, 'OK', data);
  }

  @ApiBearerAuth('BearerAuth')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.settingService.remove(+id);
    return ResponseFormat(true, HttpStatus.OK, 'OK', data);
  }
}
