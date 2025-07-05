import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub, FiPlay } from 'react-icons/fi';
import { GiGears } from 'react-icons/gi';

const ProjectCard = ({ project, index }) => {
  const categoryColors = {
    mechatronics: 'from-mech-orange to-red-500',
    videoEditing: 'from-mech-teal to-blue-500',
    animation3d: 'from-mech-purple to-pink-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="card group relative overflow-hidden"
    >
      {/* Category Badge */}
      <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-gradient-to-r ${categoryColors[project.category]} text-white text-xs font-semibold`}>
        {project.category === 'mechatronics' && 'Mechatronics'}
        {project.category === 'videoEditing' && 'Video Editing'}
        {project.category === 'animation3d' && '3D Animation'}
      </div>

      {/* Media */}
      <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
        {project.mediaType === 'video' ? (
          <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
            <video
              src={project.mediaUrl}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => e.target.pause()}
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FiPlay className="text-4xl text-white" />
            </div>
          </div>
        ) : (
          <img
            src={project.mediaUrl || '/api/placeholder/400/300'}
            alt={project.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Tech Stack */}
      {project.technologies && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <div className="flex gap-4 mt-auto">
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors"
          >
            <FiExternalLink />
            <span className="text-sm font-medium">Live Demo</span>
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <FiGithub />
            <span className="text-sm font-medium">Code</span>
          </a>
        )}
      </div>

      {/* Decorative element */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-8 -right-8 text-gray-100 dark:text-gray-800 opacity-20"
      >
        <GiGears className="text-6xl" />
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;