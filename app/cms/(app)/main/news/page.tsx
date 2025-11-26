"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  FileText,
  Edit,
  Loader2,
  Trash2,
  X,
  Image as ImageIcon,
  Star,
  Eye,
  User,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNewsData } from "@/src/hook/newsHook";
import {
  createNews,
  listNews,
  listNewsType,
  updateNews,
  deleteNews,
} from "@/src/features/news/newsApi";
import Pagination from "@/components/pagination";

interface NewsCategory {
  id: number;
  name: string;
}

interface NewsAuthor {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
}

interface News {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  featured: boolean;
  published: boolean;
  view_count: number;
  image_url: string;
  slug: string;
  published_at: string;
  category: NewsCategory;
  author: NewsAuthor;
}

export default function NewsPage() {
  const dispatch = useDispatch();
  const { news, totalNews, newsTypes } = useNewsData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showPublishedOnly, setShowPublishedOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Bulk delete states
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featured: false,
    category_id: "",
    image: null as File | null,
  });

  useEffect(() => {
    dispatch(
      listNews({ limit: itemsPerPage, page: currentPage } as any) as any
    );
    dispatch(listNewsType() as any);
  }, [dispatch, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds([]); // Clear selection when changing page
  };

  const handleCreate = () => {
    setEditingNews(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      featured: false,
      category_id: "",
      image: null,
    });
    setImagePreview(null);
    setShowCreateModal(true);
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      excerpt: newsItem.excerpt || "",
      content: newsItem.content || "",
      featured: newsItem.featured,
      category_id: newsItem.category.id.toString(),
      image: null,
    });
    setImagePreview(newsItem.image_url || null);
    setShowCreateModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(editingNews?.image_url || null);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề tin tức");
      return;
    }

    if (!formData.category_id) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    if (!formData.excerpt.trim()) {
      toast.error("Vui lòng nhập mô tả ngắn");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }

    setCreating(true);
    try {
      const apiFormData = new FormData();
      apiFormData.append("title", formData.title);
      apiFormData.append("excerpt", formData.excerpt);
      apiFormData.append("content", formData.content);
      apiFormData.append("featured", formData.featured.toString());
      apiFormData.append("category_id", formData.category_id);

      if (formData.image) {
        apiFormData.append("file", formData.image);
      }

      if (editingNews) {
        const res = await dispatch(
          updateNews({
            id: editingNews.id,
            data: apiFormData,
          } as any) as any
        );
        if (res.payload.status == 200 || res.payload.status == 201) {
          dispatch(
            listNews({ limit: itemsPerPage, page: currentPage } as any) as any
          );
          toast.success(
            res.payload.data.message || "Cập nhật tin tức thành công"
          );
        }
      } else {
        const res = await dispatch(createNews(apiFormData as any) as any);
        if (res.payload.status == 200 || res.payload.status == 201) {
          dispatch(
            listNews({ limit: itemsPerPage, page: currentPage } as any) as any
          );
          toast.success(res.payload.data.message || "Tạo tin tức thành công");
        }
      }

      setShowCreateModal(false);
    } catch (error) {
      console.error("Error saving news:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedIds.length === filteredNews.length && filteredNews.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNews.map((n: News) => n.id));
    }
  };

  // Handle individual checkbox
  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (ids: number[]) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} tin tức?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await dispatch(deleteNews(ids as any) as any);

      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(res.payload.data.message || "Xóa tin tức thành công");
        dispatch(
          listNews({ limit: itemsPerPage, page: currentPage } as any) as any
        );
        setSelectedIds([]);
      } else {
        toast.error("Có lỗi xảy ra khi xóa tin tức");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  // Filter news (chỉ filter trên dữ liệu đã được phân trang từ server)
  const filteredNews = news
    ?.filter((newsItem: News) => {
      const matchesSearch =
        newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (newsItem.excerpt &&
          newsItem.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (newsItem.content &&
          newsItem.content.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" ||
        newsItem.category.id.toString() === selectedCategory;
      const matchesFeatured = !showFeaturedOnly || newsItem.featured;
      const matchesPublished = !showPublishedOnly || newsItem.published;

      return (
        matchesSearch && matchesCategory && matchesFeatured && matchesPublished
      );
    })
    .sort((a: News, b: News) => {
      return (
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    });

  // Tính tổng số trang từ totalNews (tổng số từ server)
  const totalPages = Math.ceil(totalNews / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchTerm, selectedCategory, showFeaturedOnly, showPublishedOnly]);

  // Calculate stats
  const featuredNews = news?.filter((n: News) => n.featured).length || 0;
  const publishedNews = news?.filter((n: News) => n.published).length || 0;
  const totalViews =
    news?.reduce((sum: number, n: News) => sum + n.view_count, 0) || 0;

  const newsByCategory = newsTypes?.map((category: NewsCategory) => ({
    ...category,
    count: news?.filter((n: News) => n.category.id === category.id).length || 0,
  }));

  const getCategoryColor = (categoryId: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-cyan-500",
    ];
    return colors[(categoryId - 1) % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quản Lý Tin Tức
            </h1>
            <p className="text-white/80">
              Quản lý các tin tức và bài viết trong tổ chức
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm Tin Tức
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category breakdown */}
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">
                Phân Bố Theo Danh Mục
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {newsByCategory?.map((category: any) => (
                  <div key={category.id} className="text-center">
                    <Badge
                      className={`${getCategoryColor(
                        category.id
                      )} text-white mb-2`}
                    >
                      {category.name}
                    </Badge>
                    <p className="text-2xl font-bold text-white">
                      {category.count}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* General stats */}
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Thống Kê Tổng Quan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-white/80 text-sm">Nổi bật</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {featuredNews}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-white/80 text-sm">Đã xuất bản</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {publishedNews}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-white/80 text-sm">Lượt xem</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{totalViews}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-white/80 text-sm">Tổng tin</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{totalNews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm tin tức..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[200px]">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {newsTypes?.map((category: NewsCategory) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured-only"
                    checked={showFeaturedOnly}
                    onCheckedChange={(checked) =>
                      setShowFeaturedOnly(checked as boolean)
                    }
                  />
                  <Label htmlFor="featured-only" className="text-white text-sm">
                    Nổi bật
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="published-only"
                    checked={showPublishedOnly}
                    onCheckedChange={(checked) =>
                      setShowPublishedOnly(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="published-only"
                    className="text-white text-sm"
                  >
                    Đã xuất bản
                  </Label>
                </div>
              </div>

              {selectedIds.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedIds)}
                  disabled={deleting}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Xóa ({selectedIds.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* News Table */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Danh Sách Tin Tức</CardTitle>
            <CardDescription className="text-white/80">
              Hiển thị {filteredNews?.length} trên tổng số {totalNews} tin tức
              {selectedIds.length > 0 && (
                <span className="ml-2 text-blue-400">
                  (Đã chọn {selectedIds.length})
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-purple-500/30">
                    <TableHead className="w-[50px] text-white">
                      <Checkbox
                        checked={
                          selectedIds.length === filteredNews?.length &&
                          filteredNews?.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                        className="border-white/30"
                      />
                    </TableHead>
                    <TableHead className="text-white">Hình Ảnh</TableHead>
                    <TableHead className="text-white">Tiêu Đề</TableHead>
                    <TableHead className="text-white">Danh Mục</TableHead>
                    <TableHead className="text-white">Tác Giả</TableHead>
                    <TableHead className="text-white">Lượt Xem</TableHead>
                    <TableHead className="text-white">Trạng Thái</TableHead>
                    <TableHead className="text-white">Ngày Xuất Bản</TableHead>
                    <TableHead className="text-white text-right">
                      Thao Tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews?.length > 0 ? (
                    filteredNews.map((newsItem: News) => (
                      <TableRow
                        key={newsItem.id}
                        className="border-b border-purple-500/30 hover:bg-white/5"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(newsItem.id)}
                            onCheckedChange={() => handleSelectOne(newsItem.id)}
                            className="border-white/30"
                          />
                        </TableCell>
                        <TableCell>
                          {newsItem.image_url ? (
                            <img
                              src={newsItem.image_url}
                              alt={newsItem.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="font-medium text-white">
                              {newsItem.title}
                            </p>
                            {newsItem.excerpt && (
                              <p className="text-sm text-white/60 mt-1 line-clamp-2">
                                {newsItem.excerpt}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getCategoryColor(
                              newsItem.category.id
                            )} text-white`}
                          >
                            {newsItem.category.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {newsItem.author.avatar_url ? (
                              <img
                                src={newsItem.author.avatar_url}
                                alt={newsItem.author.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="text-white text-sm">
                                {newsItem.author.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-white/60">
                            <Eye className="h-4 w-4" />
                            <span className="text-sm">
                              {newsItem.view_count}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {newsItem.featured && (
                              <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30 w-fit">
                                <Star className="h-3 w-3 mr-1" />
                                Nổi bật
                              </Badge>
                            )}
                            {newsItem.published ? (
                              <Badge className="bg-green-600/20 text-green-400 border-green-500/30 w-fit">
                                Đã xuất bản
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-600/20 text-gray-400 border-gray-500/30 w-fit">
                                Nháp
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-white/60">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">
                              {new Date(
                                newsItem.published_at
                              ).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(newsItem)}
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete([newsItem.id])}
                              disabled={deleting}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-white/60"
                      >
                        Không tìm thấy tin tức nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalNews}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            />
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingNews ? "Chỉnh Sửa Tin Tức" : "Thêm Tin Tức Mới"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">
                  Tiêu Đề <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="bg-black/50 border-purple-500/30 text-white"
                  placeholder="VD: Thông báo quan trọng về..."
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-white">
                  Danh Mục <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category_id: value }))
                  }
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {newsTypes?.map((category: NewsCategory) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="excerpt" className="text-white">
                  Mô Tả Ngắn <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  className="bg-black/50 border-purple-500/30 text-white"
                  placeholder="Mô tả ngắn gọn về tin tức..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-white">
                  Nội Dung <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="bg-black/50 border-purple-500/30 text-white"
                  placeholder="Nội dung chi tiết của tin tức..."
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="image" className="text-white mb-3 block">
                  Hình Ảnh
                </Label>
                <div className="space-y-3">
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-purple-500/30">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      {formData.image && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  <Input
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    className="bg-black/50 border-purple-500/30 text-white file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                    accept="image/*"
                  />
                  <p className="text-xs text-white/60">
                    {editingNews && !formData.image
                      ? "Chọn hình ảnh mới để thay thế (để trống nếu giữ nguyên)"
                      : "Chọn hình ảnh cho tin tức"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: checked as boolean,
                    }))
                  }
                />
                <Label
                  htmlFor="featured"
                  className="text-white flex items-center"
                >
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  Đánh dấu là tin nổi bật
                </Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={creating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : editingNews ? (
                  "Cập nhật"
                ) : (
                  "Tạo mới"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
