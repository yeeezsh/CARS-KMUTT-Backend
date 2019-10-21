import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { StaffJWTStrategy } from './staff.jwt.strategy';
import { StaffStrategey } from './staff.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),

  ],
  providers: [AuthService, StaffStrategey, StaffJWTStrategy],
  exports: [AuthService],
})
export class AuthModule { }
