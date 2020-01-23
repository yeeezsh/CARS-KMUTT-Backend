import { Controller, Post, UseGuards, Get, Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AreaService } from './area.service';
import { CreateAreaBuildingDto } from './dtos/area.building.create.dto';
import { CreateAreaDto } from './dtos/area.create.dto';

@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get('/sport/area/reserved/:id/:date')
  async getSportAreaAvailable(
    @Param('id') id: string,
    @Param('date') date: Date,
  ) {
    console.log(id, date);
    return;
  }

  @UseGuards(AuthGuard('requestor'))
  @Get('/sport/area/all')
  async getSportAreaAll() {
    return await this.areaService.getAreaBuilding();
  }

  @UseGuards(AuthGuard('requestor'))
  @Get('/sport/fields/:id')
  async getSportAreaField(@Param('id') id: string) {
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
