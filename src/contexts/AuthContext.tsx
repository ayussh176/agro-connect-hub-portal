
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'distributor1',
    role: 'distributor',
    name: 'John Distributor',
    region: 'North Region',
    staffId: 'staff1'
  },
  {
    id: '2',
    username: 'staff1',
    role: 'staff',
    name: 'Jane Staff',
    region: 'North Region',
    territory: 'North Territory',
    managerId: 'manager1'
  },
  {
    id: '3',
    username: 'manager1',
    role: 'manager',
    name: 'Mike Manager',
    region: 'North Region'
  },
  {
    id: '4',
    username: 'accountant1',
    role: 'accountant',
    name: 'Alice Accountant',
    region: 'State Level'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session and authentication token
    const storedUser = localStorage.getItem('pesticide-user');
    const authToken = localStorage.getItem('pesticide-auth-token');
    const sessionExpiry = localStorage.getItem('pesticide-session-expiry');
    
    if (storedUser && authToken && sessionExpiry) {
      const expiryTime = parseInt(sessionExpiry, 10);
      const currentTime = Date.now();
      
      // Check if session is still valid (expires after 30 days)
      if (currentTime < expiryTime) {
        setUser(JSON.parse(storedUser));
      } else {
        // Session expired, clear storage
        localStorage.removeItem('pesticide-user');
        localStorage.removeItem('pesticide-auth-token');
        localStorage.removeItem('pesticide-session-expiry');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - in real app, this would be an API call
    const foundUser = mockUsers.find(
      u => u.username === credentials.username && u.role === credentials.role
    );

    if (foundUser && credentials.password === 'password123') {
      const authToken = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const sessionExpiry = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
      
      setUser(foundUser);
      localStorage.setItem('pesticide-user', JSON.stringify(foundUser));
      localStorage.setItem('pesticide-auth-token', authToken);
      localStorage.setItem('pesticide-session-expiry', sessionExpiry.toString());
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pesticide-user');
    localStorage.removeItem('pesticide-auth-token');
    localStorage.removeItem('pesticide-session-expiry');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
