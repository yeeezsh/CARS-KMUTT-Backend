import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';

// inputs
import { CreateStaffInput } from './dtos/create-staff.input';

// dtos
import { StaffDto } from './dtos/staff.dto';

@Resolver('Users')
export class UsersResolver {

    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Query(() => [StaffDto])
    async staff() {
        return await this.usersService.listStaff();
    }


}
