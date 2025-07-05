import React, { useState } from 'react';
import { FiMail, FiPhone, FiGithub, FiLinkedin } from 'react-icons/fi';
import { useData } from '../../contexts/DataContext';

const ContactEditor = () => {
  const { draftData, updateDraft } = useData();
  const [profile, setProfile] = useState(draftData.profile);

  const handleChange = (field, value) => {
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
    updateDraft({ ...draftData, profile: newProfile });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Edit Contact Information</h2>
      
      <div className="card">
        <h3 className="text-lg font-medium mb-4">Contact Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FiMail className="text-primary-500" />
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FiPhone className="text-primary-500" />
              Phone Number
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium mb-4">Social Links</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FiGithub className="text-primary-500" />
              GitHub Profile
            </label>
            <input
              type="url"
              value={profile.github}
              onChange={(e) => handleChange('github', e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FiLinkedin className="text-primary-500" />
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={profile.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
        <h3 className="text-lg font-medium mb-2 text-primary-900 dark:text-primary-100">
          Contact Form
        </h3>
        <p className="text-sm text-primary-700 dark:text-primary-300">
          The contact form on your portfolio will automatically send emails to the address you've configured above. 
          When visitors submit the form, it will open their default email client with the message pre-filled.
        </p>
      </div>
    </div>
  );
};

export default ContactEditor;