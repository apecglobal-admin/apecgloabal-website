import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  onUpload: (result: { 
    url: string; 
    public_id: string;
    name: string;
    size: string;
    type: string;
  }) => void;
  onDelete?: () => void;
  currentFile?: {
    name: string;
    url: string;
    size?: string;
    type?: string;
  };
  folder?: string;
  className?: string;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export function FileUpload({
  onUpload,
  onDelete,
  currentFile,
  folder = 'documents',
  className = '',
  label = 'Upload File',
  accept = '*',
  maxSize = 10 // 10MB default
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
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
        console.log('Uploading to folder:', folder);
      } else {
        formData.append('folder', 'documents');
        console.log('Using default documents folder');
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Calculate file size in KB or MB
      const fileSizeInKB = Math.round(file.size / 1024);
      const fileSize = fileSizeInKB >= 1024 
        ? `${(fileSizeInKB / 1024).toFixed(2)} MB` 
        : `${fileSizeInKB} KB`;
      
      onUpload({ 
        url: result.url, 
        public_id: result.public_id,
        name: file.name,
        size: fileSize,
        type: file.type
      });
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to get file icon based on type
  const getFileIcon = (type?: string) => {
    if (!type) return <File className="h-8 w-8" />;
    
    if (type.includes('pdf')) {
      return <File className="h-8 w-8 text-red-500" />;
    } else if (type.includes('word') || type.includes('document')) {
      return <File className="h-8 w-8 text-blue-500" />;
    } else if (type.includes('excel') || type.includes('spreadsheet')) {
      return <File className="h-8 w-8 text-green-500" />;
    } else if (type.includes('image')) {
      return <File className="h-8 w-8 text-purple-500" />;
    } else {
      return <File className="h-8 w-8" />;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {currentFile ? (
        <div className="border rounded-md p-4 flex items-center justify-between">
          <div className="flex items-center">
            {getFileIcon(currentFile.type)}
            <div className="ml-3">
              <p className="text-sm font-medium">{currentFile.name}</p>
              {currentFile.size && (
                <p className="text-xs text-muted-foreground">{currentFile.size}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={currentFile.url} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop or click to upload
          </p>
          <Input
            type="file"
            accept={accept}
            onChange={handleUpload}
            disabled={isUploading}
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Maximum file size: {maxSize}MB
          </p>
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