import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { ProjectMemberService } from '../project_member/project_member.service';
import { ProjectMember } from '../project_member/entities/project_member.entity';
import { UserService } from 'src/user/user.service';
import { QueryService } from 'src/helper/query.service';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(ProjectMember) private projectMemberRepository: Repository<ProjectMember>,
    private projectMemberService: ProjectMemberService,
    private userService: UserService,
    private readonly queryService: QueryService
  ) { }
  async create(createProjectDto: CreateProjectDto) {
    const project = await this.projectRepository.create({ ...createProjectDto })
    return this.projectRepository.save(project)
  }

  async findAll(user_id: number) {
    console.log(user_id)
    // از createQueryBuilder استفاده کنید و اطلاعات مورد نظر را انتخاب کنید
    const data = []
    const projects = await this.projectMemberRepository
      .createQueryBuilder('project_member')
      .leftJoin('project_member.project_id', 'project') // از leftJoin بجای leftJoinAndSelect استفاده کنید
      .select('project.*')
      .where('project_member.user_id = :user_id', { user_id })
      .getRawMany(); // برای دریافت نتایج به صورت plain objects از getRawMany استفاده کنید

    await Promise.all(projects.map(async (element) => {
      // getManager
      const project = await this.findOne(element['id']);
      if (project) data.push(project);
    }));

    return data
  }

  async findAllByFilter(filter: FilterParamsDto, condition: any) {
    const queryBuilder = this.queryService.createFilterQuery(this.projectRepository, filter, "project", condition);
    const data = await queryBuilder.getMany();

    await Promise.all(data.map(async (element) => {
      if(element['manager_id']){
        const manager = await this.userService.findOne(element['manager_id']);
        if (manager) element['manager'] = manager;
      }
    }));
    return data;
  }


  async findOne(project_id: number = null, user_id: number = null) {
    console.log(project_id, user_id)
    const projectMember = await this.projectMemberService.findNumberCustomer(project_id, user_id)
    const projectMembers = await this.projectMemberService.findAllProjectId(project_id)

    if (projectMember && project_id) {
      const projectRelations = await this.projectRepository.createQueryBuilder('project')
        .leftJoinAndSelect('project.activities', 'activity')
        .leftJoinAndSelect('activity.tasks', 'task')
        .leftJoinAndSelect('task.reports', 'report')
        .leftJoinAndSelect('task.workTracks', 'work_track')
        .where(`project.id = ${project_id}`)
        // .andWhere(`task.user_id = ${user_id}`)
        .getOne()
      const manager = await this.userService.findOne(projectRelations['manager_id']);
      if (manager) projectRelations['manager'] = manager;
      projectRelations['project_members'] = projectMembers
      return projectRelations
    }

    return null
  }

}
