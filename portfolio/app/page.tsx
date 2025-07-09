'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TypewriterHeading } from '@/components/ui/TypewriterHeading';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-6xl md:text-8xl font-display font-bold">
          TAHA MOHAMMED
        </h1>
        <TypewriterHeading
          texts={[
            'Mechatronics Engineer',
            'Creative Developer',
            '3D Artist',
            'Video Editor',
          ]}
          className="text-2xl md:text-3xl text-accent-cyan mt-4"
        />
      </motion.div>
      <motion.div
        className="mt-12 flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      >
        <Link href="/projects" className="button-primary">
          View Projects
        </Link>
        <Link href="/about" className="button-secondary">
          About Me
        </Link>
      </motion.div>
    </main>
  );
}