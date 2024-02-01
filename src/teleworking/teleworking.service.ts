import { Injectable } from '@nestjs/common';
import { CreateTeleworkingDto } from './dto/create-teleworking.dto';
import { UpdateTeleworkingDto } from './dto/update-teleworking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teleworking } from './entities/teleworking.entity';
import { Repository } from 'typeorm';
import { QueryService } from 'src/helper/query.service';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { UserService } from 'src/user/user.service';
import TeleworkingStatus from './enum/TeleworkingStatusEnum';

@Injectable()
export class TeleworkingService {
  constructor(
    @InjectRepository(Teleworking) private teleworkingRepository: Repository<Teleworking>, private readonly queryService: QueryService, private userService: UserService
  ) { }

  /**
   * ایجاد یک سابقه دورکاری جدید
   * @param createTeleworkingDto اطلاعات موردنیاز برای ایجاد سابقه دورکاری
   * @returns سابقه دورکاری ایجاد شده
   */
  async create(createTeleworkingDto: CreateTeleworkingDto) {
    const teleworking = await this.teleworkingRepository.create({ ...createTeleworkingDto });
    return this.teleworkingRepository.save(teleworking);
  }

  /**
   * دریافت تمامی سوابق دورکاری
   * @returns لیستی از تمامی سوابق دورکاری
   */
  async findAll(condition: any) {
    console.log(condition)
    return this.teleworkingRepository.findBy(condition)
  }

  async findAllByFilter(filter: FilterParamsDto, condition: any) {
    const queryBuilder = this.queryService.createFilterQuery(this.teleworkingRepository, filter, "teleworkings", condition);
    const data = await queryBuilder.getMany();

    // انتظار می‌رود که userService.findOne از نوع Promise باشد
    // await Promise.all(data.map(async (element) => {
    //   if(element['user']){
    //     const user = await this.userService.findOne(element['user_id']);
    //     if (user) element['user'] = user;
    //   }

    //   // getManager
    //   if(element['manager_id']){
    //     const manager = await this.userService.findOne(element['manager_id']);
    //     if (manager) element['manager'] = manager;
    //   }
    // }));
    return data;
  }

  /**
   * دریافت یک سابقه دورکاری بر اساس شناسه
   * @param id شناسه سابقه دورکاری مورد نظر
   * @returns سابقه دورکاری موردنظر
   */
  findOne(condition: any) {
    return this.teleworkingRepository.findOneBy(condition);
  }

  /**
   * به‌روزرسانی یک سابقه دورکاری
   * @param updateTeleworkingDto اطلاعات جدید برای به‌روزرسانی سابقه دورکاری
   * @returns سابقه دورکاری به‌روزرسانی شده
   */
  update(condition: any, updateTeleworkingDto: UpdateTeleworkingDto) {
    return this.teleworkingRepository.update(condition, { ...updateTeleworkingDto });
  }

  async changeStatusSET(condition: any) {
    const attendanceCorrectionToUpdate = await this.teleworkingRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.teleworkingRepository.update(condition, { status: TeleworkingStatus.SET })
  }

  async changeStatusCONFIRM(condition: any) {
    const attendanceCorrectionToUpdate = await this.teleworkingRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    await this.teleworkingRepository.update(condition, { status: TeleworkingStatus.CONFIRM })

    return attendanceCorrectionToUpdate
  }

  async changeStatusREJECT(condition: any) {
    const attendanceCorrectionToUpdate = await this.teleworkingRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.teleworkingRepository.update(condition, { status: TeleworkingStatus.REJECT })
  }


  /**
   * حذف یک سابقه دورکاری بر اساس شناسه
   * @param id شناسه سابقه دورکاری مورد نظر برای حذف
   * @returns نتیجه حذف
   */
  remove(id: number) {
    return this.teleworkingRepository.delete(id);
  }
}
