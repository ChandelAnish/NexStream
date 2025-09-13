'use client';

import { motion } from 'framer-motion';
import { Calendar, FileText, Database, Zap } from 'lucide-react';

interface HeroSectionProps {
  darkMode: boolean;
}

export default function HeroSection({ darkMode }: HeroSectionProps) {
  const features = [
    { icon: Calendar, text: 'Streamline Appointments' },
    { icon: FileText, text: 'Simplify Billing' },
    { icon: Database, text: 'Digitize Records' },
    { icon: Zap, text: 'Deliver SmartCare' },
  ];

  return (
    <section className={`min-h-screen flex items-center pt-16 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-teal-50'
    } transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`text-5xl lg:text-6xl font-bold leading-tight ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Transform Your Practice{' '}
                <span className="text-teal-600 block">Effortlessly</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className={`text-lg leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Welcome to <span className="font-semibold text-teal-600">DocsPath</span>...
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className={`text-base leading-relaxed ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                a smarter way to run your clinic. From automated scheduling to intelligent 
                patient communication and real-time analytics, everything you need is unified 
                in one powerful platform.
              </motion.p>
            </div>

            {/* Feature Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-3"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                    darkMode 
                      ? 'bg-gray-800 text-gray-300' 
                      : 'bg-white text-gray-700'
                  } shadow-sm border ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <feature.icon className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Badge */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Built for doctors. Trusted by thousands. Ready for you.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  darkMode ? 'hover:bg-teal-600' : ''
                }`}
              >
                Request a Demo
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Background Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-32 h-32 bg-teal-100 rounded-full opacity-20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-200 rounded-full opacity-30"
              />
              
              {/* Doctor Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative z-10 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 shadow-2xl"
              >
                <div className="w-full h-96 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                  {/* Placeholder for doctor image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-teal-600/20">
                    <div className="absolute bottom-0 right-0 w-64 h-80 bg-white/10 rounded-tl-3xl flex items-end justify-center p-6">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl">👩‍⚕️</span>
                        </div>
                        <p className="text-sm opacity-80">Professional Healthcare</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard Mockup */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="absolute top-4 left-4 bg-white rounded-lg p-4 shadow-lg"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-teal-600 rounded-full"></div>
                      </div>
                      <div className="text-xs font-semibold text-gray-800">Analytics Dashboard</div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-24 h-2 bg-teal-200 rounded"></div>
                      <div className="w-16 h-2 bg-blue-200 rounded"></div>
                      <div className="w-20 h-2 bg-green-200 rounded"></div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}