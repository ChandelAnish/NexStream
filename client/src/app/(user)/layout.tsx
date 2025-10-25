'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../firebase/config'; 
import { signOut } from 'firebase/auth';

// This is the new layout component
export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const [currentTime, setCurrentTime] = useState<string>('');
  const router = useRouter();

  // Effect for updating the clock
  useEffect(() => {
    const updateTime = (): void => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear any relevant session/local storage
      window.sessionStorage.removeItem('userData');
      window.sessionStorage.removeItem('signupFormData');
      // Redirect to sign-in page
      router.push('/sign-in');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    // This wrapper applies the background and min-height
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Header (Navbar) */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">NexStream</h1>
            </div>
            
            <div className="flex items-center space-x-16">
              <div className="text-cyan-400 font-mono text-lg">
                {currentTime}
              </div>
              
              <button 
                onClick={handleLogout}
                title="Logout"
                className="text-red-500 hover:text-red-400 transition-colors duration-200 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* This div wraps the actual page content (your dashboard, stream, etc.) */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}