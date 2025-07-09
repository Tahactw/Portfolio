'use client';

import { useState, useEffect } from 'react';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { Project } from '@/lib/data';
import { Pencil, Trash2, Plus, GripVertical } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '@/components/admin/SortableItem';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchProjects = async () => {
    try { 
      setLoading(true); 
      const res = await fetch('/api/data?type=projects'); 
      const data = await res.json(); 
      setProjects(data); 
    } 
    catch (error) { 
      toast.error('Failed to fetch projects'); 
    } 
    finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleEdit = (project: Project) => { 
    setEditingProject(project); 
    setShowForm(true); 
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    toast.promise(
      fetch('/api/data', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ type: 'projects', id }) 
      })
        .then(res => { 
          if (!res.ok) throw new Error('Delete failed'); 
          return res.json(); 
        })
        .then(fetchProjects),
      { 
        loading: 'Deleting...', 
        success: 'Project deleted!', 
        error: 'Failed to delete.' 
      }
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex(p => p.id === active.id);
    const newIndex = projects.findIndex(p => p.id === over.id);
    
    const newProjects = arrayMove(projects, oldIndex, newIndex).map((p, i) => ({ ...p, order: i }));
    setProjects(newProjects);
    
    try {
      await Promise.all(
        newProjects.map(p => 
          fetch('/api/data', { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ type: 'projects', id: p.id, data: { order: p.order } }) 
          })
        )
      );
      toast.success('Order updated');
    } catch (error) { 
      toast.error('Failed to update order'); 
      fetchProjects(); 
    }
  };

  const handleFormClose = () => { 
    setShowForm(false); 
    setEditingProject(null); 
    fetchProjects(); 
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="loading-dots">Loading</div></div>;

  const activeProject = activeId ? projects.find(p => p.id === activeId) : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1>Manage Projects</h1>
        <button 
          onClick={() => { setEditingProject(null); setShowForm(true); }} 
          className="button-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>
      
      {projects.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-text-secondary mb-4">No projects yet</p>
          <button 
            onClick={() => { setEditingProject(null); setShowForm(true); }} 
            className="button-primary"
          >
            Add First Project
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => setActiveId(event.active.id as string)}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {projects.map((project) => (
                <SortableItem
                  key={project.id}
                  id={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeProject ? (
              <div className="glass rounded-lg p-4 flex items-center gap-4 drag-overlay">
                <GripVertical className="w-5 h-5 text-text-secondary" />
                <div className="w-20 h-12 relative rounded overflow-hidden flex-shrink-0 bg-bg-primary">
                  {activeProject.thumbnail && (
                    <Image src={activeProject.thumbnail} alt={activeProject.title} fill sizes="80px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{activeProject.title}</h3>
                  <div className="text-sm text-text-secondary line-clamp-1" dangerouslySetInnerHTML={{ __html: activeProject.description }} />
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
      
      {showForm && <ProjectForm project={editingProject} onClose={handleFormClose} />}
    </div>
  );
}