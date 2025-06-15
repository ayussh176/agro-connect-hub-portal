
export interface FirebaseUser {
  uid: string;
  name: string;
  email: string;
  role: 'distributor' | 'staff' | 'manager' | 'accountant';
  regionId: string;
  staffId?: string; // for distributor
  managerId?: string; // for staff
  contactInfo?: string;
}

export interface FirebaseProduct {
  id: string;
  name: string;
  formula: string;
  price: number;
  availability: 'In Stock' | 'Out of Stock' | 'Limited';
  dose: string;
}

export interface FirebaseScheme {
  id: string;
  title: string;
  imageUrl: string;
  uploadedBy: string; // staffId
  timestamp: number;
}

export interface FirebaseSales {
  id: string;
  distributorId: string;
  month: number;
  year: number;
  salesAmount: number;
  overdue: number;
  staffId: string;
  regionId: string;
}

export interface FirebaseCollection {
  id: string;
  distributorId: string;
  month: number;
  year: number;
  collectionAmount: number;
  staffId: string;
  regionId: string;
}
