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
  Edit,
  Loader2,
  Trash2,
  X,
  Building2,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useCompanyData } from "@/src/hook/companyHook";
import { useServicesData } from "@/src/hook/servicesHook";
import { listCompanies } from "@/src/features/company/companyApi";
import {
    createServices,
  deleteServices,
  listServices,
  listServicesType,
  updateServices,
} from "@/src/features/service/serviceApi";
import Pagination from "@/components/pagination";

interface ServiceCategory {
  id: number | null;
  name: string | null;
}

interface ServiceCompany {
  id: number;
  name: string;
  logo_url: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  features: string[];
  price_range: string;
  company: ServiceCompany;
  category: ServiceCategory;
}

interface ServiceType {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  website_url: string;
  email: string;
  phone: string;
  address: string;
}

export default function ServicesManagementPage() {
  const dispatch = useDispatch();
  const { services, servicesTypes } = useServicesData();
  const { companies, totalCompany } = useCompanyData();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Bulk delete states
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Feature input state
  const [featureInput, setFeatureInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    features: [] as string[],
    min_price: "",
    max_price: "",
    category_id: "",
    company_id: "",
  });

  useEffect(() => {
    dispatch(listCompanies({ limit: totalCompany, page: 1 } as any) as any);
  }, [dispatch, totalCompany]);

  useEffect(() => {
    dispatch(listServices() as any);
    dispatch(listServicesType() as any);
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds([]);
  };

  const handleCreate = () => {
    setEditingService(null);
    setFormData({
      title: "",
      description: "",
      features: [],
      min_price: "",
      max_price: "",
      category_id: "",
      company_id: "",
    });
    setFeatureInput("");
    setShowCreateModal(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    
    // Parse price_range to extract min and max price
    const priceRange = service.price_range || "";
    const priceParts = priceRange.split("-");
    const minPrice = priceParts[0]?.trim().replace(/[^\d]/g, "") || "";
    const maxPrice = priceParts[1]?.trim().replace(/[^\d]/g, "") || "";
    
    setFormData({
      title: service.title,
      description: service.description,
      features: service.features || [],
      min_price: minPrice,
      max_price: maxPrice,
      category_id: service.category?.id?.toString() || "",
      company_id: service.company.id.toString(),
    });
    setFeatureInput("");
    setShowCreateModal(true);
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề dịch vụ");
      return;
    }

    if (!formData.company_id) {
      toast.error("Vui lòng chọn công ty");
      return;
    }

    if (!formData.min_price.trim() || !formData.max_price.trim()) {
      toast.error("Vui lòng nhập đầy đủ giá tối thiểu và tối đa");
      return;
    }

    setCreating(true);
    try {
      const apiData = {
        title: formData.title,
        description: formData.description,
        features: formData.features,
        min_price: parseFloat(formData.min_price),
        max_price: parseFloat(formData.max_price),
        company_id: parseInt(formData.company_id),
        ...(formData.category_id && formData.category_id !== "all" && {
          category_id: parseInt(formData.category_id),
        }),
      };

      if (editingService) {
        const res = await dispatch(
          updateServices({
            id: editingService.id,
            ...apiData,
          } as any) as any
        );
        if (res.payload.status == 200 || res.payload.status == 201) {
          await dispatch(listServices() as any);
          setShowCreateModal(false);
          toast.success(res.payload.data.message || "Cập nhật dịch vụ thành công");
        }
      } else {
        const res = await dispatch(createServices(apiData as any) as any);
        if (res.payload.status == 200 || res.payload.status == 201) {
          await dispatch(listServices() as any);
          setShowCreateModal(false);
          toast.success(res.payload.data.message || "Tạo dịch vụ thành công");
        }
      }

      
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredServices.length && filteredServices.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredServices.map((s: Service) => s.id));
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (ids: number[]) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} dịch vụ?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await dispatch(deleteServices(ids as any) as any);
      
      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(res.payload.data.message || "Xóa dịch vụ thành công");
        await dispatch(listServices() as any);
        setSelectedIds([]);
      } else {
        toast.error("Có lỗi xảy ra khi xóa dịch vụ");
      }
    } catch (error) {
      console.error("Error deleting services:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  const filteredServices = services
    .filter((service: Service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description &&
          service.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" ||
        service.category?.id?.toString() === selectedCategory;

      const matchesCompany =
        selectedCompany === "all" ||
        service.company.id.toString() === selectedCompany;

      return matchesSearch && matchesCategory && matchesCompany;
    })
    .sort((a: Service, b: Service) => b.id - a.id);

//   const totalPages = Math.ceil(totalService / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchTerm, selectedCategory, selectedCompany]);

  const servicesByCategory = servicesTypes?.map((type: ServiceType) => ({
    ...type,
    count: services?.filter((s: Service) => s?.category?.id === type?.id).length,
  }));

  const getCategoryColor = (categoryId: number | null) => {
    if (!categoryId) return "bg-gray-500";
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
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
              Quản Lý Dịch Vụ
            </h1>
            <p className="text-white/80">
              Quản lý các dịch vụ của các công ty trong tổ chức
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm Dịch Vụ
          </Button>
        </div>

        {/* Category breakdown */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">
              Phân Bố Theo Loại Dịch Vụ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {servicesByCategory.map((type: any) => (
                <div key={type.id} className="text-center">
                  <Badge className={`${getCategoryColor(type.id)} text-white mb-2`}>
                    {type.name}
                  </Badge>
                  <p className="text-2xl font-bold text-white">{type.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm dịch vụ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[200px]">
                  <SelectValue placeholder="Chọn loại dịch vụ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {servicesTypes.map((type: ServiceType) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[200px]">
                  <SelectValue placeholder="Chọn công ty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả công ty</SelectItem>
                  {companies.map((company: Company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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

        {/* Services Table */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Danh Sách Dịch Vụ</CardTitle>
            {/* <CardDescription className="text-white/80">
              Hiển thị {filteredServices.length} trên tổng số {totalService} dịch vụ
              {selectedIds.length > 0 && (
                <span className="ml-2 text-blue-400">
                  (Đã chọn {selectedIds.length})
                </span>
              )}
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-purple-500/30">
                    <TableHead className="w-[50px] text-white">
                      <Checkbox
                        checked={
                          selectedIds.length === filteredServices.length &&
                          filteredServices.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                        className="border-white/30"
                      />
                    </TableHead>
                    <TableHead className="text-white">Tiêu Đề</TableHead>
                    <TableHead className="text-white">Loại</TableHead>
                    <TableHead className="text-white">Công Ty</TableHead>
                    <TableHead className="text-white">Tính Năng</TableHead>
                    <TableHead className="text-white">Giá</TableHead>
                    <TableHead className="text-white text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service: Service) => (
                      <TableRow
                        key={service.id}
                        className="border-b border-purple-500/30 hover:bg-white/5"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(service.id)}
                            onCheckedChange={() => handleSelectOne(service.id)}
                            className="border-white/30"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">
                              {service.title}
                            </p>
                            {service.description && (
                              <p className="text-sm text-white/60 mt-1 line-clamp-2">
                                {service.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {service.category?.name ? (
                            <Badge
                              className={`${getCategoryColor(
                                service.category.id
                              )} text-white`}
                            >
                              {service.category.name}
                            </Badge>
                          ) : (
                            <span className="text-white/40 text-sm">Chưa phân loại</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-blue-400" />
                            <div>
                              <p className="text-white text-sm font-medium">
                                {service.company.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {service.features?.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-purple-400" />
                              <span className="text-white text-sm">
                                {service.features.length} tính năng
                              </span>
                            </div>
                          ) : (
                            <span className="text-white/40 text-sm">
                              Không có
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="text-white text-sm">
                              {service.price_range}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(service)}
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete([service.id])}
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
                        colSpan={7}
                        className="text-center py-8 text-white/60"
                      >
                        Không tìm thấy dịch vụ nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Component */}
            {/* <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalService}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            /> */}
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingService ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ Mới"}
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
                  placeholder="VD: Tư vấn dịch vụ vệ sĩ"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Mô Tả
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="bg-black/50 border-purple-500/30 text-white"
                  placeholder="Mô tả chi tiết về dịch vụ..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-white">
                  Công Ty <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.company_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, company_id: value }))
                  }
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn công ty" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company: Company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category" className="text-white">
                  Loại Dịch Vụ
                </Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category_id: value }))
                  }
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn loại dịch vụ (tùy chọn)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Chưa phân loại</SelectItem>
                    {servicesTypes.map((type: ServiceType) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_price" className="text-white">
                    Giá Tối Thiểu <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="min_price"
                    type="number"
                    value={formData.min_price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        min_price: e.target.value,
                      }))
                    }
                    className="bg-black/50 border-purple-500/30 text-white"
                    placeholder="VD: 50"
                  />
                </div>
                <div>
                  <Label htmlFor="max_price" className="text-white">
                    Giá Tối Đa <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="max_price"
                    type="number"
                    value={formData.max_price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        max_price: e.target.value,
                      }))
                    }
                    className="bg-black/50 border-purple-500/30 text-white"
                    placeholder="VD: 100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="features" className="text-white mb-3 block">
                  Tính Năng
                </Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      id="features"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      className="bg-black/50 border-purple-500/30 text-white flex-1"
                      placeholder="Nhập tính năng và nhấn Enter hoặc Thêm"
                    />
                    <Button
                      type="button"
                      onClick={handleAddFeature}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.features.length > 0 && (
                    <div className="bg-black/30 p-4 rounded-lg border border-purple-500/30 space-y-2">
                      <p className="text-white text-sm font-medium mb-2">
                        Đã thêm {formData.features.length} tính năng
                      </p>
                      {formData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-black/40 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Sparkles className="h-4 w-4 text-purple-400 flex-shrink-0" />
                            <p className="text-white text-sm">{feature}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFeature(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                ) : editingService ? (
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