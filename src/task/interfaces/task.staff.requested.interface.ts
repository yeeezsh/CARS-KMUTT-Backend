import { StaffPermissionType } from 'src/users/schemas/staffs.schema';

export interface TaskStaffRequested {
  group: StaffPermissionType;
  id?: string[];
  approve: boolean;
}
