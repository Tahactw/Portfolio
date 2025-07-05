import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { useData } from '../../contexts/DataContext';

const SkillsEditor = () => {
  const { draftData, updateDraft } = useData();
  const [editingSkill, setEditingSkill] = useState(null);

  const handleAddSkill = () => {
    const newSkill = {
      id: uuidv4(),
      category: 'Engineering',
      name: 'New Skill',
      level: 50,
      description: ''
    };
    setEditingSkill(newSkill);
  };

  const handleSaveSkill = (skill) => {
    const skills = [...draftData.skills];
    const existingIndex = skills.findIndex(s => s.id === skill.id);
    
    if (existingIndex >= 0) {
      skills[existingIndex] = skill;
    } else {
      skills.push(skill);
    }
    
    updateDraft({ ...draftData, skills });
    setEditingSkill(null);
  };

  const handleDeleteSkill = (skillId) => {
    updateDraft({
      ...draftData,
      skills: draftData.skills.filter(s => s.id !== skillId)
    });
  };

  const categories = ['Video Editing', 'Motion Graphics', '3D Animation', 'Graphic Design', 'Engineering'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Manage Skills</h2>
        <button
          onClick={handleAddSkill}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus />
          Add Skill
        </button>
      </div>

      <div className="grid gap-4">
        {draftData.skills.map((skill) => (
          <div key={skill.id} className="card flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                  {skill.category}
                </span>
                <h3 className="font-semibold">{skill.name}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {skill.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-mech-teal"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{skill.level}%</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setEditingSkill(skill)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingSkill.id ? 'Edit Skill' : 'Add New Skill'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={editingSkill.category}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="input-field"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Skill Name</label>
                <input
                  type="text"
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Proficiency Level (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingSkill.level}
                  onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) || 0 })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editingSkill.description}
                  onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setEditingSkill(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveSkill(editingSkill)}
                className="flex-1 btn-primary"
              >
                Save Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsEditor;