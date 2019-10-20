import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';

// interfaces
import { Staff } from './interfaces/staff.interface';

// dtos
import { CreateStaffInput } from './dtos/staff.input';
import { StaffLoginDto } from './dtos/staff.login.dto';

// helpers
import { Hash } from './helpers/hash';

@Injectable()
export class UsersService {
    constructor(
        @Inject('STAFF_MODEL') private readonly staffModel: Model<Staff>,
    ) { }

    async createStaff(create: CreateStaffInput): Promise<Staff> {
        try {
            const duplicated = await Promise.all([
                this.staffModel.findOne({ username: create.username }),
                this.staffModel.findOne({ email: create.email }),
            ]);
            const valid = duplicated.filter(e => e);
            if (valid.length !== 0) {
                throw new HttpException('username or email is duplicated', HttpStatus.BAD_REQUEST);
            }

            const parse: CreateStaffInput = {
                ...create,
                password: await Hash.encrypt(create.password),
            };
            const doc = new this.staffModel(parse);
            const saved = await doc.save();
            return saved;
        } catch (err) {
            throw err;
        }
    }

    async loginStaff(login: StaffLoginDto): Promise<Staff> {
        try {
            const user: Staff = await this.staffModel.findOne({ username: login.username }).lean();
            if (!user) { throw new HttpException('user is not exist', HttpStatus.UNAUTHORIZED); }
            const auth = await Hash.compare(login.password, user.password);
            if (!auth) { throw new HttpException('password invalid', HttpStatus.UNAUTHORIZED); }
            return user;
        } catch (err) {
            throw err;
        }
    }

    async listStaff(): Promise<Staff[]> {
        const doc = await this.staffModel.find({});
        return doc;
    }

}
