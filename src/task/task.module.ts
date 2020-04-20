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
import { TaskManageService } from './task.manage.service';
import { TaskManageController } from './task.manage.controller';
import { TaskCronsService } from './task.crons.service';
import { AreaQueryService } from 'src/area/area.query.service';
import { TaskFormController } from './task.form.controller';
import { TaskFormService } from './task.form.service';

@Module({
  imports: [DatabaseModule, AreaModule, FormModule, ScheduleModule.forRoot()],
  providers: [
    TaskService,
    HistoryService,
    TaskManageService,
    TaskCronsService,
    AreaQueryService,
    TaskFormService,
    ...taskProviders,
  ],
  controllers: [
    TaskController,
    TaskSportController,
    TaskManageController,
    TaskFormController,
  ],
  exports: [...taskProviders, TaskService],
})
export class TaskModule {}
