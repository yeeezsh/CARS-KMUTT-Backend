import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveProperty,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CreateStaffInput } from './dtos/staff.input';
import { StaffDto } from './dtos/staff.dto';
import { GqlStaffGuard } from './guards/staff.guard';
import { GqlRequestorGuard } from './guards/requestor.guard';
import { CurrentUser } from './decorators/user.decorator';
import { UsersService } from './users.service';
import { RequestorDto } from './dtos/requestor.dto';
import { UserInfoArgs } from './dtos/userinfo.args';
import { UserSession } from './interfaces/user.session.interface';

@Resolver('Users')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('Users')
  async Users() {
    return await this.usersService.listStaff();
  }

  @Query('User')
  async User(@Args('id') id: string, @Args('permission') permission: string) {
    return await this.usersService.getUserInfo(id, permission);
  }

  @UseGuards(GqlRequestorGuard)
  @Query('Requestor')
  async Requestor(@CurrentUser() user: UserSession) {
    const { _id } = user;
    return await this.usersService.getUserInfo(_id, 'requestor');
  }

  @UseGuards(GqlStaffGuard)
  @Query('Staff')
  async Staff(@CurrentUser() user: UserSession) {
    const { _id } = user;
    return await this.usersService.getUserInfo(_id, 'staff');
  }
}
