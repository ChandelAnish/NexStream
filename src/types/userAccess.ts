export type Department = 'Manager' | 'Doctor' | 'Nurse' | 'Stuff';
export type AccessLevel = 'Full' | 'Partial' | 'Non';
export type UserStatus = 'Active' | 'Inactive';

export interface UserAccess {
  id?: number;
  name: string;
  avatar?: string;
  department: Department;
  dateOfJoin: string;
  accessLevel: AccessLevel;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}
