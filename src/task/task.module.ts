import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { DatabaseModule } from '../database/database.module';
import { taskProviders } from './task.providers';

@Module({
  imports: [DatabaseModule],
  providers: [TaskService, ...taskProviders, TaskResolver],
})
export class TaskModule {}
