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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Loader2,
  Filter,
  X,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  User,
  MapPin,
  AlignLeft,
  Paperclip,
  UserCheck,
} from "lucide-react";
import { listEmployeeAbsences, listEmployeeAbsencesById, listStatusAbsence, listTypeAbsence } from "@/src/features/attendance/attendanceApi";
import { useAttendanceData } from "@/src/hook/attendanceHook";
import { useDispatch } from "react-redux";
import Pagination from "@/components/pagination";

interface AbsenceRecord {
  id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  reason: string;
  document: string | null;
  address: string | null;
  absence: { id: number; name: string };
  creator: { id: number; name: string; avatar: string | null };
  status: { id: number; name: string };
  approver: { id: number | null; name: string | null; avatar: string | null };
}

const STATUS_COLORS: Record<number, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  1: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    icon: <Clock className="h-3 w-3" />,
  },
  2: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    icon: <XCircle className="h-3 w-3" />,
  },
  3: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500/30",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatTime(t: string) {
  return t?.slice(0, 5) ?? "";
}

export default function EmployeeAbsenceAttendancePage() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { statusAbsence, listTypeAbsences, listEmployeeAbsence, totalEmployeeAbsence, listEmployeeAbsenceById } = useAttendanceData();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [detailRecord, setDetailRecord] = useState<AbsenceRecord | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchDebounce, setSearchDebounce] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load status & type lists once
  useEffect(() => {
    dispatch(listStatusAbsence(token) as any);
    dispatch(listTypeAbsence(token) as any);
  }, [dispatch]);

  // Reload list whenever filters / page change
  useEffect(() => {
    setLoading(true);
    dispatch(
      listEmployeeAbsences({
        token,
        page,
        limit,
        search: searchDebounce.trim() || undefined,
        absence_id: filterType !== "all" ? filterType : undefined,
        attendance_status_id: filterStatus !== "all" ? filterStatus : undefined,
      }) as any,
    ).finally(() => setLoading(false));
  }, [dispatch, page, limit, searchDebounce, filterStatus, filterType]);

  const safeData: AbsenceRecord[] = Array.isArray(listEmployeeAbsence) ? listEmployeeAbsence : [];
  const safeStatuses = Array.isArray(statusAbsence) ? statusAbsence : [];
  const safeTypes = Array.isArray(listTypeAbsences) ? listTypeAbsences : [];

  const totalPages = Math.ceil((totalEmployeeAbsence ?? 0) / limit);
  const paginatedData = safeData;
  const totalCount = totalEmployeeAbsence ?? 0;

  const hasActiveFilters = searchTerm.trim() !== "" || filterStatus !== "all" || filterType !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterType("all");
    setPage(1);
  };

  const handleViewDetail = async (id: string) => {
    setDetailRecord(null);
    setDetailLoading(true);
    try {
      const res = await dispatch(
        listEmployeeAbsencesById({ token, id }) as any,
      );
      const data = res?.payload?.data;
      if (data) setDetailRecord(data);
    } catch {
      // silently fail — modal won't open
    } finally {
      setDetailLoading(false);
    }
  };

  const renderStatusBadge = (status: { id: number; name: string }) => {
    const cfg = STATUS_COLORS[status.id] ?? {
      bg: "bg-gray-600/20",
      text: "text-gray-400",
      border: "border-gray-500/30",
      icon: null,
    };
    return (
      <Badge className={`${cfg.bg} ${cfg.text} ${cfg.border} flex items-center gap-1 w-fit text-xs`}>
        {cfg.icon}
        {status.name}
      </Badge>
    );
  };

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">
            Danh Sách Đơn Vắng Mặt
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Theo dõi và quản lý các đơn vắng mặt của nhân viên
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tổng đơn</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{totalCount}</p>
              </div>
              <ClipboardList className="hidden sm:block h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-yellow-500/30">
          <CardContent className="p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Chờ duyệt</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeData.filter((r) => r.status.id === 1).length}
                </p>
              </div>
              <Clock className="hidden sm:block h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Đã duyệt</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeData.filter((r) => r.status.id === 3).length}
                </p>
              </div>
              <CheckCircle2 className="hidden sm:block h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-red-500/30">
          <CardContent className="p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Từ chối</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeData.filter((r) => r.status.id === 2).length}
                </p>
              </div>
              <XCircle className="hidden sm:block h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardContent className="p-3 sm:p-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên, lý do, loại đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 h-9 text-sm"
              />
            </div>

            {/* Mobile toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden shrink-0 h-9 px-3 border-purple-500/30 text-white/70 bg-black/30 hover:bg-white/10 ${hasActiveFilters ? "border-purple-400 text-purple-300" : ""}`}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? (
                <ChevronUp className="h-3 w-3 ml-1" />
              ) : (
                <ChevronDown className="h-3 w-3 ml-1" />
              )}
            </Button>

            {/* Desktop filters */}
            <div className="hidden sm:flex gap-2 items-center">
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
                <SelectTrigger className="w-[180px] bg-black/30 border-purple-500/30 text-white h-9 text-sm">
                  <Filter className="h-4 w-4 mr-2 shrink-0" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {safeStatuses.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
                <SelectTrigger className="w-[210px] bg-black/30 border-purple-500/30 text-white h-9 text-sm">
                  <FileText className="h-4 w-4 mr-2 shrink-0" />
                  <SelectValue placeholder="Loại đơn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại đơn</SelectItem>
                  {safeTypes.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 h-9"
                >
                  <X className="h-4 w-4 mr-1" /> Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          {/* Mobile expandable */}
          {showFilters && (
            <div className="sm:hidden mt-3 flex flex-col gap-2">
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
                <SelectTrigger className="w-full bg-black/30 border-purple-500/30 text-white h-9 text-sm">
                  <SelectValue placeholder="Lọc trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {safeStatuses.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
                <SelectTrigger className="w-full bg-black/30 border-purple-500/30 text-white h-9 text-sm">
                  <SelectValue placeholder="Lọc loại đơn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại đơn</SelectItem>
                  {safeTypes.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 w-full h-9 text-sm"
                >
                  <X className="h-4 w-4 mr-2" /> Xóa bộ lọc
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* List */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-base sm:text-xl">Danh Sách Đơn</CardTitle>
              <CardDescription className="text-white/60 text-xs sm:text-sm">
                {paginatedData.length} đơn{hasActiveFilters && ` / ${totalCount} tổng`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-2 sm:px-6 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-white" />
              <span className="ml-2 text-white text-sm">Đang tải...</span>
            </div>
          ) : (
            <>
              {/* Mobile: card list */}
              <div className="sm:hidden space-y-2">
                {paginatedData.length > 0 ? (
                  paginatedData.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white/5 border border-purple-500/20 rounded-xl p-3 space-y-2 cursor-pointer hover:bg-white/8 transition-colors"
                      onClick={() => handleViewDetail(record.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <FileText className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-white text-sm leading-tight">
                              {record.absence.name}
                            </p>
                            <p className="text-xs text-white/50 mt-0.5">{record.creator.name}</p>
                          </div>
                        </div>
                        {renderStatusBadge(record.status)}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-white/50 pt-1 border-t border-white/5">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(record.start_date)} – {formatDate(record.end_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(record.start_time)} – {formatTime(record.end_time)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-white/50 text-sm">
                    {hasActiveFilters ? "Không tìm thấy đơn nào phù hợp" : "Chưa có đơn nào"}
                  </div>
                )}
              </div>

              {/* Desktop: table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-purple-500/30">
                      <TableHead className="text-white">Người tạo</TableHead>
                      <TableHead className="text-white">Loại đơn</TableHead>
                      <TableHead className="text-white">Thời gian</TableHead>
                      <TableHead className="text-white">Ca làm</TableHead>
                      <TableHead className="text-white">Trạng thái</TableHead>
                      <TableHead className="text-white">Người duyệt</TableHead>
                      <TableHead className="text-white">Chi tiết</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((record) => (
                        <TableRow
                          key={record.id}
                          className="border-b border-purple-500/30 hover:bg-white/5"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                                <User className="h-4 w-4 text-purple-400" />
                              </div>
                              <span className="text-white font-medium text-sm">{record.creator.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <FileText className="h-4 w-4 text-purple-400 shrink-0" />
                              <span className="text-white/90 text-sm">{record.absence.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-white text-sm">{formatDate(record.start_date)}</span>
                              {record.start_date !== record.end_date && (
                                <span className="text-white/50 text-xs">→ {formatDate(record.end_date)}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-white/80 text-sm">
                              {formatTime(record.start_time)} – {formatTime(record.end_time)}
                            </span>
                          </TableCell>
                          <TableCell>{renderStatusBadge(record.status)}</TableCell>
                          <TableCell>
                            {record.approver.name ? (
                              <span className="text-white/80 text-sm">{record.approver.name}</span>
                            ) : (
                              <span className="text-white/30 text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetail(record.id)}
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 h-7 text-xs px-2.5"
                            >
                              Xem
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-white/60">
                          {hasActiveFilters
                            ? "Không tìm thấy đơn nào phù hợp với bộ lọc"
                            : "Chưa có đơn nào"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>

        {totalPages > 1 && (
          <div className="px-3 sm:px-6 pb-4 sm:pb-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalEmployeeAbsence}
              onPageChange={setPage}
              maxVisiblePages={5}
              itemsPerPage={limit}
            />
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Dialog
        open={detailLoading || !!detailRecord}
        onOpenChange={(open) => { if (!open) setDetailRecord(null); }}
      >
        <DialogContent className="bg-black/90 border-purple-500/30 text-white w-[calc(100vw-2rem)] max-w-lg mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-400" />
              {detailLoading ? "Đang tải..." : `Chi Tiết Đơn #${detailRecord?.id}`}
            </DialogTitle>
          </DialogHeader>

          {/* Loading state */}
          {detailLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
              <span className="ml-2 text-white/70 text-sm">Đang tải chi tiết...</span>
            </div>
          )}

          {/* Detail content */}
          {!detailLoading && detailRecord && (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5 border border-purple-500/20">
                <span className="text-white/60 text-sm">Trạng thái</span>
                {renderStatusBadge(detailRecord.status)}
              </div>

              {/* Info grid */}
              <div className="space-y-3 border border-purple-500/20 rounded-xl p-3 sm:p-4 bg-purple-500/5">
                <p className="text-xs sm:text-sm font-semibold text-white/80">Thông Tin Đơn</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50">Loại đơn</p>
                      <p className="text-sm text-white">{detailRecord.absence.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50">Người tạo</p>
                      <p className="text-sm text-white">{detailRecord.creator.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CalendarDays className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50">Ngày bắt đầu</p>
                      <p className="text-sm text-white">{formatDate(detailRecord.start_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CalendarDays className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50">Ngày kết thúc</p>
                      <p className="text-sm text-white">{formatDate(detailRecord.end_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50">Giờ bắt đầu</p>
                      <p className="text-sm text-white">{formatTime(detailRecord.start_time)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50">Giờ kết thúc</p>
                      <p className="text-sm text-white">{formatTime(detailRecord.end_time)}</p>
                    </div>
                  </div>

                  {detailRecord.address && (
                    <div className="flex items-start gap-2 sm:col-span-2">
                      <MapPin className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-white/50">Địa điểm</p>
                        <p className="text-sm text-white">{detailRecord.address}</p>
                      </div>
                    </div>
                  )}

                  {detailRecord.approver.name && (
                    <div className="flex items-start gap-2 sm:col-span-2">
                      <UserCheck className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-white/50">Người duyệt</p>
                        <p className="text-sm text-white">{detailRecord.approver.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reason */}
              {detailRecord.reason && (
                <div className="border border-purple-500/20 rounded-xl p-3 sm:p-4 bg-purple-500/5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <AlignLeft className="h-4 w-4 text-purple-400" />
                    <p className="text-xs sm:text-sm font-semibold text-white/80">Lý Do</p>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed pl-6">{detailRecord.reason}</p>
                </div>
              )}

              {/* Document */}
              {detailRecord.document && (
                <div className="border border-purple-500/20 rounded-xl p-3 bg-purple-500/5 flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-purple-400 shrink-0" />
                  <p className="text-xs sm:text-sm font-semibold text-white/80">Tài liệu đính kèm</p>
                  <a
                    href={detailRecord.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline ml-auto"
                  >
                    Xem tài liệu
                  </a>
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-gray-700/50">
                <Button
                  variant="outline"
                  onClick={() => setDetailRecord(null)}
                  className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20 h-9 text-sm"
                >
                  <X className="h-4 w-4 mr-1.5" /> Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}