import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { AreaModule } from '../area/area.module';
import { FormModule } from '../form/form.module';
import { taskProviders } from './task.providers';
import { databaseProviders } from '../database/database.provider';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, AreaModule, FormModule, ...taskProviders, ...databaseProviders],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
