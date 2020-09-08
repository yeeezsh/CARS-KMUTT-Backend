import { Document, Types } from 'mongoose';
import { TaskDesc } from './task.desc.interface';
import { TaskRequestor } from './task.requestor.interface';
import { TaskStaffRequested } from './task.staff.requested.interface';
import { TaskTimeSlot } from './task.time.slot.interface';

type TimeSlotType = TaskTimeSlot[];
export enum TaskStateType {
  WAIT = 'wait',
  REJECT = 'reject',
  ACCEPT = 'accept',
  DROP = 'drop',
  REQUESTED = 'requested',
  FORWARD = 'forward',
  RESEND = 'resend',
}

export const TASK_STATE: TaskStateType[] = [
  TaskStateType.WAIT,
  TaskStateType.REJECT,
  TaskStateType.ACCEPT,
  TaskStateType.DROP,
  TaskStateType.REQUESTED,
  TaskStateType.FORWARD,
  TaskStateType.RESEND,
];

export enum TaskType {
  common = 'common',
  commonSport = 'common-sport',
  sport = 'sport',
  meetingClub = 'meeting-club',
  meetingRoom = 'meeting-room',
}

export const TASK_TYPE: TaskType[] = [
  TaskType.common,
  TaskType.commonSport,
  TaskType.sport,
  TaskType.meetingClub,
  TaskType.meetingRoom,
];

export interface Task {
  vid: string;
  reserve?: TimeSlotType;
  requestor: TaskRequestor[];
  state: TaskStateType[];
  staff?: TaskStaffRequested[];
  area?: string | Types.ObjectId; // required area module
  forms?: any[];
  desc?: TaskDesc[];
  type?: TaskType;

  createAt: Date;
  updateAt: Date;
}
export interface TaskDoc extends Task, Document {}
export interface TaskLastCard extends Task {
  owner: string;
}
