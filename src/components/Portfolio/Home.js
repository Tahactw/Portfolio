import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGithub, FiLinkedin } from 'react-icons/fi';
import { GiGears, GiCircuitry, GiRobotGolem } from 'react-icons/gi';
import { useData } from '../../contexts/DataContext';

const Home = () => {
  const { publishedData } = useData();
  const { profile } = publishedData;

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto w-full py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-mech-teal bg-clip-text text-transparent">
              {profile.name}
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-6">
              {profile.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {profile.bio}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Link to="/projects" className="btn-primary inline-flex items-center gap-2">
                View My Work
                <FiArrowRight />
              </Link>
              <Link to="/about" className="px-6 py-3 border-2 border-primary-500 text-primary-500 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200">
                About Me
              </Link>
            </div>
            
            <div className="flex gap-4">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-colors"
              >
                <FiGithub className="text-xl" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-colors"
              >
                <FiLinkedin className="text-xl" />
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Animated background elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <GiGears className="absolute top-0 right-0 text-6xl text-mech-orange opacity-20" />
                <GiCircuitry className="absolute bottom-0 left-0 text-6xl text-mech-teal opacity-20" />
                <GiRobotGolem className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl text-primary-500 opacity-10" />
              </motion.div>
              
              {/* Profile image */}
              <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-primary-500/20">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
              </div>
              
              {/* Floating tech icons */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 p-4 bg-mech-orange rounded-xl shadow-lg"
              >
                <GiGears className="text-2xl text-white" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 p-4 bg-mech-teal rounded-xl shadow-lg"
              >
                <GiCircuitry className="text-2xl text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;