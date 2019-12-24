import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CreateStaffInput } from './dtos/staff.input';
import { StaffDto } from './dtos/staff.dto';
import { GqlStaffGuard } from './guards/staff.guard';
import { CurrentUser } from './decorators/user.guard.decorator';
import { UsersService } from './users.service';
import { RequestorDto } from './dtos/requestor.dto';
import { UserInfoArgs } from './dtos/userinfo.args';

@Resolver('Users')
export class UsersResolver {

    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Query('Users')
    async Users() {
        return await this.usersService.listStaff();
    }

    @Query('User')
    async User(@Args('id') id: string, @Args('permission') permission: string) {
        return await this.usersService.getUserInfo(id, permission);
    }

    @Query('Requestor')
    async Requestor(@Args('id') id: string) {
        return await this.usersService.getUserInfo(id, 'requestor');
    }

    @Query('Staff')
    async Staff(@Args('id') id: string) {
        return await this.usersService.getUserInfo(id, 'staff');
    }
}
