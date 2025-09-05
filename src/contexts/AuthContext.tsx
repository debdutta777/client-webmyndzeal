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
    await supabase.auth.signOut();
    setUser(null);
    setClient(null);
    router.push('/');
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
