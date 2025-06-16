
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ManagerDistributor {
  id: string;
  name: string;
  code: string;
  monthlySales: number;
  yearlySales: number;
  monthlyCollection: number;
  yearlyCollection: number;
  overdue: number;
}

interface ManagerDistributorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  distributors: ManagerDistributor[];
  title: string;
  showYearly?: boolean;
}

export function ManagerDistributorsModal({ 
  isOpen, 
  onClose, 
  distributors, 
  title,
  showYearly = false
}: ManagerDistributorsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Distributor ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>{showYearly ? 'Yearly Sales (₹)' : 'Monthly Sales (₹)'}</TableHead>
                <TableHead>{showYearly ? 'Yearly Collection (₹)' : 'Monthly Collection (₹)'}</TableHead>
                <TableHead>Overdue (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributors.map((distributor) => (
                <TableRow key={distributor.id}>
                  <TableCell className="font-medium">{distributor.code}</TableCell>
                  <TableCell>{distributor.name}</TableCell>
                  <TableCell>₹{(showYearly ? distributor.yearlySales : distributor.monthlySales).toLocaleString()}</TableCell>
                  <TableCell>₹{(showYearly ? distributor.yearlyCollection : distributor.monthlyCollection).toLocaleString()}</TableCell>
                  <TableCell>₹{distributor.overdue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
