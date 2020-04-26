// import { Schema, Document } from 'mongoose';
import { Document, Types } from 'mongoose';
// import { StaffDoc } from '../../users/interfaces/staff.interface';
import { AreaDoc } from '../../area/interfaces/area.interface';

interface TimeSlot {
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

export type TaskType = 'common' | 'common-sport' | 'sport' | 'meeting';

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
