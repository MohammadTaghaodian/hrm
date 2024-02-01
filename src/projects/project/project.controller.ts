import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ParseIntPipe } from '@nestjs/common';
import { ProjectAdminService } from './project-admin.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import UserType from 'src/user/enum/UserTypeEnum';
import ResponseFormat from 'src/utils/Addons/response-formats';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { CreateProjectMemberDto } from '../project_member/dto/create-project_member.dto';
import { ProjectMemberService } from '../project_member/project_member.service';
import { ProjectUserService } from './project-user.service';

@ApiTags('projects - پروژه ها')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectUserService: ProjectUserService, private readonly projectAdminService: ProjectAdminService, private readonly projectMemberService: ProjectMemberService) { }

  @ApiBearerAuth('BearerAuth')
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    try {
      if (req.user.role != UserType.ADMIN)
        return ResponseFormat(true, 403, "FORBIDDEN", null);

      if(!createProjectDto.manager_id) createProjectDto.manager_id = req.user.id

      const data = await this.projectAdminService.create(createProjectDto);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/addUserToProject')
  async addUserToProject(@Request() req, @Body() createProjectMemberDto: CreateProjectMemberDto) {
    const { project_id, user_id } = createProjectMemberDto

    try {
      if (req.user.role != UserType.ADMIN)
        return ResponseFormat(true, 403, "FORBIDDEN", null);

      // const project = await this.projectService.findOne(project_id, user_id)
      const data = await this.projectMemberService.create(project_id, user_id);
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Delete('/removeUserFromProject')
  async removeUserFromProject(@Request() req: any, @Body() createProjectMemberDto: CreateProjectMemberDto) {
    const { project_id, user_id } = createProjectMemberDto

    try {
      if (req.user.role != UserType.ADMIN)
        return ResponseFormat(true, 403, "FORBIDDEN");

      const project = await this.projectUserService.findOne(project_id)
      if(project){
        const data = await this.projectMemberService.remove( project_id, user_id );
        return ResponseFormat(true, 200, "OK", data);
      } return ResponseFormat(true, 404, "NOT-USER");

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR");
    }
  }


  @ApiBearerAuth('BearerAuth')
  @Get()
  async findAll(@Request() req) {
    try {
      let data

      if (req.user.role == UserType.ADMIN) {
        data = await this.projectAdminService.findAll();
        console.log('ADMIN')
      } else {
        data = await this.projectUserService.findAll(req.user.id);
        console.log('NOT ADMIN')
      }

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      console.log(error)
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  @ApiBearerAuth('BearerAuth')
  @Post('/getByFilter')
  async findAllByFilter(@Body() filter: FilterParamsDto, @Request() req) {
    try {
      const condition = await req.user.role != UserType.ADMIN ? req.user. id : false

      const data = await this.projectUserService.findAllByFilter(filter, condition);

      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      console.log(error)
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // @ApiBearerAuth('BearerAuth')
  // @Post('/getByFilter')
  // async findAllByFilter(@Body() filter: FilterParamsDto, @Request() req: any) {
  //   try {
  //     const condition = await req.user.role != UserType.ADMIN ? req.user.id : false
  //     const data = await this.projectService.findAllByFilter(filter, condition);

  //     return ResponseFormat(true, 200, "OK", data);

  //   } catch (error) {
  //     // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
  //     console.log(error)
  //     return ResponseFormat(false, 500, "SERVER-ERROR", null);
  //   }
  // }

  @ApiBearerAuth('BearerAuth')
  @Get(':project_id')
  async findOne(@Param('project_id') project_id: number, @Request() req) {
    try {
      let data

      if (req.user.role == UserType.EMPLOYEES) {
        console.log('EMPLOYEES')
        data = await this.projectUserService.findOne(project_id, req.user.id);
      }
      else if (req.user.role == UserType.ADMIN) {
        console.log('ADMIN')
        data = await this.projectAdminService.findOne(project_id);
      }

      if (!data) return ResponseFormat(true, 204, "NOT-FOUND", data)
      return ResponseFormat(true, 200, "OK", data);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }


  @ApiBearerAuth('BearerAuth')
  @Patch(':project_id')
  async update(@Param('project_id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto, @Request() req: any) {
    try {
      if (req.user.role != UserType.ADMIN)
        return

      await this.projectAdminService.update(+id, updateProjectDto);
      const attendance = await this.projectAdminService.findOne(id)
      if (!attendance) return ResponseFormat(false, 204, "NOT-FOUND", attendance)
      return ResponseFormat(true, 200, "OK", attendance);

    } catch (error) {
      // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
      return ResponseFormat(false, 500, "SERVER-ERROR", null);
    }
  }

  // @ApiBearerAuth('BearerAuth')
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   try {
  //     const data = await this.projectAdminService.remove(+id);
  //     return ResponseFormat(true, 200, "OK", data);

  //   } catch (error) {
  //     // در صورت بروز خطا، پاسخ خطا به کاربر ارسال می‌شود
  //     return ResponseFormat(false, 500, "SERVER-ERROR", null);
  //   }
  // }
}
