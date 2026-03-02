"use client";

import { useState, useEffect, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Users,
  Building2,
  Mail,
  Phone,
  Calendar,
  Edit,
  Loader2,
  UserCheck,
  UserX,
  Briefcase,
  Trash2,
  Eye,
  Upload,
  Download,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  createEmployee,
  exportExcel,
  importExcel,
  listContact,
  listEmployee,
  listEmployeeStatus,
  listManager,
  listSkill,
  resetPasswordEmployeeCMS,
  updateEmployee,
  updateStatusEmployee,
} from "@/src/features/employee/employeeApi";
import { listDepartment } from "@/src/features/department/departmentApi";
import { listPosition } from "@/src/features/position/positionApi";
import CreateAndEditModalEmployee from "./createAndEditModal";
import EmployeeDetailModal from "./detail/detailModal";
import { useEmployeeData } from "@/src/hook/employeeHook";
import { usePositionData } from "@/src/hook/positionHook";
import { useDepartmentData } from "@/src/hook/departmentHook";
import { useRoleData } from "@/src/hook/roleHook";
import { listRoleLevelPositionWebsite } from "@/src/features/role/roleApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

interface Skill {
  skill_id: string | number;
  value: string | number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  position_id: number | null;
  position: string | null;
  department_id: number | null;
  level_id: number | null;
  department_name: string | null;
  join_date: string | null;
  status: string;
  avatar_url: string | null;
  salary: number | null;
  manager_id: number | null;
  address: string | null;
  birthday: string | null;
  education: string | null;
  educations: {
    degree_level: string;
    major: string;
    school_name: string;
    graduation_year: number;
  }[];
  contracts: {
    base_salary: string;
    allowance: string;
    contract_type: number;
  }[];
  certificates: {
    certificate_name: string;
  }[];
  skills: Array<{
    id: number;
    name: string;
    value: string;
  }>;
  skill_group_id: number | null;
  skill_groups?: Array<{
    id: number;
    name: string;
    status: boolean;
  }>;
  issue_date: string | null;
  issue_place: string | null;
  citizen_card: string | null;
  birth_place: string | null;
  emergency_contract: string | null;
  bio: string | null;
  company_id: number | null;
  gen: number;
  employees_status: number | null;
}

interface Department {
  id: number;
  name: string;
}

export default function EmployeesManagementContent() {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { employees, totalEmployees, skills, contacts, managers, statuses } =
    useEmployeeData();
  const { departments, totalDepartment } = useDepartmentData();
  const { positions, totalPosition } = usePositionData();
  const { levelPositionRoles } = useRoleData();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil((totalEmployees || 0) / itemsPerPage);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null,
  );
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    gen: 1,
    phone: "",
    position: "",
    birth_place: "",
    citizen_card: "",
    issue_date: "",
    issue_place: "",
    major: "",
    school_name: "",
    graduation_year: "",
    certificate_name: "",
    degree_level: "",
    contract_type: "",
    base_salary: "",
    allowance: "",
    emergency_contract: "",
    department_id: "",
    level_id: "",
    join_date: "",
    status: "active",
    salary: "",
    manager_id: "",
    address: "",
    birthday: "",
    education: "",
    skills: [] as Skill[],
    bio: "",
    skill_group_id: "",
    employees_status: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 100);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    dispatch(
      listEmployee({
        limit: itemsPerPage,
        page: currentPage,
        search: debouncedSearchTerm || "",
      } as any) as any,
    );
    dispatch(listSkill() as any);
    dispatch(listContact() as any);
    dispatch(listManager() as any);
    dispatch(listEmployeeStatus() as any);
  }, [dispatch, currentPage, debouncedSearchTerm]);

  useEffect(() => {
    dispatch(
      listDepartment({
        limit: totalDepartment,
        page: 1,
        search: "",
      } as any) as any,
    );
    dispatch(
      listPosition({ limit: totalPosition, page: 1, search: "" } as any) as any,
    );
    dispatch(listRoleLevelPositionWebsite() as any);
  }, [dispatch, totalPosition, totalDepartment]);

  const handleUpdateStatus = async (employeeId: number, statusId: string) => {
    try {
      const res = await dispatch(
        updateStatusEmployee({
          id: employeeId,
          status: parseInt(statusId),
        }) as any,
      );
      if (res.payload.status === 200 || res.payload.status === 201) {
        await dispatch(
          listEmployee({
            limit: itemsPerPage,
            page: currentPage,
            search: debouncedSearchTerm || "",
          } as any) as any,
        );
        toast.success(res.payload.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleExportExcel = async () => {
    const result = await dispatch(exportExcel() as any);
    if (exportExcel.fulfilled.match(result)) {
      const blob = result.payload;
      const url = window.URL.createObjectURL(
        new Blob([blob] as any, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employees.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await dispatch(importExcel(formData) as any);
    await dispatch(
      listEmployee({
        limit: itemsPerPage,
        page: currentPage,
        search: debouncedSearchTerm || "",
      } as any) as any,
    );
    e.target.value = "";
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setFormData({
      id: "",
      allowance: "",
      base_salary: "",
      contract_type: "",
      certificate_name: "",
      degree_level: "",
      emergency_contract: "",
      issue_date: "",
      issue_place: "",
      major: "",
      school_name: "",
      graduation_year: "",
      birth_place: "",
      citizen_card: "",
      gen: 1,
      name: "",
      email: "",
      phone: "",
      position: "",
      department_id: "",
      level_id: "",
      join_date: "",
      status: "",
      salary: "",
      manager_id: "",
      address: "",
      birthday: "",
      education: "",
      skills: [],
      bio: "",
      skill_group_id: "",
      employees_status: "",
    });
    setShowCreateModal(true);
  };

  const handleEdit = async (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      id: employee.id.toString(),
      name: employee.name || "",
      email: employee.email || "",
      gen: employee.gen || 1,
      phone: employee.phone || "",
      position: employee.position_id?.toString() || "",
      birth_place: employee.birth_place || "",
      citizen_card: employee.citizen_card || "",
      issue_date: employee.issue_date ? employee.issue_date.split("T")[0] : "",
      issue_place: employee.issue_place || "",
      emergency_contract: employee.emergency_contract || "",
      address: employee.address || "",
      birthday: employee.birthday ? employee.birthday.split("T")[0] : "",
      join_date: employee.join_date ? employee.join_date.split("T")[0] : "",
      status: employee.status || "active",
      department_id: employee.department_id?.toString() || "",
      level_id: employee.level_id?.toString() || "",
      manager_id: employee.manager_id?.toString() || "",
      bio: employee.bio || "",
      degree_level: employee.educations?.[0]?.degree_level || "",
      major: employee.educations?.[0]?.major || "",
      school_name: employee.educations?.[0]?.school_name || "",
      graduation_year:
        employee.educations?.[0]?.graduation_year?.toString() || "",
      base_salary: employee.contracts?.[0]?.base_salary?.toString() || "",
      allowance: employee.contracts?.[0]?.allowance?.toString() || "",
      contract_type: employee.contracts?.[0]?.contract_type?.toString() || "",
      certificate_name: employee.certificates?.[0]?.certificate_name || "",
      salary:
        employee.salary?.toString() ||
        employee.contracts?.[0]?.base_salary?.toString() ||
        "",
      skills:
        employee.skills?.map((skill) => ({
          skill_id: skill.id,
          value: skill.value || "",
          name: skill.name,
        })) || [],
      skill_group_id:
        employee.skill_groups?.[0]?.id?.toString() ||
        employee.skill_group_id?.toString() ||
        "",
      education: employee.education || "",
      employees_status: employee.employees_status?.toString() || "1",
    });
    setShowCreateModal(true);
  };

  const validateForm = () => {
    const requiredFields = {
      email: "Email",
      name: "Họ tên",
      join_date: "Ngày vào làm",
      birthday: "Ngày sinh",
      address: "Địa chỉ",
      manager_id: "Quản lý trực tiếp",
      gen: "Giới tính",
      birth_place: "Nơi sinh",
      citizen_card: "CCCD",
      issue_date: "Ngày cấp CCCD",
      issue_place: "Nơi cấp CCCD",
      emergency_contract: "Liên hệ khẩn cấp",
      degree_level: "Trình độ học vấn",
      major: "Chuyên ngành",
      school_name: "Trường học",
      graduation_year: "Năm tốt nghiệp",
      base_salary: "Lương cơ bản",
      allowance: "Phụ cấp",
      contract_type: "Loại hợp đồng",
      certificate_name: "Chứng chỉ",
      skill_group_id: "Nhóm kỹ năng",
      department_id: "Phòng ban",
      level_id: "Cấp bậc",
      position: "Chức vụ",
    };

    type RequiredFormField = keyof typeof requiredFields;

    for (const key in requiredFields) {
      const typedKey = key as RequiredFormField;
      if (!formData[typedKey] || formData[typedKey] === "") {
        toast.error(`${requiredFields[typedKey]} không được để trống`);
        return false;
      }
    }

    if (!formData.skills || formData.skills.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 kỹ năng");
      return false;
    }

    for (const skill of formData.skills) {
      if (!skill.skill_id) {
        toast.error("Kỹ năng không hợp lệ");
        return false;
      }
      if (Number(skill.value) < 0 || Number(skill.value) > 100) {
        toast.error("Điểm kỹ năng phải từ 0–100");
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    const isEditing = !!editingEmployee;
    if (!validateForm()) return;

    const baseData = {
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      join_date: formData.join_date,
      birthday: formData.birthday,
      address: formData.address,
      manager_id: formData.manager_id,
      gen: formData.gen,
      birth_place: formData.birth_place,
      citizen_card: formData.citizen_card,
      issue_date: formData.issue_date,
      issue_place: formData.issue_place,
      emergency_contract: formData.emergency_contract,
      degree_level: formData.degree_level,
      major: formData.major,
      school_name: formData.school_name,
      graduation_year: formData.graduation_year,
      base_salary: formData.base_salary,
      allowance: formData.allowance,
      contract_type: formData.contract_type,
      certificate_name: formData.certificate_name,
      skills: formData.skills.map((skill) => ({
        skill_id: parseInt(skill.skill_id.toString()),
        value: parseInt(skill.value.toString()) || 0,
      })),
      skill_group_id: formData.skill_group_id
        ? parseInt(formData.skill_group_id)
        : null,
      department_id: formData.department_id,
      level_id: formData.level_id,
      position_id: formData.position,
    };

    try {
      let res;
      if (isEditing) {
        const updateData = { id: editingEmployee.id, ...baseData };
        res = await dispatch(updateEmployee(updateData) as any);
      } else {
        res = await dispatch(createEmployee(baseData) as any);
      }

      if (res.payload.status == 200 || res.payload.status == 201) {
        await dispatch(
          listEmployee({
            limit: itemsPerPage,
            page: currentPage,
            search: debouncedSearchTerm || "",
          } as any) as any,
        );
        setShowCreateModal(false);
        toast.success(res.payload.data.message);
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Lỗi khi lưu nhân viên");
    }
  };

  const handleDelete = async () => {};

  const handleResetPassword = async (employee: any) => {
    try {
      const res = await dispatch(resetPasswordEmployeeCMS(employee.id) as any);
      if (res.payload.status == 200 || res.payload.status == 201) {
        toast.success(res.payload.data.message);
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee.id);
    setShowDetailModal(true);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedEmployees = employees || [];

  const filteredEmployees =
    selectedStatus === "all"
      ? paginatedEmployees
      : paginatedEmployees.filter(
          (emp: Employee) => emp.status === selectedStatus,
        );

  const activeEmployees =
    employees?.filter((e: Employee) => e.status === "active").length || 0;
  const inactiveEmployees =
    employees?.filter((e: Employee) => e.status === "inactive").length || 0;
  const companiesWithEmployees = employees
    ? [...new Set(employees.map((e: Employee) => e.company_id).filter(Boolean))]
        .length
    : 0;

  if (!employees) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Đang tải nhân viên...</span>
      </div>
    );
  }

  // Helper to get department name
  const getDeptName = (deptId: number | null) => {
    if (!deptId) return null;
    return departments?.find((d: any) => d.id === deptId)?.name || null;
  };

  const getLevelName = (levelId: number | null) => {
    if (!levelId) return null;
    return levelPositionRoles?.find((l: any) => l.id === levelId)?.name || null;
  };

  const getPositionName = (posId: number | null) => {
    if (!posId) return null;
    return positions?.find((p: any) => p.id === posId)?.title || null;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Quản Lý Nhân Viên
          </h1>
          <p className="text-sm text-white/70">
            Quản lý thông tin nhân viên của tất cả các công ty
          </p>
        </div>
      </div>

      {/* Stats - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm">Tổng NV</p>
                <p className="text-xl md:text-2xl font-bold text-white">
                  {totalEmployees}
                </p>
              </div>
              <Users className="h-6 w-6 md:h-8 md:w-8 text-purple-400 shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm">Hoạt động</p>
                <p className="text-xl md:text-2xl font-bold text-white">
                  {activeEmployees}
                </p>
              </div>
              <UserCheck className="h-6 w-6 md:h-8 md:w-8 text-green-400 shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-red-500/30">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm">Không HĐ</p>
                <p className="text-xl md:text-2xl font-bold text-white">
                  {inactiveEmployees}
                </p>
              </div>
              <UserX className="h-6 w-6 md:h-8 md:w-8 text-red-400 shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs md:text-sm">Công ty</p>
                <p className="text-xl md:text-2xl font-bold text-white">
                  {companiesWithEmployees}
                </p>
              </div>
              <Building2 className="h-6 w-6 md:h-8 md:w-8 text-blue-400 shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters + Actions */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardContent className="p-4 md:p-6">
          {/* Search + Filter row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm tên nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImportExcel}
            />
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 flex items-center gap-1.5 text-sm h-9 px-3"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm NV</span>
            </Button>
            <Button
              onClick={handleExportExcel}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 flex items-center gap-1.5 text-sm h-9 px-3"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white border-0 flex items-center gap-1.5 text-sm h-9 px-3"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader className="px-4 md:px-6 py-4">
          <CardTitle className="text-white text-lg md:text-xl">
            Danh Sách Nhân Viên
            <span className="ml-2 text-sm font-normal text-white/50">
              ({filteredEmployees.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 md:px-6 pb-4 md:pb-6">
          {/* MOBILE: Card list (hidden on md+) */}
          <div className="block md:hidden space-y-3 px-4">
            {filteredEmployees.length > 0 ? (
              (filteredEmployees as Employee[]).map((employee) => {
                const deptName = getDeptName(employee.department_id);
                const posName = getPositionName(employee.position_id);
                const levelName = getLevelName(employee.level_id);

                return (
                  <div
                    key={employee.id}
                    className="bg-white/5 border border-purple-500/30 rounded-xl p-4 space-y-3"
                  >
                    {/* Top row: avatar + name + actions */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                          {employee.avatar_url ? (
                            <Image
                              src={employee.avatar_url}
                              alt={employee.name || "Avatar"}
                              width={44}
                              height={44}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-white/60" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm truncate">
                            {employee.name || (
                              <span className="text-white/40 italic">
                                Chưa có tên
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-white/50 truncate">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleViewDetails(employee)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-white/80" />
                        </button>
                        <button
                          onClick={() => handleEdit(employee)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5 text-white/80" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(employee)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                          <Briefcase className="h-3.5 w-3.5 text-white/80" />
                        </button>
                      </div>
                    </div>

                    {/* Info chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {deptName && (
                        <span className="inline-flex items-center gap-1 text-xs bg-purple-500/15 text-purple-300 px-2 py-1 rounded-full">
                          <Building2 className="h-3 w-3" />
                          {deptName}
                        </span>
                      )}
                      {posName && (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-500/15 text-blue-300 px-2 py-1 rounded-full">
                          <Briefcase className="h-3 w-3" />
                          {posName}
                        </span>
                      )}
                      {levelName && (
                        <span className="inline-flex items-center gap-1 text-xs bg-indigo-500/15 text-indigo-300 px-2 py-1 rounded-full">
                          {levelName}
                        </span>
                      )}
                    </div>

                    {/* Contact + Status row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-3">
                        {employee.phone && (
                          <span className="flex items-center gap-1 text-xs text-white/50">
                            <Phone className="h-3 w-3" />
                            {employee.phone}
                          </span>
                        )}
                      </div>
                      <Select
                        value={employee.employees_status?.toString() || ""}
                        onValueChange={(value) =>
                          handleUpdateStatus(employee.id, value)
                        }
                      >
                        <SelectTrigger className="bg-black/30 border-purple-500/30 text-white h-8 text-xs w-auto min-w-[130px]">
                          <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses && statuses.length > 0 ? (
                            statuses.map((status: any) => (
                              <SelectItem key={status.id} value={status.id}>
                                {status.name || "Chưa có tên"}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              Chưa có trạng thái
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-white/40">
                Không tìm thấy nhân viên nào
              </div>
            )}
          </div>

          {/* DESKTOP: Table (hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-purple-500/30">
                  <TableHead className="text-white/70 font-medium">
                    Nhân Viên
                  </TableHead>
                  <TableHead className="text-white/70 font-medium">
                    Phòng Ban
                  </TableHead>
                  <TableHead className="text-white/70 font-medium">
                    Cấp Bậc
                  </TableHead>
                  <TableHead className="text-white/70 font-medium">
                    Chức Vụ
                  </TableHead>
                  <TableHead className="text-white/70 font-medium">
                    Liên Hệ
                  </TableHead>
                  <TableHead className="text-white/70 font-medium">
                    Trạng Thái
                  </TableHead>
                  <TableHead className="text-white/70 font-medium text-right">
                    Thao Tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  (filteredEmployees as Employee[]).map((employee) => (
                    <TableRow
                      key={employee.id}
                      className="border-b border-purple-500/30 hover:bg-white/5 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            {employee.avatar_url ? (
                              <Image
                                src={employee.avatar_url}
                                alt={employee.name || "Avatar"}
                                width={36}
                                height={36}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Users className="h-4 w-4 text-white/60" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">
                              {employee.name || (
                                <span className="text-white/40 italic text-xs">
                                  Chưa có tên
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-white/50">
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-white/70 text-sm">
                        {(() => {
                          if (employee.department_id) {
                            const dept = departments?.find(
                              (d: any) => d.id === employee.department_id,
                            );
                            return (
                              dept?.name || (
                                <span className="text-white/40 italic text-xs">
                                  Chưa có
                                </span>
                              )
                            );
                          }
                          return (
                            <span className="text-white/40 italic text-xs">
                              Chưa phân công
                            </span>
                          );
                        })()}
                      </TableCell>

                      <TableCell className="text-white/70 text-sm">
                        {(() => {
                          if (employee.level_id) {
                            const level = levelPositionRoles?.find(
                              (l: any) => l.id === employee.level_id,
                            );
                            return (
                              level?.name || (
                                <span className="text-white/40 italic text-xs">
                                  Chưa có
                                </span>
                              )
                            );
                          }
                          return (
                            <span className="text-white/40 italic text-xs">
                              Chưa phân công
                            </span>
                          );
                        })()}
                      </TableCell>

                      <TableCell className="text-white/70 text-sm">
                        {(() => {
                          if (employee.position_id) {
                            const pos = positions?.find(
                              (p: any) => p.id === employee.position_id,
                            );
                            return (
                              pos?.title || (
                                <span className="text-white/40 italic text-xs">
                                  Chưa có
                                </span>
                              )
                            );
                          }
                          return (
                            <span className="text-white/40 italic text-xs">
                              Chưa xác định
                            </span>
                          );
                        })()}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="flex items-center text-xs text-white/60 gap-1">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[150px]">
                              {employee.email || (
                                <span className="italic">Chưa có</span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-white/50 gap-1">
                            <Phone className="h-3 w-3 shrink-0" />
                            {employee.phone || (
                              <span className="italic">Chưa có SĐT</span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Select
                          value={employee.employees_status?.toString() || ""}
                          onValueChange={(value) =>
                            handleUpdateStatus(employee.id, value)
                          }
                        >
                          <SelectTrigger className="bg-black/30 border-purple-500/30 text-white w-[140px] h-8 text-xs">
                            <SelectValue placeholder="Chưa có" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses && statuses.length > 0 ? (
                              statuses.map((status: any) => (
                                <SelectItem key={status.id} value={status.id}>
                                  {status.name || "Chưa có tên"}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                Chưa có trạng thái
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="bg-slate-900 text-white border border-white/20"
                            >
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(employee)}
                                className="cursor-pointer focus:bg-white/10"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleEdit(employee)}
                                className="cursor-pointer focus:bg-white/10"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleResetPassword(employee)}
                                className="cursor-pointer focus:bg-white/10"
                              >
                                <Briefcase className="mr-2 h-4 w-4" />
                                Reset mật khẩu
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-white/40"
                    >
                      Không tìm thấy nhân viên nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 md:px-6 pb-4 md:pb-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalEmployees || 0}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
            />
          </div>
        )}
      </Card>

      {/* Detail Employee */}
      <EmployeeDetailModal
        employeeId={selectedEmployee}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        skillsList={skills}
      />

      {/* Create/Edit Modal */}
      <CreateAndEditModalEmployee
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        formData={formData}
        setFormData={setFormData}
        editingEmployee={editingEmployee}
        departments={departments}
        positions={positions}
        contacts={contacts}
        managers={managers}
        skills={skills}
        levelPositionRoles={levelPositionRoles}
        handleSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingEmployee}
        onOpenChange={() => setDeletingEmployee(null)}
      >
        <DialogContent className="bg-black/90 border-red-500/30 text-white max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Xác Nhận Xóa Nhân Viên
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-white/80">
              Bạn có chắc chắn muốn xóa nhân viên{" "}
              <span className="font-semibold text-red-400">
                {deletingEmployee?.name || "này"}
              </span>{" "}
              không?
            </p>
            <p className="text-sm text-red-400">
              ⚠️ Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên
              quan.
            </p>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setDeletingEmployee(null)}
                className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20"
                disabled={deleting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa Nhân Viên
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
