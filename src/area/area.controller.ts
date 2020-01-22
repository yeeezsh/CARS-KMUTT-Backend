import { Controller, Post, Req, UseGuards, Get, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AreaService } from './area.service';
import { CreateAreaBuildingDto } from './dtos/area.building.create.dto';
import { CreateAreaDto } from './dtos/area.create.dto';

@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}
  @UseGuards(AuthGuard('requestor'))
  @Get('/sport/all')
  async all() {
    return await this.areaService.getAreaBuilding();
    return 'test ja';
  }

  //   staff operate
  @Post('/building')
  async createBuilding(@Body() body: CreateAreaBuildingDto) {
    await this.areaService.createAreaBuilding(body);
    return;
  }

  @Post('/area')
  async createArea(@Body() body: CreateAreaDto) {
    await this.areaService.createArea(body);
    return;
  }
}
