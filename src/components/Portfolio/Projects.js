import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { GiGears, GiCircuitry, GiRobotGolem } from 'react-icons/gi';
import { useData } from '../../contexts/DataContext';
import ProjectCard from './ProjectCard';

const Projects = () => {
  const { publishedData } = useData();
  const { projects } = publishedData;
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Projects', icon: GiGears },
    { id: 'mechatronics', name: 'Mechatronics', icon: GiCircuitry },
    { id: 'videoEditing', name: 'Video Editing', icon: GiRobotGolem },
    { id: 'animation3d', name: '3D Animation', icon: GiRobotGolem }
  ];

  const getAllProjects = () => {
    const allProjects = [];
    Object.entries(projects).forEach(([category, projectList]) => {
      projectList.forEach(project => {
        allProjects.push({ ...project, category });
      });
    });
    return allProjects;
  };

  const getFilteredProjects = () => {
    if (activeCategory === 'all') {
      return getAllProjects();
    }
    return projects[activeCategory]?.map(project => ({ ...project, category: activeCategory })) || [];
  };

  const filteredProjects = getFilteredProjects();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-primary-500 to-mech-teal bg-clip-text text-transparent">
            My Projects
          </h1>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="text-xl" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl text-gray-300 dark:text-gray-700 mb-4">
                  <GiGears />
                </div>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  No projects in this category yet.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;