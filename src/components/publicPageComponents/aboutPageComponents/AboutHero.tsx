// components/about/AboutHero.tsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/publicPageComponents/Layout";
import { Globe } from "lucide-react";

export default function AboutHero() {
  const darkMode = useTheme();

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${
      darkMode ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Globe icon and About Us */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center lg:items-start"
          >
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 ${
              darkMode ? 'bg-teal-600' : 'bg-teal-500'
            }`}>
              <Globe className="w-16 h-16 text-white" />
            </div>
            <div className={`p-8 rounded-lg ${
              darkMode ? 'bg-teal-700' : 'bg-teal-600'
            }`}>
              <h1 className="text-3xl font-bold text-white mb-4">About Us</h1>
              <p className="text-teal-50 leading-relaxed">
                Our cutting-edge technology bridges the gap between doctors and digital transformation—enabling faster, smarter, and more connected care.
              </p>
            </div>
          </motion.div>

          {/* Right side - Main content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h2 className={`text-2xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                At <span className="text-teal-600">Docspath</span> we are revolutionizing
              </h2>
              <p className={`text-lg leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                healthcare by equipping doctors with an AI-powered, unified dashboard that streamlines patient management, enhances clinical decision-making, and drives operational excellence.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}