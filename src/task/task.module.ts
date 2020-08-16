import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AreaQueryService } from 'src/area/area.query.service';
import { AreaModule } from '../area/area.module';
import { DatabaseModule } from '../database/database.module';
import { FormModule } from '../form/form.module';
import { TaskController } from './task.controller';
import { TaskCronsService } from './task.crons.service';
import { TaskFormController } from './task.form.controller';
import { TaskFormService } from './task.form.service';
import { TaskMeetingController } from './task.meeting.controller';
import { taskProviders } from './task.providers';
import { TaskQueryService } from './task.query.service';
import { TaskService } from './task.service';
import { TaskSportController } from './task.sport.controller';
import { TaskSportService } from './task.sport.service';
import { TaskStaffController } from './task.staff.controller';
import { TaskstaffService } from './task.staff.service';
import { TaskUtilsService } from './task.utils.service';

@Module({
  imports: [DatabaseModule, AreaModule, FormModule, ScheduleModule.forRoot()],
  providers: [
    TaskService,
    TaskSportService,
    TaskQueryService,
    TaskstaffService,
    TaskCronsService,
    AreaQueryService,
    TaskFormService,
    TaskUtilsService,
    ...taskProviders,
  ],
  controllers: [
    TaskController,
    TaskMeetingController,
    TaskSportController,
    TaskStaffController,
    TaskFormController,
  ],
  exports: [...taskProviders, TaskService],
})
export class TaskModule {}
