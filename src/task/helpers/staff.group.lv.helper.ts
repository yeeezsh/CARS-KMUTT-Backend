import { TaskStaffRequested } from '../interfaces/task.staff.requested.interface';
import { STAFF_PERMISSION } from 'src/users/schemas/staffs.schema';

export default (taskStaff: TaskStaffRequested): number => {
  const STAFF_LEVEL = STAFF_PERMISSION;
  const result = STAFF_LEVEL.findIndex(st => st === taskStaff.group);
  if (result === -1) throw new Error('bad staff level parsing');
  return result;
};
