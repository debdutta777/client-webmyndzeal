"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type AccountType = 'individual' | 'business' | 'school';

export default function LoginPage() {
  const [type, setType] = useState<AccountType>('individual');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [orgCode, setOrgCode] = useState(''); // business/school optional code
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectTo);
    }
  }, [user, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!email || !password) {
      return setError('Please fill both email and password');
    }
    
    if ((type === 'business' || type === 'school') && orgCode && orgCode.trim().length < 4) {
      return setError('Organization code must be at least 4 characters');
    }
    
    setLoading(true);
    
    try {
      // Sign in with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) {
        setError(authError.message);
        return;
      }
      
      if (data?.user) {
        // Check if user is a client
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('auth_id', data.user.id)
          .single();
        
        if (userData?.role !== 'client') {
          await supabase.auth.signOut();
          setError('This login is for clients only. Providers should use the provider portal.');
          return;
        }
        
        
        // Get redirect destination from session storage
        const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
        sessionStorage.removeItem('redirectAfterLogin');
        
        // Redirect to intended destination
        router.push(redirectTo);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0F7FC] via-[#C8E8F5] to-[#8BA872]/20" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#8BA872]/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#B7E3FF]/30 blur-3xl"
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
        >
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-white/60 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2D3319]">Welcome back</h1>
              <p className="text-sm text-gray-600">Sign in to access your MyndZeal account</p>
            </div>

            {/* Account type toggle */}
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-2 bg-[#F4FAF2] p-1 rounded-2xl border border-[#8BA872]/20">
                {(
                  [
                    { k: 'individual', label: 'Individual' },
                    { k: 'business', label: 'Business' },
                    { k: 'school', label: 'School' },
                  ] as { k: AccountType; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.k}
                    type="button"
                    onClick={() => setType(opt.k)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                      type === opt.k
                        ? 'bg-gradient-to-r from-[#8BA872] to-[#7A9C61] text-white shadow'
                        : 'text-[#2D3319] hover:bg-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
                  <span className="text-sm text-gray-700">{type === 'business' ? 'Work email' : type === 'school' ? 'Institution email' : 'Email'}</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20"
                    placeholder="you@gmail.com"
                    required
                  />
                </label>

                {(type === 'business' || type === 'school') && (
                  <label className="block">
                    <span className="text-sm text-gray-700">{type === 'business' ? 'Organization code / domain (optional)' : 'School code / domain (optional)'}</span>
                    <input
                      value={orgCode}
                      onChange={(e) => setOrgCode(e.target.value)}
                      className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20"
                      placeholder={type === 'business' ? 'e.g., ACME-IND' : 'e.g., RIVERDALE-HS'}
                    />
                  </label>
                )}

                <label className="block">
                  <span className="text-sm text-gray-700">Password</span>
                  <div className="relative mt-1">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 pr-12 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v=>!v)}
                      className="absolute inset-y-0 right-2 my-auto flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:text-[#2D3319] focus:outline-none focus:ring-2 focus:ring-[#8BA872]/30"
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                      title={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </label>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} className="rounded border-gray-300" />
                    Remember me
                  </label>
                  <Link href="#" className="text-sm text-[#8BA872] font-semibold">Forgot password?</Link>
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <button
                  type="submit"
                  className="w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-[#8BA872] to-[#7A9C61] text-white px-4 py-3 rounded-2xl font-semibold shadow hover:shadow-md transition disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span>New to MyndZeal?</span>
                  <Link href="/auth/register" className="text-[#8BA872] font-semibold">Create an account</Link>
                </div>
              </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
