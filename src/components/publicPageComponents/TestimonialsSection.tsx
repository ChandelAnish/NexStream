'use client';

import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TestimonialsSectionProps {
  darkMode: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  rating: number;
  avatar: string;
}

export default function TestimonialsSection({ darkMode }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Dr. Aakash Mehta",
      title: "Cardiologist",
      content: "This platform has completely transformed the way I manage my clinic. AI-powered automation has saved me hours of manual work.",
      rating: 5,
      avatar: "AM"
    },
    {
      id: 2,
      name: "Dr. Priya Nair",
      title: "General Physician",
      content: "Patient engagement and appointment management have never been this seamless. Highly recommend for doctors.",
      rating: 5,
      avatar: "PN"
    },
    {
      id: 3,
      name: "Dr. Sarah Johnson",
      title: "Pediatrician",
      content: "Love the intuitive interface and comprehensive features. It has streamlined our entire practice management process.",
      rating: 5,
      avatar: "SJ"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

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
    <section className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-teal-600 text-black'} py-16`}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-12"
          >
            What Doctors Say About DocsPath
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="flex justify-center space-x-6 overflow-hidden">
              {testimonials.map((testimonial, index) => {
                const isActive = index === currentIndex;
                const isNext = index === (currentIndex + 1) % testimonials.length;
                const isPrev = index === (currentIndex - 1 + testimonials.length) % testimonials.length;

                return (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isActive ? 1 : isPrev || isNext ? 0.7 : 0,
                      scale: isActive ? 1 : 0.9,
                      x: isActive ? 0 : isNext ? 100 : isPrev ? -100 : 0
                    }}
                    transition={{ duration: 0.5 }}
                    className={`rounded-lg p-6 shadow-lg min-w-[320px] max-w-[320px] transition-colors duration-500 ${
                      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                    } ${!isActive && !isPrev && !isNext ? 'hidden' : ''}`}
                  >
                    {/* Quote Icon */}
                    <div className={`text-6xl leading-none mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-200'}`}>&quot;</div>

                    {/* Stars */}
                    <div className="flex space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-6 leading-relaxed`}>
                      {testimonial.content}
                    </p>

                    {/* Doctor Info */}
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                        darkMode ? 'bg-gray-700 text-teal-200' : 'bg-teal-100 text-teal-600'
                      }`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className={`${darkMode ? 'text-white' : 'text-gray-800'} font-semibold`}>{testimonial.name}</h4>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{testimonial.title}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
                darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextTestimonial}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
                darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentIndex
                      ? 'bg-white'
                      : darkMode ? 'bg-white/40' : 'bg-white/60'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
