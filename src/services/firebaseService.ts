
import { 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  User as FirebaseAuthUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { FirebaseUser, FirebaseProduct, FirebaseScheme, FirebaseSales, FirebaseCollection } from '@/types/firebase';

// Authentication
export const loginUser = async (email: string, password: string): Promise<FirebaseUser | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (userDoc.exists()) {
      return { uid: userCredential.user.uid, ...userDoc.data() } as FirebaseUser;
    }
    return null;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// Products
export const getProducts = async (): Promise<FirebaseProduct[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseProduct));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const updateProductPrice = async (productId: string, price: number): Promise<void> => {
  try {
    await updateDoc(doc(db, 'products', productId), { price });
  } catch (error) {
    console.error('Error updating product price:', error);
    throw error;
  }
};

// Schemes
export const getSchemes = async (): Promise<FirebaseScheme[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'schemes'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseScheme));
  } catch (error) {
    console.error('Error fetching schemes:', error);
    return [];
  }
};

export const addScheme = async (scheme: Omit<FirebaseScheme, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'schemes'), scheme);
    return docRef.id;
  } catch (error) {
    console.error('Error adding scheme:', error);
    throw error;
  }
};

export const deleteScheme = async (schemeId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'schemes', schemeId));
  } catch (error) {
    console.error('Error deleting scheme:', error);
    throw error;
  }
};

// Sales
export const getSalesByDistributor = async (distributorId: string): Promise<FirebaseSales[]> => {
  try {
    const q = query(collection(db, 'sales'), where('distributorId', '==', distributorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseSales));
  } catch (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
};

export const getAllSales = async (): Promise<FirebaseSales[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'sales'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseSales));
  } catch (error) {
    console.error('Error fetching all sales:', error);
    return [];
  }
};

export const updateSales = async (salesId: string, salesData: Partial<FirebaseSales>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'sales', salesId), salesData);
  } catch (error) {
    console.error('Error updating sales:', error);
    throw error;
  }
};

// Collections
export const getCollectionsByDistributor = async (distributorId: string): Promise<FirebaseCollection[]> => {
  try {
    const q = query(collection(db, 'collections'), where('distributorId', '==', distributorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseCollection));
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};

export const getAllCollections = async (): Promise<FirebaseCollection[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'collections'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseCollection));
  } catch (error) {
    console.error('Error fetching all collections:', error);
    return [];
  }
};

export const updateCollection = async (collectionId: string, collectionData: Partial<FirebaseCollection>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'collections', collectionId), collectionData);
  } catch (error) {
    console.error('Error updating collection:', error);
    throw error;
  }
};

// Users
export const getUserById = async (userId: string): Promise<FirebaseUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { uid: userId, ...userDoc.data() } as FirebaseUser;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
