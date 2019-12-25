import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AreaService } from './area.service';
import { Area } from './interfaces/area.interface';
import { AreaDto } from './dtos/area.dto';
import { AreaTypeDto } from './dtos/area.type.dto';
import { AreaType } from './interfaces/area.type.interface';

@Resolver('Area')
export class AreaResolver {
    constructor(private readonly areaServie: AreaService) { }

    @Query('Areas')
    async Areas() {
        return await this.areaServie.listArea();
    }

    @Query('AreaTypes')
    async AreaTypes() {
        return await this.areaServie.listAreaType();
    }

    @Mutation('createArea')
    async createArea(@Args('createArea') args: AreaDto): Promise<Area> {
        return await this.areaServie.createArea(args);
    }

    @Mutation('createAreaType')
    async createAreaType(@Args('createAreaType') args: AreaTypeDto): Promise<AreaType> {
        return await this.areaServie.createAreaType(args);
    }
}
