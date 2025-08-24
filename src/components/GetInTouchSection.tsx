"use client";
import { motion } from "framer-motion";

const ContactCard = ({ icon, title, content, action, href, index }: any) => {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} whileHover={{ y: -5, scale: 1.02 }} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#8BA872]/10 to-transparent rounded-bl-full" />
      <div className="w-16 h-16 bg-gradient-to-br from-[#8BA872] to-[#7A9C61] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-lg mb-6 leading-relaxed">{content}</p>
      <motion.a href={href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center text-[#8BA872] font-semibold text-lg group-hover:text-[#7A9C61] transition-colors duration-300">{action}<svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></motion.a>
    </motion.div>
  );
};

const QuickContactForm = () => {
  // UI-only form: inputs are disabled to avoid client-side logic while preserving appearance
  return (
    <motion.form initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white rounded-3xl p-8 shadow-lg space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
        <input id="name" name="name" placeholder="Enter your full name" disabled className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input id="email" name="email" type="email" placeholder="Enter your email" disabled className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea id="message" name="message" rows={4} placeholder="Tell us how we can help you..." disabled className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed resize-none" />
      </div>
      <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-[#8BA872] to-[#7A9C61] text-white`}>
        Send Message
      </motion.button>
    </motion.form>
  );
};

export default function GetInTouchSection() {
  const contactInfo = [
    { icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>, title: "Call Us", content: "Ready to talk? Our counselors are available to provide immediate support and guidance.", action: "Call Now", href: "tel:+916290364859" },
    { icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: "Email Us", content: "Have questions? Send us an email and we'll respond within 24 hours.", action: "Send Email", href: "mailto:info@lifzyy.com" },
    { icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: "Visit Our Office", content: "Located in the heart of Kolkata, our office provides a comfortable space for in-person consultations.", action: "Get Directions", href: "https://maps.google.com/?q=Kolkata,+West+Bengal,+India" },
    { icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: "Our Hours", content: "We're available 7 days a week to provide you with the support you need, when you need it most.", action: "Book Session", href: "/book-session" }
  ];

  return (
    <section id="contact" className="py-20 bg-[#C8E8F5] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/20 rounded-full -translate-x-36 -translate-y-36"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8BA872]/10 rounded-full translate-x-48 translate-y-48"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="flex items-center justify-center mb-4"><span className="text-[#8BA872] text-lg mr-2">☎️</span><span className="text-[#61674D] font-medium tracking-wider text-sm uppercase">Get In Touch</span></div>
          <h2 className="text-4xl md:text-5xl font-light text-[#8BA872] mb-6 leading-tight">We're here to <span className="font-bold uppercase">listen</span> and <span className="font-bold uppercase">support</span> you.</h2>
          <p className="text-xl text-[#61674D] max-w-3xl mx-auto leading-relaxed">Your mental well-being matters to us. Reach out today and take the first step towards a healthier, happier you.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (<ContactCard key={index} {...info} index={index} />))}
            </div>
          </div>
          <div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-6">
              <h3 className="text-2xl font-bold text-[#61674D] mb-3">Send us a message</h3>
              <p className="text-[#61674D]/70">Fill out the form below and we'll get back to you as soon as possible.</p>
            </motion.div>
            <QuickContactForm />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6"><div className="text-3xl mb-3">📞</div><h4 className="font-bold text-[#61674D] mb-2">Phone Support</h4><p className="text-[#61674D]/70 text-sm">+91 6290 364 859</p><p className="text-[#61674D]/70 text-sm">Available 10 AM - 11 PM</p></div>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6"><div className="text-3xl mb-3">✉️</div><h4 className="font-bold text-[#61674D] mb-2">Email Support</h4><p className="text-[#61674D]/70 text-sm">info@myndzeal.com</p><p className="text-[#61674D]/70 text-sm">24-hour response time</p></div>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6"><div className="text-3xl mb-3">🏢</div><h4 className="font-bold text-[#61674D] mb-2">Office Location</h4><p className="text-[#61674D]/70 text-sm">Kolkata, West Bengal</p><p className="text-[#61674D]/70 text-sm">India</p></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#8BA872] to-[#7A9C61] rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Need Immediate Support?</h3>
            <p className="text-lg mb-6 opacity-90">If you're experiencing a mental health emergency, please reach out immediately.</p>
            <motion.a href="tel:+916290364859" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center bg-white text-[#8BA872] px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">Call Crisis Support</motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
