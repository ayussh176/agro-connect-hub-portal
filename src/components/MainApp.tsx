import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dashboard } from './Dashboard';
import { ProductSection } from './ProductSection';
import { AccountantProductSection } from './AccountantProductSection';
import { SchemesSection } from './SchemesSection';
import { SchemeManagement } from './SchemeManagement';
import { SalesManagement } from './SalesManagement';
import { CollectionManagement } from './CollectionManagement';
import { Navigation } from './Navigation';

export function MainApp() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        // Show AccountantProductSection for accountants, regular ProductSection for others
        return user?.role === 'accountant' ? <AccountantProductSection /> : <ProductSection />;
      case 'schemes':
        return user?.role === 'manager' ? <SchemeManagement /> : <SchemesSection />;
      case 'sales':
        return <SalesManagement />;
      case 'collections':
        return <CollectionManagement />;
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
