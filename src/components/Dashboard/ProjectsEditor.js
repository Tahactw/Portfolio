import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus, FiEdit2, FiTrash2, FiMove } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { useData } from '../../contexts/DataContext';

const ProjectsEditor = () => {
  const { draftData, updateDraft } = useData();
  const [editingProject, setEditingProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState('mechatronics');
  
  const categories = [
    { id: 'mechatronics', name: 'Mechatronics Projects' },
    { id: 'videoEditing', name: 'Video Editing' },
    { id: 'animation3d', name: '3D Animation' }
  ];

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(draftData.projects[activeCategory]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateDraft({
      ...draftData,
      projects: {
        ...draftData.projects,
        [activeCategory]: items
      }
    });
  };

  const handleAddProject = () => {
    const newProject = {
      id: uuidv4(),
      title: 'New Project',
      description: '',
      mediaType: 'image',
      mediaUrl: '/api/placeholder/400/300',
      technologies: [],
      demoUrl: '',
      githubUrl: ''
    };
    
    setEditingProject(newProject);
  };

  const handleSaveProject = (project) => {
    const projects = [...draftData.projects[activeCategory]];
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    
    updateDraft({
      ...draftData,
      projects: {
        ...draftData.projects,
        [activeCategory]: projects
      }
    });
    
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId) => {
    updateDraft({
      ...draftData,
      projects: {
        ...draftData.projects,
        [activeCategory]: draftData.projects[activeCategory].filter(p => p.id !== projectId)
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Manage Projects</h2>
        <button
          onClick={handleAddProject}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus />
          Add Project
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`pb-2 px-1 font-medium transition-colors relative ${
              activeCategory === category.id
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {category.name}
            {activeCategory === category.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
            )}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {draftData.projects[activeCategory].map((project, index) => (
                <Draggable key={project.id} draggableId={project.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`card flex items-center gap-4 ${
                        snapshot.isDragging ? 'shadow-2xl' : ''
                      }`}
                    >
                      <div {...provided.dragHandleProps} className="cursor-move">
                        <FiMove className="text-gray-400" />
                      </div>
                      
                      <img
                        src={project.mediaUrl}
                        alt={project.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingProject.id ? 'Edit Project' : 'Add New Project'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={4}
                  className="input-field resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Media Type</label>
                <select
                  value={editingProject.mediaType}
                  onChange={(e) => setEditingProject({ ...editingProject, mediaType: e.target.value })}
                  className="input-field"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Media URL</label>
                <input
                  type="text"
                  value={editingProject.mediaUrl}
                  onChange={(e) => setEditingProject({ ...editingProject, mediaUrl: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={editingProject.technologies?.join(', ') || ''}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Demo URL</label>
                <input
                  type="text"
                  value={editingProject.demoUrl}
                  onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <input
                  type="text"
                  value={editingProject.githubUrl}
                  onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setEditingProject(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveProject(editingProject)}
                className="flex-1 btn-primary"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsEditor;