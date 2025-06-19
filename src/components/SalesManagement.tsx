import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Save, X, Search, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

interface DistributorSales {
  id: string;
  distributorName: string;
  DistributorId: string;
  region: string;
  monthlySales: number;
  yearlySales: number;
}

export function SalesManagement() {
  const { user } = useAuth();
  const [rows, setRows] = useState<DistributorSales[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ monthlySales: 0, yearlySales: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;
    async function load() {
      const snap = await getDocs(collection(db, 'sales'));
      const data: DistributorSales[] = [];
      snap.forEach(d => {
        const row = d.data() as any;
        if (user.role === 'distributor' && d.id === user.id) data.push({ id: d.id, ...row });
        else if ((user.role === 'staff' || user.role === 'manager') && row.region === user.region) data.push({ id: d.id, ...row });
        else if (user.role === 'accountant') data.push({ id: d.id, ...row });
      });
      setRows(data);
    }
    load();
  }, [user]);

  const save = async (id: string) => {
    await updateDoc(doc(db, 'sales', id), {
      monthlySales: editValues.monthlySales,
      yearlySales: editValues.yearlySales
    });
    setRows(current => current.map(r => r.id === id ? { ...r, monthlySales: editValues.monthlySales, yearlySales: editValues.yearlySales } : r));
    setEditingId(null);
  };

  const filtered = rows.filter(r =>
    r.region.includes(searchTerm) ||
    r.DistributorId.includes(searchTerm) ||
    r.distributorName.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2>Sales Management</h2>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => {
            const docp = new jsPDF();
            docp.autoTable([], {
              head: [['ID','Name','Region','Monthly','Yearly']],
              body: filtered.map(r => [r.DistributorId, r.distributorName, r.region, r.monthlySales, r.yearlySales])
            });
            docp.save('sales.pdf');
          }}><FileText />PDF</Button>
          <Button size="sm" onClick={() => {
            const ws = XLSX.utils.json_to_sheet(filtered);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sales');
            XLSX.writeFile(wb, 'sales.xlsx');
          }}><Download />Excel</Button>
        </div>
      </div>
      <div className="relative">
      <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Monthly Sales</TableHead>
            <TableHead>Yearly Sales</TableHead>
            {user.role === 'accountant' && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.DistributorId}</TableCell>
              <TableCell>{row.distributorName}</TableCell>
              <TableCell>{row.region}</TableCell>
              <TableCell>
                {editingId === row.id ? (
                  <Input type="number"
                    value={editValues.monthlySales}
                    onChange={e => setEditValues(ev => ({ ...ev, monthlySales: Number(e.target.value) }))}
                  />
                ) : `₹${row.monthlySales.toLocaleString()}`}
              </TableCell>
              <TableCell>
                {editingId === row.id ? (
                  <Input type="number"
                    value={editValues.yearlySales}
                    onChange={e => setEditValues(ev => ({ ...ev, yearlySales: Number(e.target.value) }))}
                  />
                ) : `₹${row.yearlySales.toLocaleString()}`}
              </TableCell>
              {user.role === 'accountant' && (
                <TableCell>
                  {editingId === row.id ? (
                    <>
                      <Button size="sm" onClick={() => save(row.id)}><Save /></Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}><X /></Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => {
                      setEditingId(row.id);
                      setEditValues({ monthlySales: row.monthlySales, yearlySales: row.yearlySales });
                    }}><Edit /></Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
