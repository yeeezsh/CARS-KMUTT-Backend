import {
  HttpException,
  HttpService,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { RequestorLoginDto } from './@dtos/requestor.login.dto';
import { CreateStaffDto } from './@dtos/staff.create.dto';
// dtos
import { StaffLoginDto } from './@dtos/staff.login.dto';
// helpers
import { Hash } from './helpers/hash';
import { Requestor } from './interfaces/requestor.interface';
// interfaces
import { StaffAPI, StaffDoc } from './interfaces/staff.interface';
import { STAFF_PERMISSION } from './schemas/staffs.schema';

const BYPASS_USER = ['11111111111', 'k.t', 't.1', 't.2', 't.3', 't.4', 't.5'];
const BYPASS_STAFF = ['staff.1', 'staff.2'];

@Injectable()
export class UsersService {
  constructor(
    @Inject('STAFF_MODEL') private readonly staffModel: Model<StaffDoc>,
    @Inject('REQUESTOR_MODEL')
    private readonly requestorModel: Model<Requestor>,
    private readonly httpService: HttpService,
  ) {}

  async createStaff(create: CreateStaffDto): Promise<StaffDoc> {
    const duplicated = await Promise.all([
      this.staffModel.findOne({ username: create.username }),
      this.staffModel.findOne({ email: create.email }),
    ]);
    const valid = duplicated.filter(e => e);
    if (valid.length !== 0) {
      throw new HttpException(
        'username or email is duplicated',
        HttpStatus.BAD_REQUEST,
      );
    }

    const parse = {
      ...create,
      password: await Hash.encrypt(create.password),
    };
    const doc = new this.staffModel(parse);
    const saved = await doc.save();
    return saved;
  }

  async loginStaff(login: StaffLoginDto): Promise<StaffAPI> {
    // BYPASS
    let bypass = false;
    if (BYPASS_STAFF.includes(login.username)) bypass = true;
    if (bypass)
      return {
        _id: new Types.ObjectId('111111111111'),
        username: login.username,
        email: 'bypass@test.com',
        group: STAFF_PERMISSION[0], // use first elem for default,
      };

    const user: StaffDoc = await this.staffModel
      .findOne({ username: login.username })
      .lean();
    if (!user) {
      throw new HttpException('user is not exist', HttpStatus.UNAUTHORIZED);
    }
    const auth = await Hash.compare(login.password, user.password);
    if (!auth) {
      throw new HttpException('password invalid', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async loginRequestor(login: RequestorLoginDto): Promise<Requestor> {
    let bypass = false;
    if (BYPASS_USER.includes(login.username)) bypass = true;
    try {
      const { data: ldap } = await this.httpService
        .post('https://auth.innosoft.kmutt.ac.th', {
          username: login.username,
          password: login.password,
        })
        .toPromise();
      if (!ldap.isSuccess) {
        if (!bypass)
          throw new HttpException(
            'invalid KMUTT account',
            HttpStatus.UNAUTHORIZED,
          );
      }
      // if no have acc in db add new one
      const registred = await this.requestorModel
        .findOne({ username: login.username })
        .lean();
      if (!registred) {
        const doc = await this.requestorModel.create({
          username: login.username,
          studentId: login.username,
        });
        return doc;
      }
      return registred;
    } catch (err) {
      if (bypass) {
        // DANGER CODE BYPASS FIX HERE NXT PATCH **
        // if no have acc in db add new one
        const registred = await this.requestorModel
          .findOne({ username: login.username })
          .lean();
        if (!registred) {
          const doc = await this.requestorModel.create({
            username: login.username,
            studentId: login.username,
          });
          return doc;
        }
        return registred;
      }

      if (err.code === 'ECONNRESET') {
        // normally throw if err at LDAP
        throw new HttpException(
          'KMUTT LDAP connection error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw err;
    }
  }

  async listStaff(): Promise<StaffDoc[]> {
    const doc = await this.staffModel.find({}).lean();
    return doc;
  }

  async getUserInfo(
    id: string,
    permission: string,
  ): Promise<StaffDoc | Requestor> {
    const staffPermission = ['staff', 'approver', 'admin'];
    if (permission === 'requestor') {
      const doc = await this.requestorModel.findById(id).lean();
      return doc;
    } else if (staffPermission.includes(permission)) {
      const doc = await this.staffModel.findById(id).lean();
      const { password, ...result } = doc;
      return result;
    } else {
      throw new Error('invalid permission');
    }
  }

  /**
   * link username to mongodb _id
   * @param  {string} id
   * @param  {'staff'|'requestor'} type
   * @returns Promise
   */
  async linkUser(
    id: string,
    type: 'staff' | 'requestor',
  ): Promise<StaffDoc | Requestor> {
    try {
      let doc: StaffDoc | Requestor | PromiseLike<StaffDoc | Requestor>;
      switch (type) {
        case 'staff':
          doc = await this.staffModel.findById(id).lean();
          break;
        case 'requestor':
          doc = await this.requestorModel.findById(id).lean();
          break;
        default:
          throw Error('bad user type');
      }
      if (!doc) {
        throw Error('user by _id is not existing');
      }
      return doc;
    } catch (err) {
      if (err.name === 'CastError') {
        throw new Error('bad user type');
      }
      throw err;
    }
  }
}
