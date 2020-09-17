import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AreaQueryService } from './area.query.service';
import { AreaService } from './area.service';
import { CreateAreaBuildingDto } from './dtos/area.building.create.dto';
import { CreateAreaDto } from './dtos/area.create.dto';
import moment = require('moment');

@Controller('area')
export class AreaController {
  constructor(
    private readonly areaService: AreaService,
    private readonly areaQueryService: AreaQueryService,
  ) {}

  @Get('/sport/building/all')
  @UseGuards(AuthGuard('requestor'))
  async getSportAreaAll() {
    return await this.areaQueryService.getAreaSportBuilding();
  }

  @Get('/common/building/all')
  @UseGuards(AuthGuard('requestor'))
  async getCommonAreaAll() {
    return this.areaQueryService.getAreaCommonBuilding();
  }

  @Get('/common/meeting/all')
  @UseGuards(AuthGuard('requestor'))
  async getCommonMeetingAll() {
    return this.areaQueryService.getAreaCommonMeeting();
  }

  @Get('/sport/fields/:id/:date')
  @UseGuards(AuthGuard('requestor'))
  async getSportAreaFields(@Param('id') id: string, @Param('date') date: Date) {
    try {
      return await this.areaQueryService.getAvailableSportAreaFields(
        id,
        moment(date),
      );
    } catch (err) {
      throw err;
    }
  }

  @Get('/available/meeting/:id')
  @UseGuards(AuthGuard('requestor'))
  async getAvailabelMeetingArea(
    @Param('id') areaId: string,
    @Query('date') date: string,
  ) {
    return await this.areaQueryService.getAvailableMeetingArea(areaId, date);
  }

  // not sure
  @Get('/available/:id')
  @UseGuards(AuthGuard('requestor'))
  async getAvailabelArea(
    @Param('id') areaId: string,
    @Query('start') start: string,
    @Query('stop') stop: string,
  ) {
    return await this.areaQueryService.getAvailabelAreaByStaff(
      areaId,
      start && moment(start),
      stop && moment(stop),
    );
  }

  //   staff operate
  @Post('/building')
  @UseGuards(AuthGuard('staff'))
  async createBuilding(@Body() body: CreateAreaBuildingDto) {
    await this.areaService.createAreaBuilding(body);
    return;
  }

  // create area
  @Post('/')
  @UseGuards(AuthGuard('staff'))
  async createArea(@Body() body: CreateAreaDto) {
    await this.areaService.createArea(body);
    return;
  }

  @Get('/table')
  @UseGuards(AuthGuard('staff'))
  async getAreaTable() {
    return this.areaQueryService.getAreaTable();
  }

  // requestor
  @Get('/:id')
  @UseGuards(AuthGuard('requestor'))
  async getAreaById(@Param('id') areaId: string) {
    return this.areaQueryService.getArea(areaId);
  }
}
