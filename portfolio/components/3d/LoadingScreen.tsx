'use client';

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }} 
      className="fixed inset-0 bg-bg-primary z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-text-secondary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-accent-warm border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Loading Experience</h2>
        <p className="text-text-secondary loading-dots">Preparing fantasy world</p>
      </div>
    </motion.div>
  );
}