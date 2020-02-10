import { Controller, Get, UseGuards } from '@nestjs/common';
import { AreaService } from 'src/area/area.service';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/common/user.decorator';
import { UserSession } from 'src/users/interfaces/user.session.interface';
import { HistoryService } from './history.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly areaService: AreaService,
    private readonly taskService: TaskService,
    private readonly historyService: HistoryService,
  ) {}

  @UseGuards(AuthGuard('requestor'))
  @Get('/last')
  async getLastestTask(@UserInfo() user: UserSession) {
    const username = user.username;
    const data = await this.taskService.getLastestTask(username);
    return data;
  }

  @UseGuards(AuthGuard('requestor'))
  @Get('/history')
  async getHistory(@UserInfo() user: UserSession) {
    const { username } = user;
    return this.historyService.getAllHistory(username);
  }

  @UseGuards(AuthGuard('requestor'))
  @Get('/requested')
  async getRequested(@UserInfo() user: UserSession) {
    const { username } = user;
    return this.historyService.getAllRequested(username);
  }

  @UseGuards(AuthGuard('requestor'))
  @Get('/wait')
  async getWait(@UserInfo() user: UserSession) {
    const { username } = user;
    return this.historyService.getAllWait(username);
  }
}
