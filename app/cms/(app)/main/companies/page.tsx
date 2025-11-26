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
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useCompanyData } from "@/src/hook/companyHook";
import {
  listCompanies,
  listIndustry,
  createCompany,
  updateCompany,
  deleteCompany,
} from "@/src/features/company/companyApi";
import Pagination from "@/components/pagination";

interface Industry {
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
  established_date: string;
  employee_count: number;
  industry: Industry[];
  short_description: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  youtube_url: string;
  display_order: number;
}

export default function CompanyPage() {
  const dispatch = useDispatch();
  const { companies, totalCompany, industries } = useCompanyData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Bulk delete states
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website_url: "",
    email: "",
    phone: "",
    address: "",
    established_date: "",
    employee_count: "",
    short_description: "",
    facebook_url: "",
    twitter_url: "",
    linkedin_url: "",
    youtube_url: "",
    industries: [] as number[],
    logo: null as File | null,
  });

  const [previewLogo, setPreviewLogo] = useState<string>("");

  useEffect(() => {
    dispatch(
      listCompanies({ limit: itemsPerPage, page: currentPage } as any) as any
    );
    dispatch(listIndustry() as any);
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds([]);
  };

  const handleCreate = () => {
    setEditingCompany(null);
    setFormData({
      name: "",
      description: "",
      website_url: "",
      email: "",
      phone: "",
      address: "",
      established_date: "",
      employee_count: "",
      short_description: "",
      facebook_url: "",
      twitter_url: "",
      linkedin_url: "",
      youtube_url: "",
      industries: [],
      logo: null,
    });
    setPreviewLogo("");
    setShowCreateModal(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      description: company.description || "",
      website_url: company.website_url || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
      established_date: company.established_date
        ? new Date(company.established_date).toISOString().split("T")[0]
        : "",
      employee_count: company.employee_count?.toString() || "",
      short_description: company.short_description || "",
      facebook_url: company.facebook_url || "",
      twitter_url: company.twitter_url || "",
      linkedin_url: company.linkedin_url || "",
      youtube_url: company.youtube_url || "",
      industries: company.industry?.map((ind) => ind.id) || [],
      logo: null,
    });
    setPreviewLogo(company.logo_url || "");
    setShowCreateModal(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: null }));
    setPreviewLogo("");
  };

  const handleIndustryToggle = (industryId: number) => {
    setFormData((prev) => ({
      ...prev,
      industries: prev.industries.includes(industryId)
        ? prev.industries.filter((id) => id !== industryId)
        : [...prev.industries, industryId],
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên công ty");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    if (formData.industries.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ngành nghề");
      return;
    }

    setCreating(true);
    try {
      const apiFormData = new FormData();
      apiFormData.append("name", formData.name);
      apiFormData.append("description", formData.description);
      apiFormData.append("website_url", formData.website_url);
      apiFormData.append("email", formData.email);
      apiFormData.append("phone", formData.phone);
      apiFormData.append("address", formData.address);
      if (formData.established_date) {
        apiFormData.append("established_date", formData.established_date);
      }
      if (formData.employee_count) {
        apiFormData.append("employee_count", formData.employee_count);
      }
      apiFormData.append("short_description", formData.short_description);
      apiFormData.append("facebook_url", formData.facebook_url);
      apiFormData.append("twitter_url", formData.twitter_url);
      apiFormData.append("linkedin_url", formData.linkedin_url);
      apiFormData.append("youtube_url", formData.youtube_url);
      apiFormData.append("industries", JSON.stringify(formData.industries));

      if (formData.logo) {
        apiFormData.append("file", formData.logo);
      }

      if (editingCompany) {
        const res = await dispatch(
          updateCompany({
            id: editingCompany.id,
            data: apiFormData,
          } as any) as any
        );
        if (res.payload.status === 200 || res.payload.status === 201) {
          await dispatch(
            listCompanies({ limit: itemsPerPage, page: currentPage } as any) as any
          );
          toast.success(res.payload.data.message || "Cập nhật công ty thành công");
        }
      } else {
        const res = await dispatch(createCompany(apiFormData as any) as any);
        if (res.payload.status === 200 || res.payload.status === 201) {
          await dispatch(
            listCompanies({ limit: itemsPerPage, page: currentPage } as any) as any
          );
          toast.success(res.payload.data.message || "Tạo công ty thành công");
        }
      }

      setShowCreateModal(false);
    } catch (error) {
      console.error("Error saving company:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  const handleSelectAll = () => {
    if (
      selectedIds.length === filteredCompanies.length &&
      filteredCompanies.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCompanies.map((c: Company) => c.id));
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
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} công ty?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await dispatch(deleteCompany(ids as any) as any);

      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(res.payload.data.message || "Xóa công ty thành công");
        await dispatch(
          listCompanies({ limit: itemsPerPage, page: currentPage } as any) as any
        );
        setSelectedIds([]);
      } else {
        toast.error("Có lỗi xảy ra khi xóa công ty");
      }
    } catch (error) {
      console.error("Error deleting companies:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  const filteredCompanies = companies
    .filter((company: Company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.description &&
          company.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.short_description &&
          company.short_description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesIndustry =
        selectedIndustry === "all" ||
        company.industry?.some(
          (ind) => ind.id.toString() === selectedIndustry
        );

      return matchesSearch && matchesIndustry;
    })
    .sort((a: Company, b: Company) => {
      return b.display_order - a.display_order;
    });

  const totalPages = Math.ceil(totalCompany / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchTerm, selectedIndustry]);

  const companiesByIndustry = industries?.map((industry: Industry) => ({
    ...industry,
    count: companies?.filter((c: Company) =>
      c.industry?.some((ind) => ind.id === industry.id)
    ).length,
  }));

  const getIndustryColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-teal-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quản Lý Công Ty
            </h1>
            <p className="text-white/80">
              Quản lý thông tin các công ty trong hệ sinh thái
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm Công Ty
          </Button>
        </div>

        {/* Industry breakdown */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">
              Phân Bố Theo Ngành Nghề
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {companiesByIndustry.map((industry: any, index: number) => (
                <div key={industry.id} className="text-center">
                  <Badge
                    className={`${getIndustryColor(index)} text-white mb-2`}
                  >
                    {industry.name}
                  </Badge>
                  <p className="text-2xl font-bold text-white">
                    {industry.count}
                  </p>
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
                  placeholder="Tìm kiếm công ty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="bg-black/30 border border-purple-500/30 text-white rounded-md px-4 py-2 min-w-[200px]"
              >
                <option value="all">Tất cả ngành nghề</option>
                {industries.map((industry: Industry) => (
                  <option key={industry.id} value={industry.id.toString()}>
                    {industry.name}
                  </option>
                ))}
              </select>

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

        {/* Companies Table */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Danh Sách Công Ty</CardTitle>
            <CardDescription className="text-white/80">
              Hiển thị {filteredCompanies.length} trên tổng số {totalCompany}{" "}
              công ty
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
                          selectedIds.length === filteredCompanies.length &&
                          filteredCompanies.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                        className="border-white/30"
                      />
                    </TableHead>
                    <TableHead className="text-white">Logo</TableHead>
                    <TableHead className="text-white">Tên Công Ty</TableHead>
                    <TableHead className="text-white">Ngành Nghề</TableHead>
                    <TableHead className="text-white">Liên Hệ</TableHead>
                    <TableHead className="text-white">Nhân Viên</TableHead>
                    <TableHead className="text-white text-right">
                      Thao Tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company: Company) => (
                      <TableRow
                        key={company.id}
                        className="border-b border-purple-500/30 hover:bg-white/5"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(company.id)}
                            onCheckedChange={() => handleSelectOne(company.id)}
                            className="border-white/30"
                          />
                        </TableCell>
                        <TableCell>
                          {company.logo_url ? (
                            <img
                              src={company.logo_url}
                              alt={company.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-purple-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">
                              {company.name}
                            </p>
                            {company.short_description && (
                              <p className="text-sm text-white/60 mt-1">
                                {company.short_description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {company.industry?.slice(0, 2).map((ind) => (
                              <Badge
                                key={ind.id}
                                className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs"
                              >
                                {ind.name}
                              </Badge>
                            ))}
                            {company.industry?.length > 2 && (
                              <Badge className="bg-gray-600/20 text-gray-400 border-gray-500/30 text-xs">
                                +{company.industry.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {company.email && (
                              <div className="flex items-center gap-2 text-white/70">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">
                                  {company.email}
                                </span>
                              </div>
                            )}
                            {company.phone && (
                              <div className="flex items-center gap-2 text-white/70">
                                <Phone className="h-3 w-3" />
                                <span>{company.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-400" />
                            <span className="text-white">
                              {company.employee_count || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(company)}
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete([company.id])}
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
                        Không tìm thấy công ty nào
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
              totalItems={totalCompany}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            />
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingCompany ? "Chỉnh Sửa Công Ty" : "Thêm Công Ty Mới"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <Label className="text-white mb-3 block">Logo Công Ty</Label>
                <div className="flex items-start gap-4">
                  {previewLogo ? (
                    <div className="relative">
                      <img
                        src={previewLogo}
                        alt="Logo preview"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-purple-500/30"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 h-6 w-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-purple-500/20 flex items-center justify-center border-2 border-dashed border-purple-500/30">
                      <ImageIcon className="h-8 w-8 text-purple-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="bg-black/50 border-purple-500/30 text-white file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                    />
                    <p className="text-white/60 text-xs mt-2">
                      Định dạng: JPG, PNG, GIF (Tối đa 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Tên Công Ty <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="bg-black/50 border-purple-500/30 text-white"
                    placeholder="VD: APEC Global"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">
                    Email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="bg-black/50 border-purple-500/30 text-white"
                    placeholder="info@company.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white">
                    Số Điện Thoại
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="bg-black/50 border-purple-500/30 text-white"
                    placeholder="+84 24 3123 4567"
                  />
                </div>

                <div>
                  <Label htmlFor="website_url" className="text-white">
                    Website
                  </Label>
                  <Input
                    id="website_url"
                    value={formData.website_url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        website_url: e.target.value,
                      }))
                    }
                    className="bg-black/50 border-purple-500/30 text-white"
                    placeholder="https://company.com"
                  />
                </div>

                <div>
                  <Label htmlFor="established_date" className="text-white">
                    Ngày Thành Lập
                  </Label>
                  <Input
                    id="established_date"
                    type="date"
                    value={formData.established_date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        established_date: e.target.value,
                      }))
                    }
                    className="bg-black/50 border-purple-500/30 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="employee_count" className="text-white">
                    Số Lượng Nhân Viên
                  </Label>
                  <Input
                    id="employee_count"
                    type="number"
                    value={formData.employee_count}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employee_count: e.target.value,
                      }))
                    }
                    className="bg-black/50 border-purple-500/30 text-white"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-white">
                  Địa Chỉ
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="bg-black/50 border-purple-500/30 text-white"
                  placeholder="Số 4 Lê Tuấn Mậu, Phường Phú Lâm, TP.HCM"
                />
              </div>

              <div>
                <Label htmlFor="short_description" className="text-white">
                  Mô Tả Ngắn
                </Label>
                <Input
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      short_description: e.target.value,
                    }))
                  }
                  className="bg-black/50 border-purple-500/30 text-white"
                  placeholder="Mô tả ngắn về công ty"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Mô Tả Chi Tiết
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
                  className="bg-black/50 border-purple-500/30 text-white min-h-[100px]"
                  placeholder="Mô tả chi tiết về công ty..."
                />
              </div>

              {/* Industries */}
              <div>
                <Label className="text-white mb-3 block">
                  Ngành Nghề <span className="text-red-400">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {industries.map((industry: Industry) => (
                    <div
                      key={industry.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`industry-${industry.id}`}
                        checked={formData.industries.includes(industry.id)}
                        onCheckedChange={() =>
                          handleIndustryToggle(industry.id)
                        }
                        className="border-white/30"
                      />
                      <Label
                        htmlFor={`industry-${industry.id}`}
                        className="text-white text-sm cursor-pointer"
                      >
                        {industry.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <Label className="text-white mb-3 block">
                  Liên Kết Mạng Xã Hội
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                    <Input
                      value={formData.facebook_url}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          facebook_url: e.target.value,
                        }))
                      }
                      className="pl-10 bg-black/50 border-purple-500/30 text-white"
                      placeholder="Facebook URL"
                    />
                  </div>

                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                    <Input
                      value={formData.twitter_url}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          twitter_url: e.target.value,
                        }))
                      }
                      className="pl-10 bg-black/50 border-purple-500/30 text-white"
                      placeholder="Twitter URL"
                    />
                  </div>

                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                    <Input
                      value={formData.linkedin_url}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          linkedin_url: e.target.value,
                        }))
                      }
                      className="pl-10 bg-black/50 border-purple-500/30 text-white"
                      placeholder="LinkedIn URL"
                    />
                  </div>

                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                    <Input
                      value={formData.youtube_url}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          youtube_url: e.target.value,
                        }))
                      }
                      className="pl-10 bg-black/50 border-purple-500/30 text-white"
                      placeholder="YouTube URL"
                    />
                  </div>
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
                ) : editingCompany ? (
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