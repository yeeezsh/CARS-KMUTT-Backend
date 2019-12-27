import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaResolver } from './area.resolver';
import { DatabaseModule } from '../database/database.module';
import { areaProviders } from './area.providers';
import { DateScalar } from 'src/common/date.scalar';
import { JSONScalar } from 'src/common/json.scalar';
import { FormModule } from 'src/form/form.module';

@Module({
  imports: [DatabaseModule, FormModule],
  providers: [
    DateScalar,
    JSONScalar,
    AreaService,
    AreaResolver,
    ...areaProviders,
  ],
  exports: [AreaService],
})
export class AreaModule {}
