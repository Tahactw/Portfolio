import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { useData } from '../../contexts/DataContext';

const EducationEditor = () => {
  const { draftData, updateDraft } = useData();
  const [editingEducation, setEditingEducation] = useState(null);

  const handleAddEducation = () => {
    const newEducation = {
      id: uuidv4(),
      degree: '',
      institution: '',
      location: '',
      period: '',
      status: '',
      description: ''
    };
    setEditingEducation(newEducation);
  };

  const handleSaveEducation = (education) => {
    const educationList = [...draftData.education];
    const existingIndex = educationList.findIndex(e => e.id === education.id);
    
    if (existingIndex >= 0) {
      educationList[existingIndex] = education;
    } else {
      educationList.push(education);
    }
    
    updateDraft({ ...draftData, education: educationList });
    setEditingEducation(null);
  };

  const handleDeleteEducation = (educationId) => {
    updateDraft({
      ...draftData,
      education: draftData.education.filter(e => e.id !== educationId)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Manage Education</h2>
        <button
          onClick={handleAddEducation}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus />
          Add Education
        </button>
      </div>

      <div className="space-y-4">
        {draftData.education.map((edu) => (
          <div key={edu.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{edu.degree}</h3>
                <p className="text-primary-500 font-medium mb-1">{edu.institution}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {edu.location} • {edu.period} • {edu.status}
                </p>
                <p className="text-gray-600 dark:text-gray-300">{edu.description}</p>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setEditingEducation(edu)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDeleteEducation(edu.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingEducation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingEducation.id ? 'Edit Education' : 'Add New Education'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Degree</label>
                <input
                  type="text"
                  value={editingEducation.degree}
                  onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Institution</label>
                <input
                  type="text"
                  value={editingEducation.institution}
                  onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={editingEducation.location}
                    onChange={(e) => setEditingEducation({ ...editingEducation, location: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Period</label>
                  <input
                    type="text"
                    value={editingEducation.period}
                    onChange={(e) => setEditingEducation({ ...editingEducation, period: e.target.value })}
                    placeholder="e.g., 2024 - 2027"
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <input
                  type="text"
                  value={editingEducation.status}
                  onChange={(e) => setEditingEducation({ ...editingEducation, status: e.target.value })}
                  placeholder="e.g., 3rd Year Student"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editingEducation.description}
                  onChange={(e) => setEditingEducation({ ...editingEducation, description: e.target.value })}
                  rows={4}
                  className="input-field resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setEditingEducation(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEducation(editingEducation)}
                className="flex-1 btn-primary"
              >
                Save Education
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationEditor;