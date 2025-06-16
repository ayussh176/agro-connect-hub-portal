import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { SalesBarChart } from './SalesBarChart';
import { TeamMembersModal } from './TeamMembersModal';
import { DistributorsModal } from './DistributorsModal';
import { ManagerDistributorsModal } from './ManagerDistributorsModal';

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

// Mock monthly sales data for bar charts
const mockMonthlySalesData = [
  { month: 'Jan', sales: 120000 },
  { month: 'Feb', sales: 135000 },
  { month: 'Mar', sales: 110000 },
  { month: 'Apr', sales: 125000 },
  { month: 'May', sales: 140000 },
  { month: 'Jun', sales: 125000 },
];

const mockManagerMonthlySalesData = [
  { month: 'Jan', sales: 2100000 },
  { month: 'Feb', sales: 2350000 },
  { month: 'Mar', sales: 2200000 },
  { month: 'Apr', sales: 2250000 },
  { month: 'May', sales: 2400000 },
  { month: 'Jun', sales: 2250000 },
];

const mockAccountantMonthlySalesData = [
  { month: 'Jan', sales: 14500000 },
  { month: 'Feb', sales: 16200000 },
  { month: 'Mar', sales: 15100000 },
  { month: 'Apr', sales: 15750000 },
  { month: 'May', sales: 16800000 },
  { month: 'Jun', sales: 15750000 },
];

// Mock team members data
const mockTeamMembers = [
  { id: '1', name: 'John Staff', role: 'Field Staff', monthlySales: 450000, monthlyCollection: 380000 },
  { id: '2', name: 'Jane Staff', role: 'Field Staff', monthlySales: 420000, monthlyCollection: 350000 },
  { id: '3', name: 'Mike Staff', role: 'Field Staff', monthlySales: 480000, monthlyCollection: 400000 },
  { id: '4', name: 'Lisa Staff', role: 'Senior Staff', monthlySales: 520000, monthlyCollection: 450000 },
  { id: '5', name: 'Tom Staff', role: 'Field Staff', monthlySales: 380000, monthlyCollection: 320000 },
];

// Mock distributors data for staff
const mockDistributors = [
  { id: '1', name: 'John Distributor', code: 'DIST001', monthlySales: 125000, yearlySales: 1450000, monthlyCollection: 105000, yearlyCollection: 1320000 },
  { id: '2', name: 'Sarah Distributor', code: 'DIST002', monthlySales: 98000, yearlySales: 1200000, monthlyCollection: 88000, yearlyCollection: 1150000 },
  { id: '3', name: 'Mike Distributor', code: 'DIST003', monthlySales: 156000, yearlySales: 1750000, monthlyCollection: 142000, yearlyCollection: 1650000 },
  { id: '4', name: 'Lisa Distributor', code: 'DIST004', monthlySales: 132000, yearlySales: 1580000, monthlyCollection: 118000, yearlyCollection: 1480000 },
];

// Mock distributors data for manager region
const mockManagerDistributors = [
  { id: '1', name: 'John Distributor', code: 'DIST001', monthlySales: 125000, yearlySales: 1450000, monthlyCollection: 105000, yearlyCollection: 1320000, overdue: 25000 },
  { id: '2', name: 'Sarah Distributor', code: 'DIST002', monthlySales: 98000, yearlySales: 1200000, monthlyCollection: 88000, yearlyCollection: 1150000, overdue: 18000 },
  { id: '3', name: 'Mike Distributor', code: 'DIST003', monthlySales: 156000, yearlySales: 1750000, monthlyCollection: 142000, yearlyCollection: 1650000, overdue: 32000 },
  { id: '4', name: 'Lisa Distributor', code: 'DIST004', monthlySales: 132000, yearlySales: 1580000, monthlyCollection: 118000, yearlyCollection: 1480000, overdue: 28000 },
  { id: '5', name: 'Tom Distributor', code: 'DIST005', monthlySales: 89000, yearlySales: 1100000, monthlyCollection: 75000, yearlyCollection: 980000, overdue: 15000 }
];

export function Dashboard() {
  const { user } = useAuth();
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showManagerMonthlySalesModal, setShowManagerMonthlySalesModal] = useState(false);
  const [showManagerYearlySalesModal, setShowManagerYearlySalesModal] = useState(false);

  const renderDistributorDashboard = () => (
    <div className="space-y-6">
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
      <SalesBarChart data={mockMonthlySalesData} title="Monthly Sales Performance" />
    </div>
  );

  const renderStaffDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowSalesModal(true)}
        >
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Your territory sales data - Click to view distributors</CardDescription>
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
        
        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowCollectionModal(true)}
        >
          <CardHeader>
            <CardTitle>Collection Performance</CardTitle>
            <CardDescription>Payment collections in your territory - Click to view distributors</CardDescription>
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
      <SalesBarChart data={mockMonthlySalesData} title="Monthly Sales Performance" />
      
      <DistributorsModal
        isOpen={showSalesModal}
        onClose={() => setShowSalesModal(false)}
        distributors={mockDistributors}
        title="Distributors Sales Performance"
        showCollection={false}
      />
      
      <DistributorsModal
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        distributors={mockDistributors}
        title="Distributors Collection Performance"
        showCollection={true}
      />
    </div>
  );

  const renderManagerDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowTeamModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSalesData.manager.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Staff members - Click to view</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowManagerMonthlySalesModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(mockSalesData.manager.totalMonthlySales / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Team total - Click to view distributors</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowManagerYearlySalesModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yearly Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(mockSalesData.manager.totalYearlySales / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Annual team performance - Click to view distributors</p>
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
      <SalesBarChart data={mockManagerMonthlySalesData} title="Team Monthly Sales Performance" />
      
      <TeamMembersModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        teamMembers={mockTeamMembers}
      />

      <ManagerDistributorsModal
        isOpen={showManagerMonthlySalesModal}
        onClose={() => setShowManagerMonthlySalesModal(false)}
        distributors={mockManagerDistributors}
        title="Monthly Sales - Regional Distributors"
        showYearly={false}
      />

      <ManagerDistributorsModal
        isOpen={showManagerYearlySalesModal}
        onClose={() => setShowManagerYearlySalesModal(false)}
        distributors={mockManagerDistributors}
        title="Yearly Sales - Regional Distributors"
        showYearly={true}
      />
    </div>
  );

  const renderAccountantDashboard = () => (
    <div className="space-y-6">
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
      <SalesBarChart data={mockAccountantMonthlySalesData} title="State Monthly Sales Performance" />
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
