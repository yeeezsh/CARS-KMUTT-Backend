import { forwardRef, Module } from '@nestjs/common';
import { TaskModule } from 'src/task/task.module';
import { DatabaseModule } from '../database/database.module';
import { FormModule } from '../form/form.module';
import { UsersModule } from '../users/users.module';
import { AreaController } from './area.controller';
import { areaProviders } from './area.providers';
import { AreaQueryService } from './area.query.service';
import { AreaQuotaService } from './area.quota.service';
import { AreaService } from './area.service';
import { BuildingController } from './building.controller';

@Module({
  imports: [
    DatabaseModule,
    FormModule,
    forwardRef(() => UsersModule),
    forwardRef(() => TaskModule),
  ],
  providers: [
    AreaService,
    AreaQuotaService,
    AreaQueryService,
    ...areaProviders,
  ],
  exports: [AreaService, AreaQueryService, AreaQuotaService, ...areaProviders],
  controllers: [AreaController, BuildingController],
})
export class AreaModule {}
