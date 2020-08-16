import {
  Body,
  Controller,
  InternalServerErrorException,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserInfo } from 'src/common/user.decorator';
import { UserSession } from 'src/users/interfaces/user.session.interface';
import { TaskFormCreateDto } from './dtos/task.form.create.dto';
import { TaskFormUpdateDto } from './dtos/task.form.update.dto';
import { TaskType } from './interfaces/task.interface';
import { TaskFormService } from './task.form.service';

@Controller('taskForm')
export class TaskFormController {
  constructor(private readonly taskFormService: TaskFormService) {}

  @Patch('/')
  @UseGuards(AuthGuard('requestor'))
  async updateTaskFormCommon(
    @Body() data: TaskFormUpdateDto,
    @Res() res: Response,
  ) {
    try {
      this.taskFormService.updateTask(data.id, data);
      return res.sendStatus(200);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Post('/common')
  @UseGuards(AuthGuard('requestor'))
  async createTaskFormCommon(
    @Body() data: TaskFormCreateDto,
    @UserInfo() user: UserSession,
    @Res() res: Response,
  ) {
    try {
      this.taskFormService.createTask(user.username, data, TaskType.common);
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
      this.taskFormService.createTask(
        user.username,
        data,
        TaskType.commonSport,
      );
      return res.sendStatus(200);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
