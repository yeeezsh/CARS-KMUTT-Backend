import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';

// inputs
import { CreateStaffInput } from './dtos/staff.input';
import { LoginStaffInput } from './dtos/staff.login.input';

// dtos
import { StaffDto } from './dtos/staff.dto';
import { StaffLoginDto } from './dtos/staff.login.dto';

@Resolver('Users')
export class UsersResolver {

    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Query(() => [StaffDto])
    async getStaffs() {
        return await this.usersService.listStaff();
    }

    @Mutation(returns => StaffDto)
    async createStaff(@Args('createStaff') data: CreateStaffInput) {
        return await this.usersService.createStaff(data);
    }

    @Mutation(returns => StaffDto)
    async loginStaff(@Args('loginStaff') data: LoginStaffInput) {
        return await this.usersService.loginStaff(data);
    }
}
