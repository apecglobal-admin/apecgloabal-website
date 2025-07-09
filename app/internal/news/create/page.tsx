'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, X } from "lucide-react";
import Link from "next/link";
import InternalLayout from "@/components/internal-layout";

function CreateNewsContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [] as string[],
    featured: false,
    published: false,
    publishedAt: ''
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'technology', label: 'Công nghệ' },
    { value: 'business', label: 'Kinh doanh' },
    { value: 'recruitment', label: 'Tuyển dụng' },
    { value: 'partnership', label: 'Hợp tác' },
    { value: 'product', label: 'Sản phẩm' },
    { value: 'company', label: 'Công ty' }
  ];

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to news list
      router.push('/internal/news');
    } catch (error) {
      console.error('Error creating news:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-white mb-2">
              Tạo tin tức mới
            </h1>
            <p className="text-white/80">Thêm tin tức hoặc bài viết mới vào hệ thống</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isSubmitting} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
            <Eye className="h-4 w-4 mr-2" />
            Xem trước
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Đang lưu...' : 'Lưu tin tức'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white">
                Thông tin cơ bản
              </CardTitle>
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
              <CardTitle className="text-white">
                Cài đặt
              </CardTitle>
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
                  <Label htmlFor="published" className="text-white">Xuất bản ngay</Label>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                </div>

                {formData.published && (
                  <div className="space-y-2">
                    <Label htmlFor="publishedAt" className="text-white">Ngày xuất bản</Label>
                    <Input
                      id="publishedAt"
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
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

export default function CreateNewsPage() {
  return (
    <InternalLayout>
      <CreateNewsContent />
    </InternalLayout>
  );
}