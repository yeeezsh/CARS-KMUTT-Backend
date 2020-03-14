import { Controller, Post, UseGuards, Get, Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AreaService } from './area.service';
import { CreateAreaBuildingDto } from './dtos/area.building.create.dto';
import { CreateAreaDto } from './dtos/area.create.dto';
import moment = require('moment');

@Controller('building')
export class BuildingController {
  @Get('/table')
  async getBuildingTable() {
    return;
  }
}
