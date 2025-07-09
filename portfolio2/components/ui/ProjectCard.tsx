'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/lib/data';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export function ProjectCard({ project }: { project: Project }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isGif = project.thumbnail.endsWith('.gif');

  return (
    <motion.div 
      variants={item} 
      whileHover={{ y: -5, scale: 1.02 }} 
      transition={{ type: "spring", stiffness: 300 }}
      layout
    >
      <Link href={`/projects/${project.id}`} className="group relative block">
        <div className="relative aspect-video rounded-xl overflow-hidden glass">
          {isGif ? (
            <img 
              src={project.thumbnail} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <Image 
              src={project.thumbnail} 
              alt={project.title} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
              className="object-cover transition-transform duration-500 group-hover:scale-110" 
              onLoad={() => setImageLoaded(true)}
            />
          )}
          
          {!imageLoaded && (
            <div className="absolute inset-0 bg-arena-floor animate-pulse" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-arena-dark/90 via-arena-dark/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.div 
              className="w-12 h-12 rounded-full bg-accent-cyan/20 backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowUpRight className="w-6 h-6 text-accent-cyan" />
            </motion.div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold mb-2 truncate font-display group-hover:text-accent-cyan transition-colors">
              {project.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded bg-accent-purple/20 text-accent-purple font-display uppercase">
                {project.category}
              </span>
              <div className="flex gap-1">
                {project.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-arena-floor/80 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
                {project.tags.length > 2 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-arena-floor/80 backdrop-blur-sm">
                    +{project.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}