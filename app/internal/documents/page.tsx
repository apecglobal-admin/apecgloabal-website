"use client"

import InternalLayout from "@/components/internal-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { useState } from "react"

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const folders = [
    { name: "Chính sách công ty", count: 25, icon: Folder, color: "text-blue-400" },
    { name: "Hướng dẫn sử dụng", count: 18, icon: Folder, color: "text-green-400" },
    { name: "Biểu mẫu", count: 32, icon: Folder, color: "text-purple-400" },
    { name: "Báo cáo", count: 45, icon: Folder, color: "text-orange-400" },
    { name: "Tài liệu kỹ thuật", count: 67, icon: Folder, color: "text-cyan-400" },
    { name: "Marketing", count: 23, icon: Folder, color: "text-pink-400" },
  ]

  const documents = [
    {
      id: 1,
      name: "Quy định bảo mật thông tin 2024.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedBy: "Nguyễn Văn A",
      uploadDate: "15/12/2024",
      downloads: 156,
      category: "Chính sách",
    },
    {
      id: 2,
      name: "Hướng dẫn sử dụng hệ thống.docx",
      type: "docx",
      size: "1.8 MB",
      uploadedBy: "Trần Thị B",
      uploadDate: "12/12/2024",
      downloads: 89,
      category: "Hướng dẫn",
    },
    {
      id: 3,
      name: "Biểu mẫu nghỉ phép.xlsx",
      type: "xlsx",
      size: "245 KB",
      uploadedBy: "Lê Văn C",
      uploadDate: "10/12/2024",
      downloads: 234,
      category: "Biểu mẫu",
    },
    {
      id: 4,
      name: "Presentation_Q4_Results.pptx",
      type: "pptx",
      size: "5.2 MB",
      uploadedBy: "Phạm Thị D",
      uploadDate: "08/12/2024",
      downloads: 67,
      category: "Báo cáo",
    },
    {
      id: 5,
      name: "API_Documentation_v2.pdf",
      type: "pdf",
      size: "3.1 MB",
      uploadedBy: "Hoàng Văn E",
      uploadDate: "05/12/2024",
      downloads: 123,
      category: "Kỹ thuật",
    },
    {
      id: 6,
      name: "Brand_Guidelines_2024.zip",
      type: "zip",
      size: "15.6 MB",
      uploadedBy: "Vũ Thị F",
      uploadDate: "03/12/2024",
      downloads: 45,
      category: "Marketing",
    },
  ]

  // Filter documents
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <File className="h-8 w-8 text-red-400" />
      case "docx":
        return <FileText className="h-8 w-8 text-blue-400" />
      case "xlsx":
        return <FileText className="h-8 w-8 text-green-400" />
      case "pptx":
        return <FileText className="h-8 w-8 text-orange-400" />
      case "zip":
        return <Archive className="h-8 w-8 text-purple-400" />
      case "jpg":
      case "png":
        return <ImageIcon className="h-8 w-8 text-pink-400" />
      case "mp4":
        return <Video className="h-8 w-8 text-cyan-400" />
      default:
        return <File className="h-8 w-8 text-gray-400" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Chính sách":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30"
      case "Hướng dẫn":
        return "bg-green-500/10 text-green-300 border-green-500/30"
      case "Biểu mẫu":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30"
      case "Báo cáo":
        return "bg-orange-500/10 text-orange-300 border-orange-500/30"
      case "Kỹ thuật":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
      case "Marketing":
        return "bg-pink-500/10 text-pink-300 border-pink-500/30"
      default:
        return "bg-gray-500/10 text-gray-300 border-gray-500/30"
    }
  }

  const handleUpload = () => {
    setShowUploadModal(true)
  }

  const handleCreateFolder = () => {
    const folderName = prompt("Nhập tên thư mục mới:")
    if (folderName) {
      alert(`Đã tạo thư mục: ${folderName}`)
    }
  }

  const handleViewDocument = (doc) => {
    alert(`Xem tài liệu: ${doc.name}`)
  }

  const handleDownloadDocument = (doc) => {
    alert(`Tải xuống: ${doc.name}`)
  }

  const handleShareDocument = (doc) => {
    alert(`Chia sẻ: ${doc.name}`)
  }

  const handleDeleteDocument = (doc) => {
    if (confirm(`Bạn có chắc chắn muốn xóa "${doc.name}"?`)) {
      alert(`Đã xóa: ${doc.name}`)
    }
  }

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/internal">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cổng Nội Bộ
            </Button>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white">Tài Liệu</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Tài Liệu</h1>
            <p className="text-white/60">Lưu trữ và quản lý tài liệu của tổ chức</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Button
              onClick={handleUpload}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Upload className="h-4 w-4 mr-2" />
              Tải Lên
            </Button>
            <Button
              onClick={handleCreateFolder}
              variant="outline"
              className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
            >
              <Folder className="h-4 w-4 mr-2" />
              Tạo Thư Mục
            </Button>
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

        {/* Folders */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Thư Mục</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {folders.map((folder, index) => {
              const IconComponent = folder.icon
              return (
                <Card
                  key={index}
                  className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <CardContent className="p-4 text-center">
                    <IconComponent className={`h-12 w-12 mx-auto ${folder.color} mb-3`} />
                    <h4 className="text-white font-medium text-sm mb-1">{folder.name}</h4>
                    <p className="text-white/60 text-xs">{folder.count} tài liệu</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Documents */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Tài Liệu Gần Đây</h3>
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-5 gap-6 items-center">
                    {/* File Info */}
                    <div className="lg:col-span-2 flex items-center space-x-4">
                      <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{doc.name}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <Badge className={`${getCategoryColor(doc.category)} border text-xs`}>{doc.category}</Badge>
                          <span className="text-white/60 text-sm">{doc.size}</span>
                        </div>
                      </div>
                    </div>

                    {/* Upload Info */}
                    <div className="space-y-1">
                      <div className="flex items-center text-white/60 text-sm">
                        <User className="h-4 w-4 mr-1" />
                        {doc.uploadedBy}
                      </div>
                      <div className="flex items-center text-white/60 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {doc.uploadDate}
                      </div>
                    </div>

                    {/* Downloads */}
                    <div className="text-center">
                      <div className="bg-black/30 rounded-lg p-3">
                        <Download className="h-5 w-5 mx-auto text-purple-400 mb-1" />
                        <p className="text-lg font-bold text-white">{doc.downloads}</p>
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
        </div>

        {/* Upload Area */}
        <div className="mt-12">
          <Card className="bg-black/50 border-purple-500/30 border-dashed">
            <CardContent className="p-12 text-center">
              <Upload className="h-16 w-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Tải Lên Tài Liệu</h3>
              <p className="text-white/60 mb-6">Kéo thả file vào đây hoặc click để chọn file</p>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                Chọn File
              </Button>
              <p className="text-white/40 text-sm mt-4">Hỗ trợ: PDF, DOC, XLS, PPT, ZIP (Max: 50MB)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </InternalLayout>
  )
}