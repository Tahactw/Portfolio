'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/data';
import { ProjectCard } from './ProjectCard';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">No projects found in this category.</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={projects.map(p => p.id).join('-')}
        variants={container}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}