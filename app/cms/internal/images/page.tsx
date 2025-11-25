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
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  FileText,
  Edit,
  Loader2,
  Trash2,
  X,
  Image as ImageIcon,
  Upload,
  Layers,
  File,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import InternalLayout from "@/components/cms-layout";
import { useImageData } from "@/src/hook/imageHook";
import {
  listImage,
  listImageType,
  listPageImage,
  createImage,
  updateImage,
  deleteImage,
  updateStatusImage,
} from "@/src/features/image/imageApi";
import Pagination from "@/components/pagination";
import { is } from "date-fns/locale";

interface ImageFormData {
  id?: string;
  title: string;
  description: string;
  type_image: string;
  page: string;
  redirect: string;
  file?: File;
  image_url?: string;
  status?: boolean;
}

function ImagePage() {
  const dispatch = useDispatch();
  const { images, totalImage, imageTypes, pageImages } = useImageData();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterPage, setFilterPage] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ImageFormData>({
    title: "",
    description: "",
    type_image: "",
    page: "",
    redirect: "",
  });

  useEffect(() => {
    dispatch(listImage({ limit: 10, page: currentPage } as any) as any);
    dispatch(listImageType() as any);
    dispatch(listPageImage() as any);
  }, [dispatch, currentPage]);

  // Filter images
  const filteredImages = images?.filter((image: any) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPage = filterPage === "all" || image.page?.id === filterPage;
    const matchesType =
      filterType === "all" || image.type_image?.id.toString() === filterType;
    return matchesSearch && matchesPage && matchesType;
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = ""; // Reset input
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        e.target.value = ""; // Reset input
        return;
      }
      setFormData({ ...formData, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle remove preview image
  const handleRemovePreview = (isEdit: boolean = false) => {
    if (isEdit) {
      // In edit mode, revert to original image
      setPreviewImage(formData.image_url || null);
      setFormData({ ...formData, file: undefined });
    } else {
      // In create mode, clear everything
      setPreviewImage(null);
      setFormData({ ...formData, file: undefined });
    }
    // Reset file inputs
    const createFileInput = document.getElementById("file") as HTMLInputElement;
    const editFileInput = document.getElementById(
      "edit-file"
    ) as HTMLInputElement;
    if (createFileInput) createFileInput.value = "";
    if (editFileInput) editFileInput.value = "";
  };

  // Handle status toggle
  const handleStatusToggle = async (imageId: string) => {
    setUpdatingStatusId(imageId);
    try {
      await dispatch(updateStatusImage(imageId as any) as any);
      toast.success("Cập nhật trạng thái thành công");
      // Refresh list
      dispatch(listImage({ limit: 10, page: currentPage } as any) as any);
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Handle form submit
  const handleSubmit = async (isEdit: boolean) => {
    if (!formData.title || !formData.type_image || !formData.page) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isEdit && !formData.file) {
      toast.error("Please select an image");
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("type_image", formData.type_image);
      formDataToSend.append("page", formData.page);
      formDataToSend.append("redirect", formData.redirect || "");

      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      if (isEdit) {
        const res = await dispatch(
          updateImage({ id: formData.id, data: formDataToSend } as any) as any
        );
        if (res.payload.status == 200 || res.payload.status == 201) {
          toast.success(res.payload.data.message);
          setIsEditDialogOpen(false);
        }
      } else {
        const res = await dispatch(createImage(formDataToSend) as any);
        if (res.payload.status == 200 || res.payload.status == 201) {
          toast.success(res.payload.data.message);
          setIsCreateDialogOpen(false);
        }
      }

      // Reset form
      resetForm();

      // Refresh list
      dispatch(listImage({ limit: 10, page: currentPage } as any) as any);
    } catch (error: any) {
      toast.error(error?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type_image: "",
      page: "",
      redirect: "",
    });
    setPreviewImage(null);
    // Reset file inputs
    const createFileInput = document.getElementById("file") as HTMLInputElement;
    const editFileInput = document.getElementById(
      "edit-file"
    ) as HTMLInputElement;
    if (createFileInput) createFileInput.value = "";
    if (editFileInput) editFileInput.value = "";
  };

  // Handle edit
  const handleEdit = (image: any) => {
    setFormData({
      id: image.id,
      title: image.title,
      description: image.description || "",
      type_image: image.type_image?.id.toString(),
      page: image.page?.id,
      redirect: image.redirect || "",
      image_url: image.image_url,
    });
    setPreviewImage(image.image_url);
    setIsEditDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (ids: string[]) => {
    if (
      !window.confirm(`Are you sure you want to delete ${ids.length} image(s)?`)
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(deleteImage(ids as any) as any);
      toast.success(`Successfully deleted ${ids.length} image(s)`);
      setSelectedImages([]);
      dispatch(listImage({ limit: 10, page: currentPage } as any) as any);
    } catch (error: any) {
      toast.error(error?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages?.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages?.map((img: any) => img.id) || []);
    }
  };

  // Handle select one
  const handleSelectOne = (id: string) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter((i) => i !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quản Lý Hình Ảnh
            </h1>
            <p className="text-white/80">
              Quản lý hình ảnh và banner trên website
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm Hình Ảnh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white/80">
                Tổng Hình Ảnh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-white">
                  {totalImage || 0}
                </p>
                <ImageIcon className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white/80">
                Loại Hình Ảnh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-white">
                  {imageTypes?.length || 0}
                </p>
                <Layers className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white/80">Trang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-white">
                  {pageImages?.length || 0}
                </p>
                <File className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white/80">Đã Chọn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-white">
                  {selectedImages.length}
                </p>
                <Trash2 className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <Select value={filterPage} onValueChange={setFilterPage}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[200px]">
                  <SelectValue placeholder="Chọn trang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trang</SelectItem>
                  {pageImages?.map((page: any) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[200px]">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {imageTypes?.map((type: any) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedImages.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedImages)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa ({selectedImages.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images Table */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Danh Sách Hình Ảnh</CardTitle>
            <CardDescription className="text-white/80">
              Hiển thị {filteredImages?.length || 0} trên tổng số{" "}
              {totalImage || 0} hình ảnh
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
                          selectedImages.length === filteredImages?.length &&
                          filteredImages?.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                        className="border-white/30"
                      />
                    </TableHead>
                    <TableHead className="w-[120px] text-white">
                      Hình Ảnh
                    </TableHead>
                    <TableHead className="text-white">Tiêu Đề</TableHead>
                    <TableHead className="text-white">Mô Tả</TableHead>
                    <TableHead className="text-white">Loại</TableHead>
                    <TableHead className="text-white">Trang</TableHead>
                    <TableHead className="text-white">Trạng Thái</TableHead>
                    <TableHead className="text-white text-right">
                      Thao Tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredImages?.length > 0 ? (
                    filteredImages.map((image: any) => (
                      <TableRow
                        key={image.id}
                        className="border-b border-purple-500/30 hover:bg-white/5"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedImages.includes(image.id)}
                            onCheckedChange={() => handleSelectOne(image.id)}
                            className="border-white/30"
                          />
                        </TableCell>
                        <TableCell>
                          <img
                            src={image.image_url}
                            alt={image.title}
                            className="w-20 h-20 object-cover rounded-md border border-purple-500/30"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-white">
                          {image.title}
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate text-white/80">
                          {image.description}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {image.type_image?.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {image.page?.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={image.status}
                              onCheckedChange={() =>
                                handleStatusToggle(image.id)
                              }
                              disabled={updatingStatusId === image.id}
                              className="data-[state=checked]:bg-green-500"
                            />
                            <Badge
                              className={
                                image.status
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : "bg-red-500/20 text-red-300 border-red-500/30"
                              }
                            >
                              {updatingStatusId === image.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : image.status ? (
                                "Hoạt động"
                              ) : (
                                "Tắt"
                              )}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(image)}
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete([image.id])}
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
                        colSpan={8}
                        className="text-center py-10 text-white/60"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="h-10 w-10 text-white/30" />
                          <p>Không tìm thấy hình ảnh nào</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil((totalImage || 0) / itemsPerPage)}
              totalItems={totalImage || 0}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              maxVisiblePages={5}
            />
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Thêm Hình Ảnh Mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="file" className="text-white">
                  Hình Ảnh <span className="text-red-400">*</span>
                </Label>
                <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 bg-black/30">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                        onClick={() => handleRemovePreview(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="file"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-10 w-10 text-purple-400 mb-2" />
                      <p className="text-sm text-white/80">
                        Nhấn để tải lên hoặc kéo thả
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        PNG, JPG, WEBP tối đa 5MB
                      </p>
                    </label>
                  )}
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Tiêu Đề <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề hình ảnh"
                  className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Mô Tả
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả hình ảnh"
                  rows={3}
                  className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">
                  Loại Hình Ảnh <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.type_image}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type_image: value })
                  }
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn loại hình ảnh" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageTypes?.map((type: any) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Page */}
              <div className="space-y-2">
                <Label htmlFor="page" className="text-white">
                  Trang <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.page}
                  onValueChange={(value) =>
                    setFormData({ ...formData, page: value })
                  }
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn trang" />
                  </SelectTrigger>
                  <SelectContent>
                    {pageImages?.map((page: any) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Redirect */}
              <div className="space-y-2">
                <Label htmlFor="redirect" className="text-white">
                  Link Chuyển Hướng
                </Label>
                <Input
                  id="redirect"
                  value={formData.redirect}
                  onChange={(e) =>
                    setFormData({ ...formData, redirect: e.target.value })
                  }
                  placeholder="Nhập link chuyển hướng (tùy chọn)"
                  className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}
                disabled={isLoading}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Hủy
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Tạo Hình Ảnh
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Chỉnh Sửa Hình Ảnh</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="edit-file" className="text-white">
                  Hình Ảnh{" "}
                  <span className="text-white/60">(Click để thay đổi)</span>
                </Label>
                <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 bg-black/30">
                  {previewImage ? (
                    <div className="relative group">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                        <label
                          htmlFor="edit-file"
                          className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Thay đổi ảnh
                        </label>
                      </div>
                      {formData.file && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                          onClick={() => handleRemovePreview(true)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <label
                      htmlFor="edit-file"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-10 w-10 text-purple-400 mb-2" />
                      <p className="text-sm text-white/80">
                        Nhấn để tải lên hình ảnh mới
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        PNG, JPG, WEBP tối đa 5MB
                      </p>
                    </label>
                  )}
                  <input
                    id="edit-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-white">
                  Tiêu Đề <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề hình ảnh"
                  className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-white">
                  Mô Tả
                </Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả hình ảnh"
                  rows={3}
                  className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="edit-type" className="text-white">
                  Loại Hình Ảnh <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.type_image}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type_image: value })
                  }
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn loại hình ảnh" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageTypes?.map((type: any) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Page */}
              <div className="space-y-2">
                <Label htmlFor="edit-page" className="text-white">
                  Trang <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.page}
                  onValueChange={(value) =>
                    setFormData({ ...formData, page: value })
                  }
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn trang" />
                  </SelectTrigger>
                  <SelectContent>
                    {pageImages?.map((page: any) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Redirect */}
              <div className="space-y-2">
                <Label htmlFor="edit-redirect" className="text-white">
                  Link Chuyển Hướng
                </Label>
                <Input
                  id="edit-redirect"
                  value={formData.redirect}
                  onChange={(e) =>
                    setFormData({ ...formData, redirect: e.target.value })
                  }
                  placeholder="Nhập link chuyển hướng (tùy chọn)"
                  className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
                disabled={isLoading}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Hủy
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Cập Nhật
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function ImageManagementPage() {
  return (
    <InternalLayout>
      <ImagePage />
    </InternalLayout>
  );
}
