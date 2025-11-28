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
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  Search,
  Loader2,
  Trash2,
  FileText,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Eye,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useApplicationData } from "@/src/hook/applicationHook";
import {
  listApplications,
  listApplicationStatus,
  reviewApplication,
  
} from "@/src/features/application/applicationApi";
import Pagination from "@/components/pagination";

interface ApplicationStatus {
  id: number;
  name: string;
}

interface ApplicationJob {
  id: number;
  title: string;
}

interface Application {
  id: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  introduction: string;
  resume_url: string;
  created_at: string;
  jobs: ApplicationJob;
  status: ApplicationStatus;
}

export default function ApplicationManagementPage() {
  const dispatch = useDispatch();
  const { applications, totalApplication, applicationStatus } =
    useApplicationData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedJob, setSelectedJob] = useState("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [reviewingApplication, setReviewingApplication] =
    useState<Application | null>(null);
  const [viewingApplication, setViewingApplication] =
    useState<Application | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState("");

  // Bulk delete states
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(listApplications({limit: itemsPerPage, page: currentPage} as any) as any);
    dispatch(listApplicationStatus() as any);
  }, [dispatch, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds([]);
  };

  const handleReview = (application: Application) => {
    setReviewingApplication(application);
    setSelectedNewStatus(application.status.id.toString());
    setShowReviewModal(true);
  };

  const handleViewDetail = (application: Application) => {
    setViewingApplication(application);
    setShowDetailModal(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewingApplication || !selectedNewStatus) {
      toast.error("Vui lòng chọn trạng thái");
      return;
    }

    setReviewing(true);
    try {
      const res = await dispatch(
        reviewApplication({
          id: reviewingApplication.id,
          status: parseInt(selectedNewStatus),
        } as any) as any
      );

      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(
          res.payload.data.message || "Xét duyệt hồ sơ thành công"
        );
        await dispatch(listApplications({limit: itemsPerPage, page: currentPage} as any) as any);
        setShowReviewModal(false);
        setReviewingApplication(null);
      } else {
        toast.error("Có lỗi xảy ra khi xét duyệt hồ sơ");
      }
    } catch (error) {
      console.error("Error reviewing application:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setReviewing(false);
    }
  };

  const handleSelectAll = () => {
    if (
      selectedIds.length === paginatedApplications.length &&
      paginatedApplications.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedApplications.map((a: Application) => a.id));
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
    if (
      !window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} hồ sơ ứng tuyển?`)
    ) {
      return;
    }

    setDeleting(true);
    try {
    //   const res = await dispatch(deleteApplications(ids as any) as any);

    //   if (res.payload.status === 200 || res.payload.status === 201) {
    //     toast.success(
    //       res.payload.data.message || "Xóa hồ sơ ứng tuyển thành công"
    //     );
    //     await dispatch(listApplications({limit: itemsPerPage, page: currentPage} as any) as any);
    //     setSelectedIds([]);
    //   } else {
    //     toast.error("Có lỗi xảy ra khi xóa hồ sơ ứng tuyển");
    //   }
    } catch (error) {
      console.error("Error deleting applications:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadResume = (url: string, name: string) => {
    window.open(url, "_blank");
  };

  const filteredApplications = applications
    .filter((app: Application) => {
      const matchesSearch =
        app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicant_phone.includes(searchTerm) ||
        app.jobs.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" ||
        app.status?.id?.toString() === selectedStatus;

      const matchesJob =
        selectedJob === "all" || app.jobs.id.toString() === selectedJob;

      return matchesSearch && matchesStatus && matchesJob;
    })
    .sort((a: Application, b: Application) => b.id - a.id);

  const totalPages = Math.ceil(totalApplication / itemsPerPage);
  const paginatedApplications = filteredApplications;

  // Get unique jobs from applications
  const uniqueJobs = Array.from(
    new Map(
      applications.map((app: Application) => [app.jobs.id, app.jobs])
    ).values()
  );

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchTerm, selectedStatus, selectedJob]);

  const applicationsByStatus = applicationStatus?.map(
    (status: ApplicationStatus) => ({
      ...status,
      count: applications?.filter((a: Application) => a?.status?.id === status?.id)
        .length,
    })
  );

  const getStatusColor = (statusId: number | null) => {
    if (!statusId) return "bg-gray-500";
    const colors = {
      1: "bg-yellow-500", // Chờ xét duyệt
      2: "bg-green-500", // Đã xét duyệt
      3: "bg-red-500", // Đã từ chối
    };
    return colors[statusId as keyof typeof colors] || "bg-gray-500";
  };

  const getStatusIcon = (statusId: number | null) => {
    if (!statusId) return <Clock className="h-4 w-4" />;
    const icons = {
      1: <Clock className="h-4 w-4" />,
      2: <CheckCircle2 className="h-4 w-4" />,
      3: <XCircle className="h-4 w-4" />,
    };
    return (
      icons[statusId as keyof typeof icons] || <Clock className="h-4 w-4" />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quản Lý Hồ Sơ Ứng Tuyển
            </h1>
            <p className="text-white/80">
              Xem và xét duyệt các hồ sơ ứng tuyển từ ứng viên
            </p>
          </div>
        </div>

        {/* Status breakdown */}
        <Card className="bg-black/50 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white">
              Phân Bố Theo Trạng Thái
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {applicationsByStatus.map((status: any) => (
                <div
                  key={status.id}
                  className="text-center p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge
                      className={`${getStatusColor(status.id)} text-white`}
                    >
                      {getStatusIcon(status.id)}
                      <span className="ml-1">{status.name}</span>
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-white">{status.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, SĐT hoặc vị trí..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-blue-500/30 text-white placeholder:text-white/50"
                />
              </div>

              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="bg-black/30 border-blue-500/30 text-white min-w-[200px]">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {applicationStatus.map((status: ApplicationStatus) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger className="bg-black/30 border-blue-500/30 text-white min-w-[200px]">
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vị trí</SelectItem>
                  {uniqueJobs.map((job: any) => (
                    <SelectItem key={job.id} value={job.id.toString()}>
                      {job.title}
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

        {/* Applications Table */}
        <Card className="bg-black/50 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white">
              Danh Sách Hồ Sơ Ứng Tuyển
            </CardTitle>
            <CardDescription className="text-white/80">
              Hiển thị {paginatedApplications.length} trên tổng số{" "}
              {totalApplication} hồ sơ
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
                          selectedIds.length ===
                            paginatedApplications.length &&
                          paginatedApplications.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                        className="border-white/30"
                      />
                    </TableHead>
                    <TableHead className="text-white">Ứng Viên</TableHead>
                    <TableHead className="text-white">Vị Trí</TableHead>
                    <TableHead className="text-white">Giới Thiệu</TableHead>
                    <TableHead className="text-white">Ngày Nộp</TableHead>
                    <TableHead className="text-white">Trạng Thái</TableHead>
                    <TableHead className="text-white text-right">
                      Thao Tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedApplications.length > 0 ? (
                    paginatedApplications.map((application: Application) => (
                      <TableRow
                        key={application.id}
                        className="border-b border-blue-500/30 hover:bg-white/5"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(application.id)}
                            onCheckedChange={() =>
                              handleSelectOne(application.id)
                            }
                            className="border-white/30"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-white">
                              {application.applicant_name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <Mail className="h-3 w-3" />
                              {application.applicant_email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <Phone className="h-3 w-3" />
                              {application.applicant_phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-cyan-400" />
                            <span className="text-white text-sm">
                              {application.jobs.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-white text-sm line-clamp-2 max-w-xs">
                            {application.introduction}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-400" />
                            <span className="text-white text-sm">
                              {formatDate(application.created_at)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              application.status?.id
                            )} text-white flex items-center gap-1 w-fit`}
                          >
                            {getStatusIcon(application.status?.id)}
                            {application.status?.name || "Không rõ"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetail(application)}
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDownloadResume(
                                  application.resume_url,
                                  application.applicant_name
                                )
                              }
                              className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 hover:border-green-500/50"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReview(application)}
                              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:border-blue-500/50"
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete([application.id])}
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
                        Không tìm thấy hồ sơ ứng tuyển nào
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
                totalItems={totalApplication}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
              />
            )}
          </CardContent>
        </Card>

        {/* Review Modal */}
        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
          <DialogContent className="bg-black/90 border-blue-500/30 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Xét Duyệt Hồ Sơ</DialogTitle>
              <DialogDescription className="text-white/60">
                Cập nhật trạng thái xét duyệt cho ứng viên{" "}
                {reviewingApplication?.applicant_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Ứng viên:</span>
                      <span className="text-white font-medium">
                        {reviewingApplication?.applicant_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Vị trí:</span>
                      <span className="text-white font-medium">
                        {reviewingApplication?.jobs.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Trạng thái hiện tại:</span>
                      <Badge
                        className={`${getStatusColor(
                          reviewingApplication?.status?.id || null
                        )} text-white`}
                      >
                        {reviewingApplication?.status?.name}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="status" className="text-white mb-2 block">
                  Chọn trạng thái mới <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={selectedNewStatus}
                  onValueChange={setSelectedNewStatus}
                >
                  <SelectTrigger className="bg-black/50 border-blue-500/30 text-white">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {applicationStatus.map((status: ApplicationStatus) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        <div className="flex items-center gap-2">
                          {status.id === 1 && (
                            <Clock className="h-4 w-4 text-yellow-400" />
                          )}
                          {status.id === 2 && (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          )}
                          {status.id === 3 && (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          {status.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowReviewModal(false)}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={reviewing || !selectedNewStatus}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {reviewing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xét duyệt...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Xác nhận
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="bg-black/90 border-blue-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Chi Tiết Hồ Sơ</DialogTitle>
            </DialogHeader>

            {viewingApplication && (
              <div className="space-y-6 py-4">
                {/* Applicant Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400">
                    Thông Tin Ứng Viên
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-white/60 text-sm">Họ và tên</Label>
                      <p className="text-white font-medium">
                        {viewingApplication.applicant_name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white/60 text-sm">Email</Label>
                      <p className="text-white font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-cyan-400" />
                        {viewingApplication.applicant_email}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white/60 text-sm">
                        Số điện thoại
                      </Label>
                      <p className="text-white font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4 text-cyan-400" />
                        {viewingApplication.applicant_phone}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white/60 text-sm">Ngày nộp</Label>
                      <p className="text-white font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-cyan-400" />
                        {formatDate(viewingApplication.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400">
                    Vị Trí Ứng Tuyển
                  </h3>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-cyan-400" />
                      <span className="text-white font-medium text-lg">
                        {viewingApplication.jobs.title}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Introduction */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400">
                    Giới Thiệu Bản Thân
                  </h3>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white whitespace-pre-wrap">
                      {viewingApplication.introduction}
                    </p>
                  </div>
                </div>

                {/* Resume */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400">
                    Hồ Sơ / CV
                  </h3>
                  <Button
                    onClick={() =>
                      handleDownloadResume(
                        viewingApplication.resume_url,
                        viewingApplication.applicant_name
                      )
                    }
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống CV
                  </Button>
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400">
                    Trạng Thái
                  </h3>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <Badge
                      className={`${getStatusColor(
                        viewingApplication.status?.id
                      )} text-white text-base px-4 py-2`}
                    >
                      {getStatusIcon(viewingApplication.status?.id)}
                      <span className="ml-2">
                        {viewingApplication.status?.name}
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Đóng
              </Button>
              {viewingApplication && (
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleReview(viewingApplication);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Xét Duyệt
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}