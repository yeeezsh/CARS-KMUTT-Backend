import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { TaskManageService } from './task.manage.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('task/manage')
export class TaskManageController {
  constructor(private readonly taskManageService: TaskManageService) {}

  //   @UseGuards(AuthGuard('requestor'))

  @Get('/all')
  async getAllTask(
    @Query('offset') offset?: Date,
    @Query('limit') limit?: Date,
  ) {
    console.log('offset', offset, 'limit', limit);
    const docs = await this.taskManageService.getAcceptTask(offset, limit);
    // await this.taskManageService.getAcceptTask(offset, limit);
    // console.log('query', offset, limit);
    return docs;
  }
}
