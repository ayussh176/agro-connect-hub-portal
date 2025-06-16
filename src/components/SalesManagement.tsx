
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Save, X, Search } from 'lucide-react';

interface DistributorSales {
  id: string;
  name: string;
  code: string;
  region: string;
  monthlySales: number;
  yearlySales: number;
}

const mockDistributorSales: DistributorSales[] = [
  {
    id: '1',
    name: 'John Distributor',
    code: 'DIST001',
    region: 'North Region',
    monthlySales: 125000,
    yearlySales: 1450000
  },
  {
    id: '2',
    name: 'Sarah Distributor',
    code: 'DIST002',
    region: 'South Region',
    monthlySales: 98000,
    yearlySales: 1200000
  },
  {
    id: '3',
    name: 'Mike Distributor',
    code: 'DIST003',
    region: 'East Region',
    monthlySales: 156000,
    yearlySales: 1750000
  },
  {
    id: '4',
    name: 'Lisa Distributor',
    code: 'DIST004',
    region: 'West Region',
    monthlySales: 132000,
    yearlySales: 1580000
  }
];

export function SalesManagement() {
  const [distributors, setDistributors] = useState<DistributorSales[]>(mockDistributorSales);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editValues, setEditValues] = useState<{ monthlySales: number; yearlySales: number }>({
    monthlySales: 0,
    yearlySales: 0
  });

  const filteredDistributors = distributors.filter(distributor =>
    distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (distributor: DistributorSales) => {
    setEditingId(distributor.id);
    setEditValues({
      monthlySales: distributor.monthlySales,
      yearlySales: distributor.yearlySales
    });
  };

  const handleSave = (distributorId: string) => {
    setDistributors(prev => 
      prev.map(dist => 
        dist.id === distributorId 
          ? { ...dist, monthlySales: editValues.monthlySales, yearlySales: editValues.yearlySales }
          : dist
      )
    );
    setEditingId(null);
    console.log(`Updated sales for distributor ${distributorId}:`, editValues);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({ monthlySales: 0, yearlySales: 0 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distributor Sales Management</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, code, or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Distributor Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Monthly Sales (₹)</TableHead>
              <TableHead>Yearly Sales (₹)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDistributors.map((distributor) => (
              <TableRow key={distributor.id}>
                <TableCell className="font-medium">{distributor.code}</TableCell>
                <TableCell>{distributor.name}</TableCell>
                <TableCell>{distributor.region}</TableCell>
                <TableCell>
                  {editingId === distributor.id ? (
                    <Input
                      type="number"
                      value={editValues.monthlySales}
                      onChange={(e) => setEditValues(prev => ({ ...prev, monthlySales: Number(e.target.value) }))}
                      className="w-32"
                    />
                  ) : (
                    `₹${distributor.monthlySales.toLocaleString()}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === distributor.id ? (
                    <Input
                      type="number"
                      value={editValues.yearlySales}
                      onChange={(e) => setEditValues(prev => ({ ...prev, yearlySales: Number(e.target.value) }))}
                      className="w-32"
                    />
                  ) : (
                    `₹${distributor.yearlySales.toLocaleString()}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === distributor.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(distributor.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(distributor)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredDistributors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No distributors found matching your search.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
