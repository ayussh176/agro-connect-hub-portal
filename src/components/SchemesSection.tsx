import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SchemeManagement } from './SchemeManagement';
import { Scheme } from '@/types/product';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export function SchemesSection() {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'scheme'), (snapshot) => {
      const schemeData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Scheme[];
      setSchemes(schemeData);
    });

    return () => unsubscribe();
  }, []);

  const canManageSchemes = user?.role === 'manager';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Schemes</h2>
        <p className="text-muted-foreground">
          {canManageSchemes
            ? 'Manage active schemes and promotions'
            : 'View active schemes and promotions'}
        </p>
      </div>

      {canManageSchemes ? (
        <SchemeManagement schemes={schemes} />
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
                  <p>Valid: {scheme.validFrom} to {scheme.validTo}</p>
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
