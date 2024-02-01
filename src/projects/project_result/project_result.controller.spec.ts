import { Test, TestingModule } from '@nestjs/testing';
import { ProjectResultController } from './project_result.controller';
import { ProjectResultService } from './project_result.service';

describe('ProjectResultController', () => {
  let controller: ProjectResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectResultController],
      providers: [ProjectResultService],
    }).compile();

    controller = module.get<ProjectResultController>(ProjectResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
