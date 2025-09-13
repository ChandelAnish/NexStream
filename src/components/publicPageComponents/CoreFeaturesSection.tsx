'use client';

import React from 'react';
import { 
  Brain, 
  Users, 
  Calendar, 
  BarChart3, 
  Shield, 
  MessageSquare, 
  CreditCard, 
  FileText 
} from 'lucide-react';

interface CoreFeaturesSectionProps {
  darkMode: boolean;
}

export default function CoreFeaturesSection({ darkMode }: CoreFeaturesSectionProps) {
  const coreFeatures = [
    {
      icon: Brain,
      title: 'Smart Doctor Dashboard',
      description: 'Everything you need, at a glance from appointments to analytics. Intuitive, customizable, and fast.'
    },
    {
      icon: Users,
      title: 'Integrated OPD + Telemedicine',
      description: 'Seamlessly run both in-clinic and virtual consultations. Schedule, consult, prescribe, and follow-up from one place.'
    },
    {
      icon: Calendar,
      title: 'One-Tap Appointment & Patient Flow Management',
      description: 'Automate bookings, manage OPD queues, and reduce no-shows—without lifting a finger.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Dashboards & Insights',
      description: 'Make smarter decisions with real-time reports on patient flow, revenue, and care outcomes.'
    },
    {
      icon: Shield,
      title: 'Role-Based Access & Security',
      description: 'Keep data private with bank-grade encryption, customizable staff permissions, and full HIPAA/GDPR compliance.'
    },
    {
      icon: MessageSquare,
      title: 'Intelligent Communication Tools',
      description: 'Natural, human-like digital assistants handle patient queries, confirmations, reminders, and follow-ups—24/7.'
    },
    {
      icon: CreditCard,
      title: 'Automated Billing & Insurance Reconciliation',
      description: 'Instant invoicing, claims management, and payment tracking—all without manual work.'
    },
    {
      icon: FileText,
      title: 'EHR + E-Prescriptions',
      description: 'Access, update, and share digital health records instantly—secure, accurate, and integrated into your workflow.'
    }
  ];

  return (
    <section className={`py-20 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    } transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Core Features
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Everything you need to run a modern healthcare practice, integrated into one powerful platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="relative w-full h-[800px] flex items-center justify-center">
          {/* Central Circle */}
          <div className="absolute z-20 w-32 h-32 bg-teal-600 rounded-full flex items-center justify-center shadow-2xl">
            <div className="text-center text-white">
              <div className="text-lg font-bold">Core</div>
              <div className="text-lg font-bold">Features</div>
            </div>
          </div>

          {/* Feature Cards positioned around the circle */}
          {coreFeatures.map((feature, index) => {
            // Calculate angle for each feature (360 degrees / 8 features = 45 degrees each)
            const angle = (index * 45) - 90; // Start from top (-90 degrees)
            const angleRad = (angle * Math.PI) / 180;
            const radius = 280; // Distance from center
            
            // Calculate x, y positions
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            return (
              <div key={index}>
                {/* Connection Line */}
                <div 
                  className="absolute w-0.5 bg-gradient-to-r from-teal-300 to-teal-500 z-5"
                  style={{
                    height: `${radius - 64}px`, // Line length (radius minus half of central circle)
                    left: '50%',
                    top: '50%',
                    transformOrigin: '0 0',
                    transform: `rotate(${angle}deg) translate(64px, -1px)` // Start from edge of central circle
                  }}
                />
                
                {/* Feature Card */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`
                  }}
                >
                  <div className={`w-56 p-4 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-teal-600" />
                      </div>
                      <h3 className={`font-semibold text-sm leading-tight ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h3>
                    </div>
                    <p className={`text-xs leading-relaxed ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
}