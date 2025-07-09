import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (result: { url: string; public_id: string }) => void;
  onDelete?: () => void;
  currentImage?: string;
  folder?: string;
  className?: string;
  label?: string;
}

export function ImageUpload({
  onUpload,
  onDelete,
  currentImage,
  folder,
  className = '',
  label = 'Upload Image'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Ensure folder is properly set and not empty
      if (folder && folder.trim()) {
        formData.append('folder', folder);
        console.log('Uploading image to folder:', folder);
      } else {
        formData.append('folder', 'companies');
        console.log('Using default companies folder for images');
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onUpload({ url: result.url, public_id: result.public_id });
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {currentImage ? (
        <div className="relative w-full h-48 border rounded-md overflow-hidden">
          <Image
            src={currentImage}
            alt="Uploaded image"
            fill
            style={{ objectFit: 'cover' }}
          />
          {onDelete && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onDelete}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop or click to upload
          </p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="max-w-xs"
          />
          {isUploading && (
            <div className="mt-2 flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Uploading...</span>
            </div>
          )}
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}

interface MultipleImageUploadProps {
  onUpload: (result: { url: string; public_id: string }) => void;
  onDelete?: (index: number) => void;
  images?: string[];
  folder?: string;
  className?: string;
  label?: string;
}

export function MultipleImageUpload({
  onUpload,
  onDelete,
  images = [],
  folder = 'companies',
  className = '',
  label = 'Upload Images'
}: MultipleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Ensure folder is properly set and not empty
      if (folder && folder.trim()) {
        formData.append('folder', folder);
        console.log('Uploading image to folder:', folder);
      } else {
        formData.append('folder', 'companies');
        console.log('Using default companies folder for images');
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onUpload({ url: result.url, public_id: result.public_id });
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative h-32 border rounded-md overflow-hidden">
            <Image
              src={image}
              alt={`Gallery image ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
            />
            {onDelete && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => onDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        
        <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center h-32">
          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground mb-2 text-center">
            Add image
          </p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="w-full h-full opacity-0 absolute inset-0 cursor-pointer"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Uploading...</span>
            </div>
          )}
        </div>
      </div>
      
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}