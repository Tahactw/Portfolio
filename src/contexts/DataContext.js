import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

const defaultData = {
  profile: {
    name: 'Taha Mohammed',
    title: 'Mechatronics Engineer & Creative Technologist',
    bio: "I'm a Mechatronics Engineering student with a strong passion for blending technology and creativity. With over 5 years of professional experience in video editing, motion graphics, and graphic design, I specialize in creating visually impactful content using industry-standard tools like Adobe Premiere Pro, After Effects, Photoshop, Illustrator, and Autodesk Maya.",
    fullBio: "I'm a Mechatronics Engineering student with a strong passion for blending technology and creativity. With over 5 years of professional experience in video editing, motion graphics, and graphic design, I specialize in creating visually impactful content using industry-standard tools like Adobe Premiere Pro, After Effects, Photoshop, Illustrator, and Autodesk Maya.\n\nMy background in engineering gives me a unique advantage when approaching animation and design from a technical and problem-solving perspective. I've worked on a wide range of projects—from commercial video ads and social media content to character animation and motion infographics.\n\nI'm a fast learner, highly detail-oriented, and always open to growth. I thrive in collaborative environments and take pride in delivering high-quality work that meets both creative and technical standards.",
    image: '/api/placeholder/300/300',
    github: 'https://github.com/Tahactw',
    linkedin: 'https://www.linkedin.com/in/taha-mohammed-7850b9372/',
    email: 'taha@example.com',
    phone: '+20 123 456 7890'
  },
  skills: [
    {
      id: uuidv4(),
      category: 'Video Editing',
      name: 'Adobe Premiere Pro',
      level: 95,
      description: '5+ years, commercial/social/educational, advanced audio, color, multiple formats'
    },
    {
      id: uuidv4(),
      category: 'Motion Graphics',
      name: 'After Effects',
      level: 90,
      description: '2D motion graphics, explainer videos, logo animation, advanced animation techniques'
    },
    {
      id: uuidv4(),
      category: '3D Animation',
      name: 'Autodesk Maya',
      level: 85,
      description: 'Character/object animation, FK/IK, rigging basics, camera animation, export for film/games'
    },
    {
      id: uuidv4(),
      category: 'Graphic Design',
      name: 'Photoshop & Illustrator',
      level: 92,
      description: 'Digital and vector art, branding, retouching, visual identity, mockups'
    },
    {
      id: uuidv4(),
      category: 'Engineering',
      name: 'Arduino & Embedded Systems',
      level: 88,
      description: 'Microcontroller programming, sensor integration, IoT projects'
    },
    {
      id: uuidv4(),
      category: 'Engineering',
      name: 'CAD & 3D Modeling',
      level: 82,
      description: 'SolidWorks, Fusion 360, mechanical design, 3D printing'
    }
  ],
  education: [
    {
      id: uuidv4(),
      degree: "Bachelor's Degree in Mechatronics Engineering",
      institution: 'Heliopolis University for Sustainable Development',
      location: 'Cairo, Egypt',
      period: '2024 - 2027',
      status: '3rd Year Student',
      description: 'In-depth robotics, automation, electronics, control systems, Arduino, Raspberry Pi, PLCs, embedded programming'
    }
  ],
  projects: {
    mechatronics: [],
    videoEditing: [],
    animation3d: []
  }
};

export const DataProvider = ({ children }) => {
  const [draftData, setDraftData] = useState(defaultData);
  const [publishedData, setPublishedData] = useState(defaultData);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem('portfolioDraft');
    const savedPublished = localStorage.getItem('portfolioPublished');
    
    if (savedDraft) {
      setDraftData(JSON.parse(savedDraft));
    }
    if (savedPublished) {
      setPublishedData(JSON.parse(savedPublished));
    }
  }, []);

  const updateDraft = (newData) => {
    setDraftData(newData);
    setHasChanges(true);
    localStorage.setItem('portfolioDraft', JSON.stringify(newData));
  };

  const publishChanges = () => {
    setPublishedData(draftData);
    setHasChanges(false);
    localStorage.setItem('portfolioPublished', JSON.stringify(draftData));
  };

  const discardChanges = () => {
    setDraftData(publishedData);
    setHasChanges(false);
    localStorage.setItem('portfolioDraft', JSON.stringify(publishedData));
  };

  return (
    <DataContext.Provider value={{
      draftData,
      publishedData,
      hasChanges,
      updateDraft,
      publishChanges,
      discardChanges
    }}>
      {children}
    </DataContext.Provider>
  );
};