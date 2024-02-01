import { Injectable } from '@nestjs/common';
import { CreateLeavesDto } from './dto/create-leaves.dto';
import { UpdateleavesDto } from './dto/update-leaves.dto';
import { Leaves } from './entities/leaves.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { QueryService } from 'src/helper/query.service';
import { UserService } from 'src/user/user.service';
import LeavesStatus from './enum/LeavesStatusEnum';

@Injectable()
export class LeavesService {
  constructor(
    @InjectRepository(Leaves) private leavesRepository: Repository<Leaves>,
    private readonly queryService: QueryService,
    private userService: UserService
  ) { }

  /**
   * ایجاد یک رکورد جدید برای مرخصی
   * @param createLeavesDto اطلاعات مورد نیاز برای ایجاد مرخصی
   * @returns مرخصی ایجاد شده
   */
  create(createLeavesDto: CreateLeavesDto) {
    const leaves = this.leavesRepository.create({ ...createLeavesDto })
    return this.leavesRepository.save(leaves)
  }

  /**
   * دریافت تمامی مرخصی‌ها
   * @returns لیستی از تمامی مرخصی‌ها
   */
  findAll(condition: any) {
    return this.leavesRepository.findBy(condition);
  }

  async findAllByFilter(filter: FilterParamsDto, condition: any) {
    const queryBuilder = this.queryService.createFilterQuery(this.leavesRepository, filter, "leaves", condition);
    const data = await queryBuilder.getMany();

    // انتظار می‌رود که userService.findOne از نوع Promise باشد
    // await Promise.all(data.map(async (element) => {
    // element['user'] = null
    // element['manager'] = null

    // if(element['user']){
    //   const user = await this.userService.findOne(element['user_id']);
    //   if (user) element['user'] = user;
    // }

    // // getManager
    // if(element['manager_id']){
    //   const manager = await this.userService.findOne(element['manager_id']);
    //   if (manager) element['manager'] = manager;
    // }
    // }));
    return data;
  }

  /**
   * دریافت یک مرخصی بر اساس شناسه
   * @param id شناسه مرخصی مورد نظر
   * @returns مرخصی موردنظر
   */
  findOne(condition: any) {
    return this.leavesRepository.findOneBy(condition);
  }

  /**
   * به‌روزرسانی یک مرخصی
   * @param updateLeavesDto اطلاعات جدید برای به‌روزرسانی مرخصی
   * @returns مرخصی به‌روزرسانی شده
   */
  update(condition: any, updateLeavesDto: UpdateleavesDto) {
    return this.leavesRepository.update(condition, updateLeavesDto);
  }

  async changeStatusSET(condition: any) {
    const attendanceCorrectionToUpdate = await this.leavesRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.leavesRepository.update(condition, { status: LeavesStatus.SET })
  }

  async changeStatusCONFIRM(condition: any) {
    const attendanceCorrectionToUpdate = await this.leavesRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.leavesRepository.update(condition, { status: LeavesStatus.CONFIRM })
  }

  async changeStatusREJECT(condition: any) {
    const attendanceCorrectionToUpdate = await this.leavesRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.leavesRepository.update(condition, { status: LeavesStatus.REJECT })
  }

  /**
   * حذف یک مرخصی بر اساس شناسه
   * @param id شناسه مرخصی مورد نظر برای حذف
   * @returns نتیجه حذف
   */
  remove(id: number) {
    return this.leavesRepository.delete(id);
  }

  async leavesEnd() {
    const leavess = await this.leavesRepository.find()
    let leavesUpdate = [], timestampNow = Date.now()


    for (const value of leavess) {
      const until_date = +value['until_date']
      if (until_date <= timestampNow && value['status'] != LeavesStatus.CONFIRM) {
        value['status'] = LeavesStatus.REJECT
        leavesUpdate.push(await this.update(value['id'], value))
      }
    }
    return leavesUpdate
  }
}
