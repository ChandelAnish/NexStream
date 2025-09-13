'use client';

import { motion } from 'framer-motion';
import { Building2, FileCheck, Users } from 'lucide-react';

interface WhyDocspathSectionProps {
  darkMode: boolean;
}

export default function WhyDocspathSection({ darkMode }: WhyDocspathSectionProps) {
  const benefits = [
    {
      icon: Building2,
      title: 'Built for busy clinics and hospitals',
      description: 'Designed specifically for high-volume healthcare environments with complex workflows.'
    },
    {
      icon: FileCheck,
      title: 'Designed to reduce paperwork, errors, and burnout',
      description: 'Streamline administrative tasks and minimize human error with intelligent automation.'
    },
    {
      icon: Users,
      title: 'Empowers you to spend more time on patients, not admin',
      description: 'Focus on what matters most - providing excellent patient care while we handle the rest.'
    }
  ];

  return (
    <section className={`py-20 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-teal-600 text-white px-8 py-4 rounded-2xl inline-block"
            >
              <h2 className="text-3xl lg:text-4xl font-bold">Why Docspath?</h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className={`text-lg leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {`Managing a clinic shouldn't feel like a second job. DocsPath gives you a powerful 
              command center to control every part of your practice from the front desk to 
              follow-ups—with zero hassle.`}
            </motion.p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className={`font-semibold text-lg ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {benefit.title}
                    </h3>
                    <p className={`${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    } leading-relaxed`}>
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side - Doctor Team Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 shadow-2xl">
              {/* Background Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-teal-200 rounded-full opacity-30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-100 rounded-full opacity-40"
              />

              {/* Team Image Placeholder */}
              <div className="relative z-10 w-full h-80 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-2 gap-4 p-8">
                  {/* Doctor Avatars */}
                  {[1, 2, 3, 4].map((index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                    >
                      <span className="text-2xl">
                        {index === 1 ? '👨‍⚕️' : index === 2 ? '👩‍⚕️' : index === 3 ? '👨‍⚕️' : '👩‍⚕️'}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg p-3"
                >
                  <div className="text-white text-xs font-semibold">Happy Team</div>
                  <div className="text-white/80 text-xs">🎉 100% Satisfied</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}