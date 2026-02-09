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
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  createIssues,
  deleteIssues,
  inviteEmployeeProject,
  listIssues,
  listProjectById,
} from "@/src/features/project/projectApi";
import { listCompanies } from "@/src/features/company/companyApi";
import { useCompanyData } from "@/src/hook/companyHook";
import { useEmployeeData } from "@/src/hook/employeeHook";
import { useProjectData } from "@/src/hook/projectHook";
import Pagination from "@/components/pagination";
import ProjectDetails from "./tabs/overview";
import { Checkbox } from "@/components/ui";
import { ProjectCreateUpdateModal } from "../project-create-modal";

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
  const { project} = useProjectData();
  const { companies , totalCompany} = useCompanyData();

  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(editMode);

  // Modal states
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);

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

  useEffect(() => {
    if (isOpen && projectId) {
      dispatch(listProjectById(projectId as any) as any);
      dispatch(listCompanies({limit: totalCompany, page: 1} as any) as any);
    }
    setEditing(editMode);
  }, [isOpen, projectId, editMode]);

  // useEffect để fill data vào form khi project thay đổi
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        company_id: project.company_id?.toString() || "",
        manager_id: project.manager_id?.toString() || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        budget: project.budget?.toString() || "",
        status: project.status || "planning",
        priority: project.priority || "medium",
        progress: project.progress || 0,
        client_name: project.client_name || "",
        client_email: project.client_email || "",
        client_phone: project.client_phone || "",
        location: project.location || "",
        technologies: Array.isArray(project.technologies)
          ? project.technologies.join(", ")
          : project.technologies || "",
        requirements: project.requirements || "",
        deliverables: Array.isArray(project.deliverables)
          ? project.deliverables.join("\n")
          : project.deliverables || "",
      });
    }
  }, [project]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden w-[95vw] sm:w-full p-3 sm:p-6">
          <DialogHeader className="overflow-x-hidden">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg sm:text-2xl font-bold text-white">
                {project?.name || "Chi Tiết Dự Án"}
              </DialogTitle>
            </div>
          </DialogHeader>

          {!project ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <span className="ml-2 text-white">Đang tải...</span>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 h-auto lg:h-[calc(90vh-120px)] overflow-x-hidden">
              <Tabs
                defaultValue="overview"
                className="flex flex-col lg:flex-row gap-3 sm:gap-4 w-full overflow-x-hidden"
                orientation="vertical"
              >
                <TabsList className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible h-fit bg-black/50 p-1.5 sm:p-2 gap-1.5 sm:gap-2 w-full lg:w-48 shrink-0 no-scrollbar">
                  <TabsTrigger
                    value="overview"
                    className="whitespace-nowrap lg:w-full lg:justify-start text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 shrink-0"
                  >
                    Tổng Quan
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    className="whitespace-nowrap lg:w-full lg:justify-start text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 shrink-0"
                  >
                    Đội Ngũ
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    className="whitespace-nowrap lg:w-full lg:justify-start text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 shrink-0"
                  >
                    Công Việc
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto overflow-x-hidden lg:pr-2">
                  <TabsContent value="overview" className="space-y-6">
                    <ProjectDetails
                      project={project}
                      companies={companies}
                      setShowEditProjectModal={setShowEditProjectModal}
                      getStatusColor={getStatusColor}
                      getStatusText={getStatusText}
                      formatCurrency={formatCurrency}
                    />
                  </TabsContent>

                  <TabsContent value="team" className="space-y-6">
                    <Card className="bg-black/50 border-blue-500/30">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Đội Ngũ Dự Án ({project?.members?.length || 0} thành viên)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b border-purple-500/30">
                              <TableHead className="text-white">ID</TableHead>
                              <TableHead className="text-white">Tên</TableHead>
                              <TableHead className="text-white">
                                Email
                              </TableHead>
                              <TableHead className="text-white">
                                Số điện thoại
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {project?.members && project.members.length > 0 ? (
                              project.members.map((member: any) => (
                                <TableRow
                                  key={member.id}
                                  className="border-b border-purple-500/20 hover:bg-white/5 transition-colors"
                                >
                                  <TableCell className="text-white/80 font-mono">
                                    #{member.id}
                                  </TableCell>
                                  <TableCell className="text-white font-medium">
                                    {member.name}
                                  </TableCell>
                                  <TableCell className="text-white/80">
                                    {member.email}
                                  </TableCell>
                                  <TableCell className="text-white/80">
                                    {member.phone || "N/A"}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={4}
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
                                Mô tả
                              </TableHead>
                              <TableHead className="text-white">
                                Tiến độ
                              </TableHead>
                              <TableHead className="text-white">
                                Ngày bắt đầu
                              </TableHead>
                              <TableHead className="text-white">
                                Ngày kết thúc
                              </TableHead>
                              <TableHead className="text-white">
                                Trạng thái
                              </TableHead>
                              <TableHead className="text-white">
                                Ưu tiên
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {project?.tasks && project.tasks.length > 0 ? (
                              project.tasks.map((task: any) => (
                                <TableRow
                                  key={task.id}
                                  className="border-b border-purple-500/20"
                                >
                                  <TableCell className="text-white font-medium">
                                    {task.name}
                                  </TableCell>
                                  <TableCell className="text-white/80">
                                    {task.description || "Không có mô tả"}
                                  </TableCell>
                                  <TableCell className="text-white">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[100px]">
                                        <div
                                          className="bg-green-500 h-2 rounded-full"
                                          style={{ width: `${task.process}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-white/60">
                                        {task.process}%
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-white/80">
                                    {task.date_start
                                      ? new Date(
                                          task.date_start
                                        ).toLocaleDateString("vi-VN")
                                      : "N/A"}
                                  </TableCell>
                                  <TableCell className="text-white/80">
                                    {task.date_end
                                      ? new Date(
                                          task.date_end
                                        ).toLocaleDateString("vi-VN")
                                      : "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                                      {typeof task.task_status === 'object' 
                                        ? task.task_status?.name || "N/A"
                                        : task.task_status || "N/A"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={
                                        task.priority?.id === 1
                                          ? "bg-red-600/20 text-red-400 border-red-500/30"
                                          : task.priority?.id === 2
                                          ? "bg-orange-600/20 text-orange-400 border-orange-500/30"
                                          : task.priority?.id === 3
                                          ? "bg-yellow-600/20 text-yellow-400 border-yellow-500/30"
                                          : "bg-gray-600/20 text-gray-400 border-gray-500/30"
                                      }
                                    >
                                      {typeof task.priority === 'object'
                                        ? task.priority?.name || "N/A"
                                        : task.priority || "N/A"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={7}
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
                </div>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal - Only appears from Overview tab */}
      {showEditProjectModal && (
        <ProjectCreateUpdateModal
          isOpen={showEditProjectModal}
          onClose={() => {
            setShowEditProjectModal(false);
          }}
          onSuccess={() => {
            dispatch(listProjectById(projectId as any) as any);
            setShowEditProjectModal(false);
            toast.success("Cập nhật dự án thành công!");
          }}
          projectId={projectId as any}
        />
      )}


    </>
  );
}