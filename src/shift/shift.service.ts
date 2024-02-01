import { Injectable } from '@nestjs/common';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shift } from './entities/shift.entity';
import { Repository } from 'typeorm';
import { ShiftDay } from './entities/shift_day.entity';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { QueryService } from 'src/helper/query.service';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift) private shiftRepository: Repository<Shift>,
    @InjectRepository(ShiftDay) private shiftDayRepository: Repository<ShiftDay>,
    private readonly queryService: QueryService,
  ) { }

  async createShift(user_id: number) {
    const shift = await this.shiftRepository.create({ user_id })
    console.log(user_id)
    return this.shiftRepository.save(shift)
  }

  async findAllShift(user_id: number) {
    const shift = await this.shiftRepository.createQueryBuilder('shift')
      .leftJoinAndSelect('shift.shiftDays', 'shift_day')
      .where(`shift.user_id = :user_id`, { user_id })
      .getOne()

    return shift['shiftDays']
    // let data = []
    // const shift = await this.shiftRepository.createQueryBuilder('shift')
    //   .leftJoin('shift.shiftDays', 'shift_day')
    //   .select('shift_day.*')
    //   .where(`shift.user_id = :user_id`, { user_id })
    //   .getRawMany()
    // if(shift.length != 0) data = shift
    // return data
  }

  async findAllByFilter(filter: FilterParamsDto, wheres: any) {
    // const shift = await this.shiftRepository.createQueryBuilder('shift')
    //   .leftJoinAndSelect('shift.shiftDays', 'shift_day')
    //   // .select('shift.*')
    //   // .groupBy('shift.user_id')
    //   // .where(`shift.user_id = :user_id`, { user_id: condition['user_id'] })
    //   .getMany()

    const queryBuilder = this.queryService.createFilterQuery(this.shiftDayRepository, filter, "shift_day", null, wheres).leftJoin("shift_day.shifts", "shift");
    const data = await queryBuilder.getMany();

    return data
  }

  async create(createShiftDto: CreateShiftDto, id: number) {
    const shift = await this.shiftRepository.findOneBy({ user_id: id })
    const shiftDay = await this.shiftDayRepository.create({ shifts: shift.id, ...createShiftDto })
    return this.shiftDayRepository.save(shiftDay)
  }

  async findAll(condition: any = null) {
    const shift = await this.shiftRepository.createQueryBuilder('shift')
      .leftJoinAndSelect('shift.shiftDays', 'shift_day')
      .getMany()

    return shift
  }

  async findAllShiftUser(weekDay: number) {
    // console.log(weekDay)
    return this.shiftDayRepository.createQueryBuilder('shift_day')
      .leftJoinAndSelect('shift_day.shifts', 'shift')
      // .select('shift.*')
      // .groupBy('shift.id')
      // .addGroupBy('shift.user_id')
      .where(`shift_day.weekDay = '${weekDay}'`)
      .getRawMany()
  }

  async shiftQuery(user_id: number, weekDay: number) {
    const shift = await this.shiftDayRepository.createQueryBuilder('shift_day')
      .innerJoin('shift_day.shifts', 'shift')
      .select('shift_day')
      .where(`shift.user_id = ${user_id}`)
      .andWhere(`shift_day.weekDay = '${weekDay}'`) 
      .getOne()

    return shift
  }

  async shiftQueryBuilder(user_id: number, weekDay: number) {
    const shift = await this.shiftDayRepository.createQueryBuilder('shift_day')
      .innerJoin('shift_day.shifts', 'shift')
      .select('shift_day')
      .where(`shift.user_id = ${user_id}`)
      .andWhere(`shift_day.weekDay = '${weekDay}'`) 
      .getMany()

    return shift
  }

  findOne(id: number) {
    return this.shiftDayRepository.findOneBy({ id })
  }

  update(id: number, updateShiftDto: UpdateShiftDto) {
    return this.shiftDayRepository.update({ id }, { ...updateShiftDto })
  }

  remove(id: number) {
    return this.shiftDayRepository.delete(id)
  }
}
