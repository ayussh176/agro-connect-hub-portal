
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Distributor {
  id: string;
  name: string;
  code: string;
  monthlySales: number;
  yearlySales: number;
  monthlyCollection?: number;
  yearlyCollection?: number;
}

interface DistributorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  distributors: Distributor[];
  title: string;
  showCollection?: boolean;
}

export function DistributorsModal({ 
  isOpen, 
  onClose, 
  distributors, 
  title, 
  showCollection = false 
}: DistributorsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Monthly Sales (₹)</TableHead>
                <TableHead>Yearly Sales (₹)</TableHead>
                {showCollection && (
                  <>
                    <TableHead>Monthly Collection (₹)</TableHead>
                    <TableHead>Yearly Collection (₹)</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributors.map((distributor) => (
                <TableRow key={distributor.id}>
                  <TableCell className="font-medium">{distributor.code}</TableCell>
                  <TableCell>{distributor.name}</TableCell>
                  <TableCell>₹{distributor.monthlySales.toLocaleString()}</TableCell>
                  <TableCell>₹{distributor.yearlySales.toLocaleString()}</TableCell>
                  {showCollection && (
                    <>
                      <TableCell>₹{distributor.monthlyCollection?.toLocaleString()}</TableCell>
                      <TableCell>₹{distributor.yearlyCollection?.toLocaleString()}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
