
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, AlertCircle } from 'lucide-react';

// Mock data for demonstration
const mockSalesData = {
  distributor: {
    monthlySales: 125000,
    yearlySales: 1450000,
    overdue: 25000
  },
  staff: {
    monthlySales: 450000,
    yearlySales: 5200000,
    monthlyCollection: 380000,
    yearlyCollection: 4800000
  },
  manager: {
    totalStaff: 5,
    totalMonthlySales: 2250000,
    totalYearlySales: 26000000,
    totalMonthlyCollection: 1900000,
    totalYearlyCollection: 24000000
  },
  accountant: {
    stateMonthlySales: 15750000,
    stateYearlySales: 182000000,
    totalDistributors: 156,
    totalStaff: 45
  }
};

export function Dashboard() {
  const { user } = useAuth();

  const renderDistributorDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{mockSalesData.distributor.monthlySales.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Current month performance</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Yearly Sales</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{mockSalesData.distributor.yearlySales.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total annual sales</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">₹{mockSalesData.distributor.overdue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Pending payments</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderStaffDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
          <CardDescription>Your territory sales data</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-between">
            <span>Monthly Sales:</span>
            <span className="font-semibold">₹{mockSalesData.staff.monthlySales.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Yearly Sales:</span>
            <span className="font-semibold">₹{mockSalesData.staff.yearlySales.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Collection Performance</CardTitle>
          <CardDescription>Payment collections in your territory</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-between">
            <span>Monthly Collection:</span>
            <span className="font-semibold">₹{mockSalesData.staff.monthlyCollection.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Yearly Collection:</span>
            <span className="font-semibold">₹{mockSalesData.staff.yearlyCollection.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderManagerDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Size</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockSalesData.manager.totalStaff}</div>
          <p className="text-xs text-muted-foreground">Staff members</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{(mockSalesData.manager.totalMonthlySales / 1000000).toFixed(1)}M</div>
          <p className="text-xs text-muted-foreground">Team total</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Yearly Sales</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{(mockSalesData.manager.totalYearlySales / 1000000).toFixed(1)}M</div>
          <p className="text-xs text-muted-foreground">Annual team performance</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
          <AlertCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">92%</div>
          <p className="text-xs text-muted-foreground">Collection efficiency</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderAccountantDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">State Monthly Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{(mockSalesData.accountant.stateMonthlySales / 1000000).toFixed(1)}M</div>
          <p className="text-xs text-muted-foreground">Current month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">State Yearly Sales</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{(mockSalesData.accountant.stateYearlySales / 1000000).toFixed(0)}M</div>
          <p className="text-xs text-muted-foreground">Annual performance</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Distributors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockSalesData.accountant.totalDistributors}</div>
          <p className="text-xs text-muted-foreground">Active distributors</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockSalesData.accountant.totalStaff}</div>
          <p className="text-xs text-muted-foreground">Field staff</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'distributor':
        return renderDistributorDashboard();
      case 'staff':
        return renderStaffDashboard();
      case 'manager':
        return renderManagerDashboard();
      case 'accountant':
        return renderAccountantDashboard();
      default:
        return <div>Dashboard not available</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your performance overview.
        </p>
      </div>
      {renderDashboardContent()}
    </div>
  );
}
