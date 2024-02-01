import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateWorkTrackDto } from './dto/create-work_track.dto';
import { UpdateWorkTrackDto } from './dto/update-work_track.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkTrack } from './entities/work_track.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/projects/task/entities/task.entity';
import { TaskService } from 'src/projects/task/task.service';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { QueryService } from 'src/helper/query.service';
import { AttendanceService } from 'src/attendance/attendance/attendance.service';
import { SettingService } from 'src/setting/setting.service';

@Injectable()
export class WorkTrackService {
  constructor(
    @InjectRepository(WorkTrack) private workTrackRepository: Repository<WorkTrack>,
    @Inject(forwardRef(() => AttendanceService))
    private attendanceService: AttendanceService,
    private readonly queryService: QueryService,
    private taskService: TaskService,
    private settingService: SettingService
  ) { }

  async addWorktrackDate(createWorkTrackDto: CreateWorkTrackDto) {
    const { attendance_id, from_date } = createWorkTrackDto
    const attendance = await this.attendanceService.findOneOrginal(attendance_id)
    const setting = await this.settingService.findOne('add-worktrack-date')
    const addWorktrackDate = +setting.value * 86400
    console.log(+new Date(from_date) / 1000 - addWorktrackDate <= attendance.start_time)

    if (+new Date(from_date) / 1000 - addWorktrackDate <= attendance.start_time) {
      return true
    }
  }

  async create(createWorkTrackDto: CreateWorkTrackDto) {
    const tasks = await this.taskService.findOne(createWorkTrackDto.task_id)
    if (createWorkTrackDto.from_date) createWorkTrackDto.from_date = Math.floor(Date.parse(createWorkTrackDto.from_date) / 1000)
    if (createWorkTrackDto.until_date) createWorkTrackDto.until_date = Math.floor(Date.parse(createWorkTrackDto.until_date) / 1000)

    const workTrack = await this.workTrackRepository.create({
      ...createWorkTrackDto,
      tasks
    })

    return await this.workTrackRepository.save(workTrack)
  }


  findAll() {
    return this.workTrackRepository.find()
  }

  async findAllByFilter(filter: FilterParamsDto, condition: any) {
    const queryBuilder = this.queryService.createFilterQuery(this.workTrackRepository, filter, "work_track", condition);
    const data = await queryBuilder.getMany();
    return data;
  }

  findByAttendance(attendance_id: number) {
    return this.workTrackRepository
      .createQueryBuilder('work_track')
      .where('work_track.attendance_id = :attendance_id', { attendance_id })
      .getMany();
  }

  async findProjectAndTaskByAttendance(attendance_id: number) {
    const workTrack = await this.workTrackRepository
      .createQueryBuilder('work_track')
      .leftJoinAndSelect('work_track.tasks', 'task')
      .leftJoinAndSelect('task.activities', 'activity')
      .leftJoinAndSelect('activity.projects', 'project')
      .where('work_track.attendance_id = :attendance_id', { attendance_id })
      .getMany();


    return workTrack
  }

  async findTrackTaskBy(task_id: number) {
    const data = await this.workTrackRepository
      .createQueryBuilder('work_track')
      .leftJoinAndSelect('work_track.tasks', 'task')
      .leftJoinAndSelect('task.activities', 'activity')
      .leftJoinAndSelect('activity.projects', 'project')
      .where('task.id = :task_id', { task_id })
      .getMany();

    await Promise.all(data.map(async (element) => {
      const attendance = await this.attendanceService.findOneOrginal(element.attendance_id)
      console.log(attendance)
      element['attendance'] = null
      if (attendance) {
        attendance['start_time_date'] = attendance.start_time ? new Date(attendance?.start_time * 1000) : null
        attendance['end_time_date'] = attendance.end_time ? new Date(attendance.end_time * 1000) : null

        element['attendance'] = attendance
      }
    }));

    return data
  }

  findOne(id: number) {
    return this.workTrackRepository.findOneBy({ id })
  }

  update(id: number, updateWorkTrackDto: UpdateWorkTrackDto) {
    return this.workTrackRepository.update(id, updateWorkTrackDto)
  }

  remove(id: number) {
    return this.workTrackRepository.delete(id)
  }
}
