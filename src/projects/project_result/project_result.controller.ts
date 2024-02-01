import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ProjectResultService } from './project_result.service';
import { CreateProjectResultDto } from './dto/create-project_result.dto';
import { UpdateProjectResultDto } from './dto/update-project_result.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import UserType from 'src/user/enum/UserTypeEnum';
import ResponseFormat from 'src/utils/Addons/response-formats';

@ApiTags('project-result')
@Controller('project-result')
export class ProjectResultController {
  constructor(private readonly projectResultService: ProjectResultService) {}

  @Post()
  create(@Body() createProjectResultDto: CreateProjectResultDto) {
    return this.projectResultService.create(createProjectResultDto);
  }

  @Get()
  findAll() {
    return this.projectResultService.findAll();
  }

  // @ApiBearerAuth('BearerAuth')
  // @Post('/getByFilter')
  // async findAllByFilter(@Body() filter: FilterParamsDto, @Request() req) {
  //   try {
  //     const condition = await req.user.role != UserType.ADMIN ? req.user.id : false

  //     const data = await this.projectResultService.findAllByFilter(filter, condition);

  //     return ResponseFormat(true, 200, "OK", data);

  //   } catch (error) {
  //     // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
  //     console.log(error)
  //     return ResponseFormat(false, 500, "SERVER-ERROR", null);
  //   }
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectResultService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectResultDto: UpdateProjectResultDto) {
    return this.projectResultService.update(+id, updateProjectResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectResultService.remove(+id);
  }
}
