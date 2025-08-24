"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const SocialIcon = ({ href, icon, label, index }: any) => {
  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} className="w-12 h-12 bg-gradient-to-br from-[#8BA872] to-[#7A9C61] rounded-2xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 group" aria-label={label}>{icon}</motion.a>
  );
};

const FooterLink = ({ href, children, isExternal = false }: any) => {
  const Component: any = isExternal ? 'a' : Link;
  const props = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Component href={href} {...props} className="text-gray-600 hover:text-[#8BA872] transition-colors duration-300 text-sm">{children}</Component>
  );
};

export default function ConnectWithUsSection() {
  const socialLinks = [
  { href: "https://www.instagram.com/lifzyyofficial/", icon: (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>), label: "Instagram" },
  { href: "https://www.linkedin.com/company/lifzyy/", icon: (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.769 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>), label: "LinkedIn" },
  { href: "https://x.com/LifzyyOfficial", icon: (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>), label: "X (Twitter)" },
  { href: "https://www.youtube.com/@LifZyyOfficial", icon: (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>), label: "YouTube" },
  { href: "https://www.reddit.com/user/LifZyyCares/", icon: (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>), label: "Reddit" },
  { href: "https://www.quora.com/profile/LifZyy", icon: (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.737 18.646h-.897l.857-2.384h.04l.857 2.384zm-1.903-3.259L8.542 24h2.278l.432-1.209h2.496L14.18 24h2.278l-2.292-8.613h-3.332z"/><path d="M24 12C24 5.373 18.627 0 12 0S0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.599-.667.994-1.486 1.173-2.427h-1.334c-1.663 0-3.013-1.35-3.013-3.013V9.493c0-1.663 1.35-3.013 3.013-3.013h7.908c1.663 0 3.013 1.35 3.013 3.013v8.454c0 1.663-1.35 3.013-3.013 3.013h-1.334c.179.941.574 1.76 1.173 2.427C20.562 21.8 24 17.303 24 12z"/></svg>), label: "Quora" },
  { href: "https://in.pinterest.com/LifzyyOfficial/", icon: (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.007 0C5.395 0 0 5.395 0 12.007c0 5.084 3.162 9.426 7.625 11.174-.105-.949-.199-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.007 12.007 24.007c6.624 0 12.007-5.395 12.007-12.007C24.014 5.395 18.631.007 12.007.007z"/></svg>), label: "Pinterest" }
  ];

  const quickLinks = [ { href: "/", label: "Home" }, { href: "/#about", label: "About Us" }, { href: "/#services", label: "Services" }, { href: "/book-session", label: "Book Session" }, { href: "/#contact", label: "Contact" } ];
  const services = [
    { href: "/book-session", label: "Active Support" },
    { href: "/book-session", label: "Empathetic Listeners" },
    { href: "/book-session", label: "Career Counselling" },
    { href: "/services/workplace", label: "Workplace Solutions" },
    { href: "/services/school", label: "School Programs" },
  ];
  const legal = [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Services" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/cookie-policy", label: "Cookie Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8BA872]/10 rounded-full -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B7E3FF]/5 rounded-full translate-x-48 translate-y-48"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-1">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#8BA872] to-[#B7E3FF] bg-clip-text text-transparent">MyndZeal</h3>
              <p className="text-gray-400 leading-relaxed mb-6">Your trusted partner in mental wellness. We provide personalized counseling services to help you achieve emotional balance and personal growth.</p>
              <div className="flex items-center text-sm text-gray-400 mb-2"><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>+91 6290 364 859</div>
              <div className="flex items-center text-sm text-gray-400"><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>info@myndzeal.com</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">{quickLinks.map((link) => (<li key={link.href}><FooterLink href={link.href}>{link.label}</FooterLink></li>))}</ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h4 className="text-lg font-semibold mb-6 text-white">Our Services</h4>
              <ul className="space-y-3">{services.map((service, idx) => (<li key={`${service.href}-${idx}`}><FooterLink href={service.href}>{service.label}</FooterLink></li>))}</ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
              <h4 className="text-lg font-semibold mb-6 text-white">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for mental health tips and updates.</p>
              <div className="flex"><input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#8BA872] focus:border-transparent text-white placeholder-gray-400" /><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-gradient-to-r from-[#8BA872] to-[#7A9C61] rounded-r-xl font-medium transition-all duration-300 hover:shadow-lg">Subscribe</motion.button></div>
            </motion.div>
          </div>
        </div>

        <div className="border-t border-gray-800 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h4 className="text-lg font-semibold mb-6 text-white">Connect With Us</h4>
              <div className="flex flex-wrap gap-4 mb-6">{socialLinks.map((social, index) => (<SocialIcon key={social.href} href={social.href} icon={social.icon} label={social.label} index={index} />))}</div>
              <p className="text-gray-400 text-sm">Follow us on social media for daily inspiration, mental health tips, and community support.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="lg:text-right">
              <h4 className="text-lg font-semibold mb-6 text-white">Legal</h4>
              <div className="flex flex-wrap gap-4 lg:justify-end mb-6">{legal.map((link, index) => (<span key={link.href}><FooterLink href={link.href}>{link.label}</FooterLink>{index < legal.length - 1 && (<span className="text-gray-600 mx-2">|</span>)}</span>))}</div>
              <div className="bg-gradient-to-r from-[#8BA872] to-[#7A9C61] rounded-2xl p-6 text-center"><h5 className="font-bold text-lg mb-2">24/7 Crisis Support</h5><p className="text-sm mb-3 opacity-90">If you're in crisis, we're here to help immediately.</p><motion.a href="tel:+916290364859" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center bg-white text-[#8BA872] px-6 py-2 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300">Call Now</motion.a></div>
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center"><div className="text-gray-400 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Lifzyy (MyndZeal). All rights reserved. | Crafted with ❤ for mental wellness.</div><div className="flex items-center space-x-4 text-sm text-gray-400"><span>⭐ Trusted by 500+ clients</span><span>•</span><span>🔒 100% Confidential</span><span>•</span><span>🏆 4.8/5 Rating</span></div></div>
        </motion.div>
      </div>
    </footer>
  );
}
