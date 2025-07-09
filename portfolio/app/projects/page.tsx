'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypewriterHeading } from '@/components/ui/TypewriterHeading';
import Image from 'next/image';
import { Pagination } from '@/components/ui/Pagination';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  brief: string;
  link: string;
}

const categories = ['All', 'Mechatronics', 'Video Montage', '3D Art'];
const PROJECTS_PER_PAGE = 6;

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[4/3] rounded-2xl overflow-hidden glass-heavy"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      layout
    >
      <Image
        src={project.thumbnail}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <motion.div
          className="transition-transform duration-300 group-hover:-translate-y-12"
        >
          <span className="px-3 py-1 text-xs font-display uppercase tracking-wider bg-accent-purple/80 text-white rounded-full">
            {project.category}
          </span>
          <h3 className="mt-2 text-2xl font-display text-white">{project.title}</h3>
        </motion.div>
        <motion.p
          className="absolute bottom-6 left-6 right-6 text-text-secondary transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        >
          {project.brief}
        </motion.p>
      </div>
    </motion.a>
  );
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/data?type=projects');
        if (!res.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data);
          setFilteredProjects(data);
        } else {
          throw new Error('Fetched data is not an array');
        }
      } catch (error) {
        toast.error('Could not load projects.');
        console.error(error);
        // Ensure filteredProjects remains an array even on error
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilter = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page on filter change
    if (category === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === category));
    }
  };

  const indexOfLastProject = currentPage * PROJECTS_PER_PAGE;
  const indexOfFirstProject = indexOfLastProject - PROJECTS_PER_PAGE;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  return (
    <main className="min-h-screen bg-arena-dark overflow-y-auto scrollable-content">
      <div className="container mx-auto px-4 pt-40 pb-24">
        <div className="text-center mb-16">
          <TypewriterHeading texts={['PROJECTS', 'MY WORK', 'CASE STUDIES']} className="text-5xl md:text-7xl mb-4" />
          <p className="text-xl text-text-secondary max-w-2xl mx-auto animate-fade-in">
            A curated selection of my creative and technical work.
          </p>
        </div>

        <motion.div
          className="flex justify-center gap-4 mb-12 flex-wrap"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilter(category)}
              className={`px-6 py-2 rounded-full border-2 transition-all font-display uppercase tracking-wider text-sm
                ${activeCategory === category
                  ? 'bg-accent-cyan text-arena-dark border-accent-cyan'
                  : 'bg-transparent border-arena-border text-text-secondary hover:text-white hover:border-white'
                }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="loading-dots text-text-secondary">Loading projects</div>
          </div>
        ) : (
          <>
            {currentProjects.length > 0 ? (
                <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence>
                  {currentProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20 text-text-secondary">
                No projects found in this category.
              </div>
            )}
            <Pagination 
              totalItems={filteredProjects.length}
              itemsPerPage={PROJECTS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </main>
  );
}