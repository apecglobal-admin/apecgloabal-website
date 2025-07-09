"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/layout";

export default function EditNews({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author_id: "",
    featured: false,
    published: true,
    image_url: "",
    tags: [] as string[],
  });
  
  // Lấy thông tin tin tức
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            title: data.title || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            category: data.category || "",
            author_id: data.author_id ? data.author_id.toString() : "",
            featured: data.featured || false,
            published: data.published || false,
            image_url: data.image_url || "",
            tags: data.tags || [],
          });
        } else {
          throw new Error("Không thể lấy thông tin tin tức");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Không thể lấy thông tin tin tức");
      }
    };
    
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    const fetchAuthors = async () => {
      try {
        const response = await fetch("/api/authors");
        if (response.ok) {
          const data = await response.json();
          setAuthors(data);
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };
    
    // Chỉ fetch khi thực sự cần thiết
    fetchNews();
    fetchCategories();
    fetchAuthors();
  }, [params.id]); // Chỉ chạy khi params.id thay đổi
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(",").map((tag) => tag.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      const response = await fetch(`/api/news/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi cập nhật tin tức");
      }
      
      setSuccess(true);
      
      // Tự động tắt thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setDeleteLoading(true);
    
    try {
      const response = await fetch(`/api/news/${params.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Có lỗi xảy ra khi xóa tin tức");
      }
      
      // Chuyển hướng về trang danh sách tin tức
      router.push("/admin/news");
    } catch (error: any) {
      setError(error.message);
      setDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/admin/news" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Chỉnh sửa tin tức</h1>
              <p className="text-gray-500">Cập nhật thông tin tin tức</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa tin tức
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xác nhận xóa tin tức</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa tin tức này? Hành động này không thể hoàn tác.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                    {deleteLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xóa...
                      </>
                    ) : (
                      "Xóa tin tức"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <AlertDescription>Cập nhật tin tức thành công!</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề tin tức"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Tóm tắt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Nhập tóm tắt ngắn gọn về tin tức"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Nội dung</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Nhập nội dung chi tiết của tin tức"
                    rows={15}
                    required
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL hình ảnh</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="Nhập URL hình ảnh đại diện"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Thẻ (tags)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags.join(", ")}
                    onChange={handleTagsChange}
                    placeholder="Nhập các thẻ, phân cách bằng dấu phẩy"
                  />
                  <p className="text-sm text-gray-500">
                    Ví dụ: công nghệ, kinh doanh, sự kiện
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author_id">Tác giả</Label>
                  <Select
                    value={formData.author_id}
                    onValueChange={(value) => handleSelectChange("author_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tác giả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Không có tác giả</SelectItem>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id.toString()}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => handleCheckboxChange("published", checked as boolean)}
                  />
                  <Label htmlFor="published">Xuất bản</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
                  />
                  <Label htmlFor="featured">Đánh dấu là tin nổi bật</Label>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Button onClick={handleSubmit} className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-500 mb-4">
                  <p>ID: {params.id}</p>
                  <p>Ngày tạo: {new Date().toLocaleDateString()}</p>
                  <p>Lượt xem: N/A</p>
                </div>
                <Link href={`/news/${params.id}`} target="_blank">
                  <Button variant="outline" className="w-full">
                    Xem trên trang web
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}