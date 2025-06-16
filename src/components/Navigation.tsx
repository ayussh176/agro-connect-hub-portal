import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Package, 
  FileText, 
  User, 
  DollarSign, 
  Users, 
  LogOut,
  Menu
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const { user, logout } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'profile', label: 'Profile', icon: User }
    ];

    switch (user?.role) {
      case 'distributor':
        return [
          ...baseItems.slice(0, 2),
          { id: 'schemes', label: 'Schemes', icon: FileText },
          baseItems[2]
        ];
      case 'staff':
        return [
          ...baseItems.slice(0, 2),
          { id: 'schemes', label: 'Schemes', icon: FileText },
          baseItems[2]
        ];
      case 'manager':
        return [
          ...baseItems.slice(0, 2),
          { id: 'schemes', label: 'Schemes', icon: FileText },
          baseItems[2]
        ];
      case 'accountant':
        return [
          baseItems[0],
          { id: 'sales', label: 'Sales', icon: DollarSign },
          { id: 'collections', label: 'Collections', icon: Users },
          baseItems[1],
          baseItems[2]
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          {user?.name}
        </h2>
        <p className="text-sm text-gray-600 capitalize">
          {user?.role}
        </p>
        <p className="text-xs text-gray-500">
          {user?.region}
        </p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={activeSection === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSectionChange(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white border-r border-gray-200 h-screen">
        <NavContent />
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
