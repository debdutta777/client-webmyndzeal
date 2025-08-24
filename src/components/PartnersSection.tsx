"use client";
import { motion } from "framer-motion";
import PartnerImage from "./PartnerImage";

const partners = [
  { name: "Oxeylo", logo: "/assets/oxeylo.png", description: "Enterprise AI Solutions" },
  { name: "PlanetSnap", logo: "/assets/Planetsnaps.png", description: "Sustainable Technology" },
  { name: "SystemRabbit", logo: "/assets/systemrabbit.png", description: "Cloud Infrastructure" },
];

export default function PartnersSection() {
  return (
    <section className="py-20" style={{ background: "#F0F7FC" }}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, scale: 0.7, y: -40 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 18, duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#8BA872", textShadow: "0 0 16px #8BA87288" }}>Our Trusted Partners</motion.h2>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6, type: "spring" }} viewport={{ once: true }} className="w-20 h-1 mx-auto rounded mb-6" style={{ background: "#8BA872", boxShadow: "0 0 16px #8BA87288" }} />
          <motion.p className="max-w-2xl mx-auto" style={{ color: "#6CA05A" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} viewport={{ once: true }}>
            We collaborate with industry leaders to deliver exceptional mental wellness solutions and expand our reach to those who need support.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {partners.map((partner, index) => (
            <motion.div key={partner.name} initial={{ opacity: 0, y: 30, rotateY: 30 }} whileInView={{ opacity: 1, y: 0, rotateY: 0 }} transition={{ duration: 0.7, delay: index * 0.2, type: "spring", stiffness: 120, damping: 14 }} viewport={{ once: true }} whileHover={{ scale: 1.07, rotateY: 8, boxShadow: "0 0 40px 10px #8BA87255, 0 10px 30px rgba(0,0,0,0.12)", filter: "drop-shadow(0 0 24px #8BA87288)" }} className="bg-white rounded-xl p-8 flex flex-col items-center justify-center shadow-xl border border-[#8BA872] transition-all relative overflow-visible" style={{ boxShadow: "0 4px 32px #8BA87222, 0 1.5px 8px rgba(0,0,0,0.08)", borderColor: "#8BA872" }}>
              <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" initial={{ opacity: 0.7, scale: 1 }} animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, #8BA87255 0%, #C8E8F5 80%, transparent 100%)", filter: "blur(36px)" }} />
              <div className="relative w-48 h-48 mb-6 z-10">
                <PartnerImage src={partner.logo} alt={`${partner.name} logo`} fill sizes="(max-width: 768px) 100vw, 384px" style={{ objectFit: "contain" }} />
              </div>
              <h3 className="text-xl font-semibold mb-2 z-10" style={{ color: "#8BA872", textShadow: "0 0 8px #8BA87255" }}>{partner.name}</h3>
              <p className="text-center z-10" style={{ color: "#6CA05A" }}>{partner.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} viewport={{ once: true }} className="mt-16 text-center">
          <p className="italic" style={{ color: "#6CA05A" }}>Interested in partnering with us? <span className="text-[#00008B] font-medium">Contact our team today.</span></p>
        </motion.div>
      </div>
    </section>
  );
}
