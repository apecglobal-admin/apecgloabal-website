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
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Award,
  Zap,
  Users,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useCompanyData } from "@/src/hook/companyHook";
import { useDepartmentData } from "@/src/hook/departmentHook";
import { useJobsData } from "@/src/hook/jobsHook";
import {
  createJob,
  deleteJobs,
  listJobs,
  updateJob,
} from "@/src/features/jobs/jobApi";
import { listCompanies } from "@/src/features/company/companyApi";
import { listDepartment } from "@/src/features/department/departmentApi";
import Pagination from "@/components/pagination";

interface JobStatus {
  id: number;
  name: string;
}

interface JobDepartment {
  id: number | null;
  name: string | null;
}

interface JobCompany {
  id: number;
  name: string;
}

interface Job {
  id: number;
  title: string;
  location: string;
  description: string;
  type: string;
  experience_required: string;
  benefits: string[];
  requirements: string[];
  skills: string[];
  urgent: boolean;
  remote_ok: boolean;
  created_at: string;
  min_price: string;
  max_price: string;
  status: JobStatus;
  department: JobDepartment;
  company: JobCompany;
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

interface Department {
  id: number;
  name: string;
  description: string | null;
}

const JOB_TYPES = [
  { value: "full-time", label: "Toàn thời gian" },
  { value: "part-time", label: "Bán thời gian" },
  { value: "contract", label: "Hợp đồng" },
  { value: "internship", label: "Thực tập" },
  { value: "freelance", label: "Tự do" },
];

const EXPERIENCE_LEVELS = [
  { value: "0-1 năm", label: "0-1 năm" },
  { value: "1-3 năm", label: "1-3 năm" },
  { value: "3-5 năm", label: "3-5 năm" },
  { value: "5-10 năm", label: "5-10 năm" },
  { value: "10+ năm", label: "10+ năm" },
];

export default function JobsManagementPage() {
  const dispatch = useDispatch();
  const { jobs, totalJobs, jobStatus } = useJobsData();
  const { companies, totalCompany } = useCompanyData();
  const { departments, totalDepartment } = useDepartmentData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Bulk delete states
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Array input states
  const [benefitInput, setBenefitInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company_id: "",
    department_id: "none",
    location: "",
    type: "",
    experience_required: "",
    min_price: "",
    max_price: "",
    urgent: false,
    remote_ok: false,
    benefits: [] as string[],
    requirements: [] as string[],
    skills: [] as string[],
  });

  useEffect(() => {
    dispatch(listJobs({limit: itemsPerPage, page: currentPage}as any) as any);
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    dispatch(listCompanies({ limit: totalCompany, page: 1 } as any) as any);
    dispatch(listDepartment({ limit: totalDepartment, page: 1, search: "" } as any) as any);
  }, [dispatch, totalCompany, totalDepartment]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds([]);
  };

  const handleCreate = () => {
    setEditingJob(null);
    setFormData({
      title: "",
      description: "",
      company_id: "",
      department_id: "none",
      location: "",
      type: "",
      experience_required: "",
      min_price: "",
      max_price: "",
      urgent: false,
      remote_ok: false,
      benefits: [],
      requirements: [],
      skills: [],
    });
    setBenefitInput("");
    setRequirementInput("");
    setSkillInput("");
    setShowCreateModal(true);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      company_id: job.company.id.toString(),
      department_id: job.department?.id?.toString() || "none",
      location: job.location,
      type: job.type,
      experience_required: job.experience_required,
      min_price: job.min_price,
      max_price: job.max_price,
      urgent: job.urgent,
      remote_ok: job.remote_ok,
      benefits: job.benefits || [],
      requirements: job.requirements || [],
      skills: job.skills || [],
    });
    setBenefitInput("");
    setRequirementInput("");
    setSkillInput("");
    setShowCreateModal(true);
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc");
      return;
    }

    if (!formData.company_id) {
      toast.error("Vui lòng chọn công ty");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Vui lòng nhập địa điểm làm việc");
      return;
    }

    if (!formData.type) {
      toast.error("Vui lòng chọn loại hình công việc");
      return;
    }

    if (!formData.experience_required) {
      toast.error("Vui lòng chọn kinh nghiệm yêu cầu");
      return;
    }

    if (!formData.min_price.trim() || !formData.max_price.trim()) {
      toast.error("Vui lòng nhập đầy đủ mức lương tối thiểu và tối đa");
      return;
    }

    setCreating(true);
    try {
      const apiData = {
        title: formData.title,
        description: formData.description,
        company_id: parseInt(formData.company_id),
        location: formData.location,
        type: formData.type,
        experience_required: formData.experience_required,
        min_price: formData.min_price,
        max_price: formData.max_price,
        urgent: formData.urgent,
        remote_ok: formData.remote_ok,
        benefits: formData.benefits,
        requirements: formData.requirements,
        skills: formData.skills,
        ...(formData.department_id &&
          formData.department_id !== "none" && {
            department_id: parseInt(formData.department_id),
          }),
      };

      if (editingJob) {
        const res = await dispatch(
          updateJob({
            id: editingJob.id,
            data: apiData,
          } as any) as any
        );
        if (res.payload.status === 200 || res.payload.status === 201) {
        await dispatch(listJobs({limit: itemsPerPage, page: currentPage}as any) as any);
          setShowCreateModal(false);
          toast.success(res.payload.data.message || "Cập nhật công việc thành công");
        }
      } else {
        const res = await dispatch(createJob(apiData as any) as any);
        if (res.payload.status === 200 || res.payload.status === 201) {
        await dispatch(listJobs({limit: itemsPerPage, page: currentPage}as any) as any);
          setShowCreateModal(false);
          toast.success(res.payload.data.message || "Tạo công việc thành công");
        }
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  const handleSelectAll = () => {
    if (
      selectedIds.length === paginatedJobs.length &&
      paginatedJobs.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedJobs.map((j: Job) => j.id));
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
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} công việc?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await dispatch(deleteJobs(ids as any) as any);

      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(res.payload.data.message || "Xóa công việc thành công");
        await dispatch(listJobs({limit: itemsPerPage, page: currentPage}as any) as any);
        setSelectedIds([]);
      } else {
        toast.error("Có lỗi xảy ra khi xóa công việc");
      }
    } catch (error) {
      console.error("Error deleting jobs:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  const filteredJobs = jobs
    .filter((job: Job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.description &&
          job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" ||
        job.status?.id?.toString() === selectedStatus;

      const matchesCompany =
        selectedCompany === "all" ||
        job.company.id.toString() === selectedCompany;

      const matchesType =
        selectedType === "all" || job.type === selectedType;

      return matchesSearch && matchesStatus && matchesCompany && matchesType;
    })
    .sort((a: Job, b: Job) => b.id - a.id);

  const totalPages = Math.ceil(totalJobs / itemsPerPage);
  const paginatedJobs = filteredJobs;

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchTerm, selectedStatus, selectedCompany, selectedType]);

  const jobsByStatus = jobStatus?.map((status: JobStatus) => ({
    ...status,
    count: jobs?.filter((j: Job) => j?.status?.id === status?.id).length,
  }));

  const getStatusColor = (statusId: number | null) => {
    if (!statusId) return "bg-gray-500";
    const colors = {
      1: "bg-green-500", // Đã đăng tải
      2: "bg-yellow-500", // Chờ xét duyệt
      3: "bg-red-500", // Đã ẩn
    };
    return colors[statusId as keyof typeof colors] || "bg-gray-500";
  };

  const getStatusIcon = (statusId: number | null) => {
    if (!statusId) return <AlertCircle className="h-4 w-4" />;
    const icons = {
      1: <CheckCircle2 className="h-4 w-4" />,
      2: <Clock className="h-4 w-4" />,
      3: <EyeOff className="h-4 w-4" />,
    };
    return icons[statusId as keyof typeof icons] || <AlertCircle className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      "full-time": "bg-blue-500",
      "part-time": "bg-purple-500",
      "contract": "bg-orange-500",
      "internship": "bg-pink-500",
      "freelance": "bg-teal-500",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quản Lý Tuyển Dụng
            </h1>
            <p className="text-white/80">
              Quản lý các vị trí tuyển dụng của các công ty trong tổ chức
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Đăng Tin Tuyển Dụng
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm công việc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-blue-500/30 text-white placeholder:text-white/50"
                />
              </div>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-black/30 border-blue-500/30 text-white min-w-[200px]">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {jobStatus.map((status: JobStatus) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-black/30 border-blue-500/30 text-white min-w-[200px]">
                  <SelectValue placeholder="Loại hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại hình</SelectItem>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="bg-black/30 border-blue-500/30 text-white min-w-[200px]">
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

        {/* Jobs Table */}
        <Card className="bg-black/50 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white">Danh Sách Tuyển Dụng</CardTitle>
            <CardDescription className="text-white/80">
              Hiển thị {paginatedJobs.length} trên tổng số {totalJobs} công việc
              {selectedIds.length > 0 && (
                <span className="ml-2 text-cyan-400">
                  (Đã chọn {selectedIds.length})
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-blue-500/30">
                    <TableHead className="w-[50px] text-white">
                      <Checkbox
                        checked={
                          selectedIds.length === paginatedJobs.length &&
                          paginatedJobs.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                        className="border-white/30"
                      />
                    </TableHead>
                    <TableHead className="text-white">Công Việc</TableHead>
                    <TableHead className="text-white">Công Ty</TableHead>
                    <TableHead className="text-white">Loại Hình</TableHead>
                    <TableHead className="text-white">Kinh Nghiệm</TableHead>
                    <TableHead className="text-white">Mức Lương</TableHead>
                    <TableHead className="text-white">Trạng Thái</TableHead>
                    <TableHead className="text-white text-right">
                      Thao Tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedJobs.length > 0 ? (
                    paginatedJobs.map((job: Job) => (
                      <TableRow
                        key={job.id}
                        className="border-b border-blue-500/30 hover:bg-white/5"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(job.id)}
                            onCheckedChange={() => handleSelectOne(job.id)}
                            className="border-white/30"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <Briefcase className="h-4 w-4 text-cyan-400 mt-1 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-white">
                                  {job.title}
                                </p>
                                {job.description && (
                                  <p className="text-sm text-white/60 mt-1 line-clamp-2">
                                    {job.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            {/* <div className="flex items-center gap-2 text-sm text-white/60">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </div> */}
                            <div className="flex flex-wrap gap-2">
                              {job.urgent && (
                                <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Gấp
                                </Badge>
                              )}
                              {job.remote_ok && (
                                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                                  <Wifi className="h-3 w-3 mr-1" />
                                  Remote
                                </Badge>
                              )}
                              {!job.remote_ok && (
                                <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/30">
                                  <WifiOff className="h-3 w-3 mr-1" />
                                  Tại văn phòng
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-blue-400" />
                            <div>
                              <p className="text-white text-sm font-medium">
                                {job.company.name}
                              </p>
                              {job.department?.name && (
                                <p className="text-xs text-white/60">
                                  {job.department.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getTypeColor(job.type)} text-white`}
                          >
                            {JOB_TYPES.find((t) => t.value === job.type)
                              ?.label || job.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-purple-400" />
                            <span className="text-white text-sm">
                              {job.experience_required}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <div>
                              <p className="text-white text-sm">
                                {parseInt(job.min_price).toLocaleString()} -{" "}
                                {parseInt(job.max_price).toLocaleString()}
                              </p>
                              <p className="text-xs text-white/60">VNĐ</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              job.status?.id
                            )} text-white flex items-center gap-1 w-fit`}
                          >
                            {getStatusIcon(job.status?.id)}
                            {job.status?.name || "Không rõ"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(job)}
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete([job.id])}
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
                        colSpan={8}
                        className="text-center py-8 text-white/60"
                      >
                        Không tìm thấy công việc nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Component */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalJobs}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
              />
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="bg-black/90 border-blue-500/30 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingJob
                  ? "Chỉnh Sửa Tin Tuyển Dụng"
                  : "Đăng Tin Tuyển Dụng Mới"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400">
                  Thông Tin Cơ Bản
                </h3>

                <div>
                  <Label htmlFor="title" className="text-white">
                    Tiêu Đề Công Việc <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="bg-black/50 border-blue-500/30 text-white"
                    placeholder="VD: Senior Backend Developer"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Mô Tả Công Việc
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
                    className="bg-black/50 border-blue-500/30 text-white"
                    placeholder="Mô tả chi tiết về công việc..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      <SelectTrigger className="bg-black/50 border-blue-500/30 text-white">
                        <SelectValue placeholder="Chọn công ty" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company: Company) => (
                          <SelectItem
                            key={company.id}
                            value={company.id.toString()}
                          >
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department" className="text-white">
                      Phòng Ban
                    </Label>
                    <Select
                      value={formData.department_id}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          department_id: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-black/50 border-blue-500/30 text-white">
                        <SelectValue placeholder="Chọn phòng ban (tùy chọn)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Không chọn</SelectItem>
                        {departments.map((dept: Department) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-white">
                    Địa Điểm Làm Việc <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="bg-black/50 border-blue-500/30 text-white"
                    placeholder="VD: Hà Nội, Việt Nam"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type" className="text-white">
                      Loại Hình Công Việc <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="bg-black/50 border-blue-500/30 text-white">
                        <SelectValue placeholder="Chọn loại hình" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experience" className="text-white">
                      Kinh Nghiệm Yêu Cầu{" "}
                      <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.experience_required}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          experience_required: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-black/50 border-blue-500/30 text-white">
                        <SelectValue placeholder="Chọn kinh nghiệm" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_price" className="text-white">
                      Mức Lương Tối Thiểu <span className="text-red-400">*</span>
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
                      className="bg-black/50 border-blue-500/30 text-white"
                      placeholder="VD: 15000000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_price" className="text-white">
                      Mức Lương Tối Đa <span className="text-red-400">*</span>
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
                      className="bg-black/50 border-blue-500/30 text-white"
                      placeholder="VD: 25000000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="urgent"
                      checked={formData.urgent}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          urgent: checked as boolean,
                        }))
                      }
                      className="border-white/30"
                    />
                    <Label
                      htmlFor="urgent"
                      className="text-white cursor-pointer flex items-center gap-2"
                    >
                      <Zap className="h-4 w-4 text-red-400" />
                      Tuyển gấp
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remote_ok"
                      checked={formData.remote_ok}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          remote_ok: checked as boolean,
                        }))
                      }
                      className="border-white/30"
                    />
                    <Label
                      htmlFor="remote_ok"
                      className="text-white cursor-pointer flex items-center gap-2"
                    >
                      <Wifi className="h-4 w-4 text-green-400" />
                      Cho phép làm việc từ xa
                    </Label>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400">
                  Phúc Lợi & Quyền Lợi
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddBenefit();
                        }
                      }}
                      className="bg-black/50 border-blue-500/30 text-white flex-1"
                      placeholder="Nhập phúc lợi và nhấn Enter hoặc Thêm"
                    />
                    <Button
                      type="button"
                      onClick={handleAddBenefit}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.benefits.length > 0 && (
                    <div className="bg-black/30 p-4 rounded-lg border border-blue-500/30 space-y-2">
                      <p className="text-white text-sm font-medium mb-2">
                        Đã thêm {formData.benefits.length} phúc lợi
                      </p>
                      {formData.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-black/40 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                            <p className="text-white text-sm">{benefit}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveBenefit(index)}
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

              {/* Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400">
                  Yêu Cầu Công Việc
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddRequirement();
                        }
                      }}
                      className="bg-black/50 border-blue-500/30 text-white flex-1"
                      placeholder="Nhập yêu cầu và nhấn Enter hoặc Thêm"
                    />
                    <Button
                      type="button"
                      onClick={handleAddRequirement}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.requirements.length > 0 && (
                    <div className="bg-black/30 p-4 rounded-lg border border-blue-500/30 space-y-2">
                      <p className="text-white text-sm font-medium mb-2">
                        Đã thêm {formData.requirements.length} yêu cầu
                      </p>
                      {formData.requirements.map((requirement, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-black/40 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                            <p className="text-white text-sm">{requirement}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRequirement(index)}
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

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400">
                  Kỹ Năng Yêu Cầu
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="bg-black/50 border-blue-500/30 text-white flex-1"
                      placeholder="Nhập kỹ năng và nhấn Enter hoặc Thêm"
                    />
                    <Button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.skills.length > 0 && (
                    <div className="bg-black/30 p-4 rounded-lg border border-blue-500/30">
                      <p className="text-white text-sm font-medium mb-3">
                        Đã thêm {formData.skills.length} kỹ năng
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1"
                          >
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSkill(index)}
                              className="ml-2 h-4 w-4 p-0 text-red-400 hover:text-red-300"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
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
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : editingJob ? (
                  "Cập nhật"
                ) : (
                  "Đăng tin"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}