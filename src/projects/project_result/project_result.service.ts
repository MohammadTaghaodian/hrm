import { Injectable } from '@nestjs/common';
import { CreateProjectResultDto } from './dto/create-project_result.dto';
import { UpdateProjectResultDto } from './dto/update-project_result.dto';

@Injectable()
export class ProjectResultService {
  create(createProjectResultDto: CreateProjectResultDto) {
    return 'This action adds a new projectResult';
  }

  findAll() {
    return `This action returns all projectResult`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectResult`;
  }

  update(id: number, updateProjectResultDto: UpdateProjectResultDto) {
    return `This action updates a #${id} projectResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectResult`;
  }
}
