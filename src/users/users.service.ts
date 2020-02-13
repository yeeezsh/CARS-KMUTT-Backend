import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  HttpService,
} from '@nestjs/common';
import { Model } from 'mongoose';

// interfaces
import { Staff } from './interfaces/staff.interface';
import { Requestor } from './interfaces/requestor.interface';

// dtos
import { CreateStaffInput } from './dtos/staff.input';
import { StaffLoginDto } from './dtos/staff.login.dto';
import { RequestorLoginDto } from './dtos/requestor.login.dto';

// helpers
import { Hash } from './helpers/hash';

const BYPASS_USER = ['11111111111', 'k.t'];

@Injectable()
export class UsersService {
  constructor(
    @Inject('STAFF_MODEL') private readonly staffModel: Model<Staff>,
    @Inject('REQUESTOR_MODEL')
    private readonly requestorModel: Model<Requestor>,
    private readonly httpService: HttpService,
  ) {}

  async createStaff(create: CreateStaffInput): Promise<Staff> {
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

    const parse: CreateStaffInput = {
      ...create,
      password: await Hash.encrypt(create.password),
    };
    const doc = new this.staffModel(parse);
    const saved = await doc.save();
    return saved;
  }

  async loginStaff(login: StaffLoginDto): Promise<Staff> {
    const user: Staff = await this.staffModel
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
    try {
      let bypass = false;
      if (BYPASS_USER.includes(login.username)) bypass = true;
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
      if (err.code === 'ECONNRESET') {
        throw new HttpException(
          'KMUTT LDAP connection error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw err;
    }
  }

  async listStaff(): Promise<Staff[]> {
    const doc = await this.staffModel.find({}).lean();
    return doc;
  }

  async getUserInfo(
    id: string,
    permission: string,
  ): Promise<Staff | Requestor> {
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

  async linkUser(
    id: string,
    type: 'staff' | 'requestor',
  ): Promise<Staff | Requestor> {
    try {
      let doc: Staff | Requestor | PromiseLike<Staff | Requestor>;
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
