import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Scheme } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext'; // ✅ Added to get logged-in user

interface SchemeManagementProps {
  schemes: Scheme[];
}

export function SchemeManagement({ schemes }: SchemeManagementProps) {
  const [isAddingScheme, setIsAddingScheme] = useState(false);
  const [newScheme, setNewScheme] = useState<Omit<Scheme, 'id'>>({
    title: '',
    description: '',
    imageUrl: '',
    validFrom: '',
    validTo: '',
    createdBy: ''
  });

  const { toast } = useToast();
  const { user } = useAuth(); // ✅ Get logged-in user

  const handleAddScheme = async () => {
    const { title, description, validFrom, validTo } = newScheme;
    if (!title || !description || !validFrom || !validTo) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const schemeToAdd = {
        ...newScheme,
        createdBy: user?.role === 'manager' ? (user.name || 'manager') : 'Unknown'

      };

      await addDoc(collection(db, 'scheme'), schemeToAdd);

      setNewScheme({
        title: '',
        description: '',
        imageUrl: '',
        validFrom: '',
        validTo: '',
        createdBy: ''
      });

      setIsAddingScheme(false);
      toast({ title: "Success", description: "Scheme added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add scheme", variant: "destructive" });
    }
  };

  const handleRemoveScheme = async (schemeId: string) => {
    if (!window.confirm('Are you sure you want to remove this scheme?')) return;
    try {
      await deleteDoc(doc(db, 'scheme', schemeId));
      toast({ title: "Success", description: "Scheme removed successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove scheme", variant: "destructive" });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const mockUrl = `https://example.com/schemes/${file.name}`;
      setNewScheme({ ...newScheme, imageUrl: mockUrl });
      toast({ title: "Image uploaded", description: "Scheme image has been uploaded successfully" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Manage Schemes</h3>
        <Button onClick={() => setIsAddingScheme(true)} disabled={isAddingScheme}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Scheme
        </Button>
      </div>

      {isAddingScheme && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Scheme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Scheme Title *</Label>
              <Input
                id="title"
                value={newScheme.title}
                onChange={(e) => setNewScheme({ ...newScheme, title: e.target.value })}
                placeholder="Enter scheme title"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newScheme.description}
                onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                placeholder="Enter scheme description"
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="image">Scheme Image</Label>
              <div className="flex items-center space-x-2">
                <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
                <Upload className="h-4 w-4 text-gray-500" />
              </div>
              {newScheme.imageUrl && <p className="text-sm text-green-600 mt-1">Image uploaded successfully</p>}
            </div>

            {/* Valid Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={newScheme.validFrom}
                  onChange={(e) => setNewScheme({ ...newScheme, validFrom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="validTo">Valid To *</Label>
                <Input
                  id="validTo"
                  type="date"
                  value={newScheme.validTo}
                  onChange={(e) => setNewScheme({ ...newScheme, validTo: e.target.value })}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-2">
              <Button onClick={handleAddScheme}>Add Scheme</Button>
              <Button variant="outline" onClick={() => setIsAddingScheme(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Schemes List */}
      <div className="grid gap-4">
        {schemes.map((scheme) => (
          <Card key={scheme.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{scheme.title}</h4>
                  <p className="text-gray-600 mt-1">{scheme.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Valid: {scheme.validFrom} to {scheme.validTo}</span>
                    <span>Created by: {scheme.createdBy}</span>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleRemoveScheme(scheme.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
