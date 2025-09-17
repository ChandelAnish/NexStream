'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Users, 
  Phone, 
  Bell, 
  Clock,
  User,
  Trophy,
  Star,
  Plus,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useRouter } from 'next/navigation'


interface RecentCall {
  id: string;
  name: string;
  type: 'p2p' | 'group';
  participants: number;
  duration: string;
  time: string;
}

interface Peer {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'in-call';
  avatar?: string;
  lastSeen?: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  time: string;
  type: 'gaming' | 'meeting';
  participants: string[];
}

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const router = useRouter();

  const [recentCalls] = useState<RecentCall[]>([
    { id: '1', name: 'Team Strategy Call', type: 'group', participants: 5, duration: '45m', time: '2h ago' },
    { id: '2', name: 'Alex Gaming Session', type: 'p2p', participants: 2, duration: '1h 23m', time: '4h ago' },
    { id: '3', name: 'Project Review', type: 'group', participants: 8, duration: '32m', time: '6h ago' },
  ]);

  const [peers] = useState<Peer[]>([
    { id: '1', name: 'Alex Chen', status: 'online' },
    { id: '2', name: 'Sarah Johnson', status: 'in-call' },
    { id: '3', name: 'Mike Rodriguez', status: 'online' },
    { id: '4', name: 'Emma Wilson', status: 'offline', lastSeen: '2h ago' },
    { id: '5', name: 'David Kim', status: 'online' },
    { id: '6', name: 'Lisa Zhang', status: 'in-call' },
  ]);

  const [upcomingEvents] = useState<UpcomingEvent[]>([
    { id: '1', title: 'Tournament Practice', time: '15:30', type: 'gaming', participants: ['You', 'Mike', 'Sarah'] },
    { id: '2', title: 'Client Presentation', time: '17:00', type: 'meeting', participants: ['You', 'Team Lead', '3 others'] },
  ]);

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const TopButton: React.FC<{
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
    gradient?: string;
  }> = ({ icon, title, onClick, gradient = 'from-cyan-500 to-blue-600' }) => (
    <motion.button
      onClick={onClick}
      className="flex-1"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300`}>
        <div className="flex flex-col items-center space-y-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
      </div>
    </motion.button>
  );

  const getStatusColor = (status: Peer['status']): string => {
    switch (status) {
      case 'online': 
        return 'bg-green-500';
      case 'in-call': 
        return 'bg-yellow-500';
      case 'offline': 
        return 'bg-gray-500';
      default: 
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Peer['status']): React.ReactNode => {
    switch (status) {
      case 'online': 
        return <Wifi className="w-3 h-3 text-green-400" />;
      case 'in-call': 
        return <Phone className="w-3 h-3 text-yellow-400" />;
      case 'offline': 
        return <WifiOff className="w-3 h-3 text-gray-400" />;
      default: 
        return <WifiOff className="w-3 h-3 text-gray-400" />;
    }
  };

  const handleAudioCall = (): void => {
    console.log('Audio Call');
  };

  const handleMeeting = (): void => {
    console.log('Meeting');
    router.push('/videoCalling');
  };

  const handleStreaming = (): void => {
    console.log('Streaming');
  };

  const handleCallPeer = (peerId: string): void => {
    console.log('Calling peer:', peerId);
  };

  const handleCallBack = (callId: string): void => {
    console.log('Calling back:', callId);
  };

  const handleAddPeer = (): void => {
    console.log('Add peer');
  };

  const handleViewAllCalls = (): void => {
    console.log('View all calls');
  };

  const handleAddSchedule = (): void => {
    console.log('Add schedule');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
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
            
            <div className="flex items-center space-x-4">
              <div className="text-cyan-400 font-mono text-lg">
                {currentTime}
              </div>
              <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Two Column Layout */}
          <div className="grid grid-cols-8 gap-8">
            {/* Left Column */}
            <div className="col-span-5 space-y-6">
              {/* Top Action Buttons */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-4"
              >
                <TopButton
                  icon={<Phone className="w-8 h-8" />}
                  title="Audio Call"
                  onClick={handleAudioCall}
                  gradient="from-green-500 to-emerald-600 cursor-pointer"
                />
                <TopButton
                  icon={<Users className="w-8 h-8" />}
                  title="Meeting"
                  onClick={handleMeeting}
                  gradient="from-blue-500 to-indigo-600 cursor-pointer"
                />
                <TopButton
                  icon={<Video className="w-8 h-8" />}
                  title="Streaming"
                  onClick={handleStreaming}
                  gradient="from-purple-500 to-pink-600 cursor-pointer"
                />
              </motion.div>

              {/* Bottom Section - Recent Calls and Peers */}
              <div className="grid grid-cols-2 gap-6">
                {/* Recent Calls */}
                <motion.div
                  variants={itemVariants}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 flex flex-col"
                  style={{ height: '485px' }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">Recent Calls</h2>
                    <button 
                      onClick={handleViewAllCalls}
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-3 flex-1 overflow-y-auto overflow-x-hidden">
                    {recentCalls.map((call) => (
                      <motion.div
                        key={call.id}
                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            call.type === 'p2p' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {call.type === 'p2p' ? <Phone className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{call.name}</p>
                            <p className="text-slate-400 text-xs">
                              {call.participants} participants • {call.duration}
                            </p>
                            <p className="text-slate-500 text-xs">{call.time}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleCallBack(call.id)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Phone className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Peers List */}
                <motion.div
                  variants={itemVariants}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 flex flex-col"
                  style={{ height: '485px' }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">Peers</h2>
                    <button 
                      onClick={handleAddPeer}
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      Add peer
                    </button>
                  </div>
                  <div className="space-y-3 flex-1 overflow-y-auto overflow-x-hidden">
                    {peers.map((peer) => (
                      <motion.div
                        key={peer.id}
                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-2 h-2 ${getStatusColor(peer.status)} rounded-full border border-slate-800`}></div>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{peer.name}</p>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(peer.status)}
                              <span className="text-slate-400 text-xs capitalize">
                                {peer.status === 'offline' && peer.lastSeen ? peer.lastSeen : peer.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        {peer.status !== 'offline' && (
                          <button 
                            onClick={() => handleCallPeer(peer.id)}
                            className="text-slate-400 hover:text-white"
                          >
                            <Phone className="w-3 h-3" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-3 space-y-6">
              {/* Profile Stats */}
              <motion.div
                variants={itemVariants}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Welcome back!</h3>
                  <p className="text-slate-400">Ready to stream?</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Trophy className="w-5 h-5 text-yellow-500 mr-1" />
                      <span className="text-2xl font-bold text-white">127</span>
                    </div>
                    <p className="text-slate-400 text-sm">Total Streams</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-5 h-5 text-cyan-500 mr-1" />
                      <span className="text-2xl font-bold text-white">4.9</span>
                    </div>
                    <p className="text-slate-400 text-sm">Rating</p>
                  </div>
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                variants={itemVariants}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Today&apos;s Schedule</h3>
                  <button 
                    onClick={handleAddSchedule}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-400 font-mono text-sm">{event.time}</span>
                        <div className={`w-3 h-3 rounded-full ${
                          event.type === 'gaming' ? 'bg-purple-500' : 'bg-blue-500'
                        }`}></div>
                      </div>
                      <h4 className="text-white font-medium">{event.title}</h4>
                      <p className="text-slate-400 text-sm">{event.participants.join(', ')}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;