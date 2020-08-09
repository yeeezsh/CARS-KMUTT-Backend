import { Document, Types } from 'mongoose';
import { TaskDesc } from './task.desc.interface';
import { TaskRequestor } from './task.requestor.interface';
import { TaskStaffRequested } from './task.staff.requested.interface';
import { TaskTimeSlot } from './task.time.slot.interface';

type TimeSlotType = TaskTimeSlot[];
export type TaskStateType =
  | 'wait'
  | 'reject'
  | 'accept'
  | 'drop'
  | 'requested'
  | 'forward';

export const TASK_STATE: TaskStateType[] = [
  'wait',
  'reject',
  'accept',
  'drop',
  'requested',
  'forward',
];

export type TaskType =
  | 'common'
  | 'common-sport'
  | 'sport'
  | 'meeting-room'
  | 'meeting-club'
  | 'meeting';

export interface Task {
  reserve?: TimeSlotType;
  requestor: TaskRequestor[];
  // requested for sport (have timeout) / wait for normaly task
  state: TaskStateType[];
  staff?: TaskStaffRequested[];
  area?: string | Types.ObjectId; // required area module
  // building?: string;
  forms?: any[];
  desc?: TaskDesc[];

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
