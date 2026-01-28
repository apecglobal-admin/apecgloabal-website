"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Save,
  X,
  Loader2,
  Building2,
  User,
  Users,
  Upload,
  FileText,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useEmployeeData } from "@/src/hook/employeeHook";
import { useDispatch } from "react-redux";
import { useCompanyData } from "@/src/hook/companyHook";
import { listEmployee, listManager } from "@/src/features/employee/employeeApi";
import { listCompanies } from "@/src/features/company/companyApi";
import { useDepartmentData } from "@/src/hook/departmentHook";
import { listDepartment } from "@/src/features/department/departmentApi";
import { useProjectData } from "@/src/hook/projectHook";
import {
  createProject,
  updateProject,
  listStatusProject,
  listProjectById,
} from "@/src/features/project/projectApi";

// Helper function to format date from ISO to YYYY-MM-DD
const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};

interface Company {
  id: number;
  name: string;
  logo_url: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  company_id: number;
}

interface Department {
  id: number;
  name: string;
  company_id: number;
}

interface ProjectStatus {
  id: number;
  name: string;
}

interface Project {
  id?: number;
  name: string;
  description: string;
  manager_id: number | null;
  progress: number;
  budget: number;
  spent: number;
  start_date: string;
  end_date: string;
  team_size: number;
  project_status_id: number;
  company_id: number;
  departments: number[];
  employees: number[];
  status?: string;
  priority?: string;
  technologies?: string | null;
  client_name?: string | null;
  client_contact?: string | null;
  is_featured?: boolean;
  image_url?: string | null;
  slug?: string | null;
  gallery?: any;
  features?: string | null;
  challenges?: string | null;
  solutions?: string | null;
  results?: string | null;
  testimonials?: any;
  display_order?: number;
  progress_state?: string | null;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId?: Project | null;
}

export function ProjectCreateUpdateModal({
  isOpen,
  onClose,
  onSuccess,
  projectId = null,
}: ProjectModalProps) {
  const dispatch = useDispatch();
  const { employees, totalEmployees, managers } = useEmployeeData();
  const { companies, totalCompany } = useCompanyData();
  const { departments, totalDepartment } = useDepartmentData();
  const { statusProject } = useProjectData();
  const { project } = useProjectData();

  const [saving, setSaving] = useState(false);

  const isEditMode = !!project?.id;

  const [formData, setFormData] = useState<Project>({
    name: "",
    description: "",
    manager_id: null,
    progress: 0,
    budget: 0,
    spent: 0,
    start_date: "",
    end_date: "",
    team_size: 0,
    project_status_id: 1,
    company_id: 0,
    departments: [],
    employees: [],
    status: "planning",
    priority: "medium",
    technologies: null,
    client_name: null,
    client_contact: null,
    is_featured: false,
    image_url: null,
    slug: null,
    gallery: null,
    features: null,
    challenges: null,
    solutions: null,
    results: null,
    testimonials: null,
    display_order: 0,
    progress_state: null,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
  const [deletedDocumentIds, setDeletedDocumentIds] = useState<number[]>([]);

  useEffect(() => {
    if (projectId) {
      dispatch(listProjectById(projectId as any) as any);
    } else {
      // Clear project data when creating new
      setFormData({
        name: "",
        description: "",
        manager_id: null,
        progress: 0,
        budget: 0,
        spent: 0,
        start_date: "",
        end_date: "",
        team_size: 0,
        project_status_id: 1,
        company_id: 0,
        departments: [],
        employees: [],
        status: "planning",
        priority: "medium",
        technologies: null,
        client_name: null,
        client_contact: null,
        is_featured: false,
        image_url: null,
        slug: null,
        gallery: null,
        features: null,
        challenges: null,
        solutions: null,
        results: null,
        testimonials: null,
        display_order: 0,
        progress_state: null,
      });
      setExistingDocuments([]);
      setSelectedFiles([]);
      setDeletedDocumentIds([]);
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (isOpen) {
      dispatch(listEmployee({ limit: totalEmployees, page: 1 } as any) as any);
      dispatch(listManager() as any);
      dispatch(listCompanies({ limit: totalCompany, page: 1 } as any) as any);
      dispatch(
        listDepartment({ limit: totalDepartment, page: 1 } as any) as any
      );
      dispatch(listStatusProject() as any);
    }
  }, [isOpen, dispatch, totalEmployees, totalCompany, totalDepartment]);

  // Load project data khi edit
  useEffect(() => {
    if (isOpen && projectId && project) {
      setFormData({
        ...project,
        // Format dates for input fields
        start_date: formatDateForInput(project.start_date),
        end_date: formatDateForInput(project.end_date),
        departments: project.departments
          ? project.departments.map((dept: any) => dept.id || dept)
          : [],
        employees: project.members
          ? project.members.map((emp: any) => emp.id || emp)
          : [],
      });

      // Load existing documents
      if (project.documents && Array.isArray(project.documents)) {
        setExistingDocuments(project.documents);
      }
    } else if (isOpen && !projectId) {
      // Đảm bảo reset form khi tạo mới
      resetForm();
      setExistingDocuments([]);
    }
  }, [isOpen, projectId, project]);

  const handleSave = async () => {
    if (!formData.name || !formData.company_id) {
      toast.error("Vui lòng nhập tên dự án và chọn công ty");
      return;
    }

    if (!formData.project_status_id) {
      toast.error("Vui lòng chọn trạng thái dự án");
      return;
    }

    try {
      setSaving(true);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append(
        "manager_id",
        formData.manager_id?.toString() || ""
      );
      formDataToSend.append("progress", formData.progress?.toString() || "0");
      formDataToSend.append("budget", formData.budget?.toString() || "0");
      formDataToSend.append("spent", formData.spent?.toString() || "0");
      formDataToSend.append("start_date", formData.start_date || "");
      formDataToSend.append("end_date", formData.end_date || "");
      formDataToSend.append("team_size", formData.team_size?.toString() || "0");
      formDataToSend.append(
        "project_status_id",
        formData.project_status_id?.toString() || ""
      );
      formDataToSend.append(
        "company_id",
        formData.company_id?.toString() || ""
      );

      if (Array.isArray(formData.departments)) {
        formDataToSend.append(
          "departments",
          JSON.stringify(formData.departments)
        );
      }
      if (Array.isArray(formData.employees)) {
        formDataToSend.append("employees", JSON.stringify(formData.employees));
      }

      // Append multiple files
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file: File) => {
          formDataToSend.append("documents", file);
        });
      }

      // Append deleted document IDs
      if (deletedDocumentIds.length > 0) {
        formDataToSend.append(
          "deleted_documents",
          JSON.stringify(deletedDocumentIds)
        );
      }

      // Debug: kiểm tra tất cả các key-value
      formDataToSend.forEach((value, key) => {
        console.log(key, value);
      });

      let res;
      if (isEditMode && project?.id) {
        // Update mode
        res = await dispatch(
          updateProject({ id: project.id, data: formDataToSend } as any) as any
        );
      } else {
        // Create mode
        res = await dispatch(createProject(formDataToSend as any) as any);
      }

      console.log("res", res);
      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(
          res.payload.data.message ||
            (isEditMode
              ? "Cập nhật dự án thành công!"
              : "Tạo dự án thành công!")
        );
        onSuccess();
        handleClose();
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      manager_id: null,
      progress: 0,
      budget: 0,
      spent: 0,
      start_date: "",
      end_date: "",
      team_size: 0,
      project_status_id: 1,
      company_id: 0,
      departments: [],
      employees: [],
      status: "planning",
      priority: "medium",
      technologies: null,
      client_name: null,
      client_contact: null,
      is_featured: false,
      image_url: null,
      slug: null,
      gallery: null,
      features: null,
      challenges: null,
      solutions: null,
      results: null,
      testimonials: null,
      display_order: 0,
      progress_state: null,
    });
    setSelectedFiles([]);
    setDeletedDocumentIds([]);
  };

  const handleClose = () => {
    if (!isEditMode) {
      resetForm();
    }
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      toast.success(`Đã chọn ${newFiles.length} file`);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("Đã xóa file");
  };

  const removeExistingDocument = (docId: number) => {
    setDeletedDocumentIds((prev) => [...prev, docId]);
    setExistingDocuments((prev) => prev.filter((doc) => doc.id !== docId));
    toast.success("Đã đánh dấu xóa tài liệu");
  };

  const toggleDepartment = (deptId: number) => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.includes(deptId)
        ? prev.departments.filter((id) => id !== deptId)
        : [...prev.departments, deptId],
    }));
  };

  const toggleEmployee = (empId: number) => {
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.includes(empId)
        ? prev.employees.filter((id) => id !== empId)
        : [...prev.employees, empId],
    }));
  };

  const handleDepartmentChange = (values: string[]) => {
    setFormData((prev) => ({
      ...prev,
      departments: values.map((v) => parseInt(v)),
    }));
  };

  const handleEmployeeChange = (values: string[]) => {
    setFormData((prev) => ({
      ...prev,
      employees: values.map((v) => parseInt(v)),
    }));
  };

  // Hiển thị tất cả departments và employees (không filter theo company)
  const filteredDepartments = departments || [];
  const filteredEmployees = employees || [];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              {isEditMode ? "Cập Nhật Dự Án" : "Tạo Dự Án Mới"}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleClose}
                size="sm"
                variant="outline"
                className="bg-transparent border-gray-500/50 text-white hover:bg-gray-500/20"
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditMode ? "Cập Nhật" : "Tạo Mới"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Tên dự án *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-black/30 border-purple-500/30 text-white"
                  placeholder="Nhập tên dự án"
                />
              </div>

              <div>
                <Label className="text-white">Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-black/30 border-purple-500/30 text-white"
                  rows={3}
                  placeholder="Mô tả chi tiết về dự án"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Công ty *</Label>
                  <Select
                    value={formData.company_id.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        company_id: parseInt(value),
                        manager_id: null,
                      })
                    }
                  >
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white w-full">
                      <SelectValue placeholder="Chọn công ty" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies && Array.isArray(companies)
                        ? companies.map((company) => (
                            <SelectItem
                              key={company.id}
                              value={company.id.toString()}
                            >
                              <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4" />
                                <span>{company.name}</span>
                              </div>
                            </SelectItem>
                          ))
                        : []}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Quản lý dự án</Label>
                  <Select
                    value={formData.manager_id?.toString() || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        manager_id: value ? parseInt(value) : null,
                      })
                    }
                  >
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white w-full">
                      <SelectValue placeholder="Chọn quản lý" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers && Array.isArray(managers)
                        ? managers.map((manager) => (
                            <SelectItem
                              key={manager.id}
                              value={manager.id.toString()}
                            >
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>{manager.name}</span>
                              </div>
                            </SelectItem>
                          ))
                        : []}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Ngày bắt đầu</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white [color-scheme:dark] pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                    <Calendar className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Ngày kết thúc</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="bg-black/30 border-purple-500/30 text-white [color-scheme:dark] pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                    <Calendar className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Trạng thái *</Label>
                  <Select
                    value={formData.project_status_id.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        project_status_id: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white w-full">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusProject && Array.isArray(statusProject)
                        ? statusProject.map((status) => (
                            <SelectItem
                              key={status.id}
                              value={status.id.toString()}
                            >
                              {status.name}
                            </SelectItem>
                          ))
                        : []}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Tiến độ (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        progress: parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-black/30 border-purple-500/30 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Ngân sách (VND)</Label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        budget: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label className="text-white">Đã chi (VND)</Label>
                  <Input
                    type="number"
                    value={formData.spent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        spent: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label className="text-white">Quy mô team</Label>
                  <Input
                    type="number"
                    value={formData.team_size}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        team_size: parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Departments & Employees */}
          <Card className="bg-black/50 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">
                Phòng ban & Nhân viên
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white mb-2 block">
                  Phòng ban tham gia ({formData.departments.length})
                </Label>
                <div className="bg-black/30 border border-purple-500/30 rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                  {!formData.company_id ? (
                    <p className="text-gray-400 text-sm">
                      Vui lòng chọn công ty trước
                    </p>
                  ) : filteredDepartments.length === 0 ? (
                    <p className="text-gray-400 text-sm">Không có phòng ban</p>
                  ) : (
                    filteredDepartments.map((dept: any) => (
                      <label
                        key={dept.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-purple-500/10 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={formData.departments.includes(dept.id)}
                          onChange={() => toggleDepartment(dept.id)}
                          className="w-4 h-4"
                        />
                        <Building2 className="h-4 w-4 text-purple-400" />
                        <span className="text-white text-sm">{dept.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">
                  Nhân viên tham gia ({formData.employees.length})
                </Label>
                <div className="bg-black/30 border border-purple-500/30 rounded-md p-3 max-h-64 overflow-y-auto space-y-2">
                  {filteredEmployees.length === 0 ? (
                    <p className="text-gray-400 text-sm">Không có nhân viên</p>
                  ) : (
                    filteredEmployees.map((emp: any) => (
                      <label
                        key={emp.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500/10 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={formData.employees.includes(emp.id)}
                          onChange={() => toggleEmployee(emp.id)}
                          className="w-4 h-4"
                        />
                        <User className="h-4 w-4 text-blue-400" />
                        <div className="flex-1">
                          <span className="text-white text-sm block">
                            {emp.name}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {emp.email}
                          </span>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">
                  Tài liệu đính kèm
                </Label>

                {/* Existing Documents */}
                {existingDocuments.length > 0 && (
                  <div className="mb-3 space-y-2">
                    <p className="text-xs text-gray-400">
                      Tài liệu hiện có ({existingDocuments.length}):
                    </p>
                    {existingDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between bg-blue-500/10 p-3 rounded-md border border-blue-500/30"
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-blue-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {doc.name}
                            </p>
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-xs underline"
                            >
                              Xem tài liệu
                            </a>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeExistingDocument(doc.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="mb-3 space-y-2">
                    <p className="text-xs text-purple-400">
                      File mới sẽ upload ({selectedFiles.length}):
                    </p>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-purple-500/10 p-3 rounded-md border border-purple-500/30"
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-purple-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {file.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSelectedFile(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload New Document */}
                <div className="bg-black/30 border-2 border-dashed border-purple-500/30 rounded-md p-4 hover:border-purple-500/50 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                    multiple
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <Upload className="h-10 w-10 text-purple-400" />
                    <div className="text-center">
                      <p className="text-white text-sm font-medium">
                        {selectedFiles.length > 0 ||
                        existingDocuments.length > 0
                          ? "Thêm tài liệu"
                          : "Nhấn để chọn file"}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        PDF, DOC, XLS, TXT, hoặc hình ảnh (có thể chọn nhiều
                        file)
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}