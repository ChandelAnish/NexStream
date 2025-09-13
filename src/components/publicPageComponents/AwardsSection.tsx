'use client';

import { motion } from 'framer-motion';
import { Award, Trophy, Star } from 'lucide-react';

interface AwardsSectionProps {
  darkMode: boolean;
}

export default function AwardsSection({ darkMode }: AwardsSectionProps) {
    console.log(darkMode)
  const awards = [
    {
      id: 1,
      title: "HealthTech Excellence 2024",
      description: "Lorem ipsum dolor sit lorem magna aliqua enim ad minim veniam elit eiusmod tempor",
      image: "/api/placeholder/280/200"
    },
    {
      id: 2,
      title: "Innovation Award",
      description: "Lorem ipsum dolor sit lorem magna aliqua enim ad minim veniam elit eiusmod tempor",
      image: "/api/placeholder/280/200"
    },
    {
      id: 3,
      title: "Best Healthcare Platform",
      description: "Lorem ipsum dolor sit lorem magna aliqua enim ad minim veniam elit eiusmod tempor",
      image: "/api/placeholder/280/200"
    }
  ];

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
    <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemVariants}
            className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-800'}`}
          >
            Recognized & Awarded
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award) => (
              <motion.div
                key={award.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                {/* Award Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
                  {/* Spotlight Effect */}
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
                  
                  {/* Award Icon */}
                  <Trophy className="w-16 h-16 text-white relative z-10" />
                  
                  {/* Decorative Elements */}
                  <div className="absolute bottom-4 right-4 flex space-x-1">
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                  </div>
                </div>

                {/* Award Content */}
                <div className="p-6">
                  <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {award.title}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    {award.description}
                  </p>
                  
                  {/* Award Badge */}
                  <div className="mt-4 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-teal-600" />
                    <span className={`text-sm font-medium ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                      Certified Award
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Recognition */}
          <motion.div
            variants={itemVariants}
            className={`mt-12 text-center p-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`}
          >
            <div className="flex justify-center items-center space-x-4 mb-4">
              <Trophy className={`w-8 h-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Industry Leader in Healthcare Technology
              </h3>
              <Trophy className={`w-8 h-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            </div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Continuously recognized by healthcare professionals and industry experts for innovation, 
              reliability, and exceptional user experience in medical practice management.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}