"use client";
import { useState } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import Image from "next/image";

// Current 6 primary service categories surfaced on /services
const data = {
  PSYCHIATRISTS: {
    image: "/assets/img3.jpg",
    title: "Psychiatrists",
    headerTitle: "MEDICAL EXPERT CARE",
    description: `Consult with licensed psychiatrists for diagnostic clarity, medication management, and integrated treatment planning for complex mental health conditions. Evidence-based, outcome-focused, confidential support.`,
  icon: "🩺",
    href: "/services/psychiatrists",
    comingSoon: false,
  },
  PSYCHOLOGISTS: {
    image: "/assets/img5.jpg",
    title: "Psychologists",
    headerTitle: "THERAPEUTIC SUPPORT",
    description: `Access structured psychological interventions, assessments, and therapy modalities tailored to your goals1helping you build resilience, insight, and sustainable wellbeing.`,
  icon: "🧠",
    href: "/services/psychologists",
    comingSoon: false,
  },
  "LISTENING CIRCLE": {
    image: "/assets/img2.jpg",
    title: "Listening Circle",
    headerTitle: "EMPATHETIC PRESENCE",
    description: `Choose from three compassionate listening tiers for safe, judgement-free emotional expression, real-time relief, and human connection when you need it most.`,
  icon: "🎧",
    href: "/services/listening",
    comingSoon: false,
  },
  "COUNSELLING PLANS": {
    image: "/assets/img1.jpg",
    title: "Counselling Plans",
    headerTitle: "GUIDED PROGRESS",
    description: `Curated counselling focus areas matched to qualified professionals1select a specialization, explore aligned practitioners, and progress through a structured care pathway.`,
  icon: "📋",
    href: "/services/counselling",
    comingSoon: false,
  },
  "EMPLOYEE WELLBEING": {
    image: "/assets/img4.jpg",
    title: "Employee Wellbeing",
    headerTitle: "WORKPLACE MENTAL HEALTH",
    description: `Organization-wide resilience, psychological safety, and mental health enablement programs. Analytics, workshops, and care routinglaunching soon. Register interest now.`,
  icon: "🏢",
    href: "/workplace",
    comingSoon: true,
  },
  "SCHOOL WELLBEING": {
    image: "/assets/mobile.jpg",
    title: "School Wellbeing",
    headerTitle: "STUDENT SUPPORT",
    description: `Holistic student mental health, SEL skill-building, and early intervention pathways for academic ecosystems. Coming soonbe first to know when we onboard institutions.`,
  icon: "🏫",
    href: "/schools",
    comingSoon: true,
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
  exit: { opacity: 0, y: -20 },
};

const buttonsContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const buttonVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
  exit: { opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.3 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: easeOut } },
};

export default function VoiceMattersSection() {
  const [selected, setSelected] = useState<keyof typeof data>("PSYCHIATRISTS");

  return (
    <section id="services" className="relative bg-[#8BA872] pt-52 pb-16 overflow-hidden">
      {/* Simple rectangular design - no waves */}
      <div className="absolute top-0 left-0 right-0 w-full h-[200px] bg-[#EFEDE1] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12 relative z-2 mt-8">
          <motion.div initial="hidden" animate="visible" variants={itemVariants}>
            <p className="text-[#EFEDE1] text-sm flex items-center justify-center mb-4 font-medium tracking-wider">
              <span className="mr-2"></span> {data[selected].headerTitle}
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={itemVariants} transition={{ delay: 0.2 }}>
            <motion.div variants={buttonsContainer} className="flex flex-wrap justify-center gap-3 mb-8">
              {Object.keys(data).map((item) => (
                <motion.div key={item} variants={buttonVariant} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <motion.button layout onClick={() => setSelected(item as keyof typeof data)} className={`
                      px-6 py-2.5 text-sm rounded-full border-2 transition-all duration-300 font-medium tracking-wide
          ${selected === item
                        ? "bg-[#EFEDE1] text-[#61674D] border-[#EFEDE1] shadow-lg transform scale-105"
                        : "bg-transparent text-[#EFEDE1] border-[#EFEDE1] hover:bg-[#EFEDE1] hover:text-[#61674D] hover:shadow-md"
                      }
                    `}>
                    {item}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={itemVariants} transition={{ delay: 0.1 }}>
            <h2 className="font-medium text-4xl lg:text-5xl text-[#EFEDE1] mb-12 leading-tight">
              <span className="text-[#B7E3FF]">Your </span>
              <span className="text-[#B7E3FF] font-semibold">VOICE</span>
              <span className="text-[#EFEDE1]"> matters—</span>
              <br />
              <span className="text-[#B7E3FF]">let&apos;s </span>
              <span className="text-[#B7E3FF] font-semibold italic">TALK.</span>
            </h2>
          </motion.div>

          {/* Selected service details */}
          <AnimatePresence mode="wait">
            <motion.div key={selected} initial="hidden" animate="visible" exit="exit" variants={cardVariants} className="mt-8">
              <div className="bg-white rounded-3xl overflow-hidden max-w-6xl mx-auto shadow-2xl hover:shadow-3xl transition-all duration-500 flex flex-col md:flex-row items-stretch min-h-[480px] md:min-h-[500px] group">
                {/* Image Section */}
                <div className="w-full md:w-1/2 relative h-80 md:h-auto flex-shrink-0 overflow-hidden">
                  <motion.div variants={imageVariants} className="relative w-full h-full">
                    <Image src={data[selected].image} alt={data[selected].title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    {/* Gradient overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                  </motion.div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-gradient-to-br from-[#EFEDE1] to-[#F8F6F0]">
                  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="flex items-center mb-6">
                    <div className="text-5xl mr-5 p-3 bg-white rounded-2xl shadow-md"><span role="img" aria-label={data[selected].title}>{data[selected].icon}</span></div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D3319] leading-tight">{data[selected].title}</h3>
                  </motion.div>

                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="text-[#4A5D3A] leading-relaxed text-lg md:text-xl mb-8 font-medium line-height-loose">
                    {data[selected].description}
                  </motion.p>

                  <div className="flex justify-center gap-4 flex-wrap">
                    <motion.a href={data[selected].href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(139, 168, 114, 0.3)" }} whileTap={{ scale: 0.95 }} className="mt-2 px-10 py-4 bg-gradient-to-r from-[#8BA872] to-[#7A9C61] text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl text-lg transition-all duration-300 border border-[#8BA872] hover:border-[#7A9C61] inline-block mx-auto">
                      {`Explore ${data[selected].title}`}
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
