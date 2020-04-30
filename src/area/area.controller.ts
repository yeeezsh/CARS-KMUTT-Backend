import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Param,
  Query,
} from '@nestjs/common';
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

  @Get('/available/meeting/:id')
  async getAvailabelMeetingArea(
    @Param('id') areaId: string,
    @Query('date') date: string,
  ) {
    return await this.areaQueryService.getAvailableMeetingArea(areaId, date);
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
