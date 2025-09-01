"use client";
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

type AccountType = 'individual' | 'business' | 'school';

export default function RegisterPage() {
  const [type, setType] = useState<AccountType>('individual');
  // common
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // individual
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  // business
  const [company, setCompany] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  // school
  const [schoolName, setSchoolName] = useState('');
  const [board, setBoard] = useState('');
  const [students, setStudents] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordScore = useMemo(() => {
    // Simple heuristic: length + variety
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 5);
  }, [password]);

  const isValid = useMemo(() => {
    if (!name || !email || !password || !confirm) return false;
    if (password !== confirm) return false;
    if (type === 'individual') {
      if (!phone || !dob) return false;
    } else if (type === 'business') {
      if (!company || !companySize || !workEmail) return false;
    } else if (type === 'school') {
      if (!schoolName || !board || !students) return false;
    }
    return true;
  }, [name, email, password, confirm, type, phone, dob, company, companySize, workEmail, schoolName, board, students]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValid) {
      setError('Please fill all required fields correctly');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F0F7FC] to-[#8BA872]/15" />
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#8BA872]/25 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#B7E3FF]/35 blur-3xl" />

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-2xl">
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-white/60 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2D3319]">Create your account</h1>
              <p className="text-sm text-gray-600">Join MyndZeal to manage bookings and preferences</p>
            </div>

            {/* Account type toggle */}
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-2 bg-[#F4FAF2] p-1 rounded-2xl border border-[#8BA872]/20">
                {([
                  { k: 'individual', label: 'Individual' },
                  { k: 'business', label: 'Business' },
                  { k: 'school', label: 'School' },
                ] as { k: AccountType; label: string }[]).map(opt => (
                  <button
                    key={opt.k}
                    type="button"
                    onClick={() => setType(opt.k)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${type === opt.k ? 'bg-gradient-to-r from-[#8BA872] to-[#7A9C61] text-white shadow' : 'text-[#2D3319] hover:bg-white'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {success ? (
              <div className="p-4 rounded-xl bg-green-50 text-green-800 text-sm">Account created (UI-only). Connect to your auth backend next.</div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm text-gray-700">Full name</span>
                    <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20" placeholder="Jane Doe" required />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-700">Email</span>
                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20" placeholder="you@example.com" required />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-700">Password</span>
                    <div className="relative mt-1">
                      <input type={showPass ? 'text' : 'password'} value={password} onChange={(e)=>setPassword(e.target.value)} className="block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 pr-12 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20" placeholder="••••••••" required />
                      <button type="button" onClick={()=>setShowPass(v=>!v)} className="absolute inset-y-0 right-2 my-auto flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:text-[#2D3319] focus:outline-none focus:ring-2 focus:ring-[#8BA872]/30" aria-label={showPass ? 'Hide password' : 'Show password'} title={showPass ? 'Hide password' : 'Show password'}>
                        {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {/* Password strength meter */}
                    <div className="mt-2">
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-2 ${passwordScore<=2?'bg-red-400':passwordScore===3?'bg-yellow-400':'bg-green-500'}`} style={{ width: `${(passwordScore/5)*100}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-gray-600">Strength: {passwordScore<=2?'Weak':passwordScore===3?'Medium':'Strong'}</p>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-700">Confirm password</span>
                    <div className="relative mt-1">
                      <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 pr-12 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20" placeholder="••••••••" required />
                      <button type="button" onClick={()=>setShowConfirm(v=>!v)} className="absolute inset-y-0 right-2 my-auto flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:text-[#2D3319] focus:outline-none focus:ring-2 focus:ring-[#8BA872]/30" aria-label={showConfirm ? 'Hide password' : 'Show password'} title={showConfirm ? 'Hide password' : 'Show password'}>
                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </label>
                </div>

                {/* Individual fields */}
        {type === 'individual' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm text-gray-700">Phone</span>
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20" placeholder="+91 98765 43210" required />
                    </label>
                    <label className="block">
          <span className="text-sm text-gray-700">Date of birth</span>
          <input type="date" value={dob} onChange={(e)=>setDob(e.target.value)} className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20" required />
                    </label>
                  </div>
                )}

                {/* Business fields */}
                {type === 'business' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm text-gray-700">Company name</span>
                      <input value={company} onChange={(e)=>setCompany(e.target.value)} className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20" placeholder="Acme Corp" required />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-700">Company size</span>
                      <select value={companySize} onChange={(e)=>setCompanySize(e.target.value)} className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 text-black focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20" required>
                        <option value="">Select</option>
                        <option value="1-50">1-50</option>
                        <option value="51-200">51-200</option>
                        <option value="201-1000">201-1000</option>
                        <option value=">1000">&gt; 1000</option>
                      </select>
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-sm text-gray-700">Work email</span>
                      <input type="email" value={workEmail} onChange={(e)=>setWorkEmail(e.target.value)} className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20" placeholder="john@acme.com" required />
                    </label>
                  </div>
                )}

                {/* School fields */}
                {type === 'school' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm text-gray-700">School name</span>
                      <input value={schoolName} onChange={(e)=>setSchoolName(e.target.value)} className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20" placeholder="Riverside High" required />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-700">Board</span>
                      <input value={board} onChange={(e)=>setBoard(e.target.value)} className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20" placeholder="CBSE / ICSE / State" required />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-sm text-gray-700">Number of students</span>
                      <input value={students} onChange={(e)=>setStudents(e.target.value)} className="mt-1 block w-full rounded-xl border-2 border-gray-200 bg-white/90 px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20" placeholder="e.g., 1200" required />
                    </label>
                  </div>
                )}

                {error && <div className="text-sm text-red-600">{error}</div>}

                <button type="submit" disabled={loading} className="w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-[#7A9C61] to-[#8BA872] text-white px-4 py-3 rounded-2xl font-semibold shadow hover:shadow-md transition disabled:opacity-70">{loading ? 'Creating…' : 'Create account'}</button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span>Already have an account?</span>
                  <Link href="/auth/login" className="text-[#8BA872] font-semibold">Sign in</Link>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
