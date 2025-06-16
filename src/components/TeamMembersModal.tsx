
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  monthlySales: number;
  monthlyCollection: number;
}

interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
}

export function TeamMembersModal({ isOpen, onClose, teamMembers }: TeamMembersModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Team Members</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 mt-4">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="secondary">{member.role}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Sales</p>
                    <p className="text-xl font-semibold text-green-600">
                      ₹{member.monthlySales.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Collection</p>
                    <p className="text-xl font-semibold text-blue-600">
                      ₹{member.monthlyCollection.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
