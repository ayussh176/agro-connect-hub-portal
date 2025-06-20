import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function Dashboard() {
  const { user } = useAuth();
  const [monthlySales, setMonthlySales] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);
  const [monthlyCollection, setMonthlyCollection] = useState(0);
  const [yearlyCollection, setYearlyCollection] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const role = user.role;
        const uid = user.id;
        const region = user.region;

        if (role === 'distributor') {
  const salesSnap = await getDocs(
    query(collection(db, 'sales'), where('distributorId', '==', uid))
  );
  const collSnap = await getDocs(
    query(collection(db, 'collection'), where('distributorId', '==', uid))
  );

  let ms = 0, ys = 0, yc = 0;
  salesSnap.forEach(doc => {
    const d = doc.data();
    ms += d.monthlySales || 0;
    ys += d.yearlySales || 0;
  });
  collSnap.forEach(doc => {
    const d = doc.data();
    yc += d.yearlyCollection || 0;
  });

  setMonthlySales(ms);
  setYearlySales(ys);
}
 else if (role === 'staff' || role === 'manager') {
          const salesSnap = await getDocs(
            query(collection(db, 'sales'), where('region', '==', region))
          );
          const collSnap = await getDocs(
            query(collection(db, 'collection'), where('region', '==', region))
          );

          let ms = 0, ys = 0, mc = 0, yc = 0;
          salesSnap.forEach(doc => {
            const d = doc.data();
            ms += d.monthlySales || 0;
            ys += d.yearlySales || 0;
          });
          collSnap.forEach(doc => {
            const d = doc.data();
            mc += d.monthlyCollection || 0;
            yc += d.yearlyCollection || 0;
          });

          setMonthlySales(ms);
          setYearlySales(ys);
          setMonthlyCollection(mc);
          setYearlyCollection(yc);
        } else if (role === 'accountant') {
          const [salesSnap, collSnap] = await Promise.all([
            getDocs(collection(db, 'sales')),
            getDocs(collection(db, 'collection'))
          ]);

          let ms = 0, ys = 0, mc = 0, yc = 0;

          salesSnap.forEach(doc => {
            const d = doc.data();
            ms += d.monthlySales || 0;
            ys += d.yearlySales || 0;
          });
          collSnap.forEach(doc => {
            const d = doc.data();
            mc += d.monthlyCollection || 0;
            yc += d.yearlyCollection || 0;
          });

          setMonthlySales(ms);
          setYearlySales(ys);
          setMonthlyCollection(mc);
          setYearlyCollection(yc);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Monthly Sales</CardTitle><DollarSign /></CardHeader>
          <CardContent>₹{monthlySales.toLocaleString()}</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Yearly Sales</CardTitle><TrendingUp /></CardHeader>
          <CardContent>₹{yearlySales.toLocaleString()}</CardContent>
        </Card>

        {user.role !== 'distributor' && (
          <>
            <Card>
              <CardHeader><CardTitle>Monthly Collection</CardTitle><DollarSign /></CardHeader>
              <CardContent>₹{monthlyCollection.toLocaleString()}</CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Yearly Collection</CardTitle><TrendingUp /></CardHeader>
              <CardContent>₹{yearlyCollection.toLocaleString()}</CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
