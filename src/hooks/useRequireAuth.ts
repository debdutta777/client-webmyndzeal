"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const requireAuth = (callback: () => void, customRedirect?: string) => {
    if (!user && !loading) {
      // Store the intended destination
      sessionStorage.setItem('redirectAfterLogin', customRedirect || pathname || '/');
      router.push('/auth/login');
      return false;
    }
    
    if (user) {
      callback();
      return true;
    }
    
    return false;
  };

  const checkAuth = () => {
    return !!user;
  };

  return {
    requireAuth,
    checkAuth,
    isAuthenticated: !!user,
    loading
  };
}
