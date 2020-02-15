import { Module, forwardRef, HttpModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    forwardRef(() => AuthModule),
    forwardRef(() => TaskModule),
  ],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
