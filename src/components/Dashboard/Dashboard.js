import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiFolder, FiTool, FiBook, FiMail, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import AboutEditor from './AboutEditor';
import ProjectsEditor from './ProjectsEditor';
import SkillsEditor from './SkillsEditor';
import EducationEditor from './EducationEditor';
import ContactEditor from './ContactEditor';

const Dashboard = () => {
  const { isAuthenticated, login } = useAuth();
  const { hasChanges, publishChanges, discardChanges } = useData();
  const [activeTab, setActiveTab] = useState('about');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!login(password)) {
                setError('Invalid password');
              }
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter admin password"
              className="input-field mb-4"
            />
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'about', label: 'About', icon: FiUser },
    { id: 'projects', label: 'Projects', icon: FiFolder },
    { id: 'skills', label: 'Skills', icon: FiTool },
    { id: 'education', label: 'Education', icon: FiBook },
    { id: 'contact', label: 'Contact', icon: FiMail }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutEditor />;
      case 'projects':
        return <ProjectsEditor />;
      case 'skills':
        return <SkillsEditor />;
      case 'education':
        return <EducationEditor />;
      case 'contact':
        return <ContactEditor />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {hasChanges && (
            <div className="flex gap-4">
              <button
                onClick={discardChanges}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <FiX />
                Discard Changes
              </button>
              <button
                onClick={publishChanges}
                className="btn-primary flex items-center gap-2"
              >
                <FiSave />
                Publish Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-500 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="text-xl" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;