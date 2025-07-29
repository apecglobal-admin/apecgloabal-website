"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  X, 
  Download, 
  Share, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2,
  FileText,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy
} from "lucide-react"
import { toast } from "sonner"
import FileTypeIcon from "@/components/file-type-icon"

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

interface DocumentPreviewModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: Document) => void;
  onShare: (doc: Document) => void;
}

export default function DocumentPreviewModal({
  document: documentProp,
  isOpen,
  onClose,
  onDownload,
  onShare
}: DocumentPreviewModalProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (documentProp && isOpen) {
      console.log('Debug - Modal opened, setting loading state')
      setZoom(100)
      setRotation(0)
      setIsLoading(true)
      setError(null)
      
      // Fallback timeout để tránh loading vô hạn
      const timeout = setTimeout(() => {
        console.log('Debug - Loading timeout, forcing stop loading')
        setIsLoading(false)
      }, 10000) // 10 seconds timeout
      
      return () => clearTimeout(timeout)
    }
  }, [documentProp, isOpen])

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case '=':
        case '+':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            handleZoomIn()
          }
          break
        case '-':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            handleZoomOut()
          }
          break
        case 'r':
        case 'R':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            handleRotate()
          }
          break
        case 'd':
        case 'D':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (documentProp) onDownload(documentProp)
          }
          break
        case 's':
        case 'S':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (documentProp) onShare(documentProp)
          }
          break
        case 'f':
        case 'F':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            handleFullscreen()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, documentProp, onClose, onDownload, onShare])

  if (!documentProp) return null

  const getFileType = () => {
    const fileType = documentProp.file_type.toLowerCase()
    const fileName = documentProp.name.toLowerCase()
    
    console.log('Debug - File info:', {
      fileType,
      fileName,
      file_url: documentProp.file_url
    })
    
    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) return 'pdf'
    if (fileType.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].some(ext => fileType.includes(ext) || fileName.endsWith(`.${ext}`))) return 'image'
    if (fileType.includes('text') || fileType.includes('plain') || fileName.endsWith('.txt')) return 'text'
    if (fileType.includes('msword') || fileType.includes('wordprocessingml') || ['doc', 'docx'].some(ext => fileType.includes(ext) || fileName.endsWith(`.${ext}`))) return 'word'
    if (fileType.includes('excel') || fileType.includes('spreadsheetml') || ['xls', 'xlsx'].some(ext => fileType.includes(ext) || fileName.endsWith(`.${ext}`))) return 'excel'
    if (fileType.includes('powerpoint') || fileType.includes('presentationml') || ['ppt', 'pptx'].some(ext => fileType.includes(ext) || fileName.endsWith(`.${ext}`))) return 'powerpoint'
    if (fileType.includes('video') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].some(ext => fileType.includes(ext) || fileName.endsWith(`.${ext}`))) return 'video'
    if (fileType.includes('audio') || ['mp3', 'wav', 'ogg', 'aac', 'm4a'].some(ext => fileType.includes(ext) || fileName.endsWith(`.${ext}`))) return 'audio'
    return 'other'
  }

  const fileType = getFileType()

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleFullscreen = () => {
    window.open(getProxyUrl(), '_blank')
  }

  const handleCopyLink = async () => {
    try {
      const fullUrl = `${window.location.origin}${getProxyUrl()}`
      await navigator.clipboard.writeText(fullUrl)
      toast.success('Đã copy link file vào clipboard!')
    } catch (error) {
      toast.error('Không thể copy link')
    }
  }

  // Create proxy URL for secure file access
  const getProxyUrl = () => {
    return `/api/documents/proxy?id=${documentProp.id}`
  }

  const renderPreview = () => {
    console.log('Debug - Rendering preview for fileType:', fileType)
    console.log('Debug - isLoading:', isLoading, 'error:', error)
    console.log('Debug - Using proxy URL:', getProxyUrl())
    
    switch (fileType) {
      case 'pdf':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={`${getProxyUrl()}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              className="w-full h-full rounded-lg border-0"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
              onLoad={() => {
                console.log('Debug - PDF loaded successfully')
                setIsLoading(false)
              }}
              onError={() => {
                console.log('Debug - PDF load error')
                setError('Không thể tải PDF. Hãy thử tải xuống để xem.')
                setIsLoading(false)
              }}
              title={documentProp.name}
            />
          </div>
        )

      case 'image':
        return (
          <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-lg overflow-hidden">
            <img
              src={getProxyUrl()}
              alt={documentProp.name}
              className="max-w-full max-h-full object-contain"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
              onLoad={() => {
                console.log('Debug - Image loaded successfully')
                setIsLoading(false)
              }}
              onError={() => {
                console.log('Debug - Image load error')
                setError('Không thể tải hình ảnh.')
                setIsLoading(false)
              }}
            />
          </div>
        )

      case 'text':
        return (
          <div className="w-full h-full bg-white rounded-lg p-4 overflow-auto">
            <iframe
              src={getProxyUrl()}
              className="w-full h-full border-0"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left'
              }}
              onLoad={() => {
                console.log('Debug - Text file loaded successfully')
                setIsLoading(false)
              }}
              onError={() => {
                console.log('Debug - Text file load error')
                setError('Không thể tải file text.')
                setIsLoading(false)
              }}
            />
          </div>
        )

      case 'video':
        return (
          <div className="w-full h-full flex items-center justify-center bg-black rounded-lg">
            <video
              src={getProxyUrl()}
              controls
              className="max-w-full max-h-full"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
              onLoadedData={() => {
                console.log('Debug - Video loaded successfully')
                setIsLoading(false)
              }}
              onError={() => {
                console.log('Debug - Video load error')
                setError('Không thể tải video.')
                setIsLoading(false)
              }}
            >
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
        )

      case 'audio':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
            <div className="text-center">
              <div className="w-32 h-32 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="h-16 w-16 text-purple-400" />
              </div>
              <audio
                src={getProxyUrl()}
                controls
                className="mb-4"
                onLoadedData={() => {
                  console.log('Debug - Audio loaded successfully')
                  setIsLoading(false)
                }}
                onError={() => {
                  console.log('Debug - Audio load error')
                  setError('Không thể tải audio.')
                  setIsLoading(false)
                }}
              >
                Trình duyệt của bạn không hỗ trợ audio.
              </audio>
              <p className="text-white text-lg font-medium">{documentProp.name}</p>
            </div>
          </div>
        )

      case 'word':
      case 'excel':
      case 'powerpoint':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(getProxyUrl())}&embedded=true`}
              className="w-full h-full rounded-lg border-0"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center center'
              }}
              onLoad={() => {
                console.log('Debug - Google Docs Viewer loaded successfully')
                setIsLoading(false)
              }}
              onError={() => {
                console.log('Debug - Google Docs Viewer load error')
                setError(`Không thể tải file ${fileType.toUpperCase()}. Google Docs Viewer có thể không hỗ trợ file này.`)
                setIsLoading(false)
              }}
              title={documentProp.name}
            />
          </div>
        )

      default:
        // Set loading to false for unsupported file types
        if (isLoading) {
          console.log('Debug - Unsupported file type, stopping loading')
          setTimeout(() => setIsLoading(false), 100)
        }
        
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
            <div className="text-center">
              <FileText className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white text-xl font-medium mb-2">Không thể xem trước</h3>
              <p className="text-white/60 mb-4">
                File {fileType.toUpperCase()} không hỗ trợ xem trước trực tiếp.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => onDownload(documentProp)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống để xem
                </Button>
                <Button
                  onClick={handleFullscreen}
                  variant="outline"
                  className="bg-transparent border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Mở trong tab mới
                </Button>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] bg-gray-900 border-purple-500/30 text-white p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold text-white truncate">
                {documentProp.name}
              </DialogTitle>
              <div className="flex items-center space-x-3 mt-2">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {documentProp.file_type}
                </Badge>
                <span className="text-white/60 text-sm">{documentProp.file_size}</span>
                {documentProp.category && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {documentProp.category}
                  </Badge>
                )}
                <span className="text-white/60 text-sm">
                  {documentProp.download_count} lượt tải
                </span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 flex-wrap">
              {(fileType === 'pdf' || fileType === 'image') && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleZoomOut}
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-gray-500/50 text-white hover:bg-white/10"
                        disabled={zoom <= 50}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Thu nhỏ (Ctrl + -)</p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-white/60 text-sm min-w-[3rem] text-center">
                    {zoom}%
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleZoomIn}
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-gray-500/50 text-white hover:bg-white/10"
                        disabled={zoom >= 200}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Phóng to (Ctrl + +)</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
              
              {(fileType === 'image' || fileType === 'video') && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleRotate}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-gray-500/50 text-white hover:bg-white/10"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Xoay (Ctrl + R)</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleFullscreen}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toàn màn hình (Ctrl + F)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onDownload(documentProp)}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-green-500/50 text-green-300 hover:bg-green-500/20"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tải xuống (Ctrl + D)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy link</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onShare(documentProp)}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chia sẻ (Ctrl + S)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-red-500/50 text-red-300 hover:bg-red-500/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Đóng (Esc)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </DialogHeader>

        {/* Preview Content */}
        <div className="flex-1 p-6 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10">
              <div className="text-center bg-black/50 p-6 rounded-lg border border-purple-500/30">
                <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-white text-lg font-medium mb-2">Đang tải file...</p>
                <p className="text-white/60 text-sm mb-4">
                  {fileType === 'pdf' && 'Đang tải PDF...'}
                  {fileType === 'image' && 'Đang tải hình ảnh...'}
                  {fileType === 'video' && 'Đang tải video...'}
                  {fileType === 'audio' && 'Đang tải audio...'}
                  {['word', 'excel', 'powerpoint'].includes(fileType) && 'Đang tải qua Google Docs Viewer...'}
                  {fileType === 'text' && 'Đang tải file text...'}
                  {fileType === 'other' && 'Đang xử lý file...'}
                </p>
                <Button
                  onClick={() => {
                    console.log('Debug - Force stop loading')
                    setIsLoading(false)
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20"
                >
                  Skip Loading (Debug)
                </Button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10">
              <div className="text-center bg-black/50 p-8 rounded-lg border border-red-500/30 max-w-md">
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-white text-xl font-medium mb-3">Không thể xem trước</h3>
                <p className="text-white/70 mb-6 text-sm leading-relaxed">{error}</p>
                <div className="space-y-3">
                  <Button
                    onClick={() => onDownload(documentProp)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống để xem
                  </Button>
                  <Button
                    onClick={handleFullscreen}
                    variant="outline"
                    className="w-full bg-transparent border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Mở trong tab mới
                  </Button>
                  <Button
                    onClick={() => {
                      setError(null)
                      setIsLoading(true)
                      // Retry loading
                      setTimeout(() => setIsLoading(false), 2000)
                    }}
                    variant="outline"
                    className="w-full bg-transparent border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    <RotateCw className="h-4 w-4 mr-2" />
                    Thử lại
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="w-full h-full">
            {renderPreview()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 pt-0 border-t border-purple-500/30 bg-black/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Info */}
            <div>
              {documentProp.description && (
                <div className="mb-3">
                  <h4 className="text-white font-medium mb-1 text-sm">Mô tả:</h4>
                  <p className="text-white/70 text-xs sm:text-sm">{documentProp.description}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-white/60">
                  Tải lên: {documentProp.uploader_name || 'Unknown'}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/60">
                  {new Date(documentProp.created_at).toLocaleDateString('vi-VN')}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/60">
                  {documentProp.download_count} lượt tải
                </span>
              </div>
            </div>
            
            {/* Keyboard Shortcuts */}
            <div className="text-right">
              <h4 className="text-white font-medium mb-1 text-sm">Phím tắt:</h4>
              <div className="text-xs text-white/60 space-y-1">
                <div>Esc: Đóng • Ctrl+D: Tải xuống</div>
                <div>Ctrl+F: Toàn màn hình • Ctrl+S: Chia sẻ</div>
                {(fileType === 'pdf' || fileType === 'image') && (
                  <div>Ctrl +/-: Zoom • Ctrl+R: Xoay</div>
                )}
              </div>
            </div>
          </div>
        </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}