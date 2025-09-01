"use client";


import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";




const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "#about" },
  { name: "Services", path: "#services", dropdown: true },
  { name: "Contact", path: "#contact" },
];

const serviceLinks = [
  { name: 'Psychiatrists', href: '/services/psychiatrists', description: 'Medical evaluation & treatment planning.' },
  { name: 'Psychologists', href: '/services/psychologists', description: 'Therapeutic support & structured interventions.' },
  { name: 'Listening Circle', href: '/services/listening', description: 'Three empathetic listening pathways.' },
  { name: 'Counselling Plans', href: '/services/counselling', description: 'Match a focus area with a counsellor.' },
  { name: 'Employee Wellbeing', href: '/workplace', description: 'Corporate mental health & resilience .' },
  { name: 'School Wellbeing', href: '/schools', description: 'Student wellbeing & SEL.' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  const navListVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const navItemVariant = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
    hover: { y: -4 },
  };

  const dropdownItem = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.14 } },
  };

  const logoVariant = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.45 } },
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // publish navbar height to a CSS variable so pages can offset themselves
  useEffect(() => {
    const setNavHeight = () => {
      const h = navRef.current?.offsetHeight || 80;
      document.documentElement.style.setProperty('--nav-h', `${h}px`);
    };
    setNavHeight();
    window.addEventListener('resize', setNavHeight);
    return () => window.removeEventListener('resize', setNavHeight);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    if (!sectionId.startsWith("#")) return;
    const section = sectionId.substring(1);
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-sm ${scrolled ? 'bg-white/95 shadow-lg' : 'bg-white/80'}`}
      style={{ willChange: 'background-color, box-shadow' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.div className="flex items-center" initial="hidden" animate="visible" variants={logoVariant} whileHover={{ scale: 1.03 }}>
            <Link href="/" className="flex items-center">
              <Image src="/assets/Inverse Horizontal Logo.png" alt="MyndZeal" width={150} height={40} className="h-10 w-auto object-contain" priority />
            </Link>
          </motion.div>

          <motion.div className="hidden md:flex flex-1 justify-center items-center space-x-8" variants={navListVariants} initial="hidden" animate="visible">
            {navItems.map((item, idx) => (
              <motion.div key={item.name} className="relative" variants={navItemVariant} onMouseEnter={() => item.dropdown && setServicesDropdown(true)} onMouseLeave={() => item.dropdown && setServicesDropdown(false)} whileHover="hover">
                {item.dropdown ? (
                  <>
                    <motion.button onClick={() => setServicesDropdown(v => !v)} className={`text-sm font-medium transition-colors duration-200 text-gray-800`}>
                      {item.name}
                      <svg className={`inline-block w-3 h-3 ml-2 transition-transform ${servicesDropdown ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
                    </motion.button>
                    <AnimatePresence>
                      {servicesDropdown && (
                        <motion.div initial="hidden" animate="visible" exit="hidden" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.04 } } }} transition={{ duration: 0.18 }} className="absolute left-0 mt-3 w-[300px] bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50">
                          {serviceLinks.map((s, i) => (
                            <motion.div key={s.href} variants={dropdownItem} className="rounded">
                              <Link href={s.href} className="block px-3 py-2 rounded hover:bg-gray-50">
                                <div className="text-sm font-medium text-gray-900">{s.name}</div>
                                <div className="text-xs text-gray-500">{s.description}</div>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  item.path.startsWith('#') ? (
                    <motion.button onClick={() => scrollToSection(item.path)} className={`text-sm font-medium transition-colors duration-200 text-gray-800`}>{item.name}</motion.button>
                  ) : (
                    <Link href={item.path} className={`text-sm font-medium transition-colors duration-200 text-gray-800`}>{item.name}</Link>
                  )
                )}
              </motion.div>
            ))}
          </motion.div>

          <div className="hidden md:flex items-center space-x-3 ml-auto">
            <Link href="/services" className="px-4 py-2 bg-gradient-to-r from-[#8BA872] to-[#7A9C61] text-white rounded-xl font-medium text-sm shadow hover:shadow-lg">Book Session</Link>
            <Link href="/auth/login" className="px-4 py-2 bg-white text-[#8BA872] border border-[#8BA872] rounded-xl font-medium text-sm">Login</Link>
            <Link href="/auth/register" className="px-4 py-2 bg-gradient-to-r from-[#7A9C61] to-[#8BA872] text-white rounded-xl font-medium text-sm">Join Us</Link>
          </div>

          <div className="md:hidden">
            <motion.button onClick={() => setIsOpen(v => !v)} className={`p-2 rounded-lg text-gray-800`} whileTap={{ scale: 0.94 }} animate={{ rotate: isOpen ? 90 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.button>
          </div>
        </div>
  </div>

  <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="md:hidden bg-white/95 backdrop-blur border-t border-white/10 z-40">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer px-3 py-2 rounded-lg text-base font-medium text-gray-800">
                        <span>Services</span>
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
                      </summary>
                      <div className="mt-2 pl-3 space-y-1">
                        {serviceLinks.map(s => (
                          <Link key={s.href} href={s.href} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50">{s.name}</Link>
                        ))}
                      </div>
                    </details>
                  ) : item.path.startsWith('#') ? (
                    <button onClick={() => { scrollToSection(item.path); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-800">{item.name}</button>
                  ) : (
                    <Link href={item.path} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-gray-800">{item.name}</Link>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link href="/services" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[#8BA872] to-[#7A9C61] text-white rounded-xl font-medium">Book Session</Link>
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 bg-white text-[#8BA872] border border-[#8BA872] rounded-xl font-medium">Login</Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[#7A9C61] to-[#8BA872] text-white rounded-xl font-medium">Join Us</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
