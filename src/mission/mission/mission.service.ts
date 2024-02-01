import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { Repository } from 'typeorm';
import { QueryService } from 'src/helper/query.service';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { UserService } from 'src/user/user.service';
import MissionStatus from './enum/MissionStatusEnum';

@Injectable()
export class MissionService {
  constructor(@InjectRepository(Mission) private missionRepository: Repository<Mission>, private readonly queryService: QueryService, private userService: UserService) { }

  /**
   * ایجاد یک ماموریت جدید
   * @param createMissionDto اطلاعات مورد نیاز برای ایجاد ماموریت
   * @returns ماموریت ایجاد شده
   */
  create(createMissionDto: CreateMissionDto) {
    const newMission = this.missionRepository.create({
      ...createMissionDto
    });

    return this.missionRepository.save(newMission);
  }

  /**
   * دریافت تمامی ماموریت‌ها به همراه تاریخچه و گزارش‌ها
   * @returns لیست تمامی ماموریت‌ها
   */
  async findAll(condition: any) {
    return await this.missionRepository.findBy(condition);
  }

  async findAllByFilter(filter: FilterParamsDto, condition: any) {
    const queryBuilder = this.queryService.createFilterQuery(this.missionRepository, filter, "missions", condition);
    const data = await queryBuilder.getMany();

    // انتظار می‌رود که userService.findOne از نوع Promise باشد
    // await Promise.all(data.map(async (element) => {
    //   element['user'] = null
    //   element['manager'] = null

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
   * دریافت یک ماموریت بر اساس شناسه
   * @param id شناسه ماموریت مورد نظر
   * @returns ماموریت موردنظر
   */
  findOne(condition: any) {
    return this.missionRepository.findOne({ relations: ['reports', 'histories'], where: condition })
  }
  /**
   * به‌روزرسانی یک ماموریت
   * @param updateRequest اطلاعات جدید برای به‌روزرسانی ماموریت
   * @returns ماموریت به‌روزرسانی شده
   */
  async update(condition: any, updateRequest: UpdateMissionDto) {
    const missionToUpdate = await this.missionRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.missionRepository.update(condition, updateRequest)
  }

  async changeStatusSET(condition: any) {
    const attendanceCorrectionToUpdate = await this.missionRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.missionRepository.update(condition, { status: MissionStatus.SET })
  }

  async changeStatusCONFIRM(condition: any) {
    const attendanceCorrectionToUpdate = await this.missionRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.missionRepository.update(condition, { status: MissionStatus.CONFIRM })
  }

  async changeStatusREJECT(condition: any) {
    const attendanceCorrectionToUpdate = await this.missionRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.missionRepository.update(condition, { status: MissionStatus.REJECT })
  }

  async changeStatusDONE(condition: any) {
    const attendanceCorrectionToUpdate = await this.missionRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.missionRepository.update(condition, { status: MissionStatus.DONE })
  }

  async changeStatusDONE_CONFIRM(condition: any) {
    const attendanceCorrectionToUpdate = await this.missionRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.missionRepository.update(condition, { status: MissionStatus.DONE_CONFIRM })
  }

  async changeStatusDONE_REJECT(condition: any) {
    const attendanceCorrectionToUpdate = await this.missionRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.missionRepository.update(condition, { status: MissionStatus.DONE_REJECT })
  }

  /**
   * حذف یک ماموریت بر اساس شناسه
   * @param id شناسه ماموریت مورد نظر برای حذف
   * @returns نتیجه حذف
   */
  async remove(id: number) {
    const missionToRemove = await this.missionRepository.findOneByOrFail({ id });

    return this.missionRepository.remove(missionToRemove);
  }

  async missionEnd() {
    const missions = await this.missionRepository.find()
    let missionUpdate = [], timestampNow = Date.now()


    for (const value of missions) {
      const until_date = +value['until_date']
      if (until_date <= timestampNow && (value['status'] != MissionStatus.DONE && value['status'] != MissionStatus.CONFIRM)) {
        value['status'] = MissionStatus.EXPIRED
        missionUpdate.push(await this.update(value['id'], value))
      }
    }
    return missionUpdate
  }
}
