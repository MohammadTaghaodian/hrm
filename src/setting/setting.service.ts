import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting) private settingRepository: Repository<Setting>,
  ) { }
  async create(createSettingDto: CreateSettingDto) {
    const setting = await this.settingRepository.create(createSettingDto)
    return this.settingRepository.save(setting)
  }

  findAll(condition: any = null) {
    return this.settingRepository.findBy(condition)
  }

  findOne(key: string) {
    return this.settingRepository.findOneBy({ key })
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return this.settingRepository.update(id, updateSettingDto)
  }

  remove(id: number) {
    return this.settingRepository.delete(id)
  }
}
