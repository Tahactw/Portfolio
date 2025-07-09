'use client';

import { useState } from 'react';
import { Experience } from '@/lib/data';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export function ExperienceForm({ experience, onClose }: { experience?: Experience | null; onClose: () => void; }) {
  const [formData, setFormData] = useState({
    title: experience?.title || '',
    company: experience?.company || '',
    description: experience?.description || '',
    startDate: experience?.startDate ? format(new Date(experience.startDate), 'yyyy-MM-dd') : '',
    endDate: experience?.endDate ? format(new Date(experience.endDate), 'yyyy-MM-dd') : '',
    current: experience?.current || false,
    skills: experience?.skills || [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description || !formData.startDate) {
      return toast.error('Title, Company, Description, and Start Date are required.');
    }
    setIsSaving(true);
    const method = experience ? 'PUT' : 'POST';
    const body = experience 
      ? { type: 'experience', id: experience.id, data: formData } 
      : { type: 'experience', data: formData };
      
    await toast.promise(
      fetch('/api/data', { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      })
        .then(res => { 
          if (!res.ok) throw new Error(experience ? 'Update failed' : 'Create failed'); 
          return res.json(); 
        }),
      {
        loading: 'Saving experience...',
        success: () => { 
          onClose(); 
          return experience ? 'Experience updated!' : 'Experience created!'; 
        },
        error: (err) => err.message,
      }
    );
    setIsSaving(false);
  };

  const addSkill = () => {
    const newSkill = skillInput.trim();
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollable-content">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{experience ? 'Edit Experience' : 'New Experience'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-text-primary/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
              className="w-full px-4 py-2 bg-bg-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-earth" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Company *</label>
            <input 
              type="text" 
              value={formData.company} 
              onChange={e => setFormData({ ...formData, company: e.target.value })} 
              className="w-full px-4 py-2 bg-bg-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-earth" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              rows={5} 
              className="w-full px-4 py-2 bg-bg-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-earth" 
              required 
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <input 
                type="date" 
                value={formData.startDate} 
                onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
                className="w-full px-4 py-2 bg-bg-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-earth" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input 
                type="date" 
                value={formData.endDate} 
                onChange={e => setFormData({ ...formData, endDate: e.target.value })} 
                disabled={formData.current} 
                className="w-full px-4 py-2 bg-bg-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-earth disabled:opacity-50" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="current" 
              checked={formData.current} 
              onChange={e => setFormData({ ...formData, current: e.target.checked, endDate: '' })} 
              className="w-4 h-4 rounded text-accent-earth focus:ring-accent-earth" 
            />
            <label htmlFor="current" className="text-sm">I currently work here</label>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Skills</label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                value={skillInput} 
                onChange={e => setSkillInput(e.target.value)} 
                onKeyDown={e => { 
                  if (e.key === 'Enter') { 
                    e.preventDefault(); 
                    addSkill(); 
                  } 
                }} 
                className="flex-1 px-4 py-2 bg-bg-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-earth" 
                placeholder="Type a skill and press Enter" 
              />
              <button 
                type="button" 
                onClick={addSkill} 
                className="px-4 py-2 bg-accent-earth/20 hover:bg-accent-earth/30 text-accent-earth rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-accent-earth/20 text-accent-earth rounded-full text-sm flex items-center gap-1">
                  {skill} 
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)} 
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4 pt-4 border-t border-text-secondary/10">
            <button 
              type="submit" 
              disabled={isSaving} 
              className="flex-1 py-2 bg-accent-earth/20 hover:bg-accent-earth/30 text-accent-earth rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              {isSaving ? 'Saving...' : 'Save Experience'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 hover:bg-text-primary/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}