import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { useData } from '../../contexts/DataContext';

const AboutEditor = () => {
  const { draftData, updateDraft } = useData();
  const [profile, setProfile] = useState(draftData.profile);

  const handleChange = (field, value) => {
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
    updateDraft({ ...draftData, profile: newProfile });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Edit About Section</h2>
      
      {/* Profile Image */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">Profile Image</h3>
        <div className="flex items-center gap-6">
          <img
            src={profile.image}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-colors flex items-center gap-2">
              <FiUpload />
              Upload New Image
            </div>
          </label>
        </div>
      </div>

      {/* Basic Info */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={profile.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Short Bio (Home Page)</label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={3}
              className="input-field resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Full Bio (About Page)</label>
            <textarea
              value={profile.fullBio}
              onChange={(e) => handleChange('fullBio', e.target.value)}
              rows={8}
              className="input-field resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutEditor;