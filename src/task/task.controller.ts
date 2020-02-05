import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AreaService } from 'src/area/area.service';
import { CreateTaskSportDto } from './dtos/task.create.sport';
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserInfo } from 'src/common/user.decorator';
import { UserSession } from 'src/users/interfaces/user.session.interface';

@Controller('task')
export class TaskController {
  constructor(
    private readonly areaService: AreaService,
    private readonly taskService: TaskService,
  ) {}

  @UseGuards(AuthGuard('requestor'))
  @Get('/last')
  async getLastestTask(@UserInfo() user: UserSession) {
    const username = user.username;
    const data = await this.taskService.getLastestTask(username);
    return data;
  }

  @UseGuards(AuthGuard('requestor'))
  @Post('/sport')
  async createSportTask(
    @Body() body: CreateTaskSportDto,
    @Req() req: Request & { user: { _id: string; username: string } },
    @Res() res: Response,
    @UserInfo() user: UserSession,
  ) {
    try {
      if (body.requestor[0] !== user.studentId)
        throw new Error('user owner request invalid');
      await this.taskService.createSportTask(body);

      return res.sendStatus(200);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        msg: String(err),
      });
    }
  }
}
