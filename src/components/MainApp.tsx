
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from './Navigation';
import { Dashboard } from './Dashboard';
import { ProductSection } from './ProductSection';
import { SchemesSection } from './SchemesSection';
import { SalesManagement } from './SalesManagement';
import { CollectionManagement } from './CollectionManagement';

export function MainApp() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductSection />;
      case 'schemes':
        return <SchemesSection />;
      case 'sales':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Sales Management</h2>
            <p className="text-muted-foreground">Manage distributor sales data</p>
            {user?.role === 'accountant' ? (
              <SalesManagement />
            ) : (
              <div className="text-center py-12 text-gray-500">
                Sales management section - Coming soon
              </div>
            )}
          </div>
        );
      case 'collection':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Collection Management</h2>
            <p className="text-muted-foreground">Manage payment collections</p>
            {user?.role === 'accountant' ? (
              <CollectionManagement />
            ) : (
              <div className="text-center py-12 text-gray-500">
                Collection management section - Coming soon
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
            <p className="text-muted-foreground">Manage your account settings</p>
            <div className="bg-white p-6 rounded-lg border">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Role</label>
                  <p className="text-lg capitalize">{user?.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Region ID</label>
                  <p className="text-lg">{user?.regionId}</p>
                </div>
                {user?.staffId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Staff ID</label>
                    <p className="text-lg">{user.staffId}</p>
                  </div>
                )}
                {user?.managerId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Manager ID</label>
                    <p className="text-lg">{user.managerId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
