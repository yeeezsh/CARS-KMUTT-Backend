import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskFormCreateDto } from './dtos/task.form.create.dto';
import { TaskFormService } from './task.form.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/common/user.decorator';
import { UserSession } from 'src/users/interfaces/user.session.interface';
import { Response } from 'express';

@Controller('taskForm')
export class TaskFormController {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskFormService: TaskFormService,
  ) {}

  @Get('/')
  async test() {
    return 'test';
  }

  @Post('/')
  @UseGuards(AuthGuard('requestor'))
  async createTaskForm(
    @Body() data: TaskFormCreateDto,
    @UserInfo() user: UserSession,
    @Res() res: Response,
  ) {
    try {
      console.log('/task from post');
      this.taskFormService.createTask(user.username, data);
      return res.sendStatus(200);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
