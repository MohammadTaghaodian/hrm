import { Injectable } from '@nestjs/common';
import { CreateProjectMemberDto } from './dto/create-project_member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectMember } from './entities/project_member.entity';
import { Repository } from 'typeorm';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Project } from '../project/entities/project.entity';

@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectRepository(ProjectMember) private projectMemberRepository: Repository<ProjectMember>,
    @InjectRepository(Project) private projectRepository: Repository<Project>
  ) { }

  create(project_id: number, user_id: number) {
    const projectMember = this.projectMemberRepository.create({ project_id, user_id })
    return this.projectMemberRepository.save(projectMember)
  }

  findAll(condition: any = null) {
    return this.projectMemberRepository.find(condition)
  }

  async findNumberCustomer(project_id: number = null, user_id: number = null) {
    let isTrue = null

    if (project_id && user_id) {
      isTrue = await this.projectMemberRepository.createQueryBuilder('project_member')
        .leftJoinAndSelect('project_member.project_id', 'project')
        .where(`project_member.user_id = ${user_id}`)
        .andWhere(`project.id = ${project_id}`)
        .getOne()
      console.log('project_id: ' + project_id + ' user_id: ' + user_id, isTrue)
    }
    else if (project_id) {
      isTrue = await this.projectMemberRepository.createQueryBuilder('project_member')
        .leftJoinAndSelect('project_member.project_id', 'project')
        .andWhere(`project.id = ${project_id}`)
        .getOne()
      console.log('project_id: ' + project_id, isTrue)
    }
    else if (user_id) {
      isTrue = await this.projectMemberRepository.find({ where: { user_id } })
      console.log('user_id: ' + user_id, isTrue)
    }

    return isTrue
  }

  async findAllProjectId(project_id: number) {
    const project = await this.projectMemberRepository.createQueryBuilder('project_member')
      .leftJoin('project_member.project_id', 'project')
      .select('project_member.user_id')
      .where(`project_member.project_id.id = ${project_id}`)
      .getMany()
    return project
  }

  remove(project_id: number, user_id: number) {
    return this.projectMemberRepository
      .createQueryBuilder()
      .delete()
      .where("project_id = :project_id AND user_id = :user_id", { project_id: project_id, user_id: user_id })
      .execute();

  }
}
