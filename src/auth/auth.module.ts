import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { StaffJWTStrategy } from './staff.jwt.strategy';
import { StaffStrategy } from './staff.strategy';
import { UsersModule } from '../users/users.module';
import { RequestorStrategy } from './requestor.strategy';
import { RequestorJWTStrategy } from './requestor.jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),

  ],
  providers: [
    AuthService,
    StaffStrategy,
    StaffJWTStrategy,
    RequestorStrategy,
    RequestorJWTStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule { }
