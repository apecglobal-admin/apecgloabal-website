"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import AdminLayout from "@/components/admin/layout";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState({ old: "", new: "" });
  const [deleteCategory, setDeleteCategory] = useState("");
  
  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          
          // Lấy số lượng tin tức cho mỗi danh mục (tối ưu hóa)
          const categoriesWithCount = data.map((category: string) => ({
            name: category,
            count: 0, // Có thể thêm API riêng để lấy count một lần hoặc cache
          }));
          
          setCategories(categoriesWithCount);
        } else {
          throw new Error("Không thể lấy danh sách danh mục");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Không thể lấy danh sách danh mục");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Lọc danh mục theo từ khóa tìm kiếm
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Thêm danh mục mới
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }
    
    setDialogLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi thêm danh mục");
      }
      
      // Cập nhật danh sách danh mục
      setCategories([...categories, { name: newCategory, count: 0 }]);
      setSuccess("Thêm danh mục thành công");
      setNewCategory("");
      setIsAddDialogOpen(false);
      
      // Tự động tắt thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setDialogLoading(false);
    }
  };
  
  // Chỉnh sửa danh mục
  const handleEditCategory = async () => {
    if (!editCategory.new.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }
    
    setDialogLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/categories/${encodeURIComponent(editCategory.old)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editCategory.new }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi cập nhật danh mục");
      }
      
      // Cập nhật danh sách danh mục
      setCategories(
        categories.map((category) =>
          category.name === editCategory.old
            ? { ...category, name: editCategory.new }
            : category
        )
      );
      setSuccess("Cập nhật danh mục thành công");
      setEditCategory({ old: "", new: "" });
      setIsEditDialogOpen(false);
      
      // Tự động tắt thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setDialogLoading(false);
    }
  };
  
  // Xóa danh mục
  const handleDeleteCategory = async () => {
    setDialogLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/categories/${encodeURIComponent(deleteCategory)}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi xóa danh mục");
      }
      
      // Cập nhật danh sách danh mục
      setCategories(categories.filter((category) => category.name !== deleteCategory));
      setSuccess("Xóa danh mục thành công");
      setDeleteCategory("");
      setIsDeleteDialogOpen(false);
      
      // Tự động tắt thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setDialogLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
            <p className="text-gray-500">Quản lý danh mục tin tức trên website</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm danh mục mới</DialogTitle>
                <DialogDescription>
                  Nhập tên danh mục mới để thêm vào hệ thống.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-category">Tên danh mục</Label>
                  <Input
                    id="new-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nhập tên danh mục"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddCategory} disabled={dialogLoading}>
                  {dialogLoading ? "Đang thêm..." : "Thêm danh mục"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <Card className="col-span-full">
              <CardContent className="flex justify-center items-center h-40">
                <p>Đang tải danh mục...</p>
              </CardContent>
            </Card>
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <Card key={category.name}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Tag className="h-8 w-8 text-blue-500" />
                    <Badge variant="outline">{category.count} tin tức</Badge>
                  </div>
                  <CardTitle className="mt-2 flex justify-between items-center">
                    <span className="truncate">{category.name}</span>
                    <div className="flex gap-1">
                      <Dialog open={isEditDialogOpen && editCategory.old === category.name} onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (open) {
                          setEditCategory({ old: category.name, new: category.name });
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
                            <DialogDescription>
                              Cập nhật tên danh mục.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-category">Tên danh mục</Label>
                              <Input
                                id="edit-category"
                                value={editCategory.new}
                                onChange={(e) => setEditCategory({ ...editCategory, new: e.target.value })}
                                placeholder="Nhập tên danh mục"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Hủy
                            </Button>
                            <Button onClick={handleEditCategory} disabled={dialogLoading}>
                              {dialogLoading ? "Đang cập nhật..." : "Cập nhật"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={isDeleteDialogOpen && deleteCategory === category.name} onOpenChange={(open) => {
                        setIsDeleteDialogOpen(open);
                        if (open) {
                          setDeleteCategory(category.name);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Xóa danh mục</DialogTitle>
                            <DialogDescription>
                              Bạn có chắc chắn muốn xóa danh mục "{category.name}"? Hành động này không thể hoàn tác.
                            </DialogDescription>
                          </DialogHeader>
                          {category.count > 0 && (
                            <Alert className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                              <AlertDescription>
                                Danh mục này đang được sử dụng trong {category.count} tin tức. Nếu xóa, các tin tức này sẽ không có danh mục.
                              </AlertDescription>
                            </Alert>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              Hủy
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteCategory} disabled={dialogLoading}>
                              {dialogLoading ? "Đang xóa..." : "Xóa danh mục"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex justify-center items-center h-40">
                <p>Không tìm thấy danh mục nào</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}