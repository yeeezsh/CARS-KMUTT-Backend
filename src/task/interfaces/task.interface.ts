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
  group?: string;
  id?: string[];
}

export type TaskType =
  | 'common'
  | 'common-sport'
  | 'sport'
  | 'meeting-room'
  | 'meeting-club';

export interface Task {
  reserve?: TimeSlotType;
  requestor: Requestor[];
  // requested for sport (have timeout) / wait for normaly task
  state: Array<'wait' | 'approve' | 'reject' | 'accept' | 'drop' | 'requested'>;
  staff?: StaffRequested[];
  area?: string | Types.ObjectId; // required area module
  building?: string;
  forms?: any[];
  desc?: string;

  // use for common/area reserve
  type?: TaskType;

  createAt: Date;
  updateAt: Date;
}
export interface TaskDoc extends Task, Document {}
export interface TaskLastCard extends TaskDoc {
  owner: string;
}
