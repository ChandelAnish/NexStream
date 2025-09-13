// components/about/LeadershipTeam.tsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/publicPageComponents/Layout";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
}

export default function LeadershipTeam() {
  const darkMode = useTheme();

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "CEO Name",
      role: "Chief Executive Officer",
      description: "Lorem ipsum dolor amet with local magnet dolar amet lorem adipiscing lorem. adipiscing cum lorem ipsum delor amet cum magnet adipiscing lorem",
      image: "/api/placeholder/300/300"
    },
    {
      id: 2,
      name: "CTO Name",
      role: "Chief Technology Officer",
      description: "Lorem ipsum dolor amet with local magnet dolar amet lorem adipiscing dolar amet lorem adipiscing lorem",
      image: "/api/placeholder/300/300"
    },
    {
      id: 3,
      name: "CMO Name",
      role: "Chief Marketing Officer",
      description: "Lorem ipsum dolor amet with local magnet dolar amet lorem adipiscing lorem. adipiscing cum lorem ipsum delor amet cum",
      image: "/api/placeholder/300/300"
    },
    {
      id: 4,
      name: "HR Name",
      role: "Human Resources",
      description: "Lorem ipsum dolor amet with local magnet dolar amet lorem adipiscing cum lorem ipsum",
      image: "/api/placeholder/300/300"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      darkMode ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className={`text-3xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Leadership Team
          </h2>
          <p className={`text-lg leading-relaxed max-w-4xl ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Meet the minds shaping the future of digital healthcare—a team of healthcare professionals, AI engineers, and innovation leaders dedicated to building intelligent systems that work for both doctors and patients.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-700 hover:shadow-2xl' 
                  : 'bg-white hover:shadow-2xl'
              }`}
            >
              <div className="aspect-square relative overflow-hidden">
                <div className={`w-full h-full flex items-center justify-center ${
                  darkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  {/* Placeholder for team member image */}
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-gray-500' : 'bg-gray-300'
                  }`}>
                    <span className={`text-2xl font-bold ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className={`text-lg font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {member.name}
                </h3>
                <p className={`text-sm font-medium mb-3 ${
                  darkMode ? 'text-teal-400' : 'text-teal-600'
                }`}>
                  {member.role}
                </p>
                <p className={`text-sm leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {member.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}