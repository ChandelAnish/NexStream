'use client';

import { motion } from 'framer-motion';
import { Building, Stethoscope, Wifi } from 'lucide-react';

interface TargetAudienceSectionProps {
  darkMode: boolean;
}

export default function TargetAudienceSection({ darkMode }: TargetAudienceSectionProps) {
  const audiences = [
    {
      icon: Building,
      title: 'Hospitals & Specialty Clinics',
      description: 'Reduce overhead, enhance team coordination, and streamline patient care—without expanding your staff.',
      image: '🏥',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Stethoscope,
      title: 'Independent Doctors & Telemedicine Providers',
      description: 'Launch a fully functional AI-enabled clinic in minutes. Automate your backend and focus on patients.',
      image: '👩‍⚕️',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <section className={`py-20 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Who is this for?
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Our platform is designed for modern healthcare teams and visionaries who want to 
            grow smarter—not just bigger.
          </p>
        </motion.div>

        {/* Audience Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {audiences.map((audience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className={`rounded-2xl overflow-hidden shadow-xl ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              } transition-all duration-300`}
            >
              {/* Header with Icon and Title */}
              <div className={`bg-gradient-to-r ${audience.color} p-6 text-white`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <audience.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{audience.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className={`text-lg leading-relaxed mb-6 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {audience.description}
                </p>

                {/* Image Placeholder */}
                <div className={`w-full h-48 bg-gradient-to-br ${audience.color.replace('to-', 'to-').replace('from-', 'from-').replace('-500', '-50').replace('-600', '-100')} rounded-xl flex items-center justify-center text-6xl`}>
                  {audience.image}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features for Telemedicine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className={`rounded-2xl p-8 ${
            darkMode ? 'bg-gray-900' : 'bg-teal-50'
          } border ${
            darkMode ? 'border-gray-700' : 'border-teal-200'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Special Focus: Telemedicine
                </h3>
              </div>
              <p className={`text-lg leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Built for the future of healthcare delivery. Our platform seamlessly integrates 
                virtual consultations with traditional practice management, giving you the tools 
                to serve patients anywhere, anytime.
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl h-48 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-4xl mb-2">💻</div>
                <div className="text-xl font-semibold">Virtual Care</div>
                <div className="text-sm opacity-80">Anywhere, Anytime</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className={`text-lg mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Ready to transform your practice?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Free Trial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300`}
            >
              Schedule Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}