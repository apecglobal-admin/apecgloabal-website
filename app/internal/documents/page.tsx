"use client"

import InternalLayout from "@/components/internal-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import {
  FileText,
  Search,
  Upload,
  Download,
  ArrowLeft,
  Folder,
  File,
  ImageIcon,
  Video,
  Archive,
  Eye,
  Trash2,
  Share,
  Calendar,
  User,
  Plus,
  Loader2,
  AlertCircle,
  X,
  FolderPlus,
  FolderInput,
  MoveHorizontal,
  Check,
  Square,
  CheckSquare,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { format } from 'date-fns';

// Define document type
interface Document {
  id: number;
  name: string;
  file_type: string;
  file_size: string;
  file_url: string;
  category: string;
  uploaded_by: number;
  uploader_name?: string;
  download_count: number;
  description: string;
  folder_path: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// Define folder type
interface Folder {
  folder_path: string;
  document_count: number;
}

export default function DocumentsPage() {
  // State variables
  const [searchTerm, setSearchTerm] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [newFolder, setNewFolder] = useState("")
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [targetFolder, setTargetFolder] = useState<string | null>(null)
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    isPublic: true,
    folderPath: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [userId, setUserId] = useState<number | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [draggedDocumentId, setDraggedDocumentId] = useState<number | null>(null)

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.user && data.user.id) {
          setUserId(data.user.id);
        } else {
          // Fallback to admin user if not logged in (for development)
          setUserId(1);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        // Fallback to admin user
        setUserId(1);
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch documents and folders
  useEffect(() => {
    const fetchDocumentsAndFolders = async () => {
      setIsLoading(true);
      try {
        // Fetch folders
        const foldersResponse = await fetch('/api/documents/folders');
        const foldersData = await foldersResponse.json();
        setFolders(foldersData);

        // Fetch documents
        let url = '/api/documents';
        if (currentFolder) {
          url += `?folderPath=${encodeURIComponent(currentFolder)}`;
        }
        const documentsResponse = await fetch(url);
        const documentsData = await documentsResponse.json();
        setDocuments(documentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentsAndFolders();
  }, [currentFolder]);

  // Update breadcrumbs when folder changes
  useEffect(() => {
    if (currentFolder) {
      const parts = currentFolder.split('/').filter(Boolean);
      setBreadcrumbs(parts);
    } else {
      setBreadcrumbs([]);
    }
  }, [currentFolder]);

  // Filter documents based on search term
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.category && doc.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get file icon based on file type
  const getFileIcon = (type: string) => {
    const fileType = type.split('/')[1] || type;
    
    switch (fileType) {
      case 'pdf':
        return <File className="h-8 w-8 text-red-400" />;
      case 'msword':
      case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'docx':
      case 'doc':
        return <FileText className="h-8 w-8 text-blue-400" />;
      case 'vnd.ms-excel':
      case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'xlsx':
      case 'xls':
        return <FileText className="h-8 w-8 text-green-400" />;
      case 'vnd.ms-powerpoint':
      case 'vnd.openxmlformats-officedocument.presentationml.presentation':
      case 'pptx':
      case 'ppt':
        return <FileText className="h-8 w-8 text-orange-400" />;
      case 'zip':
      case 'x-zip-compressed':
      case 'x-rar-compressed':
      case 'rar':
        return <Archive className="h-8 w-8 text-purple-400" />;
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'gif':
      case 'webp':
        return <ImageIcon className="h-8 w-8 text-pink-400" />;
      case 'mp4':
      case 'mpeg':
      case 'quicktime':
      case 'x-msvideo':
        return <Video className="h-8 w-8 text-cyan-400" />;
      default:
        return <File className="h-8 w-8 text-gray-400" />;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Chính sách":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30";
      case "Hướng dẫn":
        return "bg-green-500/10 text-green-300 border-green-500/30";
      case "Biểu mẫu":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      case "Báo cáo":
        return "bg-orange-500/10 text-orange-300 border-orange-500/30";
      case "Kỹ thuật":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "Marketing":
        return "bg-pink-500/10 text-pink-300 border-pink-500/30";
      default:
        return "bg-gray-500/10 text-gray-300 border-gray-500/30";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Handle folder click
  const handleFolderClick = (folderPath: string) => {
    setCurrentFolder(folderPath);
  };

  // Navigate to parent folder
  const navigateToParentFolder = () => {
    if (currentFolder) {
      const parts = currentFolder.split('/').filter(Boolean);
      if (parts.length > 1) {
        // Go up one level
        const parentPath = parts.slice(0, -1).join('/');
        setCurrentFolder(parentPath);
      } else {
        // Go to root
        setCurrentFolder(null);
      }
    }
  };

  // Navigate to specific breadcrumb
  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setCurrentFolder(null);
    } else {
      const path = breadcrumbs.slice(0, index + 1).join('/');
      setCurrentFolder(path);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Nếu chỉ chọn 1 file
      if (e.target.files.length === 1) {
        const file = e.target.files[0];
        setSelectedFile(file);
        setUploadForm({
          ...uploadForm,
          name: file.name,
        });
      } else {
        // Nếu chọn nhiều file, chỉ lấy file đầu tiên để hiển thị
        const firstFile = e.target.files[0];
        setSelectedFile(firstFile);
        setUploadForm({
          ...uploadForm,
          name: `${e.target.files.length} files được chọn`,
        });
        
        // Lưu tất cả các file vào state
        const filesArray = Array.from(e.target.files);
        setSelectedFiles(filesArray);
      }
      setShowUploadModal(true);
    }
  };

  // Handle drag over for file upload
  const handleFileUploadDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drop for file upload
  const handleFileUploadDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Nếu chỉ có 1 file
      if (e.dataTransfer.files.length === 1) {
        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
        setUploadForm({
          ...uploadForm,
          name: file.name,
        });
        setSelectedFiles([]);
      } else {
        // Nếu có nhiều file
        const firstFile = e.dataTransfer.files[0];
        setSelectedFile(firstFile);
        setUploadForm({
          ...uploadForm,
          name: `${e.dataTransfer.files.length} files được chọn`,
        });
        
        // Lưu tất cả các file vào state
        const filesArray = Array.from(e.dataTransfer.files);
        setSelectedFiles(filesArray);
      }
      setShowUploadModal(true);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if ((!selectedFile && selectedFiles.length === 0) || !userId) {
      toast.error('Vui lòng chọn file và đảm bảo đã đăng nhập');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Xác định danh sách file cần upload
      const filesToUpload = selectedFiles.length > 0 ? selectedFiles : [selectedFile!];
      const totalFiles = filesToUpload.length;
      let uploadedCount = 0;
      const uploadedDocuments = [];
      
      // Upload từng file một
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', totalFiles === 1 ? uploadForm.name : file.name);
        formData.append('description', uploadForm.description);
        formData.append('uploadedBy', userId.toString());
        formData.append('isPublic', uploadForm.isPublic.toString());
        formData.append('folderPath', currentFolder || '');

        // Cập nhật tiến trình dựa trên số file đã upload
        const progressPerFile = 80 / totalFiles;
        setUploadProgress(10 + progressPerFile * uploadedCount);

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const newDocument = await response.json();
        uploadedDocuments.push(newDocument);
        uploadedCount++;
      }
      
      // Cập nhật danh sách tài liệu
      setDocuments([...uploadedDocuments, ...documents]);
      
      setUploadProgress(100);
      
      // Hiển thị thông báo thành công
      if (totalFiles === 1) {
        toast.success('Tải lên thành công!');
      } else {
        toast.success(`Đã tải lên ${totalFiles} tài liệu thành công!`);
      }
      
      // Reset form
      setSelectedFile(null);
      setSelectedFiles([]);
      setUploadForm({
        name: "",
        description: "",
        isPublic: true,
        folderPath: "",
      });
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Tải lên thất bại. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle create folder
  const handleCreateFolder = async () => {
    if (!newFolder.trim() || !userId) {
      toast.error('Vui lòng nhập tên thư mục và đảm bảo đã đăng nhập');
      return;
    }

    try {
      // Create the full path if in a subfolder
      const fullPath = currentFolder ? `${currentFolder}/${newFolder}` : newFolder;
      
      const response = await fetch('/api/documents/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderName: fullPath,
          createdBy: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create folder');
      }

      // Add the new folder to the list
      setFolders([...folders, { folder_path: fullPath, document_count: 0 }]);
      
      toast.success(`Đã tạo thư mục: ${newFolder}`);
      setNewFolder("");
      setShowCreateFolderModal(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Không thể tạo thư mục. Vui lòng thử lại.');
    }
  };

  // Handle view document
  const handleViewDocument = (doc: Document) => {
    window.open(doc.file_url, '_blank');
  };

  // Handle download document
  const handleDownloadDocument = async (doc: Document) => {
    try {
      // Call the download API to increment the download count
      const response = await fetch(`/api/documents/download?id=${doc.id}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const data = await response.json();
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = doc.file_url;
      link.setAttribute('download', doc.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update the document in the list with the new download count
      setDocuments(documents.map(d => 
        d.id === doc.id ? { ...d, download_count: data.document.download_count } : d
      ));
      
      toast.success(`Đang tải xuống: ${doc.name}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Không thể tải xuống tài liệu. Vui lòng thử lại.');
    }
  };

  // Handle share document
  const handleShareDocument = (doc: Document) => {
    // Create a shareable link
    const shareLink = `${window.location.origin}/internal/documents/shared?id=${doc.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        toast.success('Đã sao chép liên kết chia sẻ vào clipboard');
      })
      .catch(() => {
        toast.error('Không thể sao chép liên kết');
      });
  };

  // Handle delete document
  const handleDeleteDocument = async (doc: Document) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa "${doc.name}"?`)) {
      return;
    }
    
    try {
      const response = await fetch('/api/documents/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: doc.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      // Remove the document from the list
      setDocuments(documents.filter(d => d.id !== doc.id));
      
      toast.success(`Đã xóa: ${doc.name}`);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Không thể xóa tài liệu. Vui lòng thử lại.');
    }
  };
  
  // Handle document selection for move
  const toggleDocumentSelection = (docId: number) => {
    setSelectedDocuments(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId);
      } else {
        return [...prev, docId];
      }
    });
  };
  
  // Handle move documents
  const handleMoveDocuments = async () => {
    if (!selectedDocuments.length) {
      toast.error('Vui lòng chọn ít nhất một tài liệu để di chuyển');
      return;
    }
    
    setShowMoveModal(true);
  };
  
  // Execute move documents
  const executeMoveDocuments = async () => {
    if (!selectedDocuments.length) {
      toast.error('Không có tài liệu nào được chọn');
      return;
    }
    
    setIsMoving(true);
    
    try {
      const response = await fetch('/api/documents/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentIds: selectedDocuments,
          targetFolder: targetFolder,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to move documents');
      }

      const result = await response.json();
      
      // Update documents list
      setDocuments(prev => prev.filter(doc => !selectedDocuments.includes(doc.id)));
      
      toast.success(`Đã di chuyển ${result.movedCount} tài liệu thành công`);
      setSelectedDocuments([]);
      setShowMoveModal(false);
      setTargetFolder(null);
    } catch (error) {
      console.error('Error moving documents:', error);
      toast.error('Không thể di chuyển tài liệu. Vui lòng thử lại.');
    } finally {
      setIsMoving(false);
    }
  };
  
  // Handle drag start
  const handleDragStart = (docId: number) => {
    setDraggedDocumentId(docId);
    setIsDragging(true);
  };
  
  // Handle drag over folder
  const handleDragOver = (e: React.DragEvent, folderPath: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('bg-purple-500/20');
  };
  
  // Handle drag leave folder
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-purple-500/20');
  };
  
  // Handle drop on folder
  const handleDrop = async (e: React.DragEvent, folderPath: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-purple-500/20');
    setIsDragging(false);
    
    if (!draggedDocumentId) return;
    
    try {
      const response = await fetch('/api/documents/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentIds: [draggedDocumentId],
          targetFolder: folderPath,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to move document');
      }

      // Update documents list
      setDocuments(prev => prev.filter(doc => doc.id !== draggedDocumentId));
      
      toast.success('Đã di chuyển tài liệu thành công');
      setDraggedDocumentId(null);
    } catch (error) {
      console.error('Error moving document:', error);
      toast.error('Không thể di chuyển tài liệu. Vui lòng thử lại.');
    }
  };

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8 flex-wrap">
          <Link href="/internal">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cổng Nội Bộ
            </Button>
          </Link>
          <span className="text-white/40">/</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => setCurrentFolder(null)}
          >
            Tài Liệu
          </Button>
          
          {breadcrumbs.length > 0 && (
            <>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-white/40">/</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => navigateToBreadcrumb(index)}
                  >
                    {crumb}
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentFolder ? `Thư mục: ${breadcrumbs[breadcrumbs.length - 1]}` : 'Quản Lý Tài Liệu'}
            </h1>
            <p className="text-white/60">
              {currentFolder 
                ? `Đường dẫn: /${breadcrumbs.join('/')}`
                : 'Lưu trữ và quản lý tài liệu của tổ chức'}
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Upload className="h-4 w-4 mr-2" />
              Tải Lên
            </Button>
            <Button
              onClick={() => setShowCreateFolderModal(true)}
              variant="outline"
              className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Tạo Thư Mục
            </Button>
            <Button
              onClick={handleMoveDocuments}
              variant="outline"
              className={`bg-transparent border-2 ${selectedDocuments.length ? 'border-green-500/50 text-green-400 hover:bg-green-500/20' : 'border-gray-500/50 text-gray-400'}`}
              disabled={selectedDocuments.length === 0}
            >
              <MoveHorizontal className="h-4 w-4 mr-2" />
              Di Chuyển ({selectedDocuments.length})
            </Button>
            {currentFolder && (
              <Button
                onClick={navigateToParentFolder}
                variant="outline"
                className="bg-transparent border-2 border-blue-500/50 text-white hover:bg-blue-500/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay Lại
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
            <span className="ml-2 text-white">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>
            {/* Folders */}
            {(!currentFolder || folders.some(f => f.folder_path.startsWith(currentFolder + '/'))) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Thư Mục</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {folders
                    .filter(folder => {
                      if (!currentFolder) {
                        // At root level, show only top-level folders (no slashes)
                        return !folder.folder_path.includes('/');
                      } else {
                        // In a subfolder, show only direct children
                        const parts = folder.folder_path.split('/');
                        const currentParts = currentFolder.split('/');
                        return parts.length === currentParts.length + 1 && 
                               folder.folder_path.startsWith(currentFolder + '/');
                      }
                    })
                    .map((folder, index) => {
                      const folderName = folder.folder_path.split('/').pop() || folder.folder_path;
                      return (
                        <Card
                          key={index}
                          className={`bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105 ${isDragging ? 'drop-target' : ''}`}
                          onClick={() => handleFolderClick(folder.folder_path)}
                          onDragOver={(e) => handleDragOver(e, folder.folder_path)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, folder.folder_path)}
                        >
                          <CardContent className="p-4 text-center">
                            <FolderInput className="h-12 w-12 mx-auto text-blue-400 mb-3" />
                            <h4 className="text-white font-medium text-sm mb-1">{folderName}</h4>
                            <p className="text-white/60 text-xs">{folder.document_count} tài liệu</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Documents */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                {searchTerm ? 'Kết Quả Tìm Kiếm' : 'Tài Liệu'}
              </h3>
              
              {filteredDocuments.length === 0 ? (
                <Card className="bg-black/50 border-purple-500/30">
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                    <h4 className="text-white text-lg font-medium mb-2">Không có tài liệu nào</h4>
                    <p className="text-white/60">
                      {searchTerm 
                        ? 'Không tìm thấy tài liệu phù hợp với từ khóa tìm kiếm.' 
                        : currentFolder 
                          ? 'Thư mục này chưa có tài liệu nào. Hãy tải lên tài liệu mới.' 
                          : 'Chưa có tài liệu nào. Hãy tải lên tài liệu đầu tiên.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredDocuments
                    .filter(doc => {
                      // Filter documents based on current folder
                      if (!currentFolder) {
                        return !doc.folder_path || doc.folder_path === '';
                      } else {
                        return doc.folder_path === currentFolder;
                      }
                    })
                    .map((doc) => (
                      <Card
                        key={doc.id}
                        className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
                        draggable={true}
                        onDragStart={() => handleDragStart(doc.id)}
                      >
                        <CardContent className="p-6">
                          <div className="grid lg:grid-cols-5 gap-6 items-center">
                            {/* File Info */}
                            <div className="lg:col-span-2 flex items-center space-x-4">
                              <div 
                                className="flex-shrink-0 cursor-pointer" 
                                onClick={() => toggleDocumentSelection(doc.id)}
                              >
                                {selectedDocuments.includes(doc.id) ? (
                                  <CheckSquare className="h-5 w-5 text-green-500" />
                                ) : (
                                  <Square className="h-5 w-5 text-gray-400 hover:text-white" />
                                )}
                              </div>
                              <div className="flex-shrink-0">{getFileIcon(doc.file_type)}</div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium truncate">{doc.name}</h4>
                                <div className="flex items-center space-x-3 mt-1">
                                  <Badge className={`${getCategoryColor(doc.folder_path || doc.category)} border text-xs`}>
                                    {doc.folder_path || doc.category || 'Uncategorized'}
                                  </Badge>
                                  <span className="text-white/60 text-sm">{doc.file_size}</span>
                                </div>
                              </div>
                            </div>

                            {/* Upload Info */}
                            <div className="space-y-1">
                              <div className="flex items-center text-white/60 text-sm">
                                <User className="h-4 w-4 mr-1" />
                                {doc.uploader_name || 'Unknown'}
                              </div>
                              <div className="flex items-center text-white/60 text-sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(doc.created_at)}
                              </div>
                            </div>

                            {/* Downloads */}
                            <div className="text-center">
                              <div className="bg-black/30 rounded-lg p-3">
                                <Download className="h-5 w-5 mx-auto text-purple-400 mb-1" />
                                <p className="text-lg font-bold text-white">{doc.download_count}</p>
                                <p className="text-white/60 text-xs">Lượt tải</p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col space-y-2">
                              <Button
                                onClick={() => handleViewDocument(doc)}
                                variant="outline"
                                size="sm"
                                className="bg-transparent border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Xem
                              </Button>
                              <Button
                                onClick={() => handleDownloadDocument(doc)}
                                variant="outline"
                                size="sm"
                                className="bg-transparent border-2 border-green-500/50 text-green-300 hover:bg-green-500/20"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Tải
                              </Button>
                              <div className="flex space-x-1">
                                <Button
                                  onClick={() => handleShareDocument(doc)}
                                  variant="outline"
                                  size="sm"
                                  className="bg-transparent border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/20 flex-1"
                                >
                                  <Share className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteDocument(doc)}
                                  variant="outline"
                                  size="sm"
                                  className="bg-transparent border-2 border-red-500/50 text-red-300 hover:bg-red-500/20 flex-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div className="mt-12">
              <Card 
                className="bg-black/50 border-purple-500/30 border-dashed"
                onDragOver={handleFileUploadDragOver}
                onDrop={handleFileUploadDrop}
              >
                <CardContent className="p-12 text-center">
                  <Upload className="h-16 w-16 mx-auto text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Tải Lên Tài Liệu</h3>
                  <p className="text-white/60 mb-6">Kéo thả file hoặc thư mục vào đây hoặc click để chọn nhiều file</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                  />
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Chọn File
                  </Button>
                  <p className="text-white/40 text-sm mt-4">Hỗ trợ: PDF, DOC, XLS, PPT, ZIP, JPG, PNG (Max: 50MB mỗi file)</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Upload Modal */}
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="bg-gray-900 border-purple-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Tải Lên Tài Liệu</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {selectedFile ? (
                <div className="flex items-center space-x-3 bg-black/30 p-3 rounded-lg">
                  {getFileIcon(selectedFile.type)}
                  <div className="flex-1">
                    <p className="text-white font-medium truncate">{selectedFile.name}</p>
                    <p className="text-white/60 text-sm">{Math.round(selectedFile.size / 1024)} KB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/60"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleFileUploadDragOver}
                  onDrop={handleFileUploadDrop}
                >
                  <Upload className="h-12 w-12 mx-auto text-purple-400 mb-3" />
                  <p className="text-white font-medium mb-1">Kéo thả file vào đây</p>
                  <p className="text-white/60 text-sm mb-4">hoặc click để chọn file</p>
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
                  >
                    Chọn File
                  </Button>
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="filename" className="text-white">Tên tài liệu</Label>
                  <Input
                    id="filename"
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    className="bg-black/30 border-purple-500/30 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="folder" className="text-white">Thư mục / Danh mục</Label>
                  <div className="bg-black/30 border border-purple-500/30 rounded-md p-2 mt-1">
                    <div className="flex items-center">
                      <FolderInput className="h-4 w-4 mr-2 text-purple-400" />
                      <span className="text-white">
                        {currentFolder ? `/${currentFolder}` : 'Thư mục gốc'}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">
                      Tài liệu sẽ được lưu vào thư mục hiện tại. Để thay đổi, hãy chọn thư mục khác trước khi tải lên.
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-white">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="bg-black/30 border-purple-500/30 text-white mt-1 min-h-[100px]"
                    placeholder="Nhập mô tả tài liệu..."
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={uploadForm.isPublic}
                    onCheckedChange={(checked) => setUploadForm({ ...uploadForm, isPublic: checked })}
                  />
                  <Label htmlFor="public" className="text-white">Công khai cho tất cả nhân viên</Label>
                </div>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-white/60 text-sm text-center">{uploadProgress}% - Đang tải lên...</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowUploadModal(false)}
                className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10"
                disabled={isUploading}
              >
                Hủy
              </Button>
              <Button
                onClick={handleUpload}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Tải Lên
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Folder Modal */}
        <Dialog open={showCreateFolderModal} onOpenChange={setShowCreateFolderModal}>
          <DialogContent className="bg-gray-900 border-purple-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Tạo Thư Mục Mới</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="foldername" className="text-white">Tên thư mục</Label>
                <Input
                  id="foldername"
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  className="bg-black/30 border-purple-500/30 text-white"
                  placeholder="Nhập tên thư mục..."
                />
              </div>
              
              {currentFolder && (
                <div className="bg-black/30 p-3 rounded-lg">
                  <p className="text-white/60 text-sm">Thư mục sẽ được tạo trong:</p>
                  <p className="text-white font-medium">/{breadcrumbs.join('/')}</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateFolderModal(false)}
                className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10"
              >
                Hủy
              </Button>
              <Button
                onClick={handleCreateFolder}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                disabled={!newFolder.trim()}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Tạo Thư Mục
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Move Documents Modal */}
        <Dialog open={showMoveModal} onOpenChange={setShowMoveModal}>
          <DialogContent className="bg-gray-900 border-purple-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Di Chuyển Tài Liệu</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="targetFolder" className="text-white">Chọn thư mục đích</Label>
                <Select
                  value={targetFolder || ''}
                  onValueChange={(value) => setTargetFolder(value === 'root' ? null : value)}
                >
                  <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn thư mục đích" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-purple-500/30 text-white">
                    <SelectItem value="root">Thư mục gốc</SelectItem>
                    {folders.map((folder, index) => (
                      <SelectItem key={index} value={folder.folder_path}>
                        {folder.folder_path.includes('/') 
                          ? `.../${folder.folder_path.split('/').pop()}` 
                          : folder.folder_path}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-black/30 p-3 rounded-lg">
                <p className="text-white/60 text-sm">Đã chọn {selectedDocuments.length} tài liệu để di chuyển</p>
                {targetFolder ? (
                  <p className="text-white font-medium">Đến: {targetFolder}</p>
                ) : (
                  <p className="text-white font-medium">Đến: Thư mục gốc</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowMoveModal(false)}
                className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10"
                disabled={isMoving}
              >
                Hủy
              </Button>
              <Button
                onClick={executeMoveDocuments}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                disabled={isMoving}
              >
                {isMoving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang di chuyển...
                  </>
                ) : (
                  <>
                    <MoveHorizontal className="h-4 w-4 mr-2" />
                    Di Chuyển
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </InternalLayout>
  )
}