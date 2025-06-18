import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dashboard } from './Dashboard';
import { ProductSection } from './ProductSection';
import { AccountantProductSection } from './AccountantProductSection';
import { SchemesSection } from './SchemesSection';
import { SalesManagement } from './SalesManagement';
import { CollectionManagement } from './CollectionManagement';
import { Navigation } from './Navigation';
import { Profile } from './Profile';

export function MainApp() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return user?.role === 'accountant' ? <AccountantProductSection /> : <ProductSection />;
      case 'schemes':
        return <SchemesSection />;
      case 'sales':
        return <SalesManagement />;
      case 'collections':
        return <CollectionManagement />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
