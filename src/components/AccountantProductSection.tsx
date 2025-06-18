import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Search, ChevronDown, ChevronUp, Save, Download, FileText, Filter
} from 'lucide-react';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger
} from '@/components/ui/collapsible';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  collection, onSnapshot, updateDoc, doc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types/product';

export function AccountantProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [editingAvailability, setEditingAvailability] = useState<string | null>(null);
  const [availabilityDraft, setAvailabilityDraft] = useState<Record<string, string>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productList: Product[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productList);
    });

    return () => unsub();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.chemicalFormula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'In Stock': return 'bg-green-500';
      case 'Limited': return 'bg-yellow-500';
      case 'Out of Stock': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAvailabilityUpdate = async (productId: string) => {
    const newAvailability = availabilityDraft[productId];
    if (!newAvailability) return;
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { availability: newAvailability });
      setEditingAvailability(null);
      setAvailabilityDraft(prev => ({ ...prev, [productId]: '' }));
      console.log(`Availability updated for ${productId} to ${newAvailability}`);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Products Report', 14, 22);
    const tableColumn = ['Product Name', 'Chemical Formula', 'Price (₹)'];
    const tableRows = filteredProducts.map(product => [
      product.name, product.chemicalFormula, product.price.toString()
    ]);
    (doc as any).autoTable({ head: [tableColumn], body: tableRows, startY: 30 });
    doc.save('products-report.pdf');
  };

  const exportToExcel = () => {
    const exportData = filteredProducts.map(product => ({
      'Product Name': product.name,
      'Chemical Formula': product.chemicalFormula,
      'Price (₹)': product.price
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'products-report.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage product availability and view pricing information</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToPDF} variant="outline">
            <FileText className="h-4 w-4 mr-2" /> Export PDF
          </Button>
          <Button onClick={exportToExcel} variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export Excel
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by product name or chemical formula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Insecticide">Insecticide</SelectItem>
              <SelectItem value="Fungicide">Fungicide</SelectItem>
              <SelectItem value="Herbicide">Herbicide</SelectItem>
              <SelectItem value="Growth Regulator">PGR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <Collapsible
              open={expandedProduct === product.id}
              onOpenChange={() =>
                setExpandedProduct(expandedProduct === product.id ? null : product.id)
              }
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>{product.chemicalFormula}</CardDescription>
                      </div>
                      <Badge variant="secondary">{product.category}</Badge>
                      <Badge className={getAvailabilityColor(product.availability)}>
                        {product.availability}
                      </Badge>
                    </div>
                    {expandedProduct === product.id ?
                      <ChevronUp className="h-4 w-4" /> :
                      <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-600">Price</h4>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{product.price}
                      </span>
                      <p className="text-sm text-gray-500">per unit (read-only)</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-600">Availability</h4>
                      {editingAvailability === product.id ? (
                        <div className="flex items-center space-x-2">
                          <Select
                            value={availabilityDraft[product.id] ?? product.availability}
                            onValueChange={(value) =>
                              setAvailabilityDraft(prev => ({ ...prev, [product.id]: value }))
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Choose availability" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="In Stock">In Stock</SelectItem>
                              <SelectItem value="Limited">Limited</SelectItem>
                              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                            </SelectContent>
                          </Select>
                          {availabilityDraft[product.id] &&
                            availabilityDraft[product.id] !== product.availability && (
                              <Button size="sm" onClick={() => handleAvailabilityUpdate(product.id)}>
                                <Save className="h-4 w-4 mr-1" /> Save
                              </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Badge className={getAvailabilityColor(product.availability)}>
                            {product.availability}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingAvailability(product.id);
                              setAvailabilityDraft(prev => ({
                                ...prev,
                                [product.id]: product.availability
                              }));
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      )}
                      <p className="text-sm text-gray-500">Current stock status</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-600">Recommended Dose</h4>
                      <p className="text-lg font-medium">{product.dose}</p>
                      <p className="text-sm text-gray-500">Application rate</p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No products found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
