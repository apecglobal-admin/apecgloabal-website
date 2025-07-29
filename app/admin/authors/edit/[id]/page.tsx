"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Plus, Trash, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

interface SocialLink {
  platform: string;
  url: string;
}

export default function EditAuthor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: "",
    avatar_url: "",
  });
  
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "", url: "" },
  ]);
  
  // Lấy thông tin tác giả
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch(`/api/authors/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
            email: data.email || "",
            avatar_url: data.avatar_url || "",
          });
          
          // Chuyển đổi đối tượng social_links thành mảng
          if (data.social_links && Object.keys(data.social_links).length > 0) {
            const links = Object.entries(data.social_links).map(([platform, url]) => ({
              platform,
              url: url as string,
            }));
            setSocialLinks(links);
          }
        } else {
          throw new Error("Không thể lấy thông tin tác giả");
        }
      } catch (error) {
        console.error("Error fetching author:", error);
        setError("Không thể lấy thông tin tác giả");
      }
    };
    
    fetchAuthor();
  }, [id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSocialLinkChange = (index: number, field: "platform" | "url", value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;
    setSocialLinks(updatedLinks);
  };
  
  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };
  
  const removeSocialLink = (index: number) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      // Chuyển đổi mảng socialLinks thành đối tượng
      const social_links = socialLinks.reduce((acc, { platform, url }) => {
        if (platform && url) {
          acc[platform] = url;
        }
        return acc;
      }, {} as Record<string, string>);
      
      const response = await fetch(`/api/authors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          social_links,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi cập nhật tác giả");
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
      const response = await fetch(`/api/authors/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Có lỗi xảy ra khi xóa tác giả");
      }
      
      // Chuyển hướng về trang danh sách tác giả
      router.push("/admin/authors");
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
            <Link href="/admin/authors" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Chỉnh sửa tác giả</h1>
              <p className="text-gray-500">Cập nhật thông tin tác giả</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa tác giả
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xác nhận xóa tác giả</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa tác giả này? Hành động này không thể hoàn tác.
                    Lưu ý: Nếu tác giả đang được sử dụng trong tin tức, bạn sẽ không thể xóa.
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
                      "Xóa tác giả"
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
            <AlertDescription>Cập nhật tác giả thành công!</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên tác giả</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên tác giả"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Tiểu sử</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Nhập tiểu sử tác giả"
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar_url">URL ảnh đại diện</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  placeholder="Nhập URL ảnh đại diện"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Social Links */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Liên kết mạng xã hội</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm liên kết
                </Button>
              </div>
              
              {socialLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <Input
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, "platform", e.target.value)}
                      placeholder="Nền tảng (vd: Facebook)"
                    />
                  </div>
                  <div className="col-span-7">
                    <Input
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, "url", e.target.value)}
                      placeholder="URL"
                    />
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      disabled={socialLinks.length === 1}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="pt-4">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}