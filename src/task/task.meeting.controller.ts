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
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskMeetingDto } from './dtos/task.meeting.dto';
import { UserSession } from 'src/users/interfaces/user.session.interface';
import { UserInfo } from 'src/common/user.decorator';
import { Response, Request } from 'express';

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
