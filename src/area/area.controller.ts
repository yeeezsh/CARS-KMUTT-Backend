import { Controller, Post, UseGuards, Get, Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AreaService } from './area.service';
import { CreateAreaBuildingDto } from './dtos/area.building.create.dto';
import { CreateAreaDto } from './dtos/area.create.dto';
import moment = require('moment');
import { AreaQueryService } from './area.query.service';

@Controller('area')
export class AreaController {
  constructor(
    private readonly areaService: AreaService,
    private readonly areaQueryService: AreaQueryService,
  ) {}

  @Get('/sport/area/all')
  @UseGuards(AuthGuard('requestor'))
  async getSportAreaAll() {
    return await this.areaQueryService.getAreaSportBuilding();
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

  @Get('/sport/fields/:id/:date')
  @UseGuards(AuthGuard('requestor'))
  async getSportAreaFields(@Param('id') id: string, @Param('date') date: Date) {
    try {
      // async test() {
      // const now = moment().startOf('day');
      // console.log('on', moment(date).format('DD-MM-YYYY HH:mm'));
      return await this.areaQueryService.getAvailableSportAreaFields(
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

  // create area
  @Post('/')
  async createArea(@Body() body: CreateAreaDto) {
    await this.areaService.createArea(body);
    return;
  }

  @Get('/table')
  async getAreaTable() {
    return this.areaQueryService.getAreaTable();
  }

  @Get('/available/:id')
  async getAvailabelArea(@Param('id') areaId: string) {
    return await this.areaQueryService.getAvailabelAreaByStaff(areaId);
  }

  @Get('/:id')
  async getAreaById(@Param('id') areaId: string) {
    return this.areaQueryService.getArea(areaId);
  }
}
