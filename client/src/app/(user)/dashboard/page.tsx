// app/(user)/dashboard/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Users 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// This is the component for the large buttons
const ActionButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient?: string;
}> = ({ icon, title, description, onClick, gradient = 'from-cyan-500 to-blue-600' }) => (
  <motion.button
    onClick={onClick}
    className="w-80" // Made button larger
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    variants={itemVariants} // Added item variant for staggered animation
  >
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 text-white hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300`}>
      <div className="flex flex-col items-center space-y-4">
        {icon}
        <span className="text-2xl font-bold">{title}</span>
        <p className="text-sm text-gray-200">{description}</p>
      </div>
    </div>
  </motion.button>
);

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};


const Dashboard: React.FC = () => {
  const router = useRouter();

  const handleMeeting = (): void => {
    console.log('Meeting');
    router.push('/videoCalling');
  };

  const handleStreaming = (): void => {
    console.log('Streaming');
    router.push('/stream');
  };

  return (
    // Main container to center content vertically and horizontally
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // This centers everything on the page.
      // min-h-[calc(100vh-250px)] accounts for navbar and padding.
      className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] text-center"
    >
      {/* Title Message */}
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to NexStream
        </h1>
        <p className="text-xl text-slate-400">
          What would you like to do today?
        </p>
      </motion.div>

      {/* Centered Buttons */}
      <motion.div 
        className="flex flex-col md:flex-row gap-8"
      >
        <ActionButton
          icon={<Users className="w-12 h-12" />}
          title="Start a Meeting"
          description="Create a room and invite your squad."
          onClick={handleMeeting}
          gradient="from-blue-500 to-indigo-600"
        />
        {/* ----- TEXT UPDATED HERE ----- */}
        <ActionButton
          icon={<Video className="w-12 h-12" />}
          title="Streaming"
          description="Watch live streams or start your own."
          onClick={handleStreaming}
          gradient="from-purple-500 to-pink-600"
        />
        {/* ----------------------------- */}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;