import { Injectable, Param } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { ProjectMemberService } from '../project_member/project_member.service';
import { ProjectMember } from '../project_member/entities/project_member.entity';
import { async } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { QueryService } from 'src/helper/query.service';

@Injectable()
export class ProjectAdminService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(ProjectMember) private projectMemberRepository: Repository<ProjectMember>,
    private projectMemberService: ProjectMemberService,
    private userService: UserService,
    ) { }
  async create(createProjectDto: CreateProjectDto) {
    const project = await this.projectRepository.create({ ...createProjectDto })
    return this.projectRepository.save(project)
  }

  async findAll() {
    // const projects = await this.projectRepository.find({relations:['projectMembers']})

    // از createQueryBuilder استفاده کنید و اطلاعات مورد نظر را انتخاب کنید
    const projects = await this.projectRepository
    .createQueryBuilder('project')
    .leftJoinAndSelect('project.projectMembers', 'project_members')
    .leftJoinAndSelect('project.activities', 'activity')
    .leftJoinAndSelect('activity.tasks', 'task')
    .getMany();

    await Promise.all(projects.map(async (element) => {
      if(element['manager_id']){
        const manager = await this.userService.findOne(element['manager_id']);
        if (manager) element['manager'] = manager;
      }
    }));

    return projects

    // let users;

    // await Promise.all(projects.map(async (element) => {
    //   users = await this.projectMemberService.findNumberCustomer(element.id)
    //   element['users'] = users.length
    // }))

    // return projects
  }

  async findOne(project_id: number) {
    let projects = []
    const projectMember = await this.projectMemberService.findAllProjectId(project_id)

    const projectRelations = await this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.activities', 'activity')
      .leftJoinAndSelect('activity.tasks', 'task')
      .leftJoinAndSelect('task.reports', 'report')
      .leftJoinAndSelect('task.workTracks', 'work_track')
      .where(`project.id = ${project_id}`)
      .getOne()

    await Promise.all(projectMember.map(async (element) => {
      projects.push(await this.userService.findOne(element.user_id))
    }));
    projectRelations['users'] = projects

    return projectRelations

  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectRepository.update({ id }, { ...updateProjectDto })
  }

  // remove(id: number) {
  //   return this.projectRepository.delete({ id })
  // }
}
