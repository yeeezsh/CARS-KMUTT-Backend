import { Controller, Post, UseGuards, Get, Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AreaService } from './area.service';
import { CreateAreaBuildingDto } from './dtos/area.building.create.dto';
import { CreateAreaDto } from './dtos/area.create.dto';

@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  //   @UseGuards(AuthGuard('requestor'))
  @Get('/sport/all')
  async all() {
    return await this.areaService.getAreaBuilding();
  }

  //   @UseGuards(AuthGuard('requestor'))
  @Get('/sport/:id')
  async getArea(@Param('id') id: string) {
    return await this.areaService.groupByBuilding(id);
  }

  //   staff operate
  @Post('/building')
  async createBuilding(@Body() body: CreateAreaBuildingDto) {
    await this.areaService.createAreaBuilding(body);
    return;
  }

  @Post('/')
  async createArea(@Body() body: CreateAreaDto) {
    await this.areaService.createArea(body);
    return;
  }
}
