"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Brain, Users, Building, GraduationCap, Headphones } from 'lucide-react';

const cards = [
  { key: 'psychiatrists', title: 'Psychiatrists', blurb: 'Medical evaluation and treatment planning for complex mental health needs.', href: '/services/psychiatrists', icon: <Brain className="w-8 h-8 text-[#8BA872]" />, gradient: 'from-blue-100 to-blue-50' },
  { key: 'psychologists', title: 'Psychologists', blurb: 'Therapeutic support, assessments and structured interventions.', href: '/services/psychologists', icon: <Heart className="w-8 h-8 text-[#8BA872]" />, gradient: 'from-green-100 to-green-50' },
  { key: 'listening', title: 'Listening Circle', blurb: 'Three empathetic listening pathways for immediate emotional relief.', href: '/services/listening', icon: <Headphones className="w-8 h-8 text-[#8BA872]" />, gradient: 'from-purple-100 to-purple-50' },
  { key: 'counselling', title: 'Counselling Plans', blurb: 'Choose a counselling focus area then book a matching professional.', href: '/services/counselling', icon: <Users className="w-8 h-8 text-[#8BA872]" />, gradient: 'from-orange-100 to-orange-50' },
  { key: 'workplace', title: 'Employee Wellbeing', blurb: 'Corporate mental health & resilience programs (coming soon).', href: '/workplace', icon: <Building className="w-8 h-8 text-gray-500" />, gradient: 'from-gray-100 to-gray-50' },
  { key: 'school', title: 'School Wellbeing', blurb: 'Student wellbeing & SEL initiatives (coming soon).', href: '/schools', icon: <GraduationCap className="w-8 h-8 text-gray-500" />, gradient: 'from-yellow-100 to-yellow-50' }
];

export default function ServicesLandingClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Your Mental Health Journey</h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto font-medium">Choose from our comprehensive range of mental health services designed to support your wellbeing</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl md:text-4xl font-bold tracking-tight text-[#2D3319] mb-4">Our Services</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[#4A5D3A] max-w-2xl mx-auto font-medium text-lg">Select a category to explore specialists or structured pathways tailored to your needs.</motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((c, i) => (
            <motion.div key={c.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.4 }} className="group relative">
              <Link href={c.href} className="block h-full">
                <div className={`relative rounded-3xl bg-gradient-to-br ${c.gradient} border border-white/50 shadow-lg hover:shadow-2xl p-8 flex flex-col transition-all duration-300 transform hover:-translate-y-2 h-full min-h-[320px]`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/80 rounded-2xl shadow-sm">{c.icon}</div>
                    <h3 className="text-2xl font-bold text-[#2D3319] group-hover:text-[#587542] transition-colors">{c.title}</h3>
                  </div>
                  <p className="text-[#4A5D3A] flex-1 leading-relaxed text-lg mb-6">{c.blurb}</p>
                  <div className="flex items-center text-[#587542] font-semibold group-hover:text-[#466536] transition-colors"><span>Explore Services</span><svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8BA872]/5 to-[#73905B]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2D3319] mb-4">Need Help Choosing?</h3>
            <p className="text-[#4A5D3A] mb-6 text-lg">Not sure which service is right for you? Our team can help guide you to the perfect match for your needs.</p>
            <Link href="/book-session" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"><Heart className="w-5 h-5" />Get Personalized Help</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
