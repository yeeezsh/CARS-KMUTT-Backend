import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';

// inputs
import { CreateStaffInput } from './dtos/staff.input';

// dtos
import { StaffDto } from './dtos/staff.dto';

@Resolver('Users')
export class UsersResolver {

    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Query(() => [StaffDto])
    async getStaffs() {
        return await this.usersService.listStaff();
    }

    // async createStaff(@Args({name: 'username', type: () => String}) data: CreateStaffInput) {
    @Mutation(returns => StaffDto)
    async createStaff(@Args('createStaff') data: CreateStaffInput) {
        return await this.usersService.createStaff(data);
    }
}
