import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { DateScalar } from '../common/date.scalar';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule),
  ],
  providers: [
    DateScalar,
    UsersService, ...usersProviders,
    UsersResolver,
  ],
  exports: [UsersService],
})
export class UsersModule { }
