import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { doc, collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function Dashboard() {
  const { user } = useAuth();
  const [monthlySales, setMonthlySales] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);
  const [monthlyCollection, setMonthlyCollection] = useState(0);
  const [yearlyCollection, setYearlyCollection] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [distributorCount, setDistributorCount] = useState(0);
  const [overdue, setOverdue] = useState(0);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        if (user.role === 'distributor') {
          const docSnap = await getDoc(doc(db, 'sales', user.id));
          if (docSnap.exists()) {
            const d = docSnap.data();
            setMonthlySales(d.monthlySales || 0);
            setYearlySales(d.yearlySales || 0);
            setOverdue(d.overdue || 0);
          }
        } else if (user.role === 'staff' || user.role === 'manager') {
          const q = query(collection(db, 'sales'), where('region', '==', user.region));
          const snap = await getDocs(q);
          let m = 0, y = 0, cM = 0, cY = 0;
          snap.forEach(doc => {
            const d = doc.data();
            m += d.monthlySales || 0;
            y += d.yearlySales || 0;
            cM += d.monthlyCollection || 0;
            cY += d.yearlyCollection || 0;
          });
          setMonthlySales(m);
          setYearlySales(y);
          setMonthlyCollection(cM);
          setYearlyCollection(cY);
        } else if (user.role === 'accountant') {
          const salesSnap = await getDocs(collection(db, 'sales'));
          let m = 0, y = 0;
          salesSnap.forEach(doc => {
            const d = doc.data();
            m += d.monthlySales || 0;
            y += d.yearlySales || 0;
          });
          const usersSnap = await getDocs(collection(db, 'users'));
          let sC = 0, dC = 0;
          usersSnap.forEach(doc => {
            const d = doc.data();
            if (d.role === 'staff') sC++;
            if (d.role === 'distributor') dC++;
          });
          setMonthlySales(m);
          setYearlySales(y);
          setStaffCount(sC);
          setDistributorCount(dC);
        }
      } catch (err) {
        console.error('Dashboard fetch error', err);
      }
    }

    fetchData();
  }, [user]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader><CardTitle>Monthly Sales</CardTitle><DollarSign/></CardHeader><CardContent>₹{monthlySales.toLocaleString()}</CardContent></Card>
        <Card><CardHeader><CardTitle>Yearly Sales</CardTitle><TrendingUp/></CardHeader><CardContent>₹{yearlySales.toLocaleString()}</CardContent></Card>
        {(user.role !== 'distributor') && (
          <Card><CardHeader><CardTitle>Monthly Collection</CardTitle><DollarSign/></CardHeader><CardContent>₹{monthlyCollection.toLocaleString()}</CardContent></Card>
        )}
        {(user.role !== 'distributor') && (
          <Card><CardHeader><CardTitle>Yearly Collection</CardTitle><TrendingUp/></CardHeader><CardContent>₹{yearlyCollection.toLocaleString()}</CardContent></Card>
        )}
        {user.role === 'distributor' && (
          <Card><CardHeader><CardTitle>Overdue Amount</CardTitle><AlertCircle/></CardHeader><CardContent>₹{overdue.toLocaleString()}</CardContent></Card>
        )}
        {user.role === 'accountant' && (
          <>
            <Card><CardHeader><CardTitle>Total Staff</CardTitle><Users/></CardHeader><CardContent>{staffCount}</CardContent></Card>
            <Card><CardHeader><CardTitle>Total Distributors</CardTitle><Users/></CardHeader><CardContent>{distributorCount}</CardContent></Card>
          </>
        )}
      </div>
    </div>
  );
}
