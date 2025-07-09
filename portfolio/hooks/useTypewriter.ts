'use client';

import { useState, useEffect, useRef } from 'react';

type TypewriterOptions = {
  loop?: boolean;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
};

export function useTypewriter(
  texts: string[],
  options: TypewriterOptions = {}
): string {
  const { 
    loop = true, 
    typingSpeed = 100, 
    deletingSpeed = 50, 
    pauseDuration = 1500 
  } = options;

  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleTyping = () => {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        if (displayedText.length > 0) {
          setDisplayedText(prev => prev.slice(0, -1));
          timeoutRef.current = setTimeout(handleTyping, deletingSpeed);
        } else {
          setIsDeleting(false);
          setTextIndex(prev => (prev + 1) % texts.length);
        }
      } else {
        if (displayedText.length < currentText.length) {
          setDisplayedText(prev => currentText.slice(0, prev.length + 1));
          timeoutRef.current = setTimeout(handleTyping, typingSpeed);
        } else {
          if (loop || textIndex < texts.length - 1) {
            timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        }
      }
    };
    
    timeoutRef.current = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timeoutRef.current);
  }, [displayedText, isDeleting, textIndex, texts, loop, typingSpeed, deletingSpeed, pauseDuration]);

  return displayedText;
}