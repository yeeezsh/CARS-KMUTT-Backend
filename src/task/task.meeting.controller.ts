import {
  Controller,
  UseGuards,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task/meeting')
export class TaskMeetingController {
  constructor(
    private readonly taskService: TaskService, // private readonly historyService: HistoryService,
  ) {}
}
