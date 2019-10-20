import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

// inputs
import { CreateStaffInput } from './dtos/staff.input';
import { LoginStaffInput } from './dtos/staff.login.input';

// dtos
import { StaffDto } from './dtos/staff.dto';

// helpers
import { GqlAuthGuard } from './staff.guard';

// decorators
import { CurrentUser } from './decorators/staff.guard.decorator';

// services
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

@Resolver('Users')
export class UsersResolver {

    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) { }

    @Query(() => [StaffDto])
    @UseGuards(GqlAuthGuard)
    async getStaffs(@CurrentUser() user: StaffDto) {
        // console.log(user)
        return await this.usersService.listStaff();
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(returns => StaffDto)
    async createStaff(@Args('createStaff') data: CreateStaffInput) {
        return await this.usersService.createStaff(data);
    }

    // @Mutation(returns => StaffGuardDto)
    // async loginStaff(@Args('loginStaff') data: LoginStaffInput) {
    //     // await this.authService.login(data.username, data.password);
    //     // await this.usersService.loginStaff(data);
    //     // const token = await this.authService.validateStaff(data.username, data.password)
    //     // console.log(token)
    //     return { access_token: 'test' };
    // }
}
