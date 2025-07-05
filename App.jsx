// App.jsx
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight, FaPlay } from 'react-icons/fa';
import { HiChip, HiCode, HiFilm } from 'react-icons/hi';
import './App.css';

// Custom Cursor Component
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('.hover-effect')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="custom-cursor"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32">
        <motion.circle
          cx="16"
          cy="16"
          r="8"
          fill="none"
          stroke="#00D9FF"
          strokeWidth="2"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M16 8 L16 24 M8 16 L24 16"
          stroke="#00D9FF"
          strokeWidth="2"
          animate={{ scale: isHovering ? 0.8 : 1 }}
        />
      </svg>
    </motion.div>
  );
};

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="animated-bg">
      <div className="circuit-pattern"></div>
      <motion.div
        className="floating-gear gear-1"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="floating-gear gear-2"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

// Main Page Component
const MainPage = ({ onNavigateToProjects }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  const projectCategories = [
    {
      id: 'mechatronics',
      title: 'Mechatronics',
      icon: <HiChip className="w-8 h-8" />,
      description: 'Robotics, automation, and embedded systems projects',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'video',
      title: 'Video Montage',
      icon: <HiFilm className="w-8 h-8" />,
      description: 'Professional video editing and motion graphics',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'animation',
      title: 'Animation',
      icon: <HiCode className="w-8 h-8" />,
      description: '3D character animation and visual effects',
      color: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className="main-page">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div style={{ y: y1 }} className="hero-content">
          <motion.div 
            className="profile-section"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div className="profile-image-container">
              <div className="profile-image">
                <div className="profile-placeholder">TM</div>
              </div>
              <motion.div 
                className="circuit-decoration"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Taha Mohammed
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Mechatronics Engineer • Creative Technologist
          </motion.p>

          {/* Social Links */}
          <motion.div 
            className="social-links"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a href="https://github.com/Tahactw" target="_blank" rel="noopener noreferrer" className="social-link hover-effect">
              <FaGithub className="w-6 h-6" />
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/taha-mohammed-7850b9372/" target="_blank" rel="noopener noreferrer" className="social-link hover-effect">
              <FaLinkedin className="w-6 h-6" />
              <span>LinkedIn</span>
            </a>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Bio Section */}
      <motion.section 
        className="bio-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div style={{ y: y2 }} className="bio-content">
          <h2 className="section-title">About Me</h2>
          <p className="bio-text">
            I'm a Mechatronics Engineering student with a strong passion for blending technology and creativity. 
            With over 5 years of professional experience in video editing, motion graphics, and graphic design, 
            I specialize in creating visually impactful content using industry-standard tools.
          </p>
          <p className="bio-text">
            My background in engineering gives me a unique advantage when approaching animation and design from 
            a technical and problem-solving perspective. I thrive in collaborative environments and take pride 
            in delivering high-quality work that meets both creative and technical standards.
          </p>
        </motion.div>
      </motion.section>

      {/* Projects Preview */}
      <motion.section 
        className="projects-preview"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title">Featured Work</h2>
        <div className="project-cards">
          {projectCategories.map((category, index) => (
            <motion.div
              key={category.id}
              className="project-card hover-effect"
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigateToProjects(category.id)}
              whileHover={{ y: -10 }}
            >
              <div className={`card-gradient bg-gradient-to-br ${category.color}`}></div>
              <div className="card-content">
                <div className="card-icon">{category.icon}</div>
                <h3 className="card-title">{category.title}</h3>
                <p className="card-description">{category.description}</p>
                <motion.div 
                  className="card-arrow"
                  whileHover={{ x: 5 }}
                >
                  <FaArrowRight />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.button
          className="view-all-btn hover-effect"
          onClick={() => onNavigateToProjects()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Projects
          <FaArrowRight className="ml-2" />
        </motion.button>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className="contact-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title">Get In Touch</h2>
        <p className="contact-text">
          I'm always interested in new opportunities and collaborations. 
          Feel free to reach out!
        </p>
        <motion.a
          href="mailto:taha.mohammed@example.com"
          className="contact-btn hover-effect"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaEnvelope className="mr-2" />
          Send Me an Email
        </motion.a>
      </motion.section>
    </div>
  );
};

// Projects Section Component
const ProjectsSection = ({ initialCategory }) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'mechatronics');
  
  // Sample project data - replace with your actual projects
  const projects = {
    mechatronics: [
      { id: 1, title: 'Autonomous Robot', image: '/api/placeholder/400/300', github: 'https://github.com/Tahactw/autonomous-robot' },
      { id: 2, title: 'Smart Home System', image: '/api/placeholder/400/300', github: 'https://github.com/Tahactw/smart-home' },
      { id: 3, title: 'Robotic Arm Control', image: '/api/placeholder/400/300', github: 'https://github.com/Tahactw/robotic-arm' },
    ],
    video: [
      { id: 1, title: 'Product Launch Video', videoId: 'dQw4w9WgXcQ', description: 'Dynamic product reveal with motion graphics' },
      { id: 2, title: 'Corporate Presentation', videoId: 'dQw4w9WgXcQ', description: 'Professional corporate video with animations' },
    ],
    animation: [
      { id: 1, title: 'Character Animation Reel', videoId: 'dQw4w9WgXcQ' },
      { id: 2, title: '3D Motion Graphics', videoId: 'dQw4w9WgXcQ' },
    ]
  };

  return (
    <div className="projects-section">
      {/* Category Tabs */}
      <div className="category-tabs">
        {['mechatronics', 'video', 'animation'].map((category) => (
          <motion.button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Horizontal Scrolling Projects */}
      <motion.div 
        className="projects-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={activeCategory}
      >
        <div className="horizontal-scroll">
          <motion.div 
            className="projects-track"
            drag="x"
            dragConstraints={{ left: -1000, right: 0 }}
          >
            {activeCategory === 'mechatronics' && (
              <>
                {projects.mechatronics.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="project-item mechatronics-item"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                      <div className="project-image">
                        <img src={project.image} alt={project.title} />
                        <div className="project-overlay">
                          <FaGithub className="w-12 h-12" />
                        </div>
                      </div>
                      <h3 className="project-title">{project.title}</h3>
                    </a>
                  </motion.div>
                ))}
              </>
            )}

            {activeCategory === 'video' && (
              <>
                {projects.video.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="project-item video-item"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="video-wrapper">
                      <iframe
                        src={`https://www.youtube.com/embed/${project.videoId}`}
                        title={project.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                  </motion.div>
                ))}
              </>
            )}

            {activeCategory === 'animation' && (
              <>
                {projects.animation.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="project-item animation-item"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="video-wrapper large">
                      <iframe
                        src={`https://www.youtube.com/embed/${project.videoId}`}
                        title={project.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="scroll-indicator"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span>Scroll →</span>
      </motion.div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('main');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleNavigateToProjects = (category = null) => {
    setSelectedCategory(category);
    setCurrentView('projects');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedCategory(null);
  };

  return (
    <div className="app">
      <CustomCursor />
      
      {/* Navigation */}
      <motion.nav 
        className="main-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="nav-content">
          <motion.button 
            className="nav-logo"
            onClick={handleBackToMain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HiChip className="w-8 h-8 text-cyan-400" />
            <span>TM</span>
          </motion.button>
          
          <div className="nav-links">
            <button 
              className={`nav-link ${currentView === 'main' ? 'active' : ''}`}
              onClick={handleBackToMain}
            >
              Home
            </button>
            <button 
              className={`nav-link ${currentView === 'projects' ? 'active' : ''}`}
              onClick={() => handleNavigateToProjects()}
            >
              Projects
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        {currentView === 'main' ? (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <MainPage onNavigateToProjects={handleNavigateToProjects} />
          </motion.div>
        ) : (
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <ProjectsSection initialCategory={selectedCategory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;