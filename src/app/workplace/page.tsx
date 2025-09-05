"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import PartnerImage from "../../components/PartnerImage";

const WorkplacePage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const companyTypes = [
    {
      title: "Tech Companies",
      description: "Combat burnout and stress in fast-paced technology environments",
      icon: "💻",
      bgColor: "bg-gradient-to-br from-[#8BA872]/20 to-[#C8E8F5]/40",
      programs: [
        "Work-Life Balance Coaching",
        "Burnout Prevention Workshops",
        "Innovation Stress Management",
        "Remote Work Mental Health"
      ]
    },
    {
      title: "Healthcare Organizations",
      description: "Support healthcare workers with specialized mental health resources",
      icon: "🏥",
      bgColor: "bg-gradient-to-br from-[#C8E8F5]/40 to-[#8BA872]/20",
      programs: [
        "Compassion Fatigue Recovery",
        "Trauma-Informed Care Training",
        "Shift Work Sleep Support",
        "Medical Professional counselling"
      ]
    },
    {
      title: "Financial Services",
      description: "Manage high-pressure environments with tailored wellness solutions",
      icon: "💼",
      bgColor: "bg-gradient-to-br from-[#8BA872]/30 to-[#F0F7FC]",
      programs: [
        "High-Pressure Environment Training",
        "Financial Stress counselling",
        "Executive Mental Health",
        "Market Volatility Stress Management"
      ]
    },
    {
      title: "Manufacturing & Industrial",
      description: "Address safety, shift work, and physical demands on mental health",
      icon: "🏭",
      bgColor: "bg-gradient-to-br from-[#C8E8F5]/30 to-[#8BA872]/25",
      programs: [
        "Safety Culture Psychology",
        "Shift Work Adaptation",
        "Physical-Mental Health Connection",
        "Blue-Collar Wellness Programs"
      ]
    },
    {
      title: "Retail & Hospitality",
      description: "Support customer-facing teams with emotional resilience training",
      icon: "🛍️",
      bgColor: "bg-gradient-to-br from-[#F0F7FC] to-[#C8E8F5]/35",
      programs: [
        "Customer Service Stress Management",
        "Emotional Labor Support",
        "Seasonal Work Mental Health",
        "Team Resilience Building"
      ]
    },
    {
      title: "Startups & Scale-ups",
      description: "Navigate rapid growth challenges with adaptive mental health solutions",
      icon: "🚀",
      bgColor: "bg-gradient-to-br from-[#8BA872]/25 to-[#C8E8F5]/30",
      programs: [
        "Uncertainty Management",
        "Rapid Growth Stress Support",
        "Founder Mental Health",
        "Team Scaling Psychology"
      ]
    }
  ];

  const coreServices = [
    {
      title: "Employee Wellness Programs",
      description: "Comprehensive mental health support tailored for your workforce",
      features: ["24/7 Support", "Group Sessions", "Individual counselling", "Stress Management"],
      icon: "🧠",
      color: "from-[#8BA872]/25 to-[#C8E8F5]/30"
    },
    {
      title: "Leadership Development",
      description: "Build emotionally intelligent leaders who create healthier work environments",
      features: ["Executive Coaching", "Team Building", "Communication Skills", "Conflict Resolution"],
      icon: "👥",
      color: "from-[#C8E8F5]/30 to-[#8BA872]/25"
    },
    {
      title: "Workplace Assessment",
      description: "Data-driven insights to improve your organizational mental health culture",
      features: ["Culture Analysis", "Burnout Prevention", "Productivity Metrics", "Custom Reports"],
      icon: "📊",
      color: "from-[#F0F7FC] to-[#C8E8F5]/35"
    }
  ];

  const stats = [
    { number: "93%", label: "Reduction in Employee Turnover", delay: 0 },
    { number: "50%", label: "Increase in Productivity", delay: 0.1 },
    { number: "92%", label: "Employee Satisfaction Rate", delay: 0.2 },
    { number: "5+", label: "Companies Transformed", delay: 0.3 }
  ];

  const testimonials = [
    {
      quote: "MyndZeal transformed our workplace culture. Employee satisfaction increased by 60% in just 6 months.",
      author: "Sarah Chen",
      position: "HR Director, TechCorp",
      company: "Fortune 500 Company"
    },
    {
      quote: "The ROI on mental health investment was immediate. Productivity soared and sick days dropped significantly.",
      author: "Michael Rodriguez",
      position: "CEO, InnovateNow",
      company: "Mid-size Startup"
    }
  ];

  return (
    <div className="min-h-screen bg-[#C8E8F5]">
      {/* Hero Section with Enhanced 3D Elements */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0" style={{ perspective: "1000px" }}>
          <motion.div
            animate={{ 
              rotateX: [0, 15, 0],
              rotateY: [0, 360],
              y: [0, -20, 0]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-10 w-16 h-20 rounded-lg backdrop-blur-sm shadow-2xl"
            style={{ 
              transformStyle: "preserve-3d",
              background: "linear-gradient(45deg, #8BA872 0%, #C8E8F5 50%, #F0F7FC 100%)"
            }}
          />

          <motion.div
            animate={{ 
              rotateX: [360, 0],
              rotateY: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-40 right-20 w-14 h-14 bg-[#C8E8F5]/40 rounded-xl backdrop-blur-sm shadow-2xl border border-[#8BA872]/20"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-2 flex items-end justify-center gap-1">
              <motion.div 
                animate={{ height: ["20%", "80%", "40%"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 bg-[#8BA872] rounded-sm"
              />
              <motion.div 
                animate={{ height: ["40%", "60%", "90%"] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                className="w-1 bg-[#8BA872] rounded-sm"
              />
              <motion.div 
                animate={{ height: ["60%", "30%", "70%"] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                className="w-1 bg-[#8BA872] rounded-sm"
              />
            </div>
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, -30, 0],
              rotateZ: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-1/4 w-24 h-16 bg-[#F0F7FC]/30 rounded-2xl backdrop-blur-sm shadow-2xl border border-[#8BA872]/20"
          />

          <motion.div
            animate={{ 
              rotateX: [0, 360],
              rotateY: [360, 0],
              x: [0, 30, -30, 0],
              y: [0, -40, 0]
            }}
            transition={{ 
              duration: 22,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-60 right-10 w-12 h-8 bg-[#8BA872]/40 rounded-md backdrop-blur-sm shadow-xl"
            style={{ transformStyle: "preserve-3d" }}
          />

          <motion.div
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-40 right-1/4 w-20 h-12 bg-[#C8E8F5]/40 rounded-xl backdrop-blur-sm shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
          />

          <motion.div
            animate={{ 
              rotateX: [0, 15, 0],
              y: [0, -15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-32 left-1/3 w-16 h-10 bg-[#F0F7FC]/50 rounded-lg backdrop-blur-sm shadow-xl border border-[#8BA872]/30"
          >
            <div className="absolute inset-1 bg-[#8BA872]/20 rounded-md">
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full bg-[#C8E8F5]/40 rounded-md"
              />
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <motion.h1 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-6 text-[#8BA872]"
              >
                <motion.span
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="block"
                >
                  Build Your
                </motion.span>
                <motion.span
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="block text-[#C8E8F5] drop-shadow-lg"
                  style={{ 
                    textShadow: "2px 2px 4px rgba(139, 168, 114, 0.3)"
                  }}
                >
                  Healthy Workplace
                </motion.span>
              </motion.h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                Transform your organization with comprehensive mental health solutions 
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                that boost productivity, reduce turnover, and create thriving workplace cultures.
              </motion.span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.7, type: "spring", stiffness: 200 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(139, 168, 114, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#8BA872] text-white rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ transformStyle: "preserve-3d" }}
              >
                Start Free Assessment
              </motion.button>
              
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.9, type: "spring", stiffness: 200 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: -5,
                  backgroundColor: "#8BA872",
                  color: "white"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-[#8BA872] text-[#8BA872] rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{ transformStyle: "preserve-3d" }}
              >
                View Success Stories
              </motion.button>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-20">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
              fill="url(#waveGradient)"
            />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8BA872" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#C8E8F5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8BA872" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Partners Section (real partners only) */}
      <section className="py-20" style={{ background: "#F0F7FC" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#8BA872", textShadow: "0 0 16px #8BA87288" }}
            >
              <motion.span
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Our Trusted Partners
              </motion.span>
            </motion.h2>
            <div className="w-20 h-1 mx-auto rounded mb-6" style={{ background: "#8BA872", boxShadow: "0 0 16px #8BA87288" }} />
            <p className="max-w-2xl mx-auto" style={{ color: "#6CA05A" }}>
              We collaborate with industry leaders to deliver exceptional mental wellness solutions 
              and expand our reach to those who need support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-xl p-8 flex flex-col items-center justify-center shadow-xl border border-[#8BA872] transition-all relative overflow-visible"
              style={{ boxShadow: "0 4px 32px #8BA87222, 0 1.5px 8px rgba(0,0,0,0.08)", borderColor: "#8BA872" }}>
              <div className="relative w-48 h-48 mb-6 z-10">
                <PartnerImage 
                  src="/assets/oxeylo.png" 
                  alt="Oxeylo logo" 
                  fill
                  sizes="192px"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 z-10" style={{ color: "#8BA872", textShadow: "0 0 8px #8BA87255" }}>Oxeylo</h3>
              <p className="text-center z-10" style={{ color: "#6CA05A" }}>Enterprise AI Solutions</p>
            </div>
            <div className="bg-white rounded-xl p-8 flex flex-col items-center justify-center shadow-xl border border-[#8BA872] transition-all relative overflow-visible"
              style={{ boxShadow: "0 4px 32px #8BA87222, 0 1.5px 8px rgba(0,0,0,0.08)", borderColor: "#8BA872" }}>
              <div className="relative w-48 h-48 mb-6 z-10">
                <PartnerImage 
                  src="/assets/Planetsnaps.png" 
                  alt="PlanetSnap logo" 
                  fill
                  sizes="192px"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 z-10" style={{ color: "#8BA872", textShadow: "0 0 8px #8BA87255" }}>PlanetSnap</h3>
              <p className="text-center z-10" style={{ color: "#6CA05A" }}>Sustainable Technology</p>
            </div>
            <div className="bg-white rounded-xl p-8 flex flex-col items-center justify-center shadow-xl border border-[#8BA872] transition-all relative overflow-visible"
              style={{ boxShadow: "0 4px 32px #8BA87222, 0 1.5px 8px rgba(0,0,0,0.08)", borderColor: "#8BA872" }}>
              <div className="relative w-48 h-48 mb-6 z-10">
                <PartnerImage 
                  src="/assets/systemrabbit.png" 
                  alt="SystemRabbit logo" 
                  fill
                  sizes="192px"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 z-10" style={{ color: "#8BA872", textShadow: "0 0 8px #8BA87255" }}>SystemRabbit</h3>
              <p className="text-center z-10" style={{ color: "#6CA05A" }}>Cloud Infrastructure</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with 3D Cards */}
      <section className="py-20 bg-[#8BA872]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
            >
              <motion.span
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Proven Results
              </motion.span>
            </motion.h2>
            <p className="text-xl text-gray-600">Real impact on businesses like yours</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: stat.delay }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  z: 50
                }}
                className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#F0F7FC] to-[#C8E8F5]/30 shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#8BA872]/20"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#8BA872] to-[#C8E8F5] bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Types Section */}
      <section className="py-20 bg-[#C8E8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 40, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 text-[#8BA872]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
              >
                Solutions by Industry
              </motion.span>
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored mental health programs designed for the unique challenges of your industry
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyTypes.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03, 
                  rotateY: 2,
                  z: 40
                }}
                className={`relative p-8 rounded-3xl ${company.bgColor} backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <motion.div
                    animate={{ 
                      rotateY: hoveredCard === index ? [0, 360] : 0 
                    }}
                    transition={{ duration: 1.5 }}
                    className="text-6xl mb-6 filter drop-shadow-lg"
                  >
                    {company.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {company.title}
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {company.description}
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#8BA872] mb-3">Specialized Programs:</h4>
                    <ul className="space-y-2">
                      {company.programs.map((program, programIndex) => (
                        <motion.li
                          key={programIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + programIndex * 0.1 }}
                          className="flex items-center text-gray-700 text-sm"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-[#8BA872] to-[#C8E8F5] rounded-full mr-3 shadow-lg flex-shrink-0" />
                          {program}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 w-full py-3 bg-gradient-to-r from-[#8BA872] to-[#C8E8F5] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Explore Programs
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 bg-[#8BA872]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, scale: 0.7, rotateX: 30 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.span
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Core Wellness Services
              </motion.span>
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive workplace mental health programs designed to boost productivity, 
              reduce turnover, and create a thriving organizational culture.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {coreServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.02, 
                  rotateY: hoveredCard === index ? 5 : 0,
                  z: 50
                }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${service.color} backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <motion.div
                    animate={{ 
                      rotateY: hoveredCard === index ? [0, 360] : 0 
                    }}
                    transition={{ duration: 1 }}
                    className="text-6xl mb-6 filter drop-shadow-lg"
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + featureIndex * 0.1 }}
                        className="flex items-center text-gray-700"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-[#8BA872] to-[#C8E8F5] rounded-full mr-3 shadow-lg" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 w-full py-3 bg-gradient-to-r from-[#8BA872] to-[#C8E8F5] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & CTA & Footer (kept simple) */}
      <section className="py-20 bg-[#C8E8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#8BA872]">Client Success Stories</motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, rotateY: -30 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.02, 
                  rotateY: 3,
                  z: 30
                }}
                className="p-8 rounded-3xl bg-gradient-to-br from-[#8BA872]/10 to-[#B7E3FF]/10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#8BA872]/20"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="text-[#8BA872] text-6xl mb-4 opacity-50">&quot;</div>
                <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">{testimonial.quote}</p>
                <div className="border-t border-[#8BA872]/20 pt-4">
                  <h4 className="font-bold text-gray-800">{testimonial.author}</h4>
                  <p className="text-[#8BA872] font-medium">{testimonial.position}</p>
                  <p className="text-gray-600 text-sm">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#8BA872] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Transform Your Workplace?</motion.h2>
          <motion.a href="/book-session" className="px-12 py-4 bg-white text-[#8BA872] rounded-2xl font-bold text-xl shadow-2xl inline-block">Get Started Today</motion.a>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#8BA872] to-[#B7E3FF] bg-clip-text text-transparent mb-4">MyndZeal</div>
          <p className="text-gray-400">Building healthier workplaces, one organization at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default WorkplacePage;
