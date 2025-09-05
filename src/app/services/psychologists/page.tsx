"use client";
import { useState, useMemo } from 'react';
import { Star, Award, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PsychologistProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  qualifications?: string;
  experience_years?: number;
  rating?: number;
  bio?: string;
  is_verified?: boolean;
  specialties?: string[];
}

export default function PsychologistsServicePage() {
  const [profiles] = useState<PsychologistProfile[]>([]);
  const [query, setQuery] = useState('');
  const [minRating, setMinRating] = useState<number>(0);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [specialization, setSpecialization] = useState('');
  const [language, setLanguage] = useState('');
  const [slotPricing] = useState<Record<string, number | null>>({});

  const filtered = useMemo(() => {
    return profiles.filter(p => {
      const name = `${p.first_name||''} ${p.last_name||''}`.toLowerCase();
      const specText = (p.specialties||[]).join(' ').toLowerCase();
      const body = p.bio?.toLowerCase() || '';
      const qual = p.qualifications?.toLowerCase() || '';
      const q = query.toLowerCase();
      if (query.trim()) {
        const matchesQuery = [name, specText, body, qual].some(f => f.includes(q));
        if (!matchesQuery) return false;
      }
      if (specialization.trim()) {
        const sp = specialization.toLowerCase();
        if (!specText.includes(sp)) return false;
      }
      if (minRating > 0 && (p.rating || 0) < minRating) return false;
      if (minExperience > 0 && (p.experience_years || 0) < minExperience) return false;
      if (language.trim()) {
        const langs: string[] = [];
        if (!langs.some((l: string) => l.includes(language.toLowerCase()))) return false;
      }
      return true;
    });
  }, [profiles, query, specialization, minRating, minExperience, language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4FAF2] to-[#E8F4F8] pb-16">
        <div className="relative overflow-hidden pt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8BA872]/5 to-transparent"></div>
          <div className="container mx-auto px-6 py-16 relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-[#8BA872]/20 mb-6">
                <span className="text-[#8BA872] font-semibold text-sm">Professional Mental Health Services</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Our <span className="text-[#8BA872]">Psychologists</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Connect with qualified psychologists who specialize in evidence-based therapeutic approaches.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-6xl mx-auto mb-12"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Search Psychologist</label>
                  <input 
                    placeholder="Search name, specialty, approach..." 
                    value={query} 
                    onChange={e=>setQuery(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20 outline-none transition-all duration-300 bg-white/90"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Specialization</label>
                  <input 
                    placeholder="Filter by specialization" 
                    value={specialization} 
                    onChange={e=>setSpecialization(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20 outline-none transition-all duration-300 bg-white/90"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Language</label>
                  <input 
                    placeholder="Preferred language" 
                    value={language} 
                    onChange={e=>setLanguage(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20 outline-none transition-all duration-300 bg-white/90"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Minimum Rating</label>
                  <input 
                    type="number" 
                    min={0} 
                    max={5}
                    step={0.1}
                    placeholder="Min rating" 
                    value={minRating||''} 
                    onChange={e=>setMinRating(Number(e.target.value)||0)} 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20 outline-none transition-all duration-300 bg-white/90"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Experience (Years)</label>
                  <input 
                    type="number" 
                    min={0} 
                    placeholder="Min experience" 
                    value={minExperience||''} 
                    onChange={e=>setMinExperience(Number(e.target.value)||0)} 
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8BA872] focus:ring-2 focus:ring-[#8BA872]/20 outline-none transition-all duration-300 bg-white/90"
                  />
                </div>
                <div className="flex items-end">
                  <div className="w-full bg-gradient-to-r from-[#8BA872]/10 to-[#73905B]/10 rounded-xl p-3 border border-[#8BA872]/20">
                    <div className="flex items-center justify-center">
                      <Filter className="w-5 h-5 text-[#8BA872] mr-2" />
                      <span className="font-semibold text-[#8BA872]">{filtered.length} results found</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => {
            const fullName = `${p.first_name||''} ${p.last_name||''}`.trim() || 'Psychologist';
            const firstBioLine = p.bio ? p.bio.split(/\r?\n/)[0] : '';
            return (
              <div
                key={p.id}
                className="relative group bg-white/90 backdrop-blur rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:-translate-y-1 animate-[fadeIn_.6s_ease]"
                style={{ animationDelay: `${Math.random() * 0.25}s` }}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8BA872] via-[#466536] to-[#8BA872] opacity-70" />
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl mb-3 ring-2 ring-white shadow-inner group-hover:scale-105 transition-transform">
                    {p.profile_image_url ? (
                      <Image 
                        src={p.profile_image_url} 
                        alt={fullName} 
                        width={96} 
                        height={96} 
                        className="object-cover w-full h-full" 
                      />
                    ) : <span>🧠</span>}
                  </div>
                  <a href={`/psychologists/${p.id}`} className="text-lg font-semibold text-[#2F3E25] flex items-center gap-2 hover:underline">{fullName}{p.is_verified && <Award className="w-4 h-4 text-[#8BA872]" />}</a>
                  <div className="mt-2 w-full flex flex-wrap justify-center gap-2">
                    {typeof p.experience_years === 'number' && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full shadow-sm text-[11px] whitespace-nowrap">
                        {p.experience_years} yrs exp
                      </span>
                    )}
                    {p.qualifications && (() => {
                      const parts = p.qualifications.split(/[,;\n]/).map(q => q.trim()).filter(Boolean);
                      const display = parts.slice(0, 2);
                      const extra = parts.length - display.length;
                      return (
                        <>
                          {display.map(q => (
                            <span key={q} className="px-2 py-0.5 bg-[#8BA872]/10 text-[#466536] rounded-full shadow-sm text-[11px] max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap" title={q}>{q}</span>
                          ))}
                          {extra > 0 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px]" title={parts.slice(2).join(', ')}>+{extra} more</span>
                          )}
                        </>
                      );
                    })()}
                    {p.specialties && p.specialties.length > 0 && (
                      <>
                        {p.specialties.slice(0, 2).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full shadow-sm text-[11px] max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap" title={s}>{s}</span>
                        ))}
                        {p.specialties.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px]" title={p.specialties.slice(2).join(', ')}>+{p.specialties.length - 2} more</span>
                        )}
                      </>
                    )}
                  </div>
                  {firstBioLine && (
                    <p className="mt-3 text-sm text-gray-700 w-full line-clamp-1 leading-snug" title={firstBioLine}>
                      {firstBioLine}
                    </p>
                  )}
                </div>
                <div className="mt-auto flex items-center justify-between px-5 pb-4 pt-3 border-t border-gray-100 gap-3 bg-gradient-to-b from-transparent to-[#F4FAF2]/40">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center text-[#8BA872] text-sm font-medium mb-1 drop-shadow-sm">
                      <Star className="w-4 h-4 mr-1 fill-current" />{(p.rating||0).toFixed(1)}
                    </div>
                    {slotPricing[p.id] ? (
                      <span className="text-[11px] text-gray-500">From ₹{slotPricing[p.id]}</span>
                    ) : (
                      <span className="text-[11px] text-gray-500">{p.experience_years || 0} years experience</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-stretch w-1/2">
                    <button
                      className="relative overflow-hidden inline-flex justify-center items-center gap-2 bg-[#8BA872] text-white text-xs font-medium px-3 py-2 rounded-full shadow hover:shadow-md transition group/book"
                      onClick={() => { window.location.href = `/providers/${p.id}/slots`; }}
                    >
                      <span className="relative z-10">Book</span>
                    </button>
                    <a
                      href={`/psychologists/${p.id}`}
                      className="inline-flex justify-center items-center gap-2 bg-white/70 border border-[#8BA872] text-[#466536] text-xs font-medium px-3 py-2 rounded-full hover:bg-[#F4FAF2] transition shadow-sm"
                    >Details</a>
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#8BA872]/5 via-transparent to-[#466536]/10" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
