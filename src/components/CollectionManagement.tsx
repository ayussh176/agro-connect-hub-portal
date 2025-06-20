import React, { useEffect, useState } from 'react';
import {
  collection, getDocs, doc, updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Save, X, Search, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface DistributorCollection {
  id: string;
  name: string;
  distributorId: string;
  region: string;
  monthlyCollection: number;
  yearlyCollection: number;
  overdue: number;
}

export function CollectionManagement() {
  const { user } = useAuth();
  const [distributors, setDistributors] = useState<DistributorCollection[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editValues, setEditValues] = useState({
    monthlyCollection: 0,
    yearlyCollection: 0,
    overdue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'collection'));
        const result: DistributorCollection[] = [];
        querySnapshot.forEach(docSnap => {
          const data = docSnap.data();
          const id = docSnap.id;

          if (user?.role === 'accountant') {
            result.push({ id, ...data } as DistributorCollection);
          } else if (user?.role === 'staff' && data.region === user.region) {
            result.push({ id, ...data } as DistributorCollection);
          } else if (user?.role === 'distributor' && data.distributorId === user.id) {
            result.push({ id, ...data } as DistributorCollection);
          }
        });

        setDistributors(result);
      } catch (error) {
        console.error("❌ Error fetching collection data:", error);
      }
    };

    fetchData();
  }, [user]);

  const filteredDistributors = distributors.filter(distributor =>
    distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.distributorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleSave = async (id: string) => {
    try {
      await updateDoc(doc(db, 'collection', id), {
        monthlyCollection: editValues.monthlyCollection,
        yearlyCollection: editValues.yearlyCollection,
        overdue: editValues.overdue
      });

      setDistributors(prev =>
        prev.map(dist =>
          dist.id === id ? { ...dist, ...editValues } : dist
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("❌ Error saving collection data:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({ monthlyCollection: 0, yearlyCollection: 0, overdue: 0 });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Distributor Collection Report', 14, 22);

    const tableColumn = ['Distributor ID', 'Name', 'Region', 'Monthly (₹)', 'Yearly (₹)', 'Overdue (₹)'];
    const tableRows = filteredDistributors.map(d => [
      d.distributorId,
      d.name,
      d.region,
      d.monthlyCollection?.toLocaleString() ?? '0',
      d.yearlyCollection?.toLocaleString() ?? '0',
      d.overdue?.toLocaleString() ?? '0'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30
    });

    doc.save('distributor-collection-report.pdf');
  };

  const exportToExcel = () => {
    const exportData = filteredDistributors.map(d => ({
      'Distributor ID': d.distributorId,
      'Distributor Name': d.name,
      'Region': d.region,
      'Monthly Collection (₹)': d.monthlyCollection,
      'Yearly Collection (₹)': d.yearlyCollection,
      'Overdue (₹)': d.overdue
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Collection');
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
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Monthly (₹)</TableHead>
              <TableHead>Yearly (₹)</TableHead>
              <TableHead>Overdue (₹)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDistributors.map(d => (
              <TableRow key={d.id}>
                <TableCell>{d.distributorId}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.region}</TableCell>
                <TableCell>
                  {editingId === d.id ? (
                    <Input
                      type="number"
                      value={editValues.monthlyCollection}
                      onChange={(e) => setEditValues(prev => ({ ...prev, monthlyCollection: Number(e.target.value) }))}
                      className="w-32"
                    />
                  ) : (
                    `₹${(d.monthlyCollection ?? 0).toLocaleString()}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === d.id ? (
                    <Input
                      type="number"
                      value={editValues.yearlyCollection}
                      onChange={(e) => setEditValues(prev => ({ ...prev, yearlyCollection: Number(e.target.value) }))}
                      className="w-32"
                    />
                  ) : (
                    `₹${(d.yearlyCollection ?? 0).toLocaleString()}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === d.id ? (
                    <Input
                      type="number"
                      value={editValues.overdue}
                      onChange={(e) => setEditValues(prev => ({ ...prev, overdue: Number(e.target.value) }))}
                      className="w-32"
                    />
                  ) : (
                    <span className="text-red-600">₹{(d.overdue ?? 0).toLocaleString()}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === d.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(d.id)}><Save className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}><X className="h-4 w-4" /></Button>
                    </div>
                  ) : (
                    user?.role === 'accountant' && (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(d)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredDistributors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No distributors found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
