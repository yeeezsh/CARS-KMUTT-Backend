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
import { TaskType } from './interfaces/task.interface';
import { TaskService } from './task.service';

@Controller('task/meeting')
export class TaskMeetingController {
  constructor(
    private readonly taskService: TaskService, // private readonly historyService: HistoryService,
  ) {}

  @Post('/meeting-club')
  @UseGuards(AuthGuard('requestor'))
  async createMeetingClubTask(
    @Body() body: CreateTaskMeetingDto,
    @Res() res: Response,
    @UserInfo() user: UserSession,
  ) {
    try {
      await this.taskService.createMeetingTask(
        body,
        TaskType.meetingClub,
        user.studentId,
      );

      return res.sendStatus(200);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        msg: String(err),
      });
    }
  }

  @Post('/meeting-room')
  @UseGuards(AuthGuard('requestor'))
  async createMeetingTask(
    @Body() body: CreateTaskMeetingDto,
    @Res() res: Response,
    @UserInfo() user: UserSession,
  ) {
    try {
      await this.taskService.createMeetingTask(
        body,
        TaskType.meetingRoom,
        user.studentId,
      );

      return res.sendStatus(200);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        msg: String(err),
      });
    }
  }

  @Post('/meeting-room/byStaff')
  @UseGuards(AuthGuard('staff'))
  async createMeetingTaskByStaff(
    @Body() body: CreateTaskMeetingDto,
    @Res() res: Response,
    @UserInfo() user: UserSession,
  ) {
    try {
      await this.taskService.createMeetingTask(
        body,
        TaskType.meetingRoom,
        user.username,
        true,
      );
      return res.sendStatus(200);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        msg: String(err),
      });
    }
  }

  @Post('/meeting-club/byStaff')
  @UseGuards(AuthGuard('staff'))
  async createMeetingClubTaskByStaff(
    @Body() body: CreateTaskMeetingDto,
    @Res() res: Response,
    @UserInfo() user: UserSession,
  ) {
    try {
      await this.taskService.createMeetingTask(
        body,
        TaskType.meetingClub,
        user.username,
        true,
      );

      return res.sendStatus(200);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        msg: String(err),
      });
    }
  }
}
