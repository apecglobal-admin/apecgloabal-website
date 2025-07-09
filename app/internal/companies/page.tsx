"use client"

import { useState, useEffect } from "react"
import InternalLayout from "@/components/internal-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Plus, Upload, Eye, Trash2, Building2, ArrowLeft } from "lucide-react"
import { Company } from "@/lib/schema"
import Image from "next/image"
import { LogoUpload } from "@/components/ui/logo-upload"
import Link from "next/link"
import { toast } from "sonner"

function CompaniesManagementContent() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    logo_url: "",
    website_url: "",
    email: "",
    phone: "",
    address: "",
    established_date: "",
    employee_count: 0,
    industry: "",
    status: "active"
  })

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      if (!response.ok) throw new Error('Failed to fetch companies')
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error('Error fetching companies:', error)
      toast.error('Không thể tải danh sách công ty')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setFormData({
      name: company.name,
      slug: company.slug,
      description: company.description,
      logo_url: company.logo_url || "",
      website_url: company.website_url || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
      established_date: company.established_date ? new Date(company.established_date).toISOString().split('T')[0] : "",
      employee_count: company.employee_count,
      industry: company.industry || "",
      status: company.status
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      if (!editingCompany) return

      const response = await fetch('/api/companies', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingCompany.id,
          ...formData,
          established_date: formData.established_date ? new Date(formData.established_date) : null
        }),
      })

      if (!response.ok) throw new Error('Failed to update company')

      toast.success('Cập nhật công ty thành công!')
      setIsDialogOpen(false)
      setEditingCompany(null)
      fetchCompanies()
    } catch (error) {
      console.error('Error updating company:', error)
      toast.error('Không thể cập nhật công ty')
    }
  }



  const handleLogoUpload = (result: { url: string; public_id: string }) => {
    setFormData(prev => ({ ...prev, logo_url: result.url }))
  }

  const handleLogoDelete = () => {
    setFormData(prev => ({ ...prev, logo_url: "" }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      logo_url: "",
      website_url: "",
      email: "",
      phone: "",
      address: "",
      established_date: "",
      employee_count: 0,
      industry: "",
      status: "active"
    })
    setEditingCompany(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-8">
        <Link href="/internal">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cổng Nội Bộ
          </Button>
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-white">Quản Lý Công Ty</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản Lý Công Ty
          </h1>
          <p className="text-white/80">Quản lý thông tin và logo của các công ty thành viên</p>
        </div>
      </div>

      <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white">Danh Sách Công Ty</CardTitle>
          <CardDescription className="text-white/80">
            Quản lý thông tin các công ty thành viên trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-purple-500/30">
                  <TableHead className="text-white">Logo</TableHead>
                  <TableHead className="text-white">Tên Công Ty</TableHead>
                  <TableHead className="text-white">Slug</TableHead>
                  <TableHead className="text-white">Ngành</TableHead>
                  <TableHead className="text-white">Nhân Viên</TableHead>
                  <TableHead className="text-white">Trạng Thái</TableHead>
                  <TableHead className="text-white">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id} className="border-b border-purple-500/30 hover:bg-white/5">
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                        {company.logo_url ? (
                          <Image
                            src={company.logo_url}
                            alt={`${company.name} logo`}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building2 className="h-6 w-6 text-white/60" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-white">{company.name}</TableCell>
                    <TableCell className="text-sm text-white/60">{company.slug}</TableCell>
                    <TableCell className="text-white/80">{company.industry}</TableCell>
                    <TableCell className="text-white/80">{company.employee_count}</TableCell>
                    <TableCell>
                      <Badge 
                        className={company.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }
                      >
                        {company.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(company)}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black/90 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Chỉnh Sửa Công Ty</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Tên Công Ty</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-white">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Mô Tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <LogoUpload
                onUpload={handleLogoUpload}
                onDelete={handleLogoDelete}
                currentImage={formData.logo_url}
                label="Logo Công Ty"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website_url" className="text-white">Website</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-white">Điện Thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="industry" className="text-white">Ngành</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-white">Địa Chỉ</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="established_date" className="text-white">Ngày Thành Lập</Label>
                <Input
                  id="established_date"
                  type="date"
                  value={formData.established_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, established_date: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="employee_count" className="text-white">Số Nhân Viên</Label>
                <Input
                  id="employee_count"
                  type="number"
                  value={formData.employee_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, employee_count: parseInt(e.target.value) || 0 }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Lưu Thay Đổi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CompaniesManagementPage() {
  return (
    <InternalLayout>
      <CompaniesManagementContent />
    </InternalLayout>
  )
}