import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class GqlStaffGuard extends AuthGuard('staffJWT') {
  // export class GqlStaffGuard {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  // handleRequest(err, user, info: Error) {
  //   if (info instanceof TokenExpiredError) {
  //     // do stuff when token is expired
  //     console.log('token expired');
  //   }
  //   // return user;
  //   return null;
  // }
}
