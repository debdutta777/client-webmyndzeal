"use client";

import { motion, easeOut, easeInOut } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: easeInOut },
  },
};

export default function HeroSection() {
  return (
    <section
      id="hero-section"
      aria-label="MyndZeal empathetic listening platform"
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 text-white pt-20 pb-20 overflow-hidden"
    >
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: easeOut }}
        className="absolute inset-0 z-[-2] hidden md:block"
      >
        <Image
          src="/assets/image 1.png"
          alt="MyndZeal - Empathetic Listening Platform Background"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </motion.div>
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: easeOut }}
        className="absolute inset-0 z-[-2] block md:hidden"
      >
        <Image
          src="/assets/mobile.jpg"
          alt="MyndZeal - Mobile Background"
          fill
          sizes="(max-width: 768px) 100vw"
          style={{ objectFit: "cover", filter: "blur(1px)" }}
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, ease: easeInOut }}
        className="absolute inset-0 bg-black z-[-1]"
      />

      <div className="relative z-10 max-w-3xl mx-auto py-20 px-2 md:px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.h1
            variants={textVariants}
            className="font-serif font-normal mb-2 text-[2.5rem] md:text-[3.5rem] text-sky-300 drop-shadow-lg"
          >
            Make your {" "}
            <motion.span
              variants={textVariants}
              className="italic font-medium inline-block"
            >
              Mind
            </motion.span>{" "}
            Zeal with
          </motion.h1>
          <motion.div
            variants={textVariants}
            className="mt-2 font-semibold italic text-[3rem] md:text-[4.5rem] text-white drop-shadow-xl tracking-wide"
          >
            MYNDZEAL
          </motion.div>
          <motion.div variants={fadeIn} transition={{ delay: 0.6 }}>
            <p className="mt-4 font-light text-lg md:text-xl text-white/90 max-w-xl mx-auto drop-shadow">
              Empathetic listening for emotional well-being
            </p>
          </motion.div>
          <motion.div variants={fadeIn} transition={{ delay: 0.8 }} className="mt-12">
            <Link href="/book-session">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent text-white border-2 border-white rounded-full px-8 py-2 text-lg font-medium cursor-pointer transition-all duration-300 hover:bg-white/10"
              >
                Begin Your Journey
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
