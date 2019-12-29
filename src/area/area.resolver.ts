import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AreaService } from './area.service';
import { Area } from './interfaces/area.interface';
import { AreaCreateDto } from './dtos/area.create.dto';
import { AreaBuildingCreateDto } from './dtos/area.building.create.dto';
import { AreaBuilding } from './interfaces/area.building.interface';

@Resolver('Area')
export class AreaResolver {
  constructor(private readonly areaServie: AreaService) { }

  @Query('Areas')
  async Areas() {
    return await this.areaServie.listArea();
  }

  @Query('Area')
  async Area(@Args('id') id: string) {
    return await this.areaServie.getArea(id);
  }

  @Query('AreaBuildings')
  async AreaBuildings() {
    return await this.areaServie.listAreaType();
  }

  @Query('AreaBuilding')
  async AreaBuilding(@Args('id') id: string) {
    return await this.areaServie.getAreaBuilding(id);
  }

  @Mutation('createArea')
  async createArea(@Args('createArea') args: AreaCreateDto): Promise<Area> {
    return await this.areaServie.createArea(args);
  }

  @Mutation('createAreaBuilding')
  async createAreaBuilding(
    @Args('createAreaBuilding') args: AreaBuildingCreateDto,
  ): Promise<AreaBuilding> {
    return await this.areaServie.createAreaBuilding(args);
  }
}
