import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaResolver } from './area.resolver';
import { DatabaseModule } from '../database/database.module';
import { areaProviders } from './area.providers';
import { JSONScalar } from '../common/json.scalar';
import { FormModule } from '../form/form.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, FormModule, UsersModule],
  providers: [JSONScalar, AreaService, AreaResolver, ...areaProviders],
  exports: [AreaService],
})
export class AreaModule {}
