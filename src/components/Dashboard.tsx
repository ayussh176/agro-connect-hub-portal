import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function Dashboard() {
  const { user } = useAuth();
  const [monthlySales, setMonthlySales] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);
  const [monthlyCollection, setMonthlyCollection] = useState(0);
  const [yearlyCollection, setYearlyCollection] = useState(0);
  // const [staffCount, setStaffCount] = useState(0);
  // const [distributorCount, setDistributorCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const role = user.role;
      const uid = user.id;
      const region = user.region;

      try {
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
          // Overdue not needed, removed
        } else if (role === 'staff' || role === 'manager') {
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
          const [salesSnap, collSnap, usersSnap] = await Promise.all([
            getDocs(collection(db, 'sales')),
            getDocs(collection(db, 'collection')),
            getDocs(collection(db, 'users'))
          ]);

          let ms = 0, ys = 0, mc = 0, yc = 0;
          let sc = 0, dc = 0;

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
          usersSnap.forEach(doc => {
            const d = doc.data();
            if (d.role === 'staff' || d.role === 'manager') sc++;
            else if (d.role === 'distributor') dc++;
          });

          setMonthlySales(ms);
          setYearlySales(ys);
          setMonthlyCollection(mc);
          setYearlyCollection(yc);
          // setStaffCount(sc);
          // setDistributorCount(dc);
        }
      } catch (err) {
        console.error('Dashboard fetch failed', err);
      }
    }

    fetchData();
  }, [user]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Monthly Sales</CardTitle><DollarSign/></CardHeader>
          <CardContent>₹{monthlySales.toLocaleString()}</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Yearly Sales</CardTitle><TrendingUp/></CardHeader>
          <CardContent>₹{yearlySales.toLocaleString()}</CardContent>
        </Card>

        {user.role !== 'distributor' && (
          <>
            <Card>
              <CardHeader><CardTitle>Monthly Collection</CardTitle><DollarSign/></CardHeader>
              <CardContent>₹{monthlyCollection.toLocaleString()}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Yearly Collection</CardTitle><TrendingUp/></CardHeader>
              <CardContent>₹{yearlyCollection.toLocaleString()}</CardContent>
            </Card>
          </>
        )}

        {/* {user.role === 'accountant' && (
          <>
            <Card>
              <CardHeader><CardTitle>Total Staff</CardTitle><Users/></CardHeader>
              <CardContent>{staffCount}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Distributors</CardTitle><Users/></CardHeader>
              <CardContent>{distributorCount}</CardContent>
            </Card>
          </>
        )} */}
      </div>
    </div>
  );
}
