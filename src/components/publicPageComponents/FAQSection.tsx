'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface FAQSectionProps {
  darkMode: boolean;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function FAQSection({ darkMode }: FAQSectionProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      id: 0,
      question: "How does DocsPath improve clinical operations?",
      answer: "It automates appointments, billing, patient communications, EHR management, and more—giving you back time to focus on patients."
    },
    {
      id: 1,
      question: "Can this system integrate with what I already use?",
      answer: "Yes, DocsPath integrates seamlessly with most existing healthcare systems, EHRs, and third-party applications through our comprehensive API and integration capabilities."
    },
    {
      id: 2,
      question: "Is patient data secure?",
      answer: "Absolutely. We implement bank-grade encryption, HIPAA compliance, role-based access controls, and regular security audits to ensure your patient data is completely secure."
    },
    {
      id: 3,
      question: "Do I need to train my staff?",
      answer: "Our platform is designed to be intuitive and user-friendly. We provide comprehensive onboarding, training materials, and ongoing support to ensure your team is comfortable using the system."
    },
    {
      id: 4,
      question: "How do I get started?",
      answer: "Simply sign up for a free trial, customize your dashboard, and start managing your practice more efficiently. Our team will guide you through the setup process."
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} relative overflow-hidden`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
        <HelpCircle className="w-full h-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* FAQ Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={itemVariants}
              className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}
            >
              Frequently asked questions
            </motion.h2>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <motion.div
                  key={faq.id}
                  variants={itemVariants}
                  className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'} overflow-hidden`}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className={`w-full text-left p-6 flex items-center justify-between hover:${darkMode ? 'bg-gray-600' : 'bg-gray-50'} transition-colors duration-200`}
                  >
                    <span className={`font-semibold pr-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${openFAQ === faq.id ? 'bg-teal-600' : darkMode ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center transition-colors duration-200`}>
                      {openFAQ === faq.id ? (
                        <Minus className="w-4 h-4 text-white" />
                      ) : (
                        <Plus className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                      >
                        <div className="p-6">
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Illustration/Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center items-center"
          >
            <div className="relative">
              {/* Doctor Image Placeholder */}
              <div className={`w-80 h-96 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-2xl flex items-center justify-center overflow-hidden relative`}>
                {/* Doctor Silhouette */}
                <div className="w-48 h-64 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full relative">
                  {/* Stethoscope */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-teal-400 rounded-full"></div>
                  {/* Medical Cross */}
                  <div className="absolute top-8 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-teal-600" />
                  </div>
                </div>
                
                {/* Question Mark Decoration */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-10 h-10 text-white/60" />
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-12 w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center"
              >
                <Plus className="w-8 h-8 text-teal-600" />
              </motion.div>
              
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-8 bottom-12 w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center"
              >
                <HelpCircle className="w-6 h-6 text-teal-600" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}