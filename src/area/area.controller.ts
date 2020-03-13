import { Controller, Post, UseGuards, Get, Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AreaService } from './area.service';
import { CreateAreaBuildingDto } from './dtos/area.building.create.dto';
import { CreateAreaDto } from './dtos/area.create.dto';
import moment = require('moment');

@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @UseGuards(AuthGuard('requestor'))
  @Get('/sport/area/all')
  async getSportAreaAll() {
    return await this.areaService.getAreaBuilding();
  }

  // @Get('/sport/fields/reserved/:id/:date')
  // async getSportAreaFieldsResevered(
  //   @Param('id') id: string,
  //   @Param('date') date: Date,
  // ) {
  //   console.log(id, date);
  //   return;
  // }

  // @UseGuards(AuthGuard('requestor'))
  // @Get('/sport/fields/:id')
  // async getSportAreaFields(@Param('id') id: string) {
  //   return await this.areaService.getSportAreaFields(id);
  // }

  @UseGuards(AuthGuard('requestor'))
  @Get('/sport/fields/:id/:date')
  async getSportAreaFields(@Param('id') id: string, @Param('date') date: Date) {
    try {
      // async test() {
      // const now = moment().startOf('day');
      // console.log('on', moment(date).format('DD-MM-YYYY HH:mm'));
      return await this.areaService.getAvailableSportAreaFields(
        id,
        moment(date),
      );
    } catch (err) {
      console.error(err);
    }
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

  @Get('/table')
  async getAreaTable() {
    return this.areaService.getAreaTable();
  }
}
