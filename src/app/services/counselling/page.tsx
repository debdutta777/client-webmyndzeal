import Link from 'next/link';
import { Metadata } from 'next';
import { Award, Star } from 'lucide-react';
import CounsellingCategoryButtonsClient from '@/components/CounsellingCategoryButtonsClient';

export const metadata: Metadata = { 
  title: 'Counselling Plans | MyndZeal' 
};

const planCategories = [
  { key: 'anxiety', label: 'Anxiety & Stress' },
  { key: 'relationships', label: 'Relationship & Interpersonal' },
  { key: 'career', label: 'Career, Performance & Coaching' },
  { key: 'emotional', label: 'Emotional Regulation & Mood' },
  { key: 'teen', label: 'Adolescent / Teen' },
  { key: 'trauma', label: 'Trauma & PTSD' },
  { key: 'addiction', label: 'Addiction & Substance Use' },
  { key: 'grief', label: 'Grief & Loss' },
  { key: 'sleep', label: 'Sleep & Insomnia' },
  { key: 'selfesteem', label: 'Self-Esteem & Confidence' },
  { key: 'parenting', label: 'Parenting & Family' },
  { key: 'couples', label: 'Couples & Relationship Therapy' },
  { key: 'lgbtq', label: 'LGBTQ+ Affirming Therapy' },
];

interface PageProps {
  // searchParams can be a thenable in some Next.js runtimes, so keep it flexible
  searchParams?: { cat?: string } | Promise<{ cat?: string }> | any;
}

export default async function CounsellingPlansPage({ searchParams }: PageProps) {
  // Await searchParams when it's a thenable (fixes Next.js: sync-dynamic-apis)
  const params = searchParams && typeof (searchParams as any)?.then === 'function'
    ? await (searchParams as any)
    : (searchParams ?? {});

  const catParam = params?.cat;
  const activeCat = catParam && planCategories.find(c => c.key === catParam) ? catParam : planCategories[0].key;
  const filtered: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4FAF2] to-[#E8F4F8] pb-16">
        <div className="relative overflow-hidden pt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9370DB]/5 to-transparent"></div>
          <div className="container mx-auto px-6 py-16 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-[#9370DB]/20 mb-6">
                <span className="text-[#9370DB] font-semibold text-sm">Professional Counselling Services</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-[#9370DB]">Counselling</span> Plans
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Select a focus area below to connect with counsellors who specialize in that need.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Choose Your Focus Area</h3>
              <CounsellingCategoryButtonsClient categories={planCategories} />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c: any) => {
              const name = `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Counsellor'
              return (
                <div 
                  key={c.id} 
                  className="relative group bg-white/90 backdrop-blur rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:-translate-y-1"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#9370DB] via-[#8BA872] to-[#9370DB] opacity-70" />
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl mb-3 ring-2 ring-white shadow-inner group-hover:scale-105 transition-transform">
                      {c.profile_image_url ? (
                        <img src={c.profile_image_url} alt={name} className="object-cover w-full h-full" />
                      ) : <span>🗣️</span>}
                    </div>
                    <h2 className="text-lg font-semibold text-[#2F3E25] flex items-center gap-2 mb-2">
                      {name}
                      {c.is_verified && <Award className="w-4 h-4 text-[#9370DB]" />}
                    </h2>
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full shadow-sm text-[11px] whitespace-nowrap">
                        {c.experience_years || 0} yrs exp
                      </span>
                      {c.hourly_rate && (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full shadow-sm text-[11px] whitespace-nowrap">
                          ₹{c.hourly_rate}/hr
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between px-5 pb-4 pt-3 border-t border-gray-100 gap-3 bg-gradient-to-b from-transparent to-[#F4FAF2]/40">
                    <div className="flex flex-col gap-2 items-stretch w-full">
                      <Link
                        href={`#`}
                        className="relative overflow-hidden inline-flex justify-center items-center gap-2 bg-gradient-to-r from-[#9370DB] to-[#8BA872] text-white text-xs font-medium px-3 py-2 rounded-full shadow hover:shadow-md transition group/book"
                      >
                        <span className="relative z-10">Book Session</span>
                      </Link>
                      <Link
                        href={`#`}
                        className="inline-flex justify-center items-center gap-2 bg-white/70 border border-[#9370DB] text-[#466536] text-xs font-medium px-3 py-2 rounded-full hover:bg-[#F4FAF2] transition shadow-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#9370DB]/5 via-transparent to-[#8BA872]/10" />
                </div>
              )
            })}
            
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">🔍</span>
                </div>
                <p className="text-gray-600 font-medium">No counsellors match this focus area yet. Try selecting another category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
}
