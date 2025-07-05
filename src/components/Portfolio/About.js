import React from 'react';
import { motion } from 'framer-motion';
import { FiTool, FiCpu, FiVideo, FiImage } from 'react-icons/fi';
import { useData } from '../../contexts/DataContext';

const About = () => {
  const { publishedData } = useData();
  const { profile, skills, education } = publishedData;

  const skillIcons = {
    'Video Editing': FiVideo,
    'Motion Graphics': FiVideo,
    '3D Animation': FiImage,
    'Graphic Design': FiImage,
    'Engineering': FiCpu,
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-primary-500 to-mech-teal bg-clip-text text-transparent">
            About Me
          </h1>
          
          {/* Bio Section */}
          <div className="card mb-12">
            <div className="prose dark:prose-invert max-w-none">
              {profile.fullBio.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <FiTool className="text-primary-500" />
              Skills & Experience
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill, index) => {
                const Icon = skillIcons[skill.category] || FiTool;
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="text-2xl text-primary-500" />
                      <h3 className="text-xl font-semibold">{skill.name}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {skill.description}
                    </p>
                    <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-mech-teal"
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
                      {skill.level}% Proficiency
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Education Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <FiCpu className="text-primary-500" />
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                  <p className="text-primary-500 font-medium mb-1">{edu.institution}</p>
                  <p className="text-gray-500 dark:text-gray-400 mb-3">
                    {edu.location} • {edu.period} • {edu.status}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">{edu.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;