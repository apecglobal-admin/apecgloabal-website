'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, X, Trash2 } from "lucide-react";
import Link from "next/link";
import InternalLayout from "@/components/internal-layout";
import { toast } from "sonner";

interface EditNewsPageProps {
  params: {
    id: string;
  };
}

function EditNewsContent({ params }: EditNewsPageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [] as string[],
    featured: false,
    published: false,
    published_at: '',
    image_url: '',
    author_name: ''
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { value: 'Công nghệ', label: 'Công nghệ' },
    { value: 'Kinh doanh', label: 'Kinh doanh' },
    { value: 'Tuyển dụng', label: 'Tuyển dụng' },
    { value: 'Hợp tác', label: 'Hợp tác' },
    { value: 'Sản phẩm', label: 'Sản phẩm' },
    { value: 'Công ty', label: 'Công ty' }
  ];

  // Load news data from API
  useEffect(() => {
    const loadNewsData = async () => {
      try {
        const response = await fetch(`/api/news/${params.id}`);
        const data = await response.json();
        
        if (response.ok) {
          // Convert API data to form format
          setFormData({
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            category: data.category || '',
            tags: data.tags || [],
            featured: data.featured || false,
            published: data.published || false,
            published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : '',
            image_url: data.image_url || '',
            author_name: data.author_name || ''
          });
        } else {
          toast.error('Lỗi khi tải tin tức: ' + data.error);
          router.push('/internal/news');
        }
      } catch (error) {
        console.error('Error loading news:', error);
        toast.error('Lỗi kết nối server');
        router.push('/internal/news');
      } finally {
        setIsLoading(false);
      }
    };

    loadNewsData();
  }, [params.id, router]);

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const updateData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        featured: formData.featured,
        published: formData.published,
        published_at: formData.published && formData.published_at ? new Date(formData.published_at).toISOString() : null,
        image_url: formData.image_url,
        author_name: formData.author_name
      };

      const response = await fetch(`/api/news/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success('Cập nhật tin tức thành công!');
        router.push('/internal/news');
      } else {
        toast.error('Lỗi: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating news:', error);
      toast.error('Lỗi kết nối server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa tin tức này?')) {
      try {
        const response = await fetch(`/api/news/${params.id}`, {
          method: 'DELETE',
        });

        const result = await response.json();
        
        if (response.ok) {
          toast.success('Xóa tin tức thành công!');
          router.push('/internal/news');
        } else {
          toast.error('Lỗi: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting news:', error);
        toast.error('Lỗi kết nối server');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-20 bg-white/10 rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-white/10 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-96 bg-white/10 rounded animate-pulse"></div>
          </div>
          <div className="h-96 bg-white/10 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/internal/news">
            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Chỉnh sửa tin tức</h1>
            <p className="text-white/80">Cập nhật thông tin tin tức</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isSubmitting} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
            <Eye className="h-4 w-4 mr-2" />
            Xem trước
          </Button>
          <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 hover:text-red-400" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Tiêu đề *</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề tin tức"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-white">Tóm tắt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Nhập tóm tắt ngắn gọn về tin tức"
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_name" className="text-white">Tác giả</Label>
                <Input
                  id="author_name"
                  placeholder="Nhập tên tác giả"
                  value={formData.author_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-white">URL hình ảnh</Label>
                <Input
                  id="image_url"
                  placeholder="Nhập URL hình ảnh đại diện"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-white">Nội dung *</Label>
                <Textarea
                  id="content"
                  placeholder="Nhập nội dung chi tiết của tin tức"
                  rows={15}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white">Cài đặt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Danh mục</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-500/30">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value} className="text-white hover:bg-purple-500/20">
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Thẻ (Tags)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập thẻ"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                    Thêm
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20 flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-400" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/20">
                  <Label htmlFor="featured" className="text-white">Tin tức nổi bật</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/20">
                  <Label htmlFor="published" className="text-white">Đã xuất bản</Label>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                </div>

                {formData.published && (
                  <div className="space-y-2">
                    <Label htmlFor="published_at" className="text-white">Ngày xuất bản</Label>
                    <Input
                      id="published_at"
                      type="datetime-local"
                      value={formData.published_at}
                      onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white focus:border-purple-500/50"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

export default function EditNewsPage({ params }: EditNewsPageProps) {
  return (
    <InternalLayout>
      <EditNewsContent params={params} />
    </InternalLayout>
  );
}