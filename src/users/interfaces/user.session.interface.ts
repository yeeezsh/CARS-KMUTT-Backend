import { StaffPermissionType } from '../schemas/staffs.schema';

export interface UserSession {
  _id: string;
  username: string;
  studentId: string;
  email: string;
  permission: string;
  group: string | StaffPermissionType;
}
