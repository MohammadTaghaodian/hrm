import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Activity } from '../activity/entities/activity.entity';
import TaskStatus from './enum/TaskStatusEnum';
import { UserService } from 'src/user/user.service';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { QueryService } from 'src/helper/query.service';
import { ProjectMemberService } from '../project_member/project_member.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Activity) private activityRepository: Repository<Activity>,
    private userService: UserService,
    private readonly queryService: QueryService,
    private projectMemberService: ProjectMemberService,
  ) { }

  async create(createTaskDto: CreateTaskDto) {
    const activities = await this.activityRepository.findOneBy({ id: createTaskDto.activity_id })
    const task = await this.taskRepository.create({
      ...createTaskDto,
      activities
    })

    const saveTask = await this.taskRepository.save(task)

    if (createTaskDto.user_id) {
      const project = await this.taskRepository.createQueryBuilder('task')
        .leftJoin('task.activities', 'activity')
        .leftJoin('activity.projects', 'project')
        .select('project.id')
        .where(`task.id = ${saveTask.id}`)
        .getRawOne();

      const proMemberFindOne = await this.projectMemberService.findNumberCustomer(project['project_id'], createTaskDto.user_id)
      if (!proMemberFindOne) {
        const projectMember = await this.projectMemberService.create(project['project_id'], createTaskDto.user_id)
      }
    }
    return saveTask

  }

  async findAll() {
    const data = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.activities', 'activity')
      .leftJoinAndSelect('activity.projects', 'project')
      .getMany();

    await Promise.all(data.map(async (element) => {
      // getManager
      const user = await this.userService.findOne(element['user_id']);
      if (user) element['user'] = user; else element['user'] = null
    }));

    return data
  }

  async findAllByFilter(filter: FilterParamsDto, condition: any) {
    const queryBuilder = this.queryService.createFilterQuery(this.taskRepository, filter, "task", condition);
    const data = await queryBuilder.getMany();

    // انتظار می‌رود که userService.findOne از نوع Promise باشد
    await Promise.all(data.map(async (element) => {
      const user = await this.userService.findOne(element['user_id']);
      element['user'] = user;
    }));
    return data;
  }

  async findAllBy(project_id: number) {
    const data = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.activities', 'activity')
      .leftJoinAndSelect('activity.projects', 'project')
      .where('project.id = :project_id', { project_id })
      .getMany();

    await Promise.all(data.map(async (element) => {
      // getManager
      const user = await this.userService.findOne(element['user_id']);
      if (user) element['user'] = user; else element['user'] = null
    }));

    return data
  }

  async findAllTaskBy(activity_id: number) {
    const data = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.activities', 'activity')
      .leftJoinAndSelect('task.reports', 'report')
      .leftJoinAndSelect('task.workTracks', 'work_track')
      .where(`activity.id = ${activity_id}`)
      .getMany();

    // await Promise.all(data.map(async (element) => {
    //   const user = await this.userService.findOne(element['user_id']);
    //   if (user) element['user'] = user; else element['user'] = null
    // }));

    return data
  }

  async findOne(id: number) {
    const data = await this.taskRepository.findOne({ relations: ['reports', 'workTracks'], where: { id } })

    const user = await this.userService.findOne(data['user_id']);
    if (user) data['user'] = user; else data['user'] = null

    return data
  }

  async changeStatusSET(condition: any) {
    const task = await this.taskRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.taskRepository.update(condition, { status: TaskStatus.SET })
  }

  async changeStatusDONE(condition: any) {
    const task = await this.taskRepository.findOneByOrFail(condition);

    // اعمال تغییرات ارسالی به رکورد موجود
    return this.taskRepository.update(condition, { status: TaskStatus.DONE })
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.taskRepository.update(id, updateTaskDto)
  }

  remove(id: number) {
    return this.taskRepository.delete(id)
  }

  async taskEnd() {
    const tasks = await this.taskRepository.find()
    let taskUpdate = [], timestampNow = Date.now()


    for (const value of tasks) {
      const until_date = +value['until_date']
      if (until_date <= timestampNow && value['status'] != TaskStatus.DONE) {
        value['status'] = TaskStatus.EXPIRED
        taskUpdate.push(await this.update(value['id'], value))
      }
    }
    return taskUpdate
  }


}
