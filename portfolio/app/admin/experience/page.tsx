'use client';

import { useState, useEffect } from 'react';
import { ExperienceForm } from '@/components/admin/ExperienceForm';
import { Experience } from '@/lib/data';
import { Pencil, Trash2, Plus, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
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
import { SortableExperienceItem } from '@/components/admin/SortableExperienceItem';

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchExperiences = async () => {
    try { 
      setLoading(true); 
      const res = await fetch('/api/data?type=experience'); 
      const data = await res.json(); 
      setExperiences(data); 
    }
    catch (error) { 
      toast.error('Failed to fetch experiences'); 
    }
    finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchExperiences(); }, []);

  const handleEdit = (exp: Experience) => { 
    setEditingExperience(exp); 
    setShowForm(true); 
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    toast.promise(
      fetch('/api/data', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ type: 'experience', id }) 
      })
        .then(res => { 
          if (!res.ok) throw new Error('Delete failed'); 
          return res.json(); 
        })
        .then(fetchExperiences),
      { 
        loading: 'Deleting...', 
        success: 'Experience deleted!', 
        error: 'Failed to delete.' 
      }
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over || active.id === over.id) return;

    const oldIndex = experiences.findIndex(e => e.id === active.id);
    const newIndex = experiences.findIndex(e => e.id === over.id);
    
    const newExperiences = arrayMove(experiences, oldIndex, newIndex).map((e, i) => ({ ...e, order: i }));
    setExperiences(newExperiences);
    
    try {
      await Promise.all(
        newExperiences.map(e => 
          fetch('/api/data', { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ type: 'experience', id: e.id, data: { order: e.order } }) 
          })
        )
      );
      toast.success('Order updated');
    } catch (error) { 
      toast.error('Failed to update order'); 
      fetchExperiences(); 
    }
  };

  const handleFormClose = () => { 
    setShowForm(false); 
    setEditingExperience(null); 
    fetchExperiences(); 
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="loading-dots">Loading</div></div>;

  const activeExperience = activeId ? experiences.find(e => e.id === activeId) : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1>Manage Experience</h1>
        <button 
          onClick={() => { setEditingExperience(null); setShowForm(true); }} 
          className="button-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>
      
      {experiences.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-text-secondary mb-4">No experience entries yet</p>
          <button 
            onClick={() => { setEditingExperience(null); setShowForm(true); }} 
            className="button-primary"
          >
            Add First Experience
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
            items={experiences.map(e => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {experiences.map((experience) => (
                <SortableExperienceItem
                  key={experience.id}
                  id={experience.id}
                  experience={experience}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeExperience ? (
              <div className="glass rounded-lg p-4 flex items-center gap-4 drag-overlay">
                <GripVertical className="w-5 h-5 text-text-secondary" />
                <div className="flex-1">
                  <h3 className="font-bold">{activeExperience.title}</h3>
                  <p className="text-accent-earth">{activeExperience.company}</p>
                  <p className="text-sm text-text-secondary">
                    {format(new Date(activeExperience.startDate), 'MMM yyyy')} - 
                    {activeExperience.current ? ' Present' : ` ${activeExperience.endDate ? format(new Date(activeExperience.endDate), 'MMM yyyy') : 'N/A'}`}
                  </p>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
      
      {showForm && <ExperienceForm experience={editingExperience} onClose={handleFormClose} />}
    </div>
  );
}