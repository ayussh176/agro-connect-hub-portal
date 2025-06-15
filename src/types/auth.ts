
export interface User {
  id: string;
  username: string;
  role: 'distributor' | 'staff' | 'manager' | 'accountant';
  name: string;
  region: string;
  territory?: string;
  managerId?: string;
  staffId?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  role: 'distributor' | 'staff' | 'manager' | 'accountant';
}
