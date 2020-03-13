import { Schema, Document } from 'mongoose';
import { StaffDoc } from '../../users/interfaces/staff.interface';
import { Area } from '../../area/interfaces/area.interface';
import { Form } from '../../form/interfaces/form.interface';

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

export interface Task extends Document {
  reserve: TimeSlotType;
  requestor: Requestor[];
  state: Array<'wait' | 'approve' | 'reject' | 'accept' | 'drop' | 'requested'>;
  staff?: StaffDoc[];
  area: Area; // required area module
  // form?: Form; // required form module
  form?: Object;
  desc?: string;

  cancle: boolean;
  createAt: Date;
  updateAt: Date;
}

export interface TaskLastCard extends Task {
  owner: string;
}
