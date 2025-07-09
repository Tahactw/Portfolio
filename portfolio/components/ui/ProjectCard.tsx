'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/lib/data';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div variants={item} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Link href={`/projects/${project.id}`} className="group relative block">
        <div className="relative aspect-video rounded-xl overflow-hidden glass">
          <Image 
            src={project.thumbnail} 
            alt={project.title} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-bg-primary/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-accent-warm/20 backdrop-blur-sm flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-accent-warm" />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold mb-1 truncate">{project.title}</h3>
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded bg-accent-earth/20 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-xs px-2 py-0.5 rounded bg-accent-earth/20 backdrop-blur-sm">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}