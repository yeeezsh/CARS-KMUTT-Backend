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

@Controller('task')
export class TaskController {
  constructor(
    private readonly areaService: AreaService,
    private readonly taskService: TaskService,
  ) {}

  @UseGuards(AuthGuard('requestor'))
  @Post('/sport')
  async createSportTask(
    @Body() body: CreateTaskSportDto,
    @Req() req: Request & { user: { _id: string; username: string } },
    @Res() res: Response,
  ) {
    try {
      const { owner } = body;
      const user = req.cookies.user._id;
      //   force self checking
      // if (owner !== user) throw new Error('first requestor must be an owner');
      await this.taskService.createSportTask(body);

      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.BAD_REQUEST).send({
        msg: String(err),
      });
    }
  }
}
