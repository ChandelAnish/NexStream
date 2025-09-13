// components/about/MissionVision.tsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/publicPageComponents/Layout";
import { Eye, Target } from "lucide-react";

export default function MissionVision() {
  const darkMode = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Our Mission & Vision
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Vision */}
          <motion.div variants={itemVariants} className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              darkMode ? 'bg-teal-600' : 'bg-teal-500'
            }`}>
              <Eye className="w-10 h-10 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${
              darkMode ? 'text-teal-400' : 'text-teal-600'
            }`}>
              Vision
            </h3>
            <p className={`text-lg leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              To modernize healthcare infrastructure by equipping doctors with next-gen automation and advancing patients a seamless, on-demand care experience built for scale, speed, and trust.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div variants={itemVariants} className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              darkMode ? 'bg-teal-600' : 'bg-teal-500'
            }`}>
              <Target className="w-10 h-10 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${
              darkMode ? 'text-teal-400' : 'text-teal-600'
            }`}>
              Mission
            </h3>
            <p className={`text-lg leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              To revolutionize healthcare by creating a seamless, intelligent ecosystem that optimizes clinical workflows, enhances patient outcomes, and empowers healthcare professionals with innovative AI tools for doctors, patients, and the healthcare industry.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}