"use client";

import { useState, useEffect } from "react";
import InternalLayout from "@/components/cms-layout";
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
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Pagination, usePagination } from "@/components/ui/pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrUpdateEmployee,
  listContact,
  listEmployee,
  listManager,
  listSkill,
} from "@/src/features/employee/employeeApi";
import { listDepartment } from "@/src/features/department/departmentApi";
import { listPosition } from "@/src/features/position/positionApi";
import { Position } from "@/lib/schema";

interface Skill {
  skill_id: string | number;
  value: string | number;
  name: string;
}

interface Education {
  school_name: string;
  degree_level: string;
  major: string;
  graduation_year: string;
}
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  position_id: number; // ⚠️ Thêm field này
  position: string; // Display name
  department_id: number;
  department_name: string;
  join_date: string;
  status: string;
  avatar_url: string;
  salary: number;
  manager_id: number;
  address: string;
  birthday: string;
  education: string;
  educations: {
    degree_level: string;
    major: string;
    school_name: string;
    graduation_year: number;
  };
  contracts: {
    base_salary: string;
    allowance: string;
    contract_type: number;
  };
  certificates: {
    certificate_name: string;
  };
  skills: Array<{
    id: number;
    name: string;
    value: string;
  }>;
  skill_group_id: number | null;
  issue_date: string;
  issue_place: string;
  citizen_card: string;
  birth_place: string;
  emergency_contract: string;
  bio: string;
  company_id: number;
  gen: number;
}

interface Department {
  id: number;
  name: string;
}

function EmployeesManagementContent() {
  const dispatch = useDispatch();
  const { employees, skills, contacts, managers, loading } = useSelector(
    (state: any) => state.employee
  );
  const { departments } = useSelector((state: any) => state.department);
  const { positions } = useSelector((state: any) => state.position);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  // Position management states
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [creatingPosition, setCreatingPosition] = useState(false);
  const [positionFormData, setPositionFormData] = useState({
    title: "",
    description: "",
    level: "staff",
    is_manager_position: false,
    is_active: true,
  });

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
  });

  useEffect(() => {
    dispatch(listEmployee() as any);
    dispatch(listDepartment() as any);
    dispatch(listPosition() as any);
    dispatch(listSkill() as any);
    dispatch(listContact() as any);
    dispatch(listManager() as any);
  }, [dispatch]);

  const handleCreatePosition = () => {
    setPositionFormData({
      title: "",
      description: "",
      level: "staff",
      is_manager_position: false,
      is_active: true,
    });
    setShowPositionModal(true);
  };

  const handleSavePosition = async () => {
    if (!positionFormData.title.trim()) {
      toast.error("Vui lòng nhập tên chức vụ");
      return;
    }

    setCreatingPosition(true);
    try {
      const response = await fetch("/api/positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(positionFormData),
      });

      const result = await response.json();

      if (result.success) {
        setShowPositionModal(false);
        dispatch(listPosition() as any);
        // Auto-select the newly created position
        setFormData({ ...formData, position: positionFormData.title });
        toast.success("Tạo chức vụ thành công!");
      } else {
        toast.error("Lỗi: " + result.error);
      }
    } catch (error) {
      console.error("Error creating position:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setCreatingPosition(false);
    }
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
    });
    setShowCreateModal(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    console.log("Editing Employee:", employee);

    setFormData({
      id: employee.id.toString(),
      name: employee.name,
      email: employee.email,
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
      manager_id: employee.manager_id?.toString() || "",
      bio: employee.bio || "",

      degree_level: employee.educations?.degree_level || "",
      major: employee.educations?.major || "",
      school_name: employee.educations?.school_name || "",
      graduation_year: employee.educations?.graduation_year?.toString() || "",

      base_salary: employee.contracts?.base_salary?.toString() || "",
      allowance: employee.contracts?.allowance?.toString() || "",
      contract_type: employee.contracts?.contract_type?.toString() || "",

      certificate_name: employee.certificates?.certificate_name || "",

      salary:
        employee.salary?.toString() ||
        employee.contracts?.base_salary?.toString() ||
        "",

      skills:
        employee.skills?.map((skill) => ({
          skill_id: skill.id,
          value: skill.value || "",
          name: skill.name,
        })) || [],

      skill_group_id: employee.skill_group_id
        ? employee.skill_group_id.toString()
        : "",

      education: employee.education || "",
    });

    setShowCreateModal(true);
  };

  const handleSave = async () => {
    // Log theo thứ tự yêu cầu
    const employeeId = editingEmployee ? editingEmployee.id : formData.id;
    const saveData = {
      id: employeeId,
      email: formData.email,
      name: formData.name,
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
        skill_id: parseInt(skill.skill_id.toString()), // Sửa lại
        value: parseInt(skill.value.toString()) || 0, // Sửa lại
      })),
      skill_group_id: formData.skill_group_id
        ? parseInt(formData.skill_group_id)
        : null,
      department_id: formData.department_id,
      position_id: formData.position,
    };
    dispatch(createOrUpdateEmployee(saveData) as any);
    dispatch(listEmployee() as any);
    console.log("Save Data:", saveData);
  };

  const handleDelete = async () => {
    if (!deletingEmployee) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/employees/${deletingEmployee.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setDeletingEmployee(null);
        //fetchEmployees()
        dispatch(listEmployee() as any);
        toast.success("Xóa nhân viên thành công!");
      } else {
        toast.error("Lỗi: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  // Filter employees
  const filteredEmployees = employees.filter((employee: Employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.position &&
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" || employee.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedEmployees,
    totalItems,
    itemsPerPage,
    goToPage,
  } = usePagination(filteredEmployees, 10);

  // Calculate stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (e: Employee) => e.status === "active"
  ).length;
  const inactiveEmployees = employees.filter(
    (e: Employee) => e.status === "inactive"
  ).length;
  const companiesWithEmployees = [
    ...new Set(employees.map((e: Employee) => e.company_id).filter(Boolean)),
  ].length;
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Đang tải nhân viên...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản Lý Nhân Viên
          </h1>
          <p className="text-white/80">
            Quản lý thông tin nhân viên của tất cả các công ty
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => (window.location.href = "/internal/positions")}
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Quản Lý Chức Vụ
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm Nhân Viên
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Nhân Viên</p>
                <p className="text-2xl font-bold text-white">
                  {totalEmployees}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Đang Hoạt Động</p>
                <p className="text-2xl font-bold text-white">
                  {activeEmployees}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Không Hoạt Động</p>
                <p className="text-2xl font-bold text-white">
                  {inactiveEmployees}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Công Ty Có NV</p>
                <p className="text-2xl font-bold text-white">
                  {companiesWithEmployees}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-blue-400" />
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
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
              />
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Danh Sách Nhân Viên</CardTitle>
          <CardDescription className="text-white/80">
            Hiển thị {paginatedEmployees.length} trên tổng số{" "}
            {filteredEmployees.length} nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-purple-500/30">
                <TableHead className="text-white">Nhân Viên</TableHead>
                <TableHead className="text-white">Phòng Ban</TableHead>
                <TableHead className="text-white">Chức Vụ</TableHead>
                <TableHead className="text-white">Liên Hệ</TableHead>
                <TableHead className="text-white">Trạng Thái</TableHead>
                <TableHead className="text-white">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.length > 0 ? (
                (paginatedEmployees as Employee[]).map((employee) => (
                  <TableRow
                    key={employee.id}
                    className="border-b border-purple-500/30 hover:bg-white/5"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                          {employee.avatar_url ? (
                            <Image
                              src={employee.avatar_url}
                              alt={employee.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-white/60" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {employee.name}
                          </p>
                          <p className="text-sm text-white/60">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-white/80">
                      {employee.department_name || "Chưa phân công"}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {employee.position || "Chưa xác định"}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-white/60">
                          <Mail className="h-3 w-3 mr-1" />
                          {employee.email}
                        </div>
                        {employee.phone && (
                          <div className="flex items-center text-sm text-white/60">
                            <Phone className="h-3 w-3 mr-1" />
                            {employee.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          employee.status === "active"
                            ? "bg-green-600/20 text-green-400 border-green-500/30"
                            : "bg-red-600/20 text-red-400 border-red-500/30"
                        }
                      >
                        {employee.status === "active"
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(employee)}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingEmployee(employee)}
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
                    colSpan={6}
                    className="text-center py-8 text-white/60"
                  >
                    Không tìm thấy nhân viên nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 pb-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
            />
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-7xl h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingEmployee ? "Chỉnh Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Row 1: Thông tin cơ bản + CCCD */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Thông tin cơ bản */}
              <div className="border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Thông Tin Cơ Bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="id" className="text-white">
                      Mã Nhân Viên
                    </Label>
                    <Input
                      id="id"
                      placeholder="NV001"
                      value={formData.id}
                      onChange={(e) =>
                        setFormData({ ...formData, id: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                      disabled={editingEmployee !== null}
                    />
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-white">
                      Họ Tên *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Nhập họ tên"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="birthday" className="text-white">
                      Ngày Sinh
                    </Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={(e) =>
                        setFormData({ ...formData, birthday: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gen" className="text-white">
                      Giới Tính
                    </Label>
                    <Select
                      value={formData.gen?.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gen: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Nam</SelectItem>
                        <SelectItem value="2">Nữ</SelectItem>
                        <SelectItem value="3">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="birth_place" className="text-white">
                      Nơi Sinh
                    </Label>
                    <Input
                      id="birth_place"
                      placeholder="Tỉnh/Thành phố"
                      value={formData.birth_place}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          birth_place: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-white">
                      Địa Chỉ
                    </Label>
                    <Input
                      id="address"
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-white">
                      Ngày gia nhập
                    </Label>
                    <Input
                      id="join_date"
                      type="date"
                      placeholder="2023-01-01"
                      value={formData.join_date}
                      onChange={(e) =>
                        setFormData({ ...formData, join_date: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* CCCD */}
              <div className="border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Thông Tin CCCD
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="citizen_card" className="text-white">
                      Số CCCD
                    </Label>
                    <Input
                      id="citizen_card"
                      placeholder="001234567890"
                      value={formData.citizen_card}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          citizen_card: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="issue_date" className="text-white">
                      Ngày Cấp
                    </Label>
                    <Input
                      id="issue_date"
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) =>
                        setFormData({ ...formData, issue_date: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="issue_place" className="text-white">
                      Nơi Cấp
                    </Label>
                    <Input
                      id="issue_place"
                      placeholder="Cục Cảnh sát..."
                      value={formData.issue_place}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          issue_place: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Học vấn + Hợp đồng */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Học vấn */}
              <div className="border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Thông Tin Học Vấn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="degree_level" className="text-white">
                      Trình Độ
                    </Label>
                    <Select
                      value={formData.degree_level}
                      onValueChange={(value) =>
                        setFormData({ ...formData, degree_level: value })
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn trình độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                        <SelectItem value="Cao đẳng">Cao đẳng</SelectItem>
                        <SelectItem value="Đại học">Đại học</SelectItem>
                        <SelectItem value="Thạc sĩ">Thạc sĩ</SelectItem>
                        <SelectItem value="Tiến sĩ">Tiến sĩ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="major" className="text-white">
                      Chuyên Ngành
                    </Label>
                    <Input
                      id="major"
                      placeholder="Công nghệ thông tin"
                      value={formData.major}
                      onChange={(e) =>
                        setFormData({ ...formData, major: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="school_name" className="text-white">
                      Trường
                    </Label>
                    <Input
                      id="school_name"
                      placeholder="Tên trường"
                      value={formData.school_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school_name: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="graduation_year" className="text-white">
                      Năm Tốt Nghiệp
                    </Label>
                    <Input
                      id="graduation_year"
                      type="number"
                      placeholder="2023"
                      value={formData.graduation_year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          graduation_year: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="certificate_name" className="text-white">
                      Chứng Chỉ
                    </Label>
                    <Input
                      id="certificate_name"
                      placeholder="AWS, PMP, TOEIC..."
                      value={formData.certificate_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          certificate_name: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Hợp đồng & Lương */}
              <div className="border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Thông Tin Hợp Đồng & Lương
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contract_type" className="text-white">
                      Phòng ban
                    </Label>
                    <Select
                      value={formData.department_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, department_id: value })
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn phòng ban" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((item: any) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contract_type" className="text-white">
                      Chức vụ
                    </Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) =>
                        setFormData({ ...formData, position: value })
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn chức vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((item: any) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="contract_type" className="text-white">
                      Loại Hợp Đồng
                    </Label>
                    <Select
                      value={formData.contract_type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, contract_type: value })
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn loại hợp đồng" />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts.map((item: any) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="base_salary" className="text-white">
                      Lương Cơ Bản (VNĐ)
                    </Label>
                    <Input
                      id="base_salary"
                      type="number"
                      placeholder="10000000"
                      value={formData.base_salary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          base_salary: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="allowance" className="text-white">
                      Phụ Cấp (VNĐ)
                    </Label>
                    <Input
                      id="allowance"
                      type="number"
                      placeholder="2000000"
                      value={formData.allowance}
                      onChange={(e) =>
                        setFormData({ ...formData, allowance: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="manager_id" className="text-white">
                      Người duyệt
                    </Label>
                    <Select
                      value={formData.manager_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, manager_id: value })
                      }
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn người duyệt" />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((item: any) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Liên hệ + Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Liên hệ */}
              <div className="border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Thông Tin Liên Hệ
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-white">
                      Số Điện Thoại
                    </Label>
                    <Input
                      id="phone"
                      placeholder="0123456789"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergency_contract" className="text-white">
                      Liên Lạc Khẩn Cấp
                    </Label>
                    <Input
                      id="emergency_contract"
                      placeholder="Tên người liên hệ - SĐT"
                      value={formData.emergency_contract}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contract: e.target.value,
                        })
                      }
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Kỹ Năng
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="skill_group_id" className="text-white">
                      Nhóm Kỹ Năng
                    </Label>
                    <Select
                      value={formData.skill_group_id}
                      onValueChange={(value) => {
                        const selectedGroup = skills.find(
                          (group: any) => group.id === Number(value)
                        );

                        setFormData({
                          ...formData,
                          skill_group_id: value,
                          skills: selectedGroup
                            ? selectedGroup.skills.map((s: any) => ({
                                skill_id: s.id,
                                value: "",
                              }))
                            : [],
                        });
                      }}
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn nhóm kỹ năng" />
                      </SelectTrigger>
                      <SelectContent>
                        {skills.map((group: any) => (
                          <SelectItem
                            key={group.id}
                            value={group.id.toString()}
                          >
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">
                      Danh Sách Kỹ Năng
                    </Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {formData.skills?.map((skill, index) => {
                        let skillName = skill.name || "";

                        if (!skillName) {
                          const group = skills.find(
                            (g: any) => g.id === Number(formData.skill_group_id)
                          );
                          skillName =
                            group?.skills.find(
                              (s: any) => s.id === skill.skill_id
                            )?.name || "";
                        }

                        if (!skillName) {
                          for (const group of skills) {
                            const foundSkill = group.skills?.find(
                              (s: any) => s.id === skill.skill_id
                            );
                            if (foundSkill) {
                              skillName = foundSkill.name;
                              break;
                            }
                          }
                        }

                        return (
                          <div key={index} className="flex gap-2 items-center">
                            <Input
                              disabled
                              value={skillName || `Skill ID: ${skill.skill_id}`}
                              className="bg-black/30 border-purple-500/30 text-white flex-1"
                            />
                            <Input
                              placeholder="Giá trị"
                              value={skill.value}
                              onChange={(e) => {
                                const newSkills = [...formData.skills];
                                newSkills[index].value = e.target.value;
                                setFormData({ ...formData, skills: newSkills });
                              }}
                              className="bg-black/30 border-purple-500/30 text-white flex-1"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-purple-500/30">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="border-purple-500/30 text-white hover:bg-purple-500/10"
              >
                Hủy
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleSave}
              >
                {editingEmployee ? "Cập Nhật" : "Thêm Mới"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Position Modal */}
      <Dialog open={showPositionModal} onOpenChange={setShowPositionModal}>
        <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Thêm Chức Vụ Mới
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="position-title" className="text-white">
                Tên Chức Vụ *
              </Label>
              <Input
                id="position-title"
                placeholder="Nhập tên chức vụ"
                value={positionFormData.title}
                onChange={(e) =>
                  setPositionFormData({
                    ...positionFormData,
                    title: e.target.value,
                  })
                }
                className="bg-black/30 border-purple-500/30 text-white"
              />
            </div>

            <div>
              <Label htmlFor="position-level" className="text-white">
                Cấp Bậc
              </Label>
              <Select
                value={positionFormData.level}
                onValueChange={(value) =>
                  setPositionFormData({ ...positionFormData, level: value })
                }
              >
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intern">Thực tập sinh</SelectItem>
                  <SelectItem value="staff">Nhân viên</SelectItem>
                  <SelectItem value="supervisor">Giám sát</SelectItem>
                  <SelectItem value="manager">Quản lý</SelectItem>
                  <SelectItem value="director">Giám đốc</SelectItem>
                  <SelectItem value="executive">Điều hành</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="position-description" className="text-white">
                Mô Tả
              </Label>
              <Textarea
                id="position-description"
                placeholder="Mô tả về chức vụ này..."
                value={positionFormData.description}
                onChange={(e) =>
                  setPositionFormData({
                    ...positionFormData,
                    description: e.target.value,
                  })
                }
                className="bg-black/30 border-purple-500/30 text-white"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is-manager"
                checked={positionFormData.is_manager_position}
                onCheckedChange={(checked) =>
                  setPositionFormData({
                    ...positionFormData,
                    is_manager_position: checked,
                  })
                }
              />
              <Label htmlFor="is-manager" className="text-white text-sm">
                Đây là vị trí quản lý
              </Label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPositionModal(false)}
                className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20"
                disabled={creatingPosition}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSavePosition}
                disabled={creatingPosition}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
              >
                {creatingPosition ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo Chức Vụ
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingEmployee}
        onOpenChange={() => setDeletingEmployee(null)}
      >
        <DialogContent className="bg-black/90 border-red-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Xác Nhận Xóa Nhân Viên
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-white/80">
              Bạn có chắc chắn muốn xóa nhân viên{" "}
              <span className="font-semibold text-red-400">
                {deletingEmployee?.name}
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

export default function EmployeesManagementPage() {
  return (
    <InternalLayout>
      <EmployeesManagementContent />
    </InternalLayout>
  );
}
