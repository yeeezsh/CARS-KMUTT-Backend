import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Requestor } from './interfaces/requestor.interface';
import { UserSession } from './interfaces/user.session.interface';

@Injectable()
export class UserQuotaService {
  constructor(
    @Inject('REQUESTOR_MODEL')
    private readonly requestorModel: Model<Requestor>,
  ) {}

  async getSportQuota(user: UserSession) {
    const MAX_QUOTAS = 1;
  }
}
