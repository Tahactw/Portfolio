import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GiGears } from 'react-icons/gi';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
          e.target.closest('a') || e.target.closest('button')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-[100] mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 1.5 : 1,
            rotate: isHovering ? 180 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <GiGears className="text-3xl text-primary-500" />
        </motion.div>
      </motion.div>
      
      <motion.div
        className="fixed w-8 h-8 border-2 border-primary-500 rounded-full pointer-events-none z-[99]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 2 : 1,
          borderWidth: isHovering ? 1 : 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      />
    </>
  );
};

export default CustomCursor;