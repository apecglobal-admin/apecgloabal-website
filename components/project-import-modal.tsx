"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  Upload,
  Download,
  X,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface ProjectImportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ProjectImportModal({ isOpen, onClose, onSuccess }: ProjectImportModalProps) {
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [importResults, setImportResults] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast.error('Chỉ hỗ trợ file CSV hoặc Excel (.xlsx)')
      return
    }

    setImporting(true)
    setProgress(0)
    setImportResults(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/projects/import', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const result = await response.json()

      if (result.success) {
        setImportResults(result.results)
        toast.success(`Đã nhập thành công ${result.results.success} dự án!`)
        onSuccess()
      } else {
        throw new Error(result.message || 'Import failed')
      }
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Có lỗi xảy ra khi nhập dữ liệu')
      setImportResults({
        success: 0,
        failed: 1,
        errors: ['Có lỗi xảy ra khi nhập dữ liệu']
      })
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = [
      ['Tên dự án*', 'Mô tả', 'ID Công ty*', 'ID Quản lý', 'Ngày bắt đầu', 'Ngày kết thúc', 'Ngân sách', 'Trạng thái', 'Ưu tiên'],
      ['Dự án mẫu', 'Mô tả dự án mẫu', '1', '1', '2024-01-01', '2024-12-31', '1000000', 'Nghiên cứu', 'Trung bình']
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'project_template.csv'
    link.click()
    
    toast.success('Đã tải xuống file mẫu!')
  }

  const handleClose = () => {
    setImporting(false)
    setProgress(0)
    setImportResults(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <Upload className="h-5 w-5 mr-2 text-purple-400" />
            Nhập Dự Án Từ Excel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions */}
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-300 text-lg">Hướng dẫn nhập dữ liệu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-white/80">1. Tải xuống file mẫu bên dưới</p>
              <p className="text-white/80">2. Điền thông tin dự án vào file mẫu</p>
              <p className="text-white/80">3. Lưu file và tải lên hệ thống</p>
              <p className="text-red-300">* Các cột có dấu * là bắt buộc</p>
            </CardContent>
          </Card>

          {/* Download Template */}
          <div className="flex justify-center">
            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30"
            >
              <Download className="h-4 w-4 mr-2" />
              Tải File Mẫu
            </Button>
          </div>

          {/* File Upload */}
          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Label className="text-white">Chọn file để nhập</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileUpload}
                    disabled={importing}
                    className="bg-black/30 border-purple-500/30 text-white file:bg-purple-500/20 file:text-purple-300 file:border-0"
                  />
                </div>
                
                {importing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Đang xử lý...</span>
                      <span className="text-white">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Import Results */}
          {importResults && (
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Kết quả nhập dữ liệu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-green-300">Thành công: {importResults.success}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <span className="text-red-300">Thất bại: {importResults.failed}</span>
                  </div>
                </div>

                {importResults.errors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-red-300 font-medium">Lỗi:</p>
                    <div className="bg-red-500/20 border border-red-500/30 rounded p-3 max-h-32 overflow-y-auto">
                      {importResults.errors.map((error, index) => (
                        <p key={index} className="text-red-300 text-sm">{error}</p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={importing}
              className="bg-transparent border-gray-500/50 text-gray-300 hover:bg-gray-500/20"
            >
              <X className="h-4 w-4 mr-2" />
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}