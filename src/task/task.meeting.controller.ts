import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserInfo } from 'src/common/user.decorator';
import { UserSession } from 'src/users/interfaces/user.session.interface';
import { CreateTaskMeetingDto } from './dtos/task.meeting.dto';
import { TaskService } from './task.service';

@Controller('task/meeting')
export class TaskMeetingController {
  constructor(
    private readonly taskService: TaskService, // private readonly historyService: HistoryService,
  ) {}

  @UseGuards(AuthGuard('requestor'))
  @Post('/meeting-club')
  async createMeetingClubTask(
    @Body() body: CreateTaskMeetingDto,
    @Res() res: Response,
    @UserInfo() user: UserSession,
  ) {
    try {
      await this.taskService.createMeetingTask(
        body,
        'meeting-club',
        user.studentId,
      );

      return res.sendStatus(200);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        msg: String(err),
      });
    }
  }

  @UseGuards(AuthGuard('requestor'))
  @Post('/meeting-room')
  async createMeetingTask(
    @Body() body: CreateTaskMeetingDto,
    @Res() res: Response,
    @UserInfo() user: UserSession,
  ) {
    try {
      await this.taskService.createMeetingTask(
        body,
        'meeting-room',
        user.studentId,
      );

      return res.sendStatus(200);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        msg: String(err),
      });
    }
  }
}
