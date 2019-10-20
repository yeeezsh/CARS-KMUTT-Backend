import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
// export class GqlAuthGuard extends AuthGuard('jwt') {
export class GqlAuthGuard extends AuthGuard('jwt') {
  // getRequest(context: ExecutionContext) {
  //   const ctx = GqlExecutionContext.create(context);
  //   console.log('staff guards', ctx, ctx.getArgs(), ctx.getContext().req, ctx.getContext().req.authorization);
  //   return ctx.getContext().req;
  // }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    // console.log(ctx.getContext().req)
    return ctx.getContext().req;
  }

  // canActivate() {
  //   return true;
  // }


  // async canActivate(ctx: ExecutionContext): Promise<boolean> {

  //   const req = ctx.switchToHttp().getRequest();
  //   if (req) {
  //     if (!req.headers.authorization) {
  //       console.log(req.headers)
  //       return false;
  //     }
  //   }

  //   return true;
  // }

}
