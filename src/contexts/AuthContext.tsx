import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AppUser {
  id: string;
  username: string;
  role: string;
  name: string;
  region?: string;
  staffId?: string;
  territory?: string;
  managerId?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

interface AuthContextType {
  user: AppUser | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserDetails = async (firebaseUser: FirebaseUser): Promise<AppUser | null> => {
    const docRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: firebaseUser.uid,
        ...docSnap.data(),
      } as AppUser;
    } else {
      console.warn("User document not found");
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        const userDetails = await fetchUserDetails(firebaseUser);
        if (userDetails) {
          setUser(userDetails);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const userDetails = await fetchUserDetails(result.user);

      if (userDetails?.role === credentials.role) {
        setUser(userDetails);
        return true;
      } else {
        await signOut(auth); // invalid role
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
