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

    @Query(() => [StaffDto])
    @UseGuards(GqlStaffGuard)
    async getStaffs(@CurrentUser() user: StaffDto) {
        return await this.usersService.listStaff();
    }

    @Query(() => RequestorDto)
    async getRequestorInfo(@Args({ name: 'id', type: () => String }) id: string): Promise<any> {
        return this.usersService.getUserInfo(id, 'requestor');
    }

    @Mutation(returns => StaffDto)
    async createStaff(@Args('createStaff') data: CreateStaffInput) {
        return await this.usersService.createStaff(data);
    }
}
