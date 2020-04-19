import { Controller, Get, Param } from '@nestjs/common';
import { AreaQueryService } from './area.query.service';

@Controller('building')
export class BuildingController {
  constructor(private readonly areaQueryService: AreaQueryService) {}

  @Get('/table')
  async getBuildingTable() {
    return;
  }

  // query building only
  @Get('/:id')
  async getBuilding(@Param('id') id: string) {
    return (await this.areaQueryService.getAreaBuilding(id))[0];
  }
}
