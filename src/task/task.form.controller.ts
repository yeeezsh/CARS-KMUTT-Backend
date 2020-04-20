import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskFormCreateDto } from './dtos/task.form.create.dto';
import { TaskFormService } from './task.form.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/common/user.decorator';
import { UserSession } from 'src/users/interfaces/user.session.interface';

@Controller('task/form')
export class TaskFormController {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskFormService: TaskFormService,
  ) {}

  @Post('/')
  @UseGuards(AuthGuard('requestor'))
  async createTaskForm(
    @Body() data: TaskFormCreateDto,
    @UserInfo() user: UserSession,
  ) {
    return this.taskFormService.createTask(user.username, data);
  }
}
