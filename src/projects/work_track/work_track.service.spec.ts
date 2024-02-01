import { Test, TestingModule } from '@nestjs/testing';
import { WorkTrackService } from './work_track.service';

describe('WorkTrackService', () => {
  let service: WorkTrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkTrackService],
    }).compile();

    service = module.get<WorkTrackService>(WorkTrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
