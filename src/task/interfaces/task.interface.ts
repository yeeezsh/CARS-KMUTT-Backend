import { Document, Types } from 'mongoose';

export interface TimeSlot {
  start?: Date;
  stop?: Date;
  allDay?: boolean;
}

type TimeSlotType = TimeSlot[];

export interface Requestor {
  username: string;
  confirm: boolean;
}

export interface StaffRequested {
  group: string;
  id?: string[];
  approve: boolean;
}

export type TaskType =
  | 'common'
  | 'common-sport'
  | 'sport'
  | 'meeting-room'
  | 'meeting-club'
  | 'meeting';

export type Desc = {
  msg: string;
  createAt: Date;
};

export interface Task {
  reserve?: TimeSlotType;
  requestor: Requestor[];
  // requested for sport (have timeout) / wait for normaly task
  state: Array<'wait' | 'reject' | 'accept' | 'drop' | 'requested'>;
  staff?: StaffRequested[];
  area?: string | Types.ObjectId; // required area module
  // building?: string;
  forms?: any[];
  desc?: Desc[];

  // use for common/area reserve
  // and use for sport timeout checking
  type?: TaskType;

  createAt: Date;
  updateAt: Date;
}
export interface TaskDoc extends Task, Document {}
export interface TaskLastCard extends TaskDoc {
  owner: string;
}
