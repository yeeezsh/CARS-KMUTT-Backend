// import { Schema, Document } from 'mongoose';
import { Document } from 'mongoose';
import { StaffDoc } from '../../users/interfaces/staff.interface';
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

export interface Task extends Document {
  reserve?: TimeSlotType;
  requestor: Requestor[];
  // requested for sport (have timeout) / wait for normaly task
  state: Array<'wait' | 'approve' | 'reject' | 'accept' | 'drop' | 'requested'>;
  staff?: StaffRequested[];
  area?: AreaDoc; // required area module
  building?: string;
  form?: any[];
  desc?: string;

  createAt: Date;
  updateAt: Date;
}

export interface TaskLastCard extends Task {
  owner: string;
}
