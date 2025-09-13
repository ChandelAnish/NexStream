'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface HowItWorksSectionProps {
  darkMode: boolean;
}

export default function HowItWorksSection({ darkMode }: HowItWorksSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`bg-teal-600 text-white py-8 px-6 rounded-t-2xl`}
        >
          <h2 className="text-3xl font-bold text-center">How It Works</h2>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-b-2xl shadow-lg`}
        >
          <motion.h3
            variants={itemVariants}
            className={`text-2xl font-semibold mb-12 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}
          >
            Get Started in 3 Simple Steps
          </motion.h3>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Steps */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div className={`flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
                  <h4 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Sign Up & Set Up
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Create your account and personalize your clinic&apos;s dashboard.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center font-bold`}>
                    2
                  </div>
                </div>
                <div className={`flex-1 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} p-6 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <h4 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Configure & Customize
                  </h4>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Set up your preferences and integrate with existing systems.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center font-bold`}>
                    3
                  </div>
                </div>
                <div className={`flex-1 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} p-6 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <h4 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Go Live & Transform
                  </h4>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Start managing your practice effortlessly with our platform.
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
              >
                Start free trial
              </motion.button>
            </motion.div>

            {/* Video Placeholder */}
            <motion.div
              variants={itemVariants}
              className="bg-teal-600 rounded-2xl aspect-video flex items-center justify-center cursor-pointer hover:bg-teal-700 transition-colors duration-300"
            >
              <Play className="w-16 h-16 text-white" fill="white" />
            </motion.div>
          </div>

          {/* Trust Section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <h4 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Trusted by 10,000+ Doctors, Clinics, and Hospitals Worldwide
            </h4>
            
            {/* Company Logos */}
            <div className="flex justify-center items-center space-x-8 opacity-60">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className={`w-12 h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg flex items-center justify-center`}
                >
                  <div className={`w-8 h-8 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded`}></div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}