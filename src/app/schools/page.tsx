"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const SchoolsPage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const services = [
    {
      title: "Student Counseling Programs",
      description: "Comprehensive mental health support tailored for students of all ages",
      features: ["Individual Sessions", "Group Therapy", "Crisis Intervention", "Academic Support"],
      icon: "📚",
      color: "from-[#8BA872]/20 to-[#7A9C61]/20"
    },
    {
      title: "Teacher Wellness Support",
      description: "Mental health resources and stress management for educators and staff",
      features: ["Staff Counseling", "Burnout Prevention", "Work-Life Balance", "Professional Development"],
      icon: "👩‍🏫",
      color: "from-[#B7E3FF]/20 to-[#8BA872]/20"
    },
    {
      title: "School Climate Assessment",
      description: "Data-driven insights to create a positive and supportive learning environment",
      features: ["Bullying Prevention", "Culture Analysis", "Safety Assessments", "Custom Programs"],
      icon: "🏫",
      color: "from-[#7A9C61]/20 to-[#B7E3FF]/20"
    }
  ];

  const stats = [
    { number: "85%", label: "Improvement in Student Engagement", delay: 0 },
    { number: "67%", label: "Reduction in Behavioral Issues", delay: 0.1 },
    { number: "92%", label: "Teacher Satisfaction Rate", delay: 0.2 },
    { number: "150+", label: "Schools Transformed", delay: 0.3 }
  ];

  const testimonials = [
    {
      quote: "MyndZeal's programs have revolutionized our school's approach to mental health. Students are more engaged and teachers feel supported.",
      author: "Dr. Emily Johnson",
      position: "Principal, Riverside High School",
      company: "Public School District"
    },
    {
      quote: "The impact on our students' academic performance and emotional well-being has been remarkable. Best investment we've made.",
      author: "Mark Thompson",
      position: "Superintendent, Greenfield Schools",
      company: "Private School Network"
    }
  ];

  const ageGroups = [
    {
      title: "Elementary (K-5)",
      description: "Age-appropriate mental health education and emotional development programs",
      features: ["Social Skills", "Emotion Regulation", "Peer Relationships", "Family Support"],
      icon: "🎨",
      gradient: "from-[#8BA872] to-[#B7E3FF]"
    },
    {
      title: "Middle School (6-8)",
      description: "Navigate the challenging adolescent years with specialized support systems",
      features: ["Identity Development", "Peer Pressure", "Academic Stress", "Body Image"],
      icon: "⚽",
      gradient: "from-[#7A9C61] to-[#8BA872]"
    },
    {
      title: "High School (9-12)",
      description: "Prepare students for adulthood with comprehensive mental health resources",
      features: ["College Prep Stress", "Career Counseling", "Relationship Skills", "Life Transitions"],
      icon: "🎓",
      gradient: "from-[#B7E3FF] to-[#7A9C61]"
    }
  ];

  return (
    <div className="min-h-screen bg-[#C8E8F5]">
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0" style={{ perspective: "1000px" }}>
          <motion.div
            animate={{ 
              rotateY: [0, 10, -10, 0],
              y: [0, -15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-32 h-20 bg-[#F0F7FC]/40 rounded-2xl backdrop-blur-sm shadow-2xl border border-[#8BA872]/30"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ scaleY: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute left-3 bottom-2 w-4 h-12 bg-[#8BA872]/70 rounded-full"
            />
            <motion.div
              animate={{ rotate: [0, 20, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute left-6 bottom-8 w-3 h-6 bg-[#8BA872]/60 rounded-full origin-bottom"
            />
            <div className="absolute right-4 bottom-2 flex gap-1">
              <motion.div
                animate={{ scaleY: [1, 0.9, 1.1, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="w-2 h-8 bg-[#C8E8F5]/80 rounded-full"
              />
              <motion.div
                animate={{ scaleY: [1, 1.2, 0.8, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="w-2 h-7 bg-[#C8E8F5]/80 rounded-full"
              />
              <motion.div
                animate={{ scaleY: [1, 0.8, 1.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="w-2 h-9 bg-[#C8E8F5]/80 rounded-full"
              />
            </div>
            <div className="absolute top-2 left-1 w-8 h-6 bg-[#8BA872]/50 rounded-sm">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full bg-[#C8E8F5]/30 rounded-sm"
              />
            </div>
          </motion.div>

          <motion.div
            animate={{ 
              rotateX: [0, 15, 0],
              rotateY: [0, 360],
              y: [0, -25, 0]
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-40 right-20 w-12 h-16 rounded-md backdrop-blur-sm shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
          />

          <motion.div
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 left-1/4 w-24 h-20 bg-[#F0F7FC]/40 rounded-lg backdrop-blur-sm shadow-2xl border border-[#8BA872]/20"
            style={{ transformStyle: "preserve-3d" }}
          />

          <motion.div
            animate={{ 
              rotateX: [360, 0],
              rotateZ: [0, 180, 360],
              y: [0, -30, 0],
              x: [0, 20, -20, 0]
            }}
            transition={{ 
              duration: 22,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-60 right-10 w-14 h-8 bg-[#8BA872]/40 rounded-lg backdrop-blur-sm shadow-xl"
            style={{ transformStyle: "preserve-3d" }}
          />
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
                  Transform Your
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
                  School Community
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
                Empower students, support educators, and create thriving learning environments 
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                with comprehensive mental health solutions designed specifically for schools.
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
                Schedule School Assessment
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
                Download Program Guide
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
              fill="url(#schoolWaveGradient)"
            />
            <defs>
              <linearGradient id="schoolWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8BA872" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#B7E3FF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7A9C61" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      <section className="py-20 bg-[#8BA872]">
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
                Programs by Age Group
              </motion.span>
            </motion.h2>
            <p className="text-xl text-gray-600">Tailored mental health support for every stage of development</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 justify-items-center max-w-6xl mx-auto">
            {ageGroups.map((group, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.02, 
                  rotateY: 3,
                  z: 40
                }}
                className="w-full max-w-sm mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white to-[#8BA872]/5 shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#8BA872]/10 group overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ 
                      rotateY: hoveredCard === index ? [0, 360] : 0 
                    }}
                    transition={{ duration: 1 }}
                    className="text-5xl sm:text-6xl mb-4 sm:mb-6 filter drop-shadow-lg flex justify-center"
                  >
                    {group.icon}
                  </motion.div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r ${group.gradient} bg-clip-text text-transparent text-center`}>
                    {group.title}
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base text-center">
                    {group.description}
                  </p>
                  <ul className="space-y-2 sm:space-y-3 text-left">
                    {group.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + featureIndex * 0.1 }}
                        className="flex items-center text-gray-700 text-sm sm:text-base"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-[#8BA872] to-[#7A9C61] rounded-full mr-3 shadow-lg" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#C8E8F5]">
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
              className="text-4xl md:text-5xl font-bold mb-4 text-[#8BA872]"
            >
              <motion.span
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Proven School Results
              </motion.span>
            </motion.h2>
            <p className="text-xl text-gray-600">Real impact on educational communities</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center max-w-5xl mx-auto">
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
                className="w-full max-w-xs text-center p-4 sm:p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-white to-[#8BA872]/5 shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#8BA872]/10"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#8BA872] to-[#7A9C61] bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-xs sm:text-sm md:text-base text-center leading-tight">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                Our School Solutions
              </motion.span>
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive mental health programs designed to support students, educators, 
              and create positive learning environments that foster academic and emotional success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 justify-items-center max-w-6xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 8px 40px 0 rgba(56,189,248,0.40)",
                  filter: "drop-shadow(0 0 16px #38bdf8)"
                }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className={
                  `relative w-full max-w-sm mx-auto p-6 sm:p-8 rounded-3xl bg-white shadow-[0_8px_32px_0_rgba(56,189,248,0.25)] ring-1 ring-sky-100 hover:shadow-[0_8px_40px_0_rgba(56,189,248,0.40)] hover:ring-2 hover:ring-sky-300 transition-all duration-500 group overflow-hidden`
                }
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ 
                      rotateY: hoveredCard === index ? [0, 360] : 0 
                    }}
                    transition={{ duration: 1 }}
                    className="text-5xl sm:text-6xl mb-4 sm:mb-6 filter drop-shadow-lg flex justify-center"
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base text-center">
                    {service.description}
                  </p>
                  <ul className="space-y-2 sm:space-y-3 text-left mb-4 sm:mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + featureIndex * 0.1 }}
                        className="flex items-center text-gray-700 text-sm sm:text-base"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-[#8BA872] to-[#7A9C61] rounded-full mr-3 shadow-lg flex-shrink-0" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.a
                    href="/book-session"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 sm:mt-6 w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#8BA872] to-[#7A9C61] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-block text-center text-sm sm:text-base"
                  >
                    Learn More
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#C8E8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, rotateZ: -5, scale: 0.9 }}
              whileInView={{ opacity: 1, rotateZ: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 text-[#8BA872]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.span
                initial={{ letterSpacing: "0.2em", opacity: 0 }}
                whileInView={{ letterSpacing: "0em", opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Educational Leaders Say
              </motion.span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 justify-items-center max-w-5xl mx-auto">
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
                className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#8BA872]/10 to-[#B7E3FF]/10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#8BA872]/20"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="text-[#8BA872] text-5xl sm:text-6xl mb-3 sm:mb-4 opacity-50 text-center">"</div>
                <p className="text-gray-700 text-base sm:text-lg mb-4 sm:mb-6 italic leading-relaxed text-center">{testimonial.quote}</p>
                <div className="border-t border-[#8BA872]/20 pt-3 sm:pt-4 text-center">
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base">{testimonial.author}</h4>
                  <p className="text-[#8BA872] font-medium text-xs sm:text-sm">{testimonial.position}</p>
                  <p className="text-gray-600 text-xs">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#8BA872] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Transform Your School?</motion.h2>
          <motion.a href="/book-session" className="px-12 py-4 bg-white text-[#8BA872] rounded-2xl font-bold text-xl shadow-2xl inline-block">Start Your Program Today</motion.a>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#8BA872] to-[#B7E3FF] bg-clip-text text-transparent mb-4">MyndZeal</div>
          <p className="text-gray-400">Empowering educational communities, one school at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default SchoolsPage;
