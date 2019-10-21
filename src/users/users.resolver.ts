import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CreateStaffInput } from './dtos/staff.input';
import { StaffDto } from './dtos/staff.dto';
import { GqlStaffGuard } from './guards/staff.guard';
import { CurrentUser } from './decorators/user.guard.decorator';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { RequestorDto } from './dtos/requestor.dto';
import { UserInfoArgs } from './dtos/userinfo.args';
import { Int } from 'type-graphql';

@Resolver('Users')
export class UsersResolver {

    constructor(
        private readonly usersService: UsersService,
        // private readonly authService: AuthService,
    ) { }

    @Query(() => [StaffDto])
    @UseGuards(GqlStaffGuard)
    async getStaffs(@CurrentUser() user: StaffDto) {
        // console.log(user)
        return await this.usersService.listStaff();
    }

    @Query(() => RequestorDto)
    // async getRequestorInfo(@Args('userInfo') args: UserInfoArgs, @CurrentUser() user: RequestorDto) {
    async getRequestorInfo(@Args({ name: 'id', type: () => String }) id: string): Promise<any> {
        return this.usersService.getUserInfo(id, 'requestor');
        // return {}
    }

    @UseGuards(GqlStaffGuard)
    @Mutation(returns => StaffDto)
    async createStaff(@Args('createStaff') data: CreateStaffInput) {
        return await this.usersService.createStaff(data);
    }
}
