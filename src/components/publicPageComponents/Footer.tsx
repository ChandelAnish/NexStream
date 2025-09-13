'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Linkedin, Instagram } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Integrations', 'API Documentation'],
    Company: ['About Us', 'Careers', 'Press', 'Contact'],
    Resources: ['Blog', 'Help Center', 'Community', 'Webinars'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
  };

  const socialLinks = [
    { icon: MessageCircle, href: '#', name: 'WhatsApp' },
    { icon: Linkedin, href: '#', name: 'LinkedIn' },
    { icon: Instagram, href: '#', name: 'Instagram' },
  ];

  return (
    <footer className={`${
      darkMode ? 'bg-gray-900' : 'bg-teal-700'
    } text-white transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Company Info */}
          <div className="lg:col-span-2">
            <motion.div 
              className="flex items-center space-x-2 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-teal-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              <span className="text-white font-bold text-xl">Docspath</span>
            </motion.div>
            <p className="text-teal-100 mb-6 text-sm leading-relaxed">
              Transform your medical practice with our comprehensive clinic management platform. 
              Built for doctors, trusted by thousands.
            </p>
            <div className="text-xs text-teal-200">
              <p className="mb-1">Copyright © 2025 Medycall</p>
              <p>Powered by Healtheck</p>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="text-teal-100 hover:text-white transition-colors duration-200 text-sm"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-teal-600 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <motion.button
                className="bg-white text-teal-700 px-6 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join us
              </motion.button>
              <motion.button
                className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-teal-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Request Demo
              </motion.button>
              <motion.button
                className="text-teal-100 hover:text-white transition-colors duration-200 font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                Blog
              </motion.button>
            </div>

            {/* Social Links and Certifications */}
            <div className="flex items-center space-x-6">
              {/* Social Media */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="text-teal-100 hover:text-white transition-colors duration-200"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>

              {/* Certification Badges */}
              <div className="flex items-center space-x-3">
                <motion.div
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold"
                  whileHover={{ scale: 1.1 }}
                >
                  DPIIT
                </motion.div>
                <motion.div
                  className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold"
                  whileHover={{ scale: 1.1 }}
                >
                  Startup India
                </motion.div>
              </div>

              {/* Payment Icons */}
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-blue-600 font-bold text-xs">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-red-600 font-bold text-xs">MC</span>
                </div>
              </div>
            </div>
          </div>

          {/* App Store Badges */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6 justify-center lg:justify-end">
            <motion.div
              className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-white">
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </motion.div>
            <motion.div
              className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-white">
                <div className="text-xs">GET IT ON</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </motion.div>
          </div>

          {/* Trust & Compliance */}
          <div className="text-center mt-8">
            <p className="text-teal-200 text-sm">
              Trust & compliance badges • HIPAA Compliant • SOC 2 Certified • ISO 27001
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}