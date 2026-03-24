"use client";

import { useState, useEffect, useMemo } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Edit,
  Loader2,
  X,
  ShieldCheck,
  ShieldAlert,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import { usePayrollData } from "@/src/hook/payrollHook";
import { useDispatch } from "react-redux";
import {
  listInsurancePayroll,
  updateInsurancePayroll,
} from "@/src/features/payroll/payrollApi";

interface InsuranceType {
  id: string;
  name: string;
  key: string;
  value: string;
}

export default function InsurancePayrollPage() {
  const token = localStorage.getItem("cmsToken");
  const dispatch = useDispatch();
  const { insurances } = usePayrollData();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInsurance, setEditingInsurance] = useState<InsuranceType | null>(null);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({ name: "", value: "" });

  useEffect(() => {
    setLoading(true);
    dispatch(listInsurancePayroll(token as any) as any).finally(() =>
      setLoading(false)
    );
  }, [dispatch]);

  const safeInsurances: InsuranceType[] = Array.isArray(insurances) ? insurances : [];

  const filteredInsurances = useMemo(() => {
    if (!searchTerm.trim()) return safeInsurances;
    return safeInsurances.filter((i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeInsurances, searchTerm]);

  const totalValue = safeInsurances.reduce(
    (sum, i) => sum + parseFloat(i.value || "0"),
    0
  );

  const handleEdit = (insurance: InsuranceType) => {
    setEditingInsurance(insurance);
    setFormData({ name: insurance.name, value: insurance.value });
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên bảo hiểm");
      return;
    }
    if (!formData.value || isNaN(parseFloat(formData.value))) {
      toast.error("Vui lòng nhập tỷ lệ hợp lệ");
      return;
    }
    if (!editingInsurance) return;

    setUpdating(true);
    try {
      const res = await dispatch(
        updateInsurancePayroll({
          token,
          id: editingInsurance.id,
          name: formData.name.trim(),
          value: formData.value,
        }) as any
      );
      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(res.payload.data.message);
        setEditingInsurance(null);
        await dispatch(listInsurancePayroll(token as any) as any);
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setUpdating(false);
    }
  };

  const getInsuranceIcon = (key: string) => {
    switch (key) {
      case "bhxh":
        return <ShieldCheck className="h-5 w-5 text-purple-400 shrink-0" />;
      case "bhyt":
        return <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0" />;
      case "bhtn":
        return <ShieldAlert className="h-5 w-5 text-orange-400 shrink-0" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-purple-400 shrink-0" />;
    }
  };

  const getValueColor = (value: string) => {
    const v = parseFloat(value);
    if (v >= 8) return "text-purple-300";
    if (v >= 3) return "text-blue-300";
    return "text-orange-300";
  };

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">
            Quản Lý Bảo Hiểm
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Quản lý các loại bảo hiểm và tỷ lệ đóng góp
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tổng loại BH</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeInsurances.length}
                </p>
              </div>
              <ShieldCheck className="hidden sm:block h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tổng tỷ lệ</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {totalValue.toFixed(2)}%
                </p>
              </div>
              <Percent className="hidden sm:block h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-orange-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">BH cao nhất</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeInsurances.length > 0
                    ? Math.max(...safeInsurances.map((i) => parseFloat(i.value))).toFixed(2) + "%"
                    : "—"}
                </p>
              </div>
              <ShieldAlert className="hidden sm:block h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardContent className="p-3 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm bảo hiểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 h-9 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-base sm:text-xl">
                Danh Sách Bảo Hiểm
              </CardTitle>
              <CardDescription className="text-white/60 text-xs sm:text-sm">
                {filteredInsurances.length} loại bảo hiểm
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
                {filteredInsurances.length > 0 ? (
                  filteredInsurances.map((insurance) => (
                    <div
                      key={insurance.id}
                      className="bg-white/5 border border-purple-500/20 rounded-xl p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          {getInsuranceIcon(insurance.key)}
                          <div>
                            <p className="font-semibold text-white text-sm leading-tight">
                              {insurance.name}
                            </p>
                            <p className="text-white/40 text-xs uppercase mt-0.5">
                              {insurance.key}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-bold text-base ${getValueColor(insurance.value)}`}
                        >
                          {parseFloat(insurance.value).toFixed(2)}%
                        </span>
                      </div>

                      <div className="flex justify-end pt-1 border-t border-white/5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(insurance)}
                          className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-white/50 text-sm">
                    Không tìm thấy bảo hiểm nào phù hợp
                  </div>
                )}
              </div>

              {/* Desktop: table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-purple-500/30">
                      <TableHead className="text-white">Tên Bảo Hiểm</TableHead>
                      <TableHead className="text-white">Mã</TableHead>
                      <TableHead className="text-white">Tỷ Lệ (%)</TableHead>
                      <TableHead className="text-white">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInsurances.length > 0 ? (
                      filteredInsurances.map((insurance) => (
                        <TableRow
                          key={insurance.id}
                          className="border-b border-purple-500/30 hover:bg-white/5"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getInsuranceIcon(insurance.key)}
                              <p className="font-medium text-white">{insurance.name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs font-mono bg-white/10 text-white/70 px-2 py-0.5 rounded uppercase">
                              {insurance.key}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-bold text-base ${getValueColor(insurance.value)}`}
                            >
                              {parseFloat(insurance.value).toFixed(2)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(insurance)}
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-white/60"
                        >
                          Không tìm thấy bảo hiểm nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog
        open={!!editingInsurance}
        onOpenChange={(open) => !open && setEditingInsurance(null)}
      >
        <DialogContent className="bg-black/90 border-purple-500/30 text-white w-[calc(100vw-2rem)] max-w-lg mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-white">
              Chỉnh Sửa Bảo Hiểm
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <Label htmlFor="ins-name" className="text-white text-sm">
                Tên Bảo Hiểm *
              </Label>
              <Input
                id="ins-name"
                placeholder="Nhập tên bảo hiểm..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 mt-1 h-9 text-sm"
              />
            </div>

            <div>
              <Label htmlFor="ins-value" className="text-white text-sm">
                Tỷ Lệ (%) *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="ins-value"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Nhập tỷ lệ..."
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 h-9 text-sm pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-700/50">
            <Button
              variant="outline"
              onClick={() => setEditingInsurance(null)}
              className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20 h-9 text-sm"
            >
              <X className="h-4 w-4 mr-1.5" /> Hủy
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 h-9 text-sm"
            >
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-1.5" /> Cập Nhật
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}