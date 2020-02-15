import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { DatabaseModule } from '../database/database.module';
import { taskProviders } from './task.providers';
import { AreaModule } from '../area/area.module';
import { FormModule } from '../form/form.module';
import { TaskController } from './task.controller';
import { HistoryService } from './history.service';
import { TaskSportController } from './task.sport.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DatabaseModule, AreaModule, FormModule, ScheduleModule.forRoot()],
  providers: [TaskService, ...taskProviders, HistoryService],
  controllers: [TaskController, TaskSportController],
  exports: [...taskProviders, TaskService],
})
export class TaskModule {}
