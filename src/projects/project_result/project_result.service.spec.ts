import { Test, TestingModule } from '@nestjs/testing';
import { ProjectResultService } from './project_result.service';

describe('ProjectResultService', () => {
  let service: ProjectResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectResultService],
    }).compile();

    service = module.get<ProjectResultService>(ProjectResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
