import { Module, forwardRef } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaResolver } from './area.resolver';
import { DatabaseModule } from '../database/database.module';
import { areaProviders } from './area.providers';
import { JSONScalar } from '../common/json.scalar';
import { FormModule } from '../form/form.module';
import { UsersModule } from '../users/users.module';
import { AreaController } from './area.controller';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    DatabaseModule,
    FormModule,
    UsersModule,
    forwardRef(() => TaskModule),
  ],
  providers: [JSONScalar, AreaService, AreaResolver, ...areaProviders],
  exports: [AreaService, ...areaProviders],
  controllers: [AreaController],
})
export class AreaModule {}
