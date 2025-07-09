'use client';

import { motion } from 'framer-motion';
import { Experience } from '@/lib/data';
import { format } from 'date-fns';

export function Timeline({ experiences }: { experiences: Experience[] }) {
  if (!experiences.length) {
    return <div className="text-center text-text-secondary py-10">No experience to display.</div>;
  }
  
  return (
    <div className="relative pl-8">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-warm via-accent-earth to-accent-leaf" />
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <motion.div 
            key={exp.id} 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true, amount: 0.5 }} 
            transition={{ duration: 0.5, delay: index * 0.1 }} 
            className="relative"
          >
            <div className="absolute -left-10 top-1 w-4 h-4 bg-accent-warm rounded-full ring-4 ring-bg-primary z-10" />
            <div className="glass-heavy rounded-xl p-6 hover:bg-text-primary/5 transition-colors">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold">{exp.title}</h3>
                  <p className="text-accent-earth font-medium">{exp.company}</p>
                </div>
                <span className="text-sm text-text-secondary whitespace-nowrap sm:ml-4 mt-2 sm:mt-0">
                  {format(new Date(exp.startDate), 'MMM yyyy')} - 
                  {exp.current ? ' Present' : ` ${exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'N/A'}`}
                </span>
              </div>
              <p className="text-text-secondary mb-4 whitespace-pre-wrap">{exp.description}</p>
              {exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span key={skill} className="text-xs px-2 py-1 rounded bg-accent-earth/10 text-text-secondary hover:bg-accent-earth/20 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}