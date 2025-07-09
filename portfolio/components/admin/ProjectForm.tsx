'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/lib/data';
import { ImageUpload } from './ImageUpload';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function ProjectForm({ project, onClose }: { project?: Project | null; onClose: () => void; }) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    thumbnail: project?.thumbnail || '',
    images: project?.images || [],
    tags: project?.tags || [],
    links: project?.links || { github: '', live: '', youtube: '' },
  });
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.description,
    editorProps: {
        attributes: { 
          class: 'prose prose-lg min-h-[150px] max-w-none w-full p-4 bg-bg-primary rounded-lg focus:outline-none focus-within:ring-2 focus-within:ring-accent-warm' 
        },
    },
    onUpdate: ({ editor }) => setFormData(prev => ({ ...prev, description: editor.getHTML() })),
  });

  useEffect(() => { 
    editor?.commands.setContent(formData.description); 
  }, [editor, formData.description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !editor?.getText() || !formData.thumbnail) {
      return toast.error('Title, Description, and Thumbnail are required.');
    }
    setIsSaving(true);
    const method = project ? 'PUT' : 'POST';
    const body = project 
      ? { type: 'projects', id: project.id, data: { ...formData, description: editor.getHTML() } } 
      : { type: 'projects', data: { ...formData, description: editor.getHTML() } };
    
    await toast.promise(
      fetch('/api/data', { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      })
        .then(res => { 
          if (!res.ok) throw new Error(project ? 'Update failed' : 'Create failed'); 
          return res.json(); 
        }),
      {
        loading: 'Saving project...',
        success: () => { 
          onClose(); 
          return project ? 'Project updated!' : 'Project created!'; 
        },
        error: (err) => err.message,
      }
    );
    setIsSaving(false);
  };

  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollable-content">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{project ? 'Edit Project' : 'New Project'}</h2>
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
              className="w-full px-4 py-2 bg-bg-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-warm" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <EditorContent editor={editor} />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail *</label>
            <ImageUpload 
              value={formData.thumbnail} 
              onChange={url => setFormData({ ...formData, thumbnail: url })} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Gallery Images</label>
            <div className="space-y-2">
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={image} 
                    readOnly 
                    className="flex-1 px-4 py-2 bg-bg-primary rounded-lg text-sm text-text-secondary" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      images: prev.images.filter((_, i) => i !== index) 
                    }))} 
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <ImageUpload 
                value="" 
                onChange={url => setFormData({ ...formData, images: [...formData.images, url] })} 
                buttonText="Add Gallery Image" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                value={tagInput} 
                onChange={e => setTagInput(e.target.value)} 
                onKeyDown={e => { 
                  if (e.key === 'Enter') { 
                    e.preventDefault(); 
                    addTag(); 
                  } 
                }} 
                className="flex-1 px-4 py-2 bg-bg-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-warm" 
                placeholder="Type a tag and press Enter" 
              />
              <button 
                type="button" 
                onClick={addTag} 
                className="px-4 py-2 bg-accent-warm/20 hover:bg-accent-warm/30 text-accent-warm rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-accent-warm/20 text-accent-warm rounded-full text-sm flex items-center gap-1">
                  {tag} 
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)} 
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium">Links</label>
            <input 
              type="url" 
              placeholder="GitHub URL" 
              value={formData.links.github || ''} 
              onChange={e => setFormData({ 
                ...formData, 
                links: { ...formData.links, github: e.target.value } 
              })} 
              className="w-full px-4 py-2 bg-bg-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-warm" 
            />
            <input 
              type="url" 
              placeholder="Live Demo URL" 
              value={formData.links.live || ''} 
              onChange={e => setFormData({ 
                ...formData, 
                links: { ...formData.links, live: e.target.value } 
              })} 
              className="w-full px-4 py-2 bg-bg-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-warm" 
            />
            <input 
              type="url" 
              placeholder="YouTube URL" 
              value={formData.links.youtube || ''} 
              onChange={e => setFormData({ 
                ...formData, 
                links: { ...formData.links, youtube: e.target.value } 
              })} 
              className="w-full px-4 py-2 bg-bg-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-warm" 
            />
          </div>
          
          <div className="flex gap-4 pt-4 border-t border-text-secondary/10">
            <button 
              type="submit" 
              disabled={isSaving} 
              className="flex-1 py-2 bg-accent-warm/20 hover:bg-accent-warm/30 text-accent-warm rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              {isSaving ? 'Saving...' : 'Save Project'}
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