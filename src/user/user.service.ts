import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { QueryService } from 'src/helper/query.service';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { ShiftService } from 'src/shift/shift.service';
import moment from 'jalali-moment';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly queryService: QueryService,
    private shiftService: ShiftService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    let data = {}

    if (createUserDto?.birthday_date) {
      let YMD = createUserDto?.birthday_date.split("/")
      if (YMD.length >= 3) data = { ...createUserDto, birthday_year: parseInt(YMD[0]), birthday_month: parseInt(YMD[1]), birthday_day: parseInt(YMD[2]) }
      else data = createUserDto
    } else data = createUserDto

    const user = this.userRepository.create({ ...data })
    const userNew = await this.userRepository.save(user)
    const shift = await this.shiftService.createShift(userNew.id) 
    return userNew
  }

  findAll() {
    return this.userRepository.find()
  }

  async findAllByFilter(filter: FilterParamsDto) {
    const queryBuilder = this.queryService.createFilterQuery(this.userRepository, filter, "users");
    const records = await queryBuilder.getMany();
    return records;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id })
    // const shift = await this.shiftService.findAllShift(id)
    // user['shift'] = shift
    return user
  }

  async findFilterUser(condition: any = null) {
    return this.userRepository.find(condition)
  }

  async findOneByDeviceId(device_id: string) {
    const user = await this.userRepository.findOneBy({ device_id })
    return user
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, { ...updateUserDto })
  }

  remove(id: number) {
    return this.userRepository.delete(id)
  }

  async findByMobile(mobile: string) {
    const user = await this.userRepository.findOneBy({ mobile })
    // const shift = await this.shiftService.findAllShift(user.id)
    // user['shift'] = shift
    return user
  }

}
