"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import InternalLayout from "@/components/cms-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  FileText,
  Download,
  ArrowLeft,
  File,
  ImageIcon,
  Video,
  Archive,
  Eye,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  Lock,
} from "lucide-react"
import { format } from 'date-fns'
import { toast } from "sonner"

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

export default function SharedDocumentPage() {
  const searchParams = useSearchParams()
  const documentId = searchParams.get('id')
  
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check login status
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.user) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  // Fetch document
  useEffect(() => {
    const fetchDocument = async () => {
      if (!documentId) {
        setError('ID tài liệu không hợp lệ');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/documents?id=${documentId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
          setError('Không tìm thấy tài liệu');
        } else {
          setDocument(data[0]);
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Không thể tải thông tin tài liệu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Get file icon
  const getFileIcon = (type: string) => {
    const fileType = type.split('/')[1] || type;
    
    switch (fileType) {
      case 'pdf':
        return <File className="h-16 w-16 text-red-400" />;
      case 'msword':
      case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'docx':
      case 'doc':
        return <FileText className="h-16 w-16 text-blue-400" />;
      case 'vnd.ms-excel':
      case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'xlsx':
      case 'xls':
        return <FileText className="h-16 w-16 text-green-400" />;
      case 'vnd.ms-powerpoint':
      case 'vnd.openxmlformats-officedocument.presentationml.presentation':
      case 'pptx':
      case 'ppt':
        return <FileText className="h-16 w-16 text-orange-400" />;
      case 'zip':
      case 'x-zip-compressed':
      case 'x-rar-compressed':
      case 'rar':
        return <Archive className="h-16 w-16 text-purple-400" />;
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'gif':
      case 'webp':
        return <ImageIcon className="h-16 w-16 text-pink-400" />;
      case 'mp4':
      case 'mpeg':
      case 'quicktime':
      case 'x-msvideo':
        return <Video className="h-16 w-16 text-cyan-400" />;
      default:
        return <File className="h-16 w-16 text-gray-400" />;
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

  // Handle view document
  const handleViewDocument = () => {
    if (document) {
      // Use the proxy endpoint for viewing
      const proxyUrl = `/api/documents/proxy?id=${document.id}`;
      window.open(proxyUrl, '_blank');
    }
  };

  // Handle download document
  const handleDownloadDocument = async () => {
    if (!document) return;
    
    try {
      toast.info('Đang chuẩn bị tải xuống...');
      
      // Use the proxy endpoint to get the file
      const proxyUrl = `/api/documents/proxy?id=${document.id}`;
      
      // Fetch the file through proxy
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Get the file as blob
      const blob = await response.blob();
      
      // Create a temporary link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.name);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Tải xuống thành công: ${document.name}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Không thể tải xuống tài liệu: ${error.message}`);
    }
  };

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/cms">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cổng Nội Bộ
            </Button>
          </Link>
          <span className="text-white/40">/</span>
          <Link href="/cms/documents">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              Tài Liệu
            </Button>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white">Tài Liệu Được Chia Sẻ</span>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 mx-auto text-purple-400 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Đang tải thông tin tài liệu...</h3>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Lỗi</h3>
                <p className="text-white/60 mb-6">{error}</p>
                <Link href="/cms/documents">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                    Quay Lại Tài Liệu
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : !isLoggedIn && document && !document.is_public ? (
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-12 text-center">
                <Lock className="h-12 w-12 mx-auto text-orange-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Tài liệu bị hạn chế</h3>
                <p className="text-white/60 mb-6">Bạn cần đăng nhập để xem tài liệu này.</p>
                <Link href="/cms">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                    Đăng Nhập
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : document ? (
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader className="border-b border-purple-500/20 pb-6">
                <CardTitle className="text-2xl font-bold text-white">{document.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* File Preview */}
                  <div className="md:col-span-1">
                    <div className="bg-black/30 rounded-lg p-8 text-center">
                      {getFileIcon(document.file_type)}
                      <div className="mt-4">
                        <Badge className={`${getCategoryColor(document.category)} border`}>
                          {document.category || 'Uncategorized'}
                        </Badge>
                        <p className="text-white/60 text-sm mt-2">{document.file_size}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <Button
                        onClick={handleViewDocument}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Xem Tài Liệu
                      </Button>
                      <Button
                        onClick={handleDownloadDocument}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Tải Xuống
                      </Button>
                    </div>
                  </div>
                  
                  {/* File Details */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Thông Tin Tài Liệu</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 py-2 border-b border-purple-500/10">
                          <div className="text-white/60">Tên file:</div>
                          <div className="col-span-2 text-white font-medium">{document.name}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 py-2 border-b border-purple-500/10">
                          <div className="text-white/60">Loại file:</div>
                          <div className="col-span-2 text-white">{document.file_type}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 py-2 border-b border-purple-500/10">
                          <div className="text-white/60">Kích thước:</div>
                          <div className="col-span-2 text-white">{document.file_size}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 py-2 border-b border-purple-500/10">
                          <div className="text-white/60">Danh mục:</div>
                          <div className="col-span-2">
                            <Badge className={`${getCategoryColor(document.category)} border`}>
                              {document.category || 'Uncategorized'}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 py-2 border-b border-purple-500/10">
                          <div className="text-white/60">Người tải lên:</div>
                          <div className="col-span-2 text-white flex items-center">
                            <User className="h-4 w-4 mr-2 text-purple-400" />
                            {document.uploader_name || 'Unknown'}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 py-2 border-b border-purple-500/10">
                          <div className="text-white/60">Ngày tải lên:</div>
                          <div className="col-span-2 text-white flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                            {formatDate(document.created_at)}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 py-2 border-b border-purple-500/10">
                          <div className="text-white/60">Lượt tải:</div>
                          <div className="col-span-2 text-white flex items-center">
                            <Download className="h-4 w-4 mr-2 text-purple-400" />
                            {document.download_count}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {document.description && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Mô Tả</h3>
                        <div className="bg-black/30 rounded-lg p-4 text-white/80">
                          {document.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </InternalLayout>
  )
}