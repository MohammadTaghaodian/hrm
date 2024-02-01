import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ProjectAdminService } from '../project/project-admin.service';
import { Project } from '../project/entities/project.entity';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { QueryService } from 'src/helper/query.service';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity) private activityRepository: Repository<Activity>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private readonly queryService: QueryService
  ) { }

  async create(createActivityDto: CreateActivityDto) {
    const projects = await this.projectRepository.findOneBy({ id: createActivityDto.project_id })
    const activity = await this.activityRepository.create({ ...createActivityDto, projects });
    return this.activityRepository.save(activity);
  }


  findAll() {
    return this.activityRepository
      .createQueryBuilder('activity')
      .leftJoin('activity.projects', 'project')
      .leftJoinAndSelect('activity.tasks', 'task')
      .getMany();
  }

  async findAllByFilter(filter: FilterParamsDto, condition: any) {
    const queryBuilder = this.queryService.createFilterQuery(this.activityRepository, filter, "activity", condition);
    const data = await queryBuilder.getMany();
    return data;
  }

  async findAllBy(project_id: number) {
    const data = await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoin('activity.projects', 'project')
      .leftJoinAndSelect('activity.tasks', 'task')
      .leftJoinAndSelect('task.reports', 'report')
      .where('project.id = :project_id', { project_id })
      .getMany();

      return data
  }

  async findOne(id: number) {
    const data = await this.activityRepository.findOne({ relations: ['tasks'], where: { id } })

    return data
  }

  async remove(id: any) {
    const activity = await this.activityRepository.findOneBy({ id });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    await this.activityRepository.remove(activity);
  }

  async update(id: any, updateActivityDto: UpdateActivityDto) {
    const existingActivity = await this.activityRepository.findOne(id);
    if (!existingActivity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    // Update the existing activity with the new data
    this.activityRepository.merge(existingActivity, updateActivityDto);

    return await this.activityRepository.save(existingActivity);
  }
}
