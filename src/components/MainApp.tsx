
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
import { Scheme } from '@/types/product';

// Mock schemes data
const mockSchemes: Scheme[] = [
  {
    id: '1',
    title: 'Summer Special Offer',
    description: 'Get 20% off on all fungicides during summer season',
    imageUrl: 'https://example.com/summer-offer.jpg',
    validFrom: '2024-04-01',
    validTo: '2024-06-30',
    createdBy: 'Manager'
  },
  {
    id: '2',
    title: 'Bulk Purchase Discount',
    description: 'Purchase more than 100 units and get 15% discount',
    imageUrl: 'https://example.com/bulk-discount.jpg',
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    createdBy: 'Staff'
  }
];

export function MainApp() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [schemes, setSchemes] = useState<Scheme[]>(mockSchemes);

  const handleAddScheme = (newScheme: Omit<Scheme, 'id'>) => {
    const scheme: Scheme = {
      ...newScheme,
      id: Date.now().toString(),
    };
    setSchemes([...schemes, scheme]);
  };

  const handleRemoveScheme = (schemeId: string) => {
    setSchemes(schemes.filter(scheme => scheme.id !== schemeId));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        // Show AccountantProductSection for accountants, regular ProductSection for others
        return user?.role === 'accountant' ? <AccountantProductSection /> : <ProductSection />;
      case 'schemes':
        return user?.role === 'manager' ? (
          <SchemeManagement 
            schemes={schemes}
            onAddScheme={handleAddScheme}
            onRemoveScheme={handleRemoveScheme}
          />
        ) : <SchemesSection />;
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
