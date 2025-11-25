"use client"

import { useState, useEffect } from "react"
import InternalLayout from "@/components/cms-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pencil,
  Plus,
  Star,
  Loader2,
  X,
  Search,
  Filter,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react"
import { toast } from "sonner"

interface ClientOverflowContent {
  id: number
  title: string
  content: string
  client_name: string
  client_position: string
  client_company: string
  client_image_url: string
  rating: number
  category: string
  is_featured: boolean
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

const CATEGORIES = [
  "Testimonial",
  "Case Study",
  "Client Feedback",
  "Success Story",
  "Review",
  "Khác"
]

function ClientOverflowContentManagement() {
  const [contents, setContents] = useState<ClientOverflowContent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingContent, setEditingContent] = useState<ClientOverflowContent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [deletingContent, setDeletingContent] = useState<ClientOverflowContent | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    client_name: "",
    client_position: "",
    client_company: "",
    client_image_url: "",
    rating: 5,
    category: "",
    is_featured: false,
    display_order: 0
  })

  // Fetch contents
  const fetchContents = async () => {
    try {
      const response = await fetch('/api/client-overflow-content')
      const result = await response.json()
      if (result.success) {
        setContents(result.data)
      } else {
        toast.error('Failed to fetch contents')
      }
    } catch (error) {
      console.error('Error fetching contents:', error)
      toast.error('Error fetching contents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContents()
  }, [])

  // Filter contents
  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.client_company?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || content.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const url = isCreateMode
        ? '/api/client-overflow-content'
        : `/api/client-overflow-content/${editingContent?.id}`

      const method = isCreateMode ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(isCreateMode ? 'Content created successfully' : 'Content updated successfully')
        setIsDialogOpen(false)
        resetForm()
        fetchContents()
      } else {
        toast.error(result.error || 'Failed to save content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      toast.error('Error saving content')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deletingContent) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/client-overflow-content/${deletingContent.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Content deleted successfully')
        setDeletingContent(null)
        fetchContents()
      } else {
        toast.error(result.error || 'Failed to delete content')
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      toast.error('Error deleting content')
    } finally {
      setDeleting(false)
    }
  }

  // Handle edit
  const handleEdit = (content: ClientOverflowContent) => {
    setEditingContent(content)
    setFormData({
      title: content.title,
      content: content.content || "",
      client_name: content.client_name || "",
      client_position: content.client_position || "",
      client_company: content.client_company || "",
      client_image_url: content.client_image_url || "",
      rating: content.rating || 5,
      category: content.category || "",
      is_featured: content.is_featured,
      display_order: content.display_order || 0
    })
    setIsCreateMode(false)
    setIsDialogOpen(true)
  }

  // Handle create
  const handleCreate = () => {
    resetForm()
    setIsCreateMode(true)
    setIsDialogOpen(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      client_name: "",
      client_position: "",
      client_company: "",
      client_image_url: "",
      rating: 5,
      category: "",
      is_featured: false,
      display_order: 0
    })
    setEditingContent(null)
  }

  // Toggle active status
  const toggleActiveStatus = async (content: ClientOverflowContent) => {
    try {
      const response = await fetch(`/api/client-overflow-content/${content.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !content.is_active }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Content ${!content.is_active ? 'activated' : 'deactivated'} successfully`)
        fetchContents()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Error updating status')
    }
  }

  if (loading) {
    return (
      <InternalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </InternalLayout>
    )
  }

  return (
    <InternalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý nội dung Client Overflow</h1>
            <p className="text-gray-600 mt-1">Quản lý các nội dung testimonial và feedback từ khách hàng</p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Thêm nội dung mới
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo tiêu đề, tên khách hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách nội dung ({filteredContents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Nổi bật</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">{content.title}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{content.client_name}</div>
                        <div className="text-sm text-gray-500">{content.client_company}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{content.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (content.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {content.is_featured && <Badge>Nổi bật</Badge>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={content.is_active ? "default" : "secondary"}>
                        {content.is_active ? "Hoạt động" : "Tạm ẩn"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActiveStatus(content)}
                        >
                          {content.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(content)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingContent(content)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isCreateMode ? 'Thêm nội dung mới' : 'Chỉnh sửa nội dung'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Tên khách hàng</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_position">Chức vụ</Label>
                  <Input
                    id="client_position"
                    value={formData.client_position}
                    onChange={(e) => setFormData({ ...formData, client_position: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_company">Công ty</Label>
                  <Input
                    id="client_company"
                    value={formData.client_company}
                    onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Đánh giá (1-5)</Label>
                  <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} sao
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_image_url">URL ảnh khách hàng</Label>
                <Input
                  id="client_image_url"
                  value={formData.client_image_url}
                  onChange={(e) => setFormData({ ...formData, client_image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Thứ tự hiển thị</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
                  />
                  <Label htmlFor="is_featured">Nội dung nổi bật</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isCreateMode ? 'Tạo mới' : 'Cập nhật'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingContent} onOpenChange={() => setDeletingContent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <p>Bạn có chắc chắn muốn xóa nội dung "{deletingContent?.title}"?</p>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDeletingContent(null)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xóa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </InternalLayout>
  )
}

export default function ClientOverflowContentPage() {
  return <ClientOverflowContentManagement />
}