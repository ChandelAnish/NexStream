// components/about/Partnership.tsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/publicPageComponents/Layout";

interface Partner {
  id: number;
  name: string;
  logo: string;
}

export default function Partnership() {
  const darkMode = useTheme();

  const partners: Partner[] = [
    { id: 1, name: "Coinbase", logo: "Coinbase" },
    { id: 2, name: "NASA", logo: "NASA" },
    { id: 3, name: "Netflix", logo: "NETFLIX" },
    { id: 4, name: "Pinterest", logo: "Pinterest" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${
      darkMode ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Partnership
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            We collaborate with top healthcare providers, research institutions, and medical organizations to enhance patient outcomes. Our partners include:
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center"
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center p-6"
            >
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}>
                {partner.logo}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional partnership logos row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-60"
        >
          <div className={`text-lg font-semibold ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Microsoft
          </div>
          <div className={`text-lg font-semibold ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Google Cloud
          </div>
          <div className={`text-lg font-semibold ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Amazon Web Services
          </div>
          <div className={`text-lg font-semibold ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            IBM Watson
          </div>
        </motion.div>
      </div>
    </section>
  );
}