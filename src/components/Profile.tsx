
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, Shield, Users } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <div>No user information available</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Your account information and details.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg">{user.name}</p>
            </div>
            {/* <div>
              <label className="text-sm font-medium text-gray-500">Username</label>
              <p className="text-lg">{user.username}</p>
            </div> */}
            <div>
              <label className="text-sm font-medium text-gray-500">User ID</label>
              <p className="text-lg">{user.id}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role & Location</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="text-lg capitalize">{user.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Region</label>
              <p className="text-lg">{user.region}</p>
            </div>
            {/* {user.territory && (
              <div>
                <label className="text-sm font-medium text-gray-500">Territory</label>
                <p className="text-lg">{user.territory}</p>
              </div>
            )} */}
          </CardContent>
        </Card>

        {(user.managerId || user.staffId) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reporting Structure</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              {user.managerId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Manager ID</label>
                  <p className="text-lg">{user.managerId}</p>
                </div>
              )}
              {user.staffId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Staff ID</label>
                  <p className="text-lg">{user.staffId}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className="text-lg text-green-600">Active</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Login</label>
              <p className="text-lg">Today</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
