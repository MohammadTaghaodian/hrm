import { Test, TestingModule } from '@nestjs/testing';
import { WorkTrackController } from './work_track.controller';
import { WorkTrackService } from './work_track.service';

describe('WorkTrackController', () => {
  let controller: WorkTrackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkTrackController],
      providers: [WorkTrackService],
    }).compile();

    controller = module.get<WorkTrackController>(WorkTrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
