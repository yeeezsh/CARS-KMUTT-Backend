import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { AreaModule } from 'src/area/area.module';
import { TaskModule } from 'src/task/task.module';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { UserQuotaService } from './user.quota.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000 }),
    DatabaseModule,
    forwardRef(() => AuthModule),
    forwardRef(() => TaskModule),
    forwardRef(() => AreaModule),
  ],
  providers: [UsersService, UserQuotaService, ...usersProviders],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
