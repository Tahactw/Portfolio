'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-16">
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full border-2 border-arena-border text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:text-white hover:border-white transition-colors"
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft size={18} />
      </motion.button>
      
      {pageNumbers.map(number => (
        <motion.button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-10 h-10 rounded-full border-2 font-display text-sm transition-colors ${
            currentPage === number
              ? 'bg-accent-cyan text-arena-dark border-accent-cyan'
              : 'bg-transparent border-arena-border text-text-secondary hover:text-white hover:border-white'
          }`}
          whileTap={{ scale: 0.9 }}
        >
          {number}
        </motion.button>
      ))}

      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full border-2 border-arena-border text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:text-white hover:border-white transition-colors"
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight size={18} />
      </motion.button>
    </div>
  );
}