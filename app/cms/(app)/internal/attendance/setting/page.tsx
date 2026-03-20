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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Settings,
  Edit,
  Loader2,
  X,
  Calendar,
  Hash,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { useAttendanceData } from "@/src/hook/attendanceHook";
import { useDispatch } from "react-redux";
import {
  listSettingAttdence,
  updateSettingAttendance,
} from "@/src/features/attendance/attendanceApi";

interface SettingItem {
  id: string;
  name: string;
  value: string;
  type: "date" | "number" | string;
}

export default function SettingAttendancePage() {
  const token = localStorage.getItem("cmsToken");
  const dispatch = useDispatch();
  const { settings } = useAttendanceData();

  const [loading, setLoading] = useState(true);
  const [editingSetting, setEditingSetting] = useState<SettingItem | null>(null);
  const [formValue, setFormValue] = useState("");
  const [saving, setSaving] = useState(false);

  // Date picker state
  const [pickerMonth, setPickerMonth] = useState(1); // 1-12
  const [pickerDay, setPickerDay] = useState(1);
  const [pickerYear, setPickerYear] = useState<number | null>(null); // null = MM-DD mode
  const [dateMode, setDateMode] = useState<"mmdd" | "yyyymmdd">("mmdd");

  const MONTHS = [
    "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
    "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",
  ];

  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month, 0).getDate();

  const buildDateValue = (m: number, d: number, y: number | null) => {
    const mm = String(m).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return y !== null ? `${y}-${mm}-${dd}` : `${mm}-${dd}`;
  };

  const syncPickerFromValue = (val: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const [y, m, d] = val.split("-").map(Number);
      setDateMode("yyyymmdd");
      setPickerYear(y);
      setPickerMonth(m);
      setPickerDay(d);
    } else if (/^\d{2}-\d{2}$/.test(val)) {
      const [m, d] = val.split("-").map(Number);
      setDateMode("mmdd");
      setPickerYear(null);
      setPickerMonth(m);
      setPickerDay(d);
    } else {
      const now = new Date();
      setDateMode("mmdd");
      setPickerYear(null);
      setPickerMonth(now.getMonth() + 1);
      setPickerDay(now.getDate());
    }
  };

  useEffect(() => {
    setLoading(true);
    dispatch(listSettingAttdence(token) as any).finally(() => setLoading(false));
  }, [dispatch]);

  const safeSettings: SettingItem[] = Array.isArray(settings) ? settings : [];

  const handleEdit = (setting: SettingItem) => {
    setEditingSetting(setting);
    setFormValue(setting.value);
    if (setting.type === "date") syncPickerFromValue(setting.value);
  };

  const handleSave = async () => {
    if (!editingSetting) return;
    if (!formValue.trim()) {
      toast.error("Vui lòng nhập giá trị");
      return;
    }

    // Validate date format MM-DD or YYYY-MM-DD
    if (editingSetting.type === "date") {
      const mmdd = /^\d{2}-\d{2}$/;
      const yyyymmdd = /^\d{4}-\d{2}-\d{2}$/;
      if (!mmdd.test(formValue) && !yyyymmdd.test(formValue)) {
        toast.error("Định dạng ngày phải là MM-DD hoặc YYYY-MM-DD");
        return;
      }
    }

    setSaving(true);
    try {
      const res = await dispatch(
        updateSettingAttendance({
          token,
          id: editingSetting.id,
          value: formValue.trim(),
          type: editingSetting.type,
        }) as any,
      );
      if (res.payload?.status === 200 || res.payload?.status === 201) {
        toast.success(res.payload.data?.message || "Cập nhật thành công");
        setEditingSetting(null);
        await dispatch(listSettingAttdence(token) as any);
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setSaving(false);
    }
  };

  const renderTypeIcon = (type: string) => {
    if (type === "date")
      return <Calendar className="h-4 w-4 text-blue-400 shrink-0" />;
    return <Hash className="h-4 w-4 text-purple-400 shrink-0" />;
  };

  const renderTypeLabel = (type: string) => {
    if (type === "date")
      return (
        <span className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
          Ngày
        </span>
      );
    return (
      <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
        Số
      </span>
    );
  };

  const formatDisplayValue = (setting: SettingItem) => {
    if (setting.type === "date") {
      // Display MM-DD as DD/MM or YYYY-MM-DD as DD/MM/YYYY
      if (/^\d{2}-\d{2}$/.test(setting.value)) {
        const [mm, dd] = setting.value.split("-");
        return `${dd}/${mm}`;
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(setting.value)) {
        const [yyyy, mm, dd] = setting.value.split("-");
        return `${dd}/${mm}/${yyyy}`;
      }
    }
    return setting.value;
  };

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">
            Cài Đặt Chấm Công
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Cấu hình các thông số hệ thống chấm công
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tổng cài đặt</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeSettings.length}
                </p>
              </div>
              <Settings className="hidden sm:block h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Kiểu ngày</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeSettings.filter((s) => s.type === "date").length}
                </p>
              </div>
              <Calendar className="hidden sm:block h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-orange-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Kiểu số</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeSettings.filter((s) => s.type === "number").length}
                </p>
              </div>
              <Hash className="hidden sm:block h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-white text-base sm:text-xl">
            Danh Sách Cài Đặt
          </CardTitle>
          <CardDescription className="text-white/60 text-xs sm:text-sm">
            {safeSettings.length} thông số cấu hình
          </CardDescription>
        </CardHeader>

        <CardContent className="px-2 sm:px-6 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-white" />
              <span className="ml-2 text-white text-sm">Đang tải...</span>
            </div>
          ) : safeSettings.length === 0 ? (
            <div className="text-center py-12 text-white/50 text-sm">
              Chưa có cài đặt nào
            </div>
          ) : (
            <>
              {/* Mobile: card list */}
              <div className="sm:hidden space-y-2">
                {safeSettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="bg-white/5 border border-purple-500/20 rounded-xl p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        {renderTypeIcon(setting.type)}
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm leading-tight">
                            {setting.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {renderTypeLabel(setting.type)}
                            <span className="text-xs text-white/70 font-mono bg-white/10 px-2 py-0.5 rounded">
                              {formatDisplayValue(setting)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(setting)}
                        className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 shrink-0"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: table-like cards */}
              <div className="hidden sm:block space-y-2">
                {safeSettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between gap-4 bg-white/5 border border-purple-500/20 rounded-xl px-5 py-4 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {renderTypeIcon(setting.type)}
                      <div>
                        <p className="font-medium text-white text-sm">
                          {setting.name}
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                          ID: {setting.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {renderTypeLabel(setting.type)}
                      <span className="text-sm text-white font-mono bg-white/10 border border-white/10 px-3 py-1 rounded-lg min-w-[80px] text-center">
                        {formatDisplayValue(setting)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(setting)}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog
        open={!!editingSetting}
        onOpenChange={(open) => !open && setEditingSetting(null)}
      >
        <DialogContent className="bg-black/90 border-purple-500/30 text-white w-[calc(100vw-2rem)] max-w-md mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-white">
              Chỉnh Sửa Cài Đặt
            </DialogTitle>
          </DialogHeader>

          {editingSetting && (
            <div className="space-y-4 sm:space-y-5">
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-3">
                <p className="text-xs text-white/40 mb-1">Thông số</p>
                <div className="flex items-center gap-2">
                  {renderTypeIcon(editingSetting.type)}
                  <p className="text-sm font-semibold text-white">
                    {editingSetting.name}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="value" className="text-white text-sm">
                  Giá Trị *{" "}
                  {editingSetting.type === "number" && (
                    <span className="text-white/40 font-normal">(Số)</span>
                  )}
                </Label>

                {editingSetting.type === "date" ? (
                  <div className="mt-2 space-y-3">
                    {/* Mode toggle */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDateMode("mmdd");
                          setPickerYear(null);
                          const val = buildDateValue(pickerMonth, pickerDay, null);
                          setFormValue(val);
                        }}
                        className={`flex-1 h-8 rounded-lg text-xs font-medium border transition-all ${
                          dateMode === "mmdd"
                            ? "bg-purple-600/40 border-purple-500/60 text-purple-300"
                            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                        }`}
                      >
                        Ngày/Tháng
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDateMode("yyyymmdd");
                          const y = new Date().getFullYear();
                          setPickerYear(y);
                          const val = buildDateValue(pickerMonth, pickerDay, y);
                          setFormValue(val);
                        }}
                        className={`flex-1 h-8 rounded-lg text-xs font-medium border transition-all ${
                          dateMode === "yyyymmdd"
                            ? "bg-purple-600/40 border-purple-500/60 text-purple-300"
                            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                        }`}
                      >
                        Ngày/Tháng/Năm
                      </button>
                    </div>

                    {/* Picker grid */}
                    <div className={`grid gap-2 ${dateMode === "yyyymmdd" ? "grid-cols-3" : "grid-cols-2"}`}>
                      {/* Month */}
                      <div className="space-y-1">
                        <p className="text-xs text-white/40 text-center">Tháng</p>
                        <div className="bg-black/40 border border-purple-500/20 rounded-xl p-1.5 h-[168px] overflow-y-auto scrollbar-thin">
                          {MONTHS.map((label, i) => {
                            const m = i + 1;
                            const selected = pickerMonth === m;
                            return (
                              <button
                                key={m}
                                type="button"
                                onClick={() => {
                                  setPickerMonth(m);
                                  // Clamp day
                                  const maxDay = getDaysInMonth(m, pickerYear ?? 2024);
                                  const clampedDay = Math.min(pickerDay, maxDay);
                                  setPickerDay(clampedDay);
                                  setFormValue(buildDateValue(m, clampedDay, pickerYear));
                                }}
                                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all ${
                                  selected
                                    ? "bg-purple-600 text-white font-semibold"
                                    : "text-white/60 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Day */}
                      <div className="space-y-1">
                        <p className="text-xs text-white/40 text-center">Ngày</p>
                        <div className="bg-black/40 border border-purple-500/20 rounded-xl p-1.5 h-[168px] overflow-y-auto scrollbar-thin">
                          {Array.from(
                            { length: getDaysInMonth(pickerMonth, pickerYear ?? 2024) },
                            (_, i) => i + 1
                          ).map((d) => {
                            const selected = pickerDay === d;
                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => {
                                  setPickerDay(d);
                                  setFormValue(buildDateValue(pickerMonth, d, pickerYear));
                                }}
                                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all ${
                                  selected
                                    ? "bg-purple-600 text-white font-semibold"
                                    : "text-white/60 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                Ngày {d}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Year (only in yyyymmdd mode) */}
                      {dateMode === "yyyymmdd" && (
                        <div className="space-y-1">
                          <p className="text-xs text-white/40 text-center">Năm</p>
                          <div className="bg-black/40 border border-purple-500/20 rounded-xl p-1.5 h-[168px] overflow-y-auto scrollbar-thin">
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => {
                              const selected = pickerYear === y;
                              return (
                                <button
                                  key={y}
                                  type="button"
                                  onClick={() => {
                                    setPickerYear(y);
                                    setFormValue(buildDateValue(pickerMonth, pickerDay, y));
                                  }}
                                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all ${
                                    selected
                                      ? "bg-purple-600 text-white font-semibold"
                                      : "text-white/60 hover:bg-white/10 hover:text-white"
                                  }`}
                                >
                                  {y}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Preview */}
                    <div className="flex items-center gap-2 bg-purple-500/5 border border-purple-500/20 rounded-xl px-3 py-2">
                      <Calendar className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <p className="text-xs text-white/60">Giá trị:</p>
                      <code className="text-sm text-purple-300 font-mono font-semibold">
                        {formValue || "—"}
                      </code>
                    </div>
                  </div>
                ) : (
                  <Input
                    id="value"
                    type="number"
                    placeholder="Nhập giá trị..."
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 mt-1 h-9 text-sm"
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-700/50">
            <Button
              variant="outline"
              onClick={() => setEditingSetting(null)}
              className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20 h-9 text-sm"
            >
              <X className="h-4 w-4 mr-1.5" /> Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 h-9 text-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1.5" /> Cập Nhật
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}