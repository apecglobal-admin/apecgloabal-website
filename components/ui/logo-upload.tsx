import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface LogoUploadProps {
  onUpload: (result: { url: string; public_id: string }) => void;
  onDelete?: () => void;
  currentImage?: string;
  className?: string;
  label?: string;
}

export function LogoUpload({
  onUpload,
  onDelete,
  currentImage,
  className = '',
  label = 'Upload Logo'
}: LogoUploadProps) {
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
      
      // Don't append folder - upload to root of Cloudinary

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
      <Label className="text-white">{label}</Label>
      
      {currentImage ? (
        <div className="relative w-full h-48 border border-purple-500/30 rounded-md overflow-hidden bg-black/30">
          <Image
            src={currentImage}
            alt="Logo"
            fill
            style={{ objectFit: 'contain' }}
            className="p-4"
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
        <div className="border border-dashed border-purple-500/30 rounded-md p-6 flex flex-col items-center justify-center bg-black/30">
          <Upload className="h-10 w-10 text-purple-400 mb-2" />
          <p className="text-sm text-white/60 mb-2">
            Drag and drop or click to upload logo
          </p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="max-w-xs bg-black/30 border-purple-500/30 text-white"
          />
          {isUploading && (
            <div className="mt-2 flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2 text-purple-400" />
              <span className="text-sm text-white">Uploading...</span>
            </div>
          )}
          {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}