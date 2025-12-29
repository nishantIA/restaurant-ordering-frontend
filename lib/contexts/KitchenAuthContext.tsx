'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface KitchenAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const KitchenAuthContext = createContext<KitchenAuthContextValue | null>(null);

const KITCHEN_PASSWORD = process.env.NEXT_PUBLIC_KITCHEN_PASSWORD || 'kitchen123';

//  Helper function to check auth (outside component)
function checkAuthentication(): boolean {
  if (typeof window === 'undefined') return false;
  
  const authStatus = localStorage.getItem('kitchen_auth');
  const authTime = localStorage.getItem('kitchen_auth_time');
  
  if (authStatus !== 'true' || !authTime) return false;
  
  const elapsed = Date.now() - parseInt(authTime);
  const twentyFourHours = 24 * 60 * 60 * 1000;
  
  if (elapsed >= twentyFourHours) {
    // Session expired, clean up
    localStorage.removeItem('kitchen_auth');
    localStorage.removeItem('kitchen_auth_time');
    return false;
  }
  
  return true;
}

export function KitchenAuthProvider({ children }: { children: ReactNode }) {
  //  Lazy initialization - check auth on initial render only
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuthentication());
  const [isLoading] = useState(false); // No loading needed with lazy init
  const router = useRouter();

  //  Only handle redirect in useEffect (no setState!)
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/kitchen/login');
    }
  }, [isAuthenticated, router]);

  const login = (password: string): boolean => {
    if (password === KITCHEN_PASSWORD) {
      localStorage.setItem('kitchen_auth', 'true');
      localStorage.setItem('kitchen_auth_time', Date.now().toString());
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('kitchen_auth');
    localStorage.removeItem('kitchen_auth_time');
    setIsAuthenticated(false);
    router.push('/kitchen/login');
  };

  return (
    <KitchenAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </KitchenAuthContext.Provider>
  );
}

export function useKitchenAuth() {
  const context = useContext(KitchenAuthContext);
  if (!context) {
    throw new Error('useKitchenAuth must be used within KitchenAuthProvider');
  }
  return context;
}