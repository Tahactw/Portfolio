'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Project } from '@/lib/data';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface SortableItemProps {
  id: string;
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function SortableItem({ id, project, onEdit, onDelete }: SortableItemProps) {
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
      <div className="w-20 h-12 relative rounded overflow-hidden flex-shrink-0 bg-arena-floor">
        {project.thumbnail && (
          <Image src={project.thumbnail} alt={project.title} fill sizes="80px" className="object-cover" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-bold font-display">{project.title}</h3>
        <div className="text-sm text-text-secondary">
          <span className="text-accent-purple font-display uppercase">{project.category}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(project)} 
          className="p-2 rounded hover:bg-text-primary/10 transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(project.id)} 
          className="p-2 rounded hover:bg-red-500/20 text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}