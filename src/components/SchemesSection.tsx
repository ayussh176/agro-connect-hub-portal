
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SchemeManagement } from './SchemeManagement';
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

export function SchemesSection() {
  const { user } = useAuth();
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

  const canManageSchemes = user?.role === 'manager';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Schemes</h2>
        <p className="text-muted-foreground">
          {canManageSchemes 
            ? 'Manage active schemes and promotions' 
            : 'View active schemes and promotions'
          }
        </p>
      </div>

      {canManageSchemes ? (
        <SchemeManagement 
          schemes={schemes}
          onAddScheme={handleAddScheme}
          onRemoveScheme={handleRemoveScheme}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {schemes.map((scheme) => (
            <Card key={scheme.id}>
              <CardHeader>
                <CardTitle>{scheme.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{scheme.description}</p>
                {scheme.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={scheme.imageUrl} 
                      alt={scheme.title}
                      className="w-full h-32 object-cover rounded-md bg-gray-100"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  <p>Valid from: {scheme.validFrom}</p>
                  <p>Valid to: {scheme.validTo}</p>
                  <p>Created by: {scheme.createdBy}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
