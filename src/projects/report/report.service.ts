import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { QueryService } from 'src/helper/query.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private readonly queryService: QueryService,
    ) { }

  async create(createReportDto: CreateReportDto) {
    const tasks = await this.taskRepository.findOneBy({ id: createReportDto.task_id })
    const report = await this.reportRepository.create({
      ...createReportDto,
      tasks
    })
    return this.reportRepository.save(report)
  }

  findAll() {
    return this.reportRepository
    .createQueryBuilder('report')
    .leftJoinAndSelect('task.reports', 'task')
    .getMany();
  }

  findAllBy(task_id: number) {
    return this.reportRepository
    .createQueryBuilder('report')
    .leftJoin('report.tasks', 'task')
    .where('task.id = :task_id', { task_id })
    .getMany();
  }

  async findAllByFilter(filter: FilterParamsDto, condition: any) {
    const queryBuilder = this.queryService.createFilterQuery(this.reportRepository, filter, "report", condition);
    const data = await queryBuilder.getMany();
    return data;
  }

  findOne(id: number) {
    return this.reportRepository.findOneBy({ id })
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return this.reportRepository.update(id, updateReportDto)
  }

  remove(id: number) {
    return this.reportRepository.delete(id)
  }
}
