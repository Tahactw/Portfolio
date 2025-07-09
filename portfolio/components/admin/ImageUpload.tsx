'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export function ImageUpload({ 
  value, 
  onChange, 
  buttonText = 'Upload Image' 
}: { 
  value: string; 
  onChange: (url: string) => void; 
  buttonText?: string; 
}) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      await toast.promise(
        fetch('/api/cloudinary/upload', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ image: base64 }) 
        })
          .then(async res => { 
            if (!res.ok) throw new Error('Upload failed'); 
            const { url } = await res.json(); 
            onChange(url); 
          }),
        { 
          loading: 'Uploading...', 
          success: 'Image uploaded!', 
          error: 'Upload failed.' 
        }
      );
      setIsUploading(false);
    };
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxFiles: 1,
    disabled: isUploading,
  });

  if (value) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-arena-floor">
        <Image src={value} alt="Upload preview" fill className="object-cover" />
        <button 
          type="button" 
          onClick={() => onChange('')} 
          className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors 
        ${isDragActive ? 'border-accent-cyan bg-accent-cyan/10' : 'border-arena-border hover:border-text-secondary/40'} 
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-8 h-8 mx-auto mb-4 text-text-secondary" />
      <p className="text-sm text-text-secondary font-display uppercase">
        {isUploading ? 'Uploading...' : isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
      </p>
      <p className="text-xs text-text-secondary/50 mt-1">1920x1080 recommended</p>
    </div>
  );
}