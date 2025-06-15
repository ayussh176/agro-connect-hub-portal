
export interface Product {
  id: string;
  name: string;
  chemicalFormula: string;
  price: number;
  availability: 'In Stock' | 'Out of Stock' | 'Limited';
  dose: string;
  category: string;
}

export interface Scheme {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  validFrom: string;
  validTo: string;
  createdBy: string;
}
