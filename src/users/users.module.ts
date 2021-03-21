import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TaskModule } from 'src/task/task.module';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';

@Module({
  imports: [
    HttpModule.register({}),
    DatabaseModule,
    forwardRef(() => AuthModule),
    forwardRef(() => TaskModule),
  ],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
