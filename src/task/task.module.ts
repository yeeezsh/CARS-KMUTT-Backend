import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { DatabaseModule } from '../database/database.module';
import { taskProviders } from './task.providers';
import { AreaModule } from '../area/area.module';
import { FormModule } from '../form/form.module';
import { TaskController } from './task.controller';
import { TaskQueryService } from './task.query.service';
import { TaskSportController } from './task.sport.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskstaffService } from './task.staff.service';
import { TaskStaffController } from './task.staffcontroller';
import { TaskCronsService } from './task.crons.service';
import { AreaQueryService } from 'src/area/area.query.service';
import { TaskFormController } from './task.form.controller';
import { TaskFormService } from './task.form.service';
import { TaskMeetingController } from './task.meeting.controller';

@Module({
  imports: [DatabaseModule, AreaModule, FormModule, ScheduleModule.forRoot()],
  providers: [
    TaskService,
    TaskQueryService,
    TaskstaffService,
    TaskCronsService,
    AreaQueryService,
    TaskFormService,
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
