
export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'distributor' | 'staff' | 'manager' | 'accountant';
  regionId: string;
  staffId?: string; // for distributor
  managerId?: string; // for staff
  contactInfo?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
