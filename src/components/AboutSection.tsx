"use client";
import { motion, easeOut } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: easeOut },
  },
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
};

export default function AboutSection() {
  return (
    <section id="about" className="bg-[#EFEDE1] pt-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }} className="mb-12">
          <motion.h2 variants={slideUp} className=" py-5 text-4xl md:text-5xl font-bold text-[#87695E] mb-4 relative">
            About Us
            <div className="w-24 h-1.5 bg-[#8BA872] rounded-full mt-4"></div>
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
          <motion.div variants={scaleIn} className="md:col-span-2 lg:col-span-2 lg:row-span-1">
            <div className="bg-[#8BA872] p-8 rounded-2xl shadow-lg h-full flex flex-col justify-between min-h-[240px] lg:min-h-[260px] relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-5">Our Mission</h3>
                <p className="text-white/90 text-base md:text-lg leading-relaxed">We believe every individual deserves to be heard and supported — without judgment and without the heavy price tag.</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="lg:row-span-1">
            <div className="bg-white p-7 rounded-2xl shadow-lg border-l-4 border-[#8BA872] h-full min-h-[200px] flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-semibold text-[#87695E] mb-5">Our Approach</h3>
              <p className="text-[#61674D] text-base md:text-lg leading-relaxed">While most platforms begin with lengthy forms and intrusive questions, we focus on listening first.</p>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-[#8BA872] h-full min-h-[180px] flex flex-col justify-center relative">
              <h3 className="text-xl font-semibold text-[#87695E] mb-4">Deep Analysis</h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[#8BA872] text-white px-3 py-1 rounded-full text-sm font-medium">24 hours</div>
              </div>
              <p className="text-[#61674D] text-base leading-relaxed">Comprehensive analysis report with actionable insights and personalized suggestions.</p>
            </div>
          </motion.div>

          <motion.div variants={fadeIn}>
            <div className="bg-[#87695E] p-7 rounded-2xl shadow-lg h-full min-h-[200px] flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-3 h-3 bg-[#8BA872] rounded-full"></div>
                  <h3 className="text-lg md:text-xl font-semibold text-white">Affordable Care</h3>
                </div>
                <div className="bg-[#8BA872] text-white px-5 py-3 rounded-lg inline-block mb-4 font-bold text-xl md:text-2xl">₹99</div>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">Trained, compassionate listeners. No clinical vibes. No pressure. Just comfort.</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-[#8BA872] h-full min-h-[180px] flex flex-col justify-center relative">
              <h3 className="text-xl font-semibold text-[#87695E] mb-4">Privacy First</h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[#8BA872] text-white px-3 py-1 rounded-full text-sm font-medium">100% Secure</div>
              </div>
              <p className="text-[#61674D] text-base leading-relaxed">Your conversations are completely confidential. We prioritize your privacy with secure, encrypted sessions and strict data protection protocols.</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={slideUp} whileHover={{ scale: 1.02 }} className="mt-12">
          <div className="bg-gradient-to-r from-[#8BA872] to-[#87695E] p-8 rounded-2xl shadow-xl text-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-white font-bold text-xl md:text-2xl italic">Speak. Heal. Grow — with MyndZeal.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
