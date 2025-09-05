"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Client {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  client: Client | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  client: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user profile from users table
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();
          
          if (userData) {
            // Convert user data to client format
            const clientData: Client = {
              id: userData.id,
              userId: userData.auth_id,
              email: userData.email,
              firstName: userData.first_name,
              lastName: userData.last_name,
              phone: userData.phone,
              dateOfBirth: userData.date_of_birth,
              createdAt: userData.created_at
            };
            setClient(clientData);
          }
          
          if (userData?.role !== 'client') {
            // If not a client, sign out
            await supabase.auth.signOut();
            setUser(null);
            setClient(null);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        
        // Fetch user profile from users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();
        
        if (userData) {
          // Convert user data to client format
          const clientData: Client = {
            id: userData.id,
            userId: userData.auth_id,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            phone: userData.phone,
            dateOfBirth: userData.date_of_birth,
            createdAt: userData.created_at
          };
          setClient(clientData);
        }
      } else {
        setUser(null);
        setClient(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // Sign out of the local session (does not revoke other devices)
      await supabase.auth.signOut({ scope: 'local' as any });
    } catch (e) {
      console.warn('Supabase signOut error (non-fatal):', e);
    }

    // Hard clear any lingering Supabase auth tokens (defensive)
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (k.startsWith('sb-') && k.endsWith('-auth-token')) keysToRemove.push(k);
        if (k.startsWith('supabase.')) keysToRemove.push(k);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      sessionStorage.removeItem('redirectAfterLogin');
    } catch (e) {
      console.warn('Local/session storage clear failed (non-fatal):', e);
    }

    setUser(null);
    setClient(null);

    // Small delay allows onAuthStateChange listeners to settle before navigating
    setTimeout(() => {
      // Prefer sending user to login explicitly to avoid immediate auto-redirects
      router.push('/auth/login');
      // Force a refresh to ensure auth state is fully reset in all client components
      router.refresh();
    }, 50);
  };

  return (
    <AuthContext.Provider value={{ user, client, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
