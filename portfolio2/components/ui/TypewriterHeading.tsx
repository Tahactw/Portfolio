'use client';

import { useTypewriter } from '@/hooks/useTypewriter';
import { motion } from 'framer-motion';
import { useState, useLayoutEffect, useRef } from 'react';

interface TypewriterHeadingProps {
  texts: string[];
  className?: string;
}

export function TypewriterHeading({ texts, className = '' }: TypewriterHeadingProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);
  const displayText = useTypewriter(texts, {
    typingSpeed: 120,
    deletingSpeed: 60,
    pauseDuration: 2000,
  });
  
  const longestText = texts.reduce((a, b) => a.length > b.length ? a : b, '');
  const measurementRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (measurementRef.current) {
      setMaxWidth(measurementRef.current.offsetWidth);
    }
  }, [texts]);

  return (
    <div
      className={`inline-flex justify-center items-center relative ${className}`}
      style={{ minWidth: maxWidth, minHeight: '1.2em' }} // Set min-width to prevent layout shift
    >
      {/* Hidden element for measurement */}
      <span ref={measurementRef} className="absolute invisible whitespace-nowrap">{longestText}</span>

      <h2 
        className={`font-display inline-block relative cursor-pointer`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="relative z-10">{displayText}</span>
        <motion.span 
          className="absolute bottom-0 h-full w-[2px] bg-accent-cyan"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-0 bg-accent-cyan/10 blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </h2>
    </div>
  );
}