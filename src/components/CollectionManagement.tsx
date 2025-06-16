import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Save, X, Search, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface DistributorCollection {
  id: string;
  name: string;
  code: string;
  region: string;
  monthlyCollection: number;
  yearlyCollection: number;
  overdue: number;
}

const mockDistributorCollection: DistributorCollection[] = [
  {
    id: '1',
    name: 'John Distributor',
    code: 'DIST001',
    region: 'North Region',
    monthlyCollection: 105000,
    yearlyCollection: 1320000,
    overdue: 25000
  },
  {
    id: '2',
    name: 'Sarah Distributor',
    code: 'DIST002',
    region: 'South Region',
    monthlyCollection: 88000,
    yearlyCollection: 1150000,
    overdue: 15000
  },
  {
    id: '3',
    name: 'Mike Distributor',
    code: 'DIST003',
    region: 'East Region',
    monthlyCollection: 142000,
    yearlyCollection: 1650000,
    overdue: 32000
  },
  {
    id: '4',
    name: 'Lisa Distributor',
    code: 'DIST004',
    region: 'West Region',
    monthlyCollection: 118000,
    yearlyCollection: 1480000,
    overdue: 18000
  }
];

export function CollectionManagement() {
  const [distributors, setDistributors] = useState<DistributorCollection[]>(mockDistributorCollection);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editValues, setEditValues] = useState<{ 
    monthlyCollection: number; 
    yearlyCollection: number; 
    overdue: number 
  }>({
    monthlyCollection: 0,
    yearlyCollection: 0,
    overdue: 0
  });

  const filteredDistributors = distributors.filter(distributor =>
    distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (distributor: DistributorCollection) => {
    setEditingId(distributor.id);
    setEditValues({
      monthlyCollection: distributor.monthlyCollection,
      yearlyCollection: distributor.yearlyCollection,
      overdue: distributor.overdue
    });
  };

  const handleSave = (distributorId: string) => {
    setDistributors(prev => 
      prev.map(dist => 
        dist.id === distributorId 
          ? { 
              ...dist, 
              monthlyCollection: editValues.monthlyCollection,
              yearlyCollection: editValues.yearlyCollection,
              overdue: editValues.overdue
            }
          : dist
      )
    );
    setEditingId(null);
    console.log(`Updated collection for distributor ${distributorId}:`, editValues);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({ monthlyCollection: 0, yearlyCollection: 0, overdue: 0 });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Distributor Collection Report', 14, 22);
    
    const tableColumn = ['Distributor ID', 'Distributor Name', 'Region', 'Monthly Collection (₹)', 'Yearly Collection (₹)', 'Overdue (₹)'];
    const tableRows = filteredDistributors.map(distributor => [
      distributor.code,
      distributor.name,
      distributor.region,
      distributor.monthlyCollection.toLocaleString(),
      distributor.yearlyCollection.toLocaleString(),
      distributor.overdue.toLocaleString()
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save('distributor-collection-report.pdf');
  };

  const exportToExcel = () => {
    const exportData = filteredDistributors.map(distributor => ({
      'Distributor ID': distributor.code,
      'Distributor Name': distributor.name,
      'Region': distributor.region,
      'Monthly Collection (₹)': distributor.monthlyCollection,
      'Yearly Collection (₹)': distributor.yearlyCollection,
      'Overdue (₹)': distributor.overdue
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Collections');
    XLSX.writeFile(wb, 'distributor-collection-report.xlsx');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Distributor Collection Management</CardTitle>
          <div className="flex gap-2">
            <Button onClick={exportToPDF} variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={exportToExcel} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
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
              <TableHead>Monthly Collection (₹)</TableHead>
              <TableHead>Yearly Collection (₹)</TableHead>
              <TableHead>Overdue (₹)</TableHead>
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
                      value={editValues.monthlyCollection}
                      onChange={(e) => setEditValues(prev => ({ ...prev, monthlyCollection: Number(e.target.value) }))}
                      className="w-32"
                    />
                  ) : (
                    `₹${distributor.monthlyCollection.toLocaleString()}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === distributor.id ? (
                    <Input
                      type="number"
                      value={editValues.yearlyCollection}
                      onChange={(e) => setEditValues(prev => ({ ...prev, yearlyCollection: Number(e.target.value) }))}
                      className="w-32"
                    />
                  ) : (
                    `₹${distributor.yearlyCollection.toLocaleString()}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === distributor.id ? (
                    <Input
                      type="number"
                      value={editValues.overdue}
                      onChange={(e) => setEditValues(prev => ({ ...prev, overdue: Number(e.target.value) }))}
                      className="w-32"
                    />
                  ) : (
                    <span className="text-red-600">₹{distributor.overdue.toLocaleString()}</span>
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
