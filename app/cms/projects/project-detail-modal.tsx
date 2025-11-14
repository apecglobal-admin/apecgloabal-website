"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Save,
  X,
  Edit,
  Users,
  CheckSquare,
  Target,
  Calendar,
  DollarSign,
  Clock,
  User,
  Plus,
  Loader2,
  MoreVertical,
  Trash2,
  ChevronsUpDown,
  Search,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { inviteEmployeeProject, listProjectById } from "@/src/features/project/projectApi";
import { listCompanies } from "@/src/features/company/companyApi";
import { listEmployee } from "@/src/features/employee/employeeApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useCompanyData } from "@/src/hook/companyHook";
import { useEmployeeData } from "@/src/hook/employeeHook";
import { useProjectData } from "@/src/hook/projectHook";

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number | null;
  editMode?: boolean;
}

export function ProjectDetailModal({
  isOpen,
  onClose,
  projectId,
  editMode = false,
}: ProjectDetailModalProps) {
  const dispatch = useDispatch();
  const { project, statusProject } = useProjectData();
  const { companies } = useCompanyData();
  const { employees } = useEmployeeData();

  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(editMode);

  // New modal states
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [searchMember, setSearchMember] = useState("");

  // Add member form
  const [memberForm, setMemberForm] = useState({
    employee_ids: [] as string[], // Thay đổi từ employee_id thành employee_ids (array)
    role: "",
    join_date: new Date().toISOString().split("T")[0],
  });

  // Add task form
  const [taskForm, setTaskForm] = useState({
    name: "",
    description: "",
    assignee_id: "",
    status: "pending",
    priority: "medium",
    due_date: "",
  });

  // Add milestone form
  const [milestoneForm, setMilestoneForm] = useState({
    name: "",
    description: "",
    due_date: "",
    status: "pending",
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    company_id: "",
    manager_id: "",
    start_date: "",
    end_date: "",
    budget: "",
    status: "planning",
    priority: "medium",
    progress: 0,
    client_name: "",
    client_email: "",
    client_phone: "",
    location: "",
    technologies: "",
    requirements: "",
    deliverables: "",
  });

  const filteredEmployees = employees?.filter((emp: any) =>
    emp.name?.toLowerCase().includes(searchMember.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchMember.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchMember.toLowerCase())
  ) || [];

  useEffect(() => {
    if (isOpen && projectId) {
      dispatch(listProjectById(projectId as any) as any);
      dispatch(listCompanies() as any);
      dispatch(listEmployee() as any);
    }
    setEditing(editMode);
  }, [isOpen, projectId, editMode]);

  const handleSave = async () => {
    if (!formData.name || !formData.company_id) {
      toast.error("Vui lòng nhập tên dự án và chọn công ty");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget) || 0,
          company_id: parseInt(formData.company_id),
          manager_id: formData.manager_id
            ? parseInt(formData.manager_id)
            : null,
          progress: parseInt(formData.progress.toString()),
          technologies: formData.technologies
            ? formData.technologies.split(",").map((t) => t.trim())
            : [],
          deliverables: formData.deliverables
            ? formData.deliverables.split("\n").filter((d) => d.trim())
            : [],
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Cập nhật dự án thành công!");
        setEditing(false);
        dispatch(listProjectById(projectId as any) as any);
      } else {
        toast.error("Lỗi: " + result.error);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setSaving(false);
    }
  };

  // Add member handler
  const handleAddMember = async () => {
    if (memberForm.employee_ids.length === 0 || !memberForm.role) {
      toast.error("Vui lòng chọn nhân viên và vai trò");
      return;
    }
    const payload = {
      id: projectId,
      members: memberForm.employee_ids
    }
    dispatch(inviteEmployeeProject(payload) as any);
    dispatch(listProjectById(projectId as any) as any);
    console.log("Adding members:", memberForm);
  };

  // Add task handler
  const handleAddTask = async () => {
    if (!taskForm.name) {
      toast.error("Vui lòng nhập tên công việc");
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskForm),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Thêm công việc thành công!");
        setShowAddTaskModal(false);
        setTaskForm({
          name: "",
          description: "",
          assignee_id: "",
          status: "pending",
          priority: "medium",
          due_date: "",
        });
        dispatch(listProjectById(projectId as any) as any);
      } else {
        toast.error("Có lỗi xảy ra khi thêm công việc");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Có lỗi xảy ra khi thêm công việc");
    }
  };

  // Add milestone handler
  const handleAddMilestone = async () => {
    if (!milestoneForm.name || !milestoneForm.due_date) {
      toast.error("Vui lòng nhập tên cột mốc và hạn chót");
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(milestoneForm),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Thêm cột mốc thành công!");
        setShowAddMilestoneModal(false);
        setMilestoneForm({
          name: "",
          description: "",
          due_date: "",
          status: "pending",
        });
        dispatch(listProjectById(projectId as any) as any);
      } else {
        toast.error("Có lỗi xảy ra khi thêm cột mốc");
      }
    } catch (error) {
      console.error("Error adding milestone:", error);
      toast.error("Có lỗi xảy ra khi thêm cột mốc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600/20 text-green-400 border-green-500/30";
      case "in_progress":
        return "bg-blue-600/20 text-blue-400 border-blue-500/30";
      case "on_hold":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-600/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "planning":
        return "Lên kế hoạch";
      case "in_progress":
        return "Đang thực hiện";
      case "on_hold":
        return "Tạm dừng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const isEmployeeAlreadyMember = (employeeId: number) => {
    return project?.members?.some((member: any) => 
      member.employee_id === employeeId || member.id === employeeId
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              {project?.name || "Chi Tiết Dự Án"}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {!editing ? (
                <Button
                  onClick={() => setEditing(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh Sửa
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setEditing(false)}
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
                    Lưu
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {!project ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Đang tải...</span>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/50">
              <TabsTrigger value="overview" className="text-white">
                Tổng Quan
              </TabsTrigger>
              <TabsTrigger value="team" className="text-white">
                Đội Ngũ
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-white">
                Công Việc
              </TabsTrigger>
              <TabsTrigger value="milestones" className="text-white">
                Cột Mốc
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Info */}
                <Card className="bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Thông Tin Cơ Bản
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing ? (
                      <>
                        <div>
                          <Label className="text-white">Tên dự án</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Mô tả</Label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            className="bg-black/30 border-purple-500/30 text-white"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Công ty</Label>
                            <Select
                              value={formData.company_id}
                              onValueChange={(value) =>
                                setFormData({ ...formData, company_id: value })
                              }
                            >
                              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {companies && Array.isArray(companies)
                                  ? companies.map((company) => (
                                      <SelectItem
                                        key={company.id}
                                        value={company.id.toString()}
                                      >
                                        {company.name}
                                      </SelectItem>
                                    ))
                                  : []}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-white">Quản lý</Label>
                            <Select
                              value={formData.manager_id}
                              onValueChange={(value) =>
                                setFormData({ ...formData, manager_id: value })
                              }
                            >
                              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                                <SelectValue placeholder="Chọn quản lý" />
                              </SelectTrigger>
                              <SelectContent>
                                {employees && Array.isArray(employees)
                                  ? employees
                                      .filter((emp) => {
                                        if (
                                          emp?.company_id == null ||
                                          formData.company_id == null
                                        )
                                          return false;
                                        return (
                                          emp.company_id.toString() ===
                                          formData.company_id.toString()
                                        );
                                      })
                                      .map((employee) => (
                                        <SelectItem
                                          key={employee.id}
                                          value={employee.id.toString()}
                                        >
                                          {employee.name}
                                        </SelectItem>
                                      ))
                                  : []}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-white/60 text-sm">Công ty</p>
                          <p className="text-white font-medium">
                            {project?.company_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Quản lý dự án</p>
                          <p className="text-white">
                            {project?.manager_name || "Chưa phân công"}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Mô tả</p>
                          <p className="text-white">
                            {project?.description || "Chưa có mô tả"}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Trạng thái</p>
                          <Badge className={getStatusColor(project?.status)}>
                            {getStatusText(project?.status)}
                          </Badge>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Project Stats */}
                <Card className="bg-black/50 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Thống Kê</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {project?.progress || 0}%
                        </div>
                        <p className="text-white/60 text-sm">Tiến độ</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {project?.members?.length || 0}
                        </div>
                        <p className="text-white/60 text-sm">Thành viên</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">
                          {project?.tasks?.length || 0}
                        </div>
                        <p className="text-white/60 text-sm">Công việc</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {project?.milestones?.length || 0}
                        </div>
                        <p className="text-white/60 text-sm">Cột mốc</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card className="bg-black/50 border-blue-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Đội Ngũ Dự Án
                    </CardTitle>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowAddMemberModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Thành Viên
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-purple-500/30">
                        <TableHead className="text-white">Tên</TableHead>
                        <TableHead className="text-white">Vai trò</TableHead>
                        <TableHead className="text-white">Email</TableHead>
                        <TableHead className="text-white">
                          Ngày tham gia
                        </TableHead>
                        <TableHead className="text-white w-16">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project?.members?.map((member: any) => (
                        <TableRow
                          key={member.id}
                          className="border-b border-purple-500/20"
                        >
                          <TableCell className="text-white">
                            {member.name}
                          </TableCell>
                          <TableCell className="text-white">
                            {member.role}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {member.email}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {new Date(member.join_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Bạn có chắc muốn xóa thành viên này?"
                                  )
                                ) {
                                  // Handle delete member
                                  console.log("Delete member:", member.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-white/60 py-8"
                          >
                            Chưa có thành viên nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <Card className="bg-black/50 border-green-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <CheckSquare className="h-5 w-5 mr-2" />
                      Công Việc
                    </CardTitle>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setShowAddTaskModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Công Việc
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-purple-500/30">
                        <TableHead className="text-white">
                          Tên công việc
                        </TableHead>
                        <TableHead className="text-white">
                          Người thực hiện
                        </TableHead>
                        <TableHead className="text-white">Trạng thái</TableHead>
                        <TableHead className="text-white">Hạn chót</TableHead>
                        <TableHead className="text-white w-16">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project?.tasks?.map((task: any) => (
                        <TableRow
                          key={task.id}
                          className="border-b border-purple-500/20"
                        >
                          <TableCell className="text-white">
                            {task.name}
                          </TableCell>
                          <TableCell className="text-white">
                            {task.assignee_name || "Chưa phân công"}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(task.status)}>
                              {getStatusText(task.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/80">
                            {task.due_date
                              ? new Date(task.due_date).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "Chưa có"}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              onClick={() => {
                                if (
                                  confirm("Bạn có chắc muốn xóa công việc này?")
                                ) {
                                  console.log("Delete task:", task.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-white/60 py-8"
                          >
                            Chưa có công việc nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-6">
              <Card className="bg-black/50 border-orange-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Cột Mốc Dự Án
                    </CardTitle>
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => setShowAddMilestoneModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Cột Mốc
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-purple-500/30">
                        <TableHead className="text-white">
                          Tên cột mốc
                        </TableHead>
                        <TableHead className="text-white">Mô tả</TableHead>
                        <TableHead className="text-white">Hạn chót</TableHead>
                        <TableHead className="text-white">Trạng thái</TableHead>
                        <TableHead className="text-white w-16">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project?.milestones?.map((milestone: any) => (
                        <TableRow
                          key={milestone.id}
                          className="border-b border-purple-500/20"
                        >
                          <TableCell className="text-white">
                            {milestone.name}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {milestone.description}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {new Date(milestone.due_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(milestone.status)}>
                              {getStatusText(milestone.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              onClick={() => {
                                if (
                                  confirm("Bạn có chắc muốn xóa cột mốc này?")
                                ) {
                                  console.log(
                                    "Delete milestone:",
                                    milestone.id
                                  );
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-white/60 py-8"
                          >
                            Chưa có cột mốc nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>

      {/* Add Member Modal */}
      <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
        <DialogContent className="bg-black/95 border-blue-500/30 text-white max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center text-white text-xl">
              <Users className="h-6 w-6 mr-2 text-blue-400" />
              Thêm Thành Viên Dự Án
            </DialogTitle>
            <p className="text-white/60 text-sm mt-1">
              Đã chọn {memberForm.employee_ids.length} nhân viên
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm nhân viên theo tên, email, phòng ban..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="pl-10 bg-black/30 border-blue-500/30 text-white placeholder:text-white/50"
              />
            </div>

            {/* Selected Members Display */}
            {memberForm.employee_ids.length > 0 && (
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Đã chọn ({memberForm.employee_ids.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {memberForm.employee_ids.map((empId) => {
                    const emp = employees?.find(
                      (e: any) => e.id.toString() === empId
                    );
                    return (
                      <Badge
                        key={empId}
                        className="bg-blue-600/30 text-blue-300 border-blue-500/50 pr-1"
                      >
                        {emp?.name}
                        <button
                          onClick={() => {
                            setMemberForm((prev) => ({
                              ...prev,
                              employee_ids: prev.employee_ids.filter(
                                (id) => id !== empId
                              ),
                            }));
                          }}
                          className="ml-2 hover:bg-red-500/30 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Employee List */}
            <div className="space-y-2">
              <h4 className="text-white/70 text-sm font-medium">
                Danh sách nhân viên ({filteredEmployees.length})
              </h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {filteredEmployees.length === 0 ? (
                  <p className="text-white/40 text-center py-8">
                    Không tìm thấy nhân viên nào
                  </p>
                ) : (
                  filteredEmployees.map((employee: any) => {
                    const isSelected = memberForm.employee_ids.includes(
                      employee.id.toString()
                    );
                    const isAlreadyMember = isEmployeeAlreadyMember(employee.id);

                    return (
                      <div
                        key={employee.id}
                        onClick={() => {
                          if (!isAlreadyMember) {
                            const empId = employee.id.toString();
                            setMemberForm((prev) => ({
                              ...prev,
                              employee_ids: prev.employee_ids.includes(empId)
                                ? prev.employee_ids.filter((id) => id !== empId)
                                : [...prev.employee_ids, empId],
                            }));
                          }
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          isAlreadyMember
                            ? "bg-green-600/20 border-2 border-green-500/50 cursor-not-allowed"
                            : isSelected
                            ? "bg-blue-600/30 border-2 border-blue-500 cursor-pointer hover:bg-blue-600/40"
                            : "bg-black/30 border-2 border-transparent cursor-pointer hover:border-blue-500/30 hover:bg-black/50"
                        }`}
                      >
                        {/* Checkbox với tích xanh */}
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            isAlreadyMember
                              ? "bg-green-500 border-green-400"
                              : isSelected
                              ? "bg-blue-500 border-blue-400"
                              : "border-white/30"
                          }`}
                        >
                          {(isSelected || isAlreadyMember) && (
                            <Check className="h-4 w-4 text-white" strokeWidth={3} />
                          )}
                        </div>

                        {/* Employee Avatar/Icon */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {employee.name?.charAt(0).toUpperCase()}
                        </div>

                        {/* Employee Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium ${
                              isAlreadyMember ? "text-green-300" : "text-white"
                            }`}>
                              {employee.name}
                            </h4>
                            {isAlreadyMember && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                                ✓ Đã là thành viên
                              </Badge>
                            )}
                            {isSelected && !isAlreadyMember && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
                                Đã chọn
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm truncate ${
                            isAlreadyMember ? "text-green-400/70" : "text-white/60"
                          }`}>
                            {employee.email}
                          </p>
                        </div>

                        {/* Department Badge */}
                        {employee.department && (
                          <div className="flex-shrink-0">
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                              {employee.department}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Role Input */}
            <div>
              <Label className="text-white">Vai trò trong dự án *</Label>
              <Input
                value={memberForm.role}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, role: e.target.value })
                }
                placeholder="VD: Frontend Developer, Project Manager, Tester..."
                className="bg-black/30 border-blue-500/30 text-white"
              />
            </div>

            {/* Join Date */}
            <div>
              <Label className="text-white">Ngày tham gia</Label>
              <Input
                type="date"
                value={memberForm.join_date}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, join_date: e.target.value })
                }
                className="bg-black/30 border-blue-500/30 text-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-blue-500/30">
            <div className="text-sm text-white/60">
              {filteredEmployees.filter((e: any) => isEmployeeAlreadyMember(e.id)).length} nhân viên đã là thành viên
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddMemberModal(false);
                  setMemberForm({
                    employee_ids: [],
                    role: "",
                    join_date: new Date().toISOString().split("T")[0],
                  });
                  setSearchMember("");
                }}
                className="bg-gray-500/20 border-gray-500/50 text-gray-300 hover:bg-gray-500/30"
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddMember}
                disabled={memberForm.employee_ids.length === 0 || !memberForm.role}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm {memberForm.employee_ids.length > 0 ? `(${memberForm.employee_ids.length})` : ""} Thành Viên
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Add Task Modal */}
      <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
        <DialogContent className="bg-black/90 border-green-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center text-white">
              <CheckSquare className="h-5 w-5 mr-2 text-green-400" />
              Thêm Công Việc
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Tên công việc *</Label>
              <Input
                value={taskForm.name}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, name: e.target.value })
                }
                placeholder="Nhập tên công việc"
                className="bg-black/30 border-green-500/30 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Mô tả</Label>
              <Textarea
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e.target.value })
                }
                placeholder="Mô tả chi tiết công việc"
                className="bg-black/30 border-green-500/30 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Người thực hiện</Label>
                <Select
                  value={taskForm.assignee_id}
                  onValueChange={(value) =>
                    setTaskForm({ ...taskForm, assignee_id: value })
                  }
                >
                  <SelectTrigger className="bg-black/30 border-green-500/30 text-white">
                    <SelectValue placeholder="Chọn người thực hiện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Chưa phân công</SelectItem>
                    {project?.team_members?.map((member: any) => (
                      <SelectItem
                        key={member.employee_id}
                        value={member.employee_id.toString()}
                      >
                        {member.employee_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Ưu tiên</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value) =>
                    setTaskForm({ ...taskForm, priority: value })
                  }
                >
                  <SelectTrigger className="bg-black/30 border-green-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white">Hạn chót</Label>
              <Input
                type="date"
                value={taskForm.due_date}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, due_date: e.target.value })
                }
                className="bg-black/30 border-green-500/30 text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddTaskModal(false)}
                className="bg-gray-500/20 border-gray-500/50 text-gray-300"
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddTask}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm Công Việc
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Milestone Modal */}
      <Dialog
        open={showAddMilestoneModal}
        onOpenChange={setShowAddMilestoneModal}
      >
        <DialogContent className="bg-black/90 border-orange-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center text-white">
              <Target className="h-5 w-5 mr-2 text-orange-400" />
              Thêm Cột Mốc
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Tên cột mốc *</Label>
              <Input
                value={milestoneForm.name}
                onChange={(e) =>
                  setMilestoneForm({ ...milestoneForm, name: e.target.value })
                }
                placeholder="VD: Hoàn thành giai đoạn 1, Beta release..."
                className="bg-black/30 border-orange-500/30 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Mô tả</Label>
              <Textarea
                value={milestoneForm.description}
                onChange={(e) =>
                  setMilestoneForm({
                    ...milestoneForm,
                    description: e.target.value,
                  })
                }
                placeholder="Mô tả chi tiết cột mốc"
                className="bg-black/30 border-orange-500/30 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Hạn chót *</Label>
              <Input
                type="date"
                value={milestoneForm.due_date}
                onChange={(e) =>
                  setMilestoneForm({
                    ...milestoneForm,
                    due_date: e.target.value,
                  })
                }
                className="bg-black/30 border-orange-500/30 text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddMilestoneModal(false)}
                className="bg-gray-500/20 border-gray-500/50 text-gray-300"
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddMilestone}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm Cột Mốc
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
