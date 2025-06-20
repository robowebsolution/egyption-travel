
import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-gradient-egyptian py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-gold">
            Traveler Stories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from travelers who discovered the magic of Egypt with us
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            Comprehensive testimonials page with filtering and detailed reviews coming soon...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
