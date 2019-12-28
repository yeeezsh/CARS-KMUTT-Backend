import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaResolver } from './area.resolver';
import { DatabaseModule } from '../database/database.module';
import { areaProviders } from './area.providers';
import { JSONScalar } from 'src/common/json.scalar';
import { FormModule } from 'src/form/form.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, FormModule, UsersModule],
  providers: [JSONScalar, AreaService, AreaResolver, ...areaProviders],
  exports: [AreaService],
})
export class AreaModule {}
