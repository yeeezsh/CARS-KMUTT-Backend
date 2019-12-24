import { Resolver, Query } from '@nestjs/graphql';
import { AreaService } from './area.service';

@Resolver('Area')
export class AreaResolver {
    constructor(private readonly areaServie: AreaService) {}

    @Query('Areas')
    async Areas() {
        return await this.areaServie.listArea();
    }
}
