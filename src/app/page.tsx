"use client";
import { motion, type Variants } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VoiceMattersSection from "@/components/VoiceMattersSection";
import PartnersSection from "@/components/PartnersSection";
import GetInTouchSection from "@/components/GetInTouchSection";
import ConnectWithUsSection from "@/components/ConnectWithUsSection";

// Enhanced animation variants
const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const slideUp: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Home() {
  return (
    <div className="relative -mt-[var(--nav-h,80px)] overflow-hidden">
      {/* Enhanced animated background elements */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-[#8BA872]/30 to-[#73905B]/20 blur-3xl"
        animate={{ 
          scale: [1, 1.08, 0.95, 1], 
          x: [0, 15, -10, 0], 
          y: [0, -20, 10, 0],
          rotate: [0, 5, -3, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 -bottom-48 -right-40 h-96 w-96 rounded-full bg-gradient-to-l from-[#B7E3FF]/40 to-[#8BA872]/25 blur-3xl"
        animate={{ 
          scale: [1, 1.06, 1.02, 1], 
          x: [0, -18, 8, 0], 
          y: [0, 15, -8, 0], 
          rotate: [0, -8, 12, 0] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 top-1/3 left-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/15 blur-2xl"
        animate={{ 
          scale: [1, 1.12, 0.88, 1], 
          opacity: [0.3, 0.6, 0.2, 0.3],
          rotate: [0, 15, -10, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          aria-hidden
          className="pointer-events-none absolute -z-10 w-2 h-2 bg-[#8BA872]/30 rounded-full"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 12}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -5, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Enhanced sections with varied animations */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
      >
        <motion.section 
          id="home" 
          variants={slideUp}
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.3 }}
        >
          <HeroSection />
        </motion.section>

        <motion.section 
          id="about" 
          variants={fadeInLeft}
          whileInView="show"
          initial="hidden"
          viewport={{ once: true, amount: 0.2 }}
        >
          <AboutSection />
        </motion.section>

        <motion.section 
          id="services" 
          variants={fadeInRight}
          whileInView="show"
          initial="hidden"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <VoiceMattersSection />
          </motion.div>
          <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <PartnersSection />
          </motion.div>
        </motion.section>

        <motion.section 
          id="contact" 
          variants={slideUp}
          whileInView="show"
          initial="hidden"
          viewport={{ once: true, amount: 0.2 }}
        >
          <GetInTouchSection />
        </motion.section>

        <motion.section 
          variants={reveal}
          whileInView="show"
          initial="hidden"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.4 }}
        >
          <ConnectWithUsSection />
        </motion.section>
      </motion.div>

      {/* Additional decorative elements */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 top-1/2 right-1/4 w-1 h-32 bg-gradient-to-b from-[#8BA872]/20 to-transparent"
        animate={{ scaleY: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 bottom-1/4 left-1/3 w-32 h-1 bg-gradient-to-r from-[#B7E3FF]/20 to-transparent"
        animate={{ scaleX: [1, 1.8, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}
