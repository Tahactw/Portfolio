'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Experience } from '@/lib/data';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface SortableExperienceItemProps {
  id: string;
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

export function SortableExperienceItem({ id, experience, onEdit, onDelete }: SortableExperienceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="glass rounded-lg p-4 flex items-center gap-4">
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-move p-2 text-text-secondary hover:text-text-primary"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold font-display">{experience.title}</h3>
        <p className="text-accent-purple">{experience.company}</p>
        <p className="text-sm text-text-secondary font-display uppercase">
          {format(new Date(experience.startDate), 'MMM yyyy')} - 
          {experience.current ? ' Present' : ` ${experience.endDate ? format(new Date(experience.endDate), 'MMM yyyy') : 'N/A'}`}
        </p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(experience)} 
          className="p-2 rounded hover:bg-text-primary/10 transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(experience.id)} 
          className="p-2 rounded hover:bg-red-500/20 text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}