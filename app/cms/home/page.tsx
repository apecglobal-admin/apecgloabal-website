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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pencil,
  Plus,
  Save,
  Loader2,
  Home,
  Info,
  Star,
  Target,
  Briefcase,
  BarChart3
} from "lucide-react"
import { toast } from "sonner"

interface HomeContentData {
  infoHighlights: any[]
  quickFacts: any[]
  valuePillars: any[]
  careerBenefits: any[]
  ctaMetrics: any[]
  introSection: any
  techShowcaseSection: any
  servicesSection: any
  companyOverviewSection: any
  ctaSection: any
}

const SECTION_CONFIGS = {
  infoHighlights: {
    title: "Thông tin nổi bật",
    icon: Info,
    description: "Các thông tin quan trọng về công ty"
  },
  quickFacts: {
    title: "Thống kê nhanh",
    icon: BarChart3,
    description: "Các số liệu và thông tin nhanh"
  },
  valuePillars: {
    title: "Giá trị cốt lõi",
    icon: Target,
    description: "Tầm nhìn, sứ mệnh và giá trị của công ty"
  },
  careerBenefits: {
    title: "Lợi ích nghề nghiệp",
    icon: Briefcase,
    description: "Các lợi ích khi làm việc tại công ty"
  },
  ctaMetrics: {
    title: "Thống kê CTA",
    icon: Star,
    description: "Các số liệu hiển thị ở phần kêu gọi hành động"
  },
  introSection: {
    title: "Giới thiệu công ty",
    icon: Building2,
    description: "Nội dung giới thiệu chính của công ty"
  },
  techShowcaseSection: {
    title: "Công nghệ nổi bật",
    icon: Cpu,
    description: "Các giải pháp công nghệ và lĩnh vực chuyên môn"
  },
  servicesSection: {
    title: "Dịch vụ chính",
    icon: Settings,
    description: "Tiêu đề và mô tả phần dịch vụ"
  },
  companyOverviewSection: {
    title: "Tổng quan công ty",
    icon: Crown,
    description: "Tiêu đề và mô tả phần tổng quan công ty"
  },
  ctaSection: {
    title: "Kêu gọi hành động",
    icon: Rocket,
    description: "Nội dung phần kêu gọi hành động cuối trang"
  }
}

export default function HomeContentPage() {
  const [homeContent, setHomeContent] = useState<HomeContentData>({
    infoHighlights: [],
    quickFacts: [],
    valuePillars: [],
    careerBenefits: [],
    ctaMetrics: [],
    introSection: {},
    techShowcaseSection: {},
    servicesSection: {},
    companyOverviewSection: {},
    ctaSection: {}
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editData, setEditData] = useState<any[]>([])

  useEffect(() => {
    fetchHomeContent()
  }, [])

  const fetchHomeContent = async () => {
    try {
      const response = await fetch('/api/home-content')
      const result = await response.json()

      if (result.success) {
        setHomeContent(result.data)
      } else {
        toast.error('Không thể tải nội dung trang chủ')
      }
    } catch (error) {
      console.error('Error fetching home content:', error)
      toast.error('Lỗi khi tải nội dung trang chủ')
    } finally {
      setLoading(false)
    }
  }

  const handleEditSection = (section: string) => {
    setEditingSection(section)
    const sectionData = homeContent[section as keyof HomeContentData]
    setEditData(Array.isArray(sectionData) ? [...sectionData] : { ...sectionData })
  }

  const handleSaveSection = async () => {
    if (!editingSection) return

    setSaving(true)
    try {
      const response = await fetch('/api/home-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          section: editingSection,
          content: editData
        })
      })

      const result = await response.json()

      if (result.success) {
        setHomeContent(prev => ({
          ...prev,
          [editingSection]: editData
        }))
        setEditingSection(null)
        toast.success('Đã lưu thay đổi thành công')
      } else {
        toast.error('Không thể lưu thay đổi')
      }
    } catch (error) {
      console.error('Error saving home content:', error)
      toast.error('Lỗi khi lưu thay đổi')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
    setEditData([])
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newData = [...editData]
    newData[index] = { ...newData[index], [field]: value }
    setEditData(newData)
  }

  const addItem = () => {
    const newItem = {
      title: '',
      description: '',
      icon: 'star',
      accent: 'red'
    }
    setEditData([...editData, newItem])
  }

  const removeItem = (index: number) => {
    const newData = editData.filter((_, i) => i !== index)
    setEditData(newData)
  }

  if (loading) {
    return (
      <InternalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </InternalLayout>
    )
  }

  return (
    <InternalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Home className="w-8 h-8" />
              Quản lý nội dung trang chủ
            </h1>
            <p className="text-gray-600 mt-1">
              Chỉnh sửa các nội dung hiển thị trên trang chủ website
            </p>
          </div>
        </div>

        <Tabs defaultValue="infoHighlights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Object.entries(SECTION_CONFIGS).map(([key, config]) => {
              const Icon = config.icon
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{config.title}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.entries(SECTION_CONFIGS).map(([sectionKey, config]) => {
            const Icon = config.icon
            const sectionData = homeContent[sectionKey as keyof HomeContentData] || []
            const isArraySection = Array.isArray(sectionData)

            return (
              <TabsContent key={sectionKey} value={sectionKey} className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-blue-600" />
                        <div>
                          <CardTitle>{config.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleEditSection(sectionKey)}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Chỉnh sửa
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isArraySection ? (
                      <div className="grid gap-4">
                        {sectionData.map((item: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{item.title || 'Chưa có tiêu đề'}</h4>
                                <p className="text-gray-600 text-sm mt-1">{item.description || 'Chưa có mô tả'}</p>
                                {item.label && (
                                  <Badge variant="secondary" className="mt-2">{item.label}</Badge>
                                )}
                              </div>
                              {item.accent && (
                                <Badge variant="outline" className={`ml-2 ${item.accent === 'red' ? 'border-red-200 text-red-700' : item.accent === 'blue' ? 'border-blue-200 text-blue-700' : 'border-gray-200'}`}>
                                  {item.accent}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                        {sectionData.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            Chưa có nội dung nào trong section này
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.keys(sectionData).length > 0 ? (
                          <div className="p-4 border rounded-lg bg-gray-50">
                            <div className="space-y-2">
                              {Object.entries(sectionData).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}: </span>
                                  <span className="text-gray-600">{String(value) || 'Chưa có nội dung'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            Chưa có nội dung nào trong section này
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={!!editingSection} onOpenChange={() => handleCancelEdit()}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="w-5 h-5" />
                Chỉnh sửa {editingSection && SECTION_CONFIGS[editingSection as keyof typeof SECTION_CONFIGS]?.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {Array.isArray(editData) ? (
                // Array sections (existing logic)
                <>
                  {editData.map((item, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Item {index + 1}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Xóa
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`title-${index}`}>Tiêu đề</Label>
                            <Input
                              id={`title-${index}`}
                              value={item.title || ''}
                              onChange={(e) => updateItem(index, 'title', e.target.value)}
                              placeholder="Nhập tiêu đề"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`label-${index}`}>Nhãn (tùy chọn)</Label>
                            <Input
                              id={`label-${index}`}
                              value={item.label || ''}
                              onChange={(e) => updateItem(index, 'label', e.target.value)}
                              placeholder="Nhập nhãn"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`description-${index}`}>Mô tả</Label>
                          <Textarea
                            id={`description-${index}`}
                            value={item.description || ''}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Nhập mô tả"
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`icon-${index}`}>Icon</Label>
                            <Input
                              id={`icon-${index}`}
                              value={item.icon || ''}
                              onChange={(e) => updateItem(index, 'icon', e.target.value)}
                              placeholder="Tên icon (vd: star, building2)"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`accent-${index}`}>Màu accent</Label>
                            <select
                              id={`accent-${index}`}
                              value={item.accent || 'red'}
                              onChange={(e) => updateItem(index, 'accent', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="red">Đỏ</option>
                              <option value="blue">Xanh dương</option>
                              <option value="green">Xanh lá</option>
                              <option value="purple">Tím</option>
                              <option value="orange">Cam</option>
                            </select>
                          </div>
                        </div>

                        {item.value && (
                          <div>
                            <Label htmlFor={`value-${index}`}>Giá trị</Label>
                            <Input
                              id={`value-${index}`}
                              value={item.value || ''}
                              onChange={(e) => updateItem(index, 'value', e.target.value)}
                              placeholder="Nhập giá trị"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  <Button onClick={addItem} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm item mới
                  </Button>
                </>
              ) : (
                // Object sections (new logic)
                <Card>
                  <CardContent className="space-y-4 pt-6">
                    {editingSection === 'introSection' && (
                      <>
                        <div>
                          <Label htmlFor="intro-badge">Badge</Label>
                          <Input
                            id="intro-badge"
                            value={editData.badge || ''}
                            onChange={(e) => setEditData({ ...editData, badge: e.target.value })}
                            placeholder="Ví dụ: Về Chúng Tôi"
                          />
                        </div>
                        <div>
                          <Label htmlFor="intro-heading">Tiêu đề chính</Label>
                          <Textarea
                            id="intro-heading"
                            value={editData.heading || ''}
                            onChange={(e) => setEditData({ ...editData, heading: e.target.value })}
                            placeholder="Ví dụ: Kiến tạo hệ sinh thái Công nghệ - Thương mại - Cộng đồng"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="intro-description">Mô tả</Label>
                          <Textarea
                            id="intro-description"
                            value={editData.description || ''}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            placeholder="Nội dung mô tả công ty"
                            rows={4}
                          />
                        </div>
                      </>
                    )}

                    {editingSection === 'techShowcaseSection' && (
                      <>
                        <div>
                          <Label htmlFor="tech-badge">Badge</Label>
                          <Input
                            id="tech-badge"
                            value={editData.badge || ''}
                            onChange={(e) => setEditData({ ...editData, badge: e.target.value })}
                            placeholder="Ví dụ: Công Nghệ Của Chúng Tôi"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tech-heading">Tiêu đề</Label>
                          <Textarea
                            id="tech-heading"
                            value={editData.heading || ''}
                            onChange={(e) => setEditData({ ...editData, heading: e.target.value })}
                            placeholder="Ví dụ: Giải pháp đột phá cho chuyển đổi số"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="tech-description">Mô tả</Label>
                          <Textarea
                            id="tech-description"
                            value={editData.description || ''}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            placeholder="Mô tả về các giải pháp công nghệ"
                            rows={3}
                          />
                        </div>
                      </>
                    )}

                    {editingSection === 'servicesSection' && (
                      <>
                        <div>
                          <Label htmlFor="services-badge">Badge</Label>
                          <Input
                            id="services-badge"
                            value={editData.badge || ''}
                            onChange={(e) => setEditData({ ...editData, badge: e.target.value })}
                            placeholder="Ví dụ: Dịch Vụ Của Chúng Tôi"
                          />
                        </div>
                        <div>
                          <Label htmlFor="services-heading">Tiêu đề</Label>
                          <Textarea
                            id="services-heading"
                            value={editData.heading || ''}
                            onChange={(e) => setEditData({ ...editData, heading: e.target.value })}
                            placeholder="Ví dụ: Giải pháp Toàn diện"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="services-description">Mô tả</Label>
                          <Textarea
                            id="services-description"
                            value={editData.description || ''}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            placeholder="Mô tả về dịch vụ"
                            rows={3}
                          />
                        </div>
                      </>
                    )}

                    {editingSection === 'companyOverviewSection' && (
                      <>
                        <div>
                          <Label htmlFor="overview-badge">Badge</Label>
                          <Input
                            id="overview-badge"
                            value={editData.badge || ''}
                            onChange={(e) => setEditData({ ...editData, badge: e.target.value })}
                            placeholder="Ví dụ: Giá Trị Cốt Lõi"
                          />
                        </div>
                        <div>
                          <Label htmlFor="overview-heading">Tiêu đề</Label>
                          <Textarea
                            id="overview-heading"
                            value={editData.heading || ''}
                            onChange={(e) => setEditData({ ...editData, heading: e.target.value })}
                            placeholder="Ví dụ: Tại sao chọn ApecGlobal?"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="overview-description">Mô tả</Label>
                          <Textarea
                            id="overview-description"
                            value={editData.description || ''}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            placeholder="Mô tả về công ty"
                            rows={3}
                          />
                        </div>
                      </>
                    )}

                    {editingSection === 'ctaSection' && (
                      <>
                        <div>
                          <Label htmlFor="cta-heading">Tiêu đề</Label>
                          <Textarea
                            id="cta-heading"
                            value={editData.heading || ''}
                            onChange={(e) => setEditData({ ...editData, heading: e.target.value })}
                            placeholder="Ví dụ: Sẵn Sàng Cho Tương Lai?"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cta-description">Mô tả</Label>
                          <Textarea
                            id="cta-description"
                            value={editData.description || ''}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            placeholder="Nội dung kêu gọi hành động"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cta-primaryButton">Nút chính</Label>
                            <Input
                              id="cta-primaryButton"
                              value={editData.primaryButton || ''}
                              onChange={(e) => setEditData({ ...editData, primaryButton: e.target.value })}
                              placeholder="Ví dụ: Bắt Đầu Ngay"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cta-secondaryButton">Nút phụ</Label>
                            <Input
                              id="cta-secondaryButton"
                              value={editData.secondaryButton || ''}
                              onChange={(e) => setEditData({ ...editData, secondaryButton: e.target.value })}
                              placeholder="Ví dụ: Tìm Hiểu Thêm"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Hủy
                </Button>
                <Button onClick={handleSaveSection} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </InternalLayout>
  )
}