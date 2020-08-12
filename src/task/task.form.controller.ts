import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserInfo } from 'src/common/user.decorator';
import { UserSession } from 'src/users/interfaces/user.session.interface';
import { TaskFormCreateDto } from './dtos/task.form.create.dto';
import { TaskFormService } from './task.form.service';
import { TaskService } from './task.service';

@Controller('taskForm')
export class TaskFormController {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskFormService: TaskFormService,
  ) {}

  @Post('/common')
  @UseGuards(AuthGuard('requestor'))
  async createTaskFormCommon(
    @Body() data: TaskFormCreateDto,
    @UserInfo() user: UserSession,
    @Res() res: Response,
  ) {
    try {
      this.taskFormService.createTask(user.username, data, 'common');
      return res.sendStatus(200);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Post('/sport')
  @UseGuards(AuthGuard('requestor'))
  async createTaskFormSport(
    @Body() data: TaskFormCreateDto,
    @UserInfo() user: UserSession,
    @Res() res: Response,
  ) {
    try {
      this.taskFormService.createTask(user.username, data, 'common-sport');
      return res.sendStatus(200);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
