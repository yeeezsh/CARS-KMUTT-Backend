import { Module, forwardRef, HttpModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { JSONScalar } from '../common/json.scalar';

@Module({
  imports: [HttpModule, DatabaseModule, forwardRef(() => AuthModule)],
  providers: [
    JSONScalar,
    UsersService,
    ...usersProviders,
    UsersResolver,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
