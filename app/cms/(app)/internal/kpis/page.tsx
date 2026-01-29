"use client";
import {
  listKPI,
  listKPIChild,
  listUnitKpi,
  createKPI,
  updateKPI,
  createKPIChild,
  updateKPIChild,
  deleteKPIsChild,
} from "@/src/features/kpi/kpiApi";
import { useKpiData } from "@/src/hook/kpiHook";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Pagination from "@/components/pagination";
import { toast } from "sonner";

export default function KpiPage() {
  const dispatch = useDispatch();
  const { kpis, totalKpi, kpiChild, totalKpiChild, units } = useKpiData();

  // States cho KPI
  const [selectedKpiId, setSelectedKpiId] = useState<string | null>(null);
  const [showKpiModal, setShowKpiModal] = useState(false);
  const [editingKpi, setEditingKpi] = useState<any>(null);
  const [kpiForm, setKpiForm] = useState({ name: "", description: "" });
  const [kpiPage, setKpiPage] = useState(1);
  const kpiLimit = 10;

  // States cho KPI Child
  const [showKpiChildModal, setShowKpiChildModal] = useState(false);
  const [editingKpiChild, setEditingKpiChild] = useState<any>(null);
  const [kpiChildForm, setKpiChildForm] = useState({
    name: "",
    description: "",
    operator: "+",
    score: "",
    target_value: "",
    unit_id: "",
    kpi_id: "",
  });
  const [kpiChildPage, setKpiChildPage] = useState(1);
  const kpiChildLimit = totalKpiChild;

  console.log("abc", kpiChildLimit);
  // States cho bulk delete
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  useEffect(() => {
    dispatch(listUnitKpi() as any);
    dispatch(listKPI({ limit: kpiLimit, page: kpiPage } as any) as any);
    dispatch(
      listKPIChild({ limit: kpiChildLimit, page: kpiChildPage } as any) as any
    );
  }, [dispatch, kpiPage, kpiChildPage, kpiChildLimit]);

  // Lọc KPI Child theo KPI được chọn
  const filteredKpiChildren = selectedKpiId
    ? kpiChild?.filter((child: any) => child.kpi.id === parseInt(selectedKpiId))
    : [];

  const handleEditKpi = (kpi: any) => {
    setEditingKpi(kpi);
    setKpiForm({ name: kpi.name, description: kpi.description || "" });
    setShowKpiModal(true);
  };

  const handleSaveKpi = async () => {
    if (!kpiForm.name.trim()) {
      alert("Vui lòng nhập tên KPI");
      return;
    }

    try {
      if (editingKpi) {
        const res = await dispatch(
          updateKPI({
            id: editingKpi.id,
            name: kpiForm.name,
            description: kpiForm.description,
          } as any) as any
        );

        if (res && res.payload && res.payload.status === 200) {
          toast.success(res.payload.data.message, { position: "top-right" });
        }
      } else {
        const res = await dispatch(
          createKPI({
            name: kpiForm.name,
            description: kpiForm.description,
          } as any) as any
        );

        if (res && res.payload && res.payload.status === 200) {
          toast.success(res.payload.data.message, { position: "top-right" });
        }
      }
      setShowKpiModal(false);
      dispatch(listKPI({ limit: kpiLimit, page: kpiPage } as any) as any);
    } catch (error) {
      console.error("Error saving KPI:", error);
      alert("Có lỗi xảy ra khi lưu KPI");
    }
  };

  const handleToggleKpi = (kpiId: string) => {
    if (selectedKpiId === kpiId) {
      setSelectedKpiId(null);
      setIsSelectionMode(false);
      setSelectedChildIds([]);
    } else {
      setSelectedKpiId(kpiId);
      setIsSelectionMode(false);
      setSelectedChildIds([]);
    }
  };

  // Handlers cho KPI Child
  const handleCreateKpiChild = () => {
    if (!selectedKpiId) {
      alert("Vui lòng chọn một KPI trước!");
      return;
    }
    setEditingKpiChild(null);
    setKpiChildForm({
      name: "",
      description: "",
      operator: "+",
      score: "",
      target_value: "",
      unit_id: "",
      kpi_id: selectedKpiId,
    });
    setShowKpiChildModal(true);
  };

  const handleEditKpiChild = (kpiChild: any) => {
    const unitId = kpiChild.unit?.id || kpiChild.unit_id || "";
    setEditingKpiChild(kpiChild);
    setKpiChildForm({
      name: kpiChild.name,
      description: kpiChild.description || "",
      operator: kpiChild.operator || "+",
      score: kpiChild.score?.toString() || "",
      target_value: kpiChild.target_value?.toString() || "",
      unit_id: unitId?.toString() || "",
      kpi_id: kpiChild.kpi.id.toString(),
    });
    setShowKpiChildModal(true);
  };

  const handleSaveKpiChild = async () => {
    if (!kpiChildForm.name.trim()) {
      alert("Vui lòng nhập tên KPI Child");
      return;
    }
    if (!kpiChildForm.unit_id) {
      alert("Vui lòng chọn đơn vị");
      return;
    }
    if (!kpiChildForm.operator) {
      alert("Vui lòng chọn toán tử");
      return;
    }
    if (!kpiChildForm.score) {
      alert("Vui lòng nhập điểm");
      return;
    }
    if (!kpiChildForm.target_value) {
      alert("Vui lòng nhập giá trị mục tiêu");
      return;
    }

    try {
      if (editingKpiChild) {
        const res = await dispatch(
          updateKPIChild({
            id: editingKpiChild.id,
            name: kpiChildForm.name,
            description: kpiChildForm.description,
            operator: kpiChildForm.operator,
            score: parseFloat(kpiChildForm.score),
            target_value: parseFloat(kpiChildForm.target_value),
            unit_id: kpiChildForm.unit_id,
          } as any) as any
        );
        if (res && res.payload && res.payload.status === 200) {
          toast.success(res.payload.data.message, { position: "top-right" });
        }
      } else {
        const res = await dispatch(
          createKPIChild({
            kpi_id: kpiChildForm.kpi_id,
            name: kpiChildForm.name,
            description: kpiChildForm.description,
            operator: kpiChildForm.operator,
            score: parseFloat(kpiChildForm.score),
            target_value: parseFloat(kpiChildForm.target_value),
            unit_id: kpiChildForm.unit_id,
          } as any) as any
        );
        if (res && res.payload && res.payload.status === 200) {
          toast.success(res.payload.data.message, { position: "top-right" });
        }
      }
      setShowKpiChildModal(false);
      dispatch(
        listKPIChild({ limit: kpiChildLimit, page: kpiChildPage } as any) as any
      );
    } catch (error) {
      console.error("Error saving KPI Child:", error);
      alert("Có lỗi xảy ra khi lưu KPI Child");
    }
  };

  // Xóa 1 hoặc nhiều KPI Child (luôn truyền mảng)
  const handleDeleteKpiChild = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa KPI Child này?")) {
      try {
        // Truyền mảng chứa 1 phần tử
        const res = await dispatch(deleteKPIsChild([id] as any) as any);
        
        if (res && res.payload && res.payload.status === 200) {
          toast.success(res.payload.data.message, { position: "top-right" });
        }
        
        dispatch(
          listKPIChild({
            limit: kpiChildLimit,
            page: kpiChildPage,
          } as any) as any
        );
      } catch (error) {
        console.error("Error deleting KPI Child:", error);
        alert("Có lỗi xảy ra khi xóa KPI Child");
      }
    }
  };

  // Toggle chọn child để xóa
  const handleToggleSelectChild = (childId: string) => {
    setSelectedChildIds((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  // Chọn tất cả children trong KPI hiện tại
  const handleSelectAllChildren = () => {
    if (selectedChildIds.length === filteredKpiChildren.length) {
      setSelectedChildIds([]);
    } else {
      setSelectedChildIds(filteredKpiChildren.map((child: any) => child.id));
    }
  };

  // Xóa nhiều KPI Child
  const handleBulkDeleteKpiChild = async () => {
    if (selectedChildIds.length === 0) {
      alert("Vui lòng chọn ít nhất một KPI Child để xóa");
      return;
    }

    if (
      confirm(
        `Bạn có chắc chắn muốn xóa ${selectedChildIds.length} KPI Child đã chọn?`
      )
    ) {
      try {
        // Truyền mảng các ID
        const res = await dispatch(deleteKPIsChild(selectedChildIds as any) as any);
        
        if (res && res.payload && res.payload.status === 200) {
          toast.success(res.payload.data.message, { position: "top-right" });
        }
        
        setSelectedChildIds([]);
        setIsSelectionMode(false);
        dispatch(
          listKPIChild({
            limit: kpiChildLimit,
            page: kpiChildPage,
          } as any) as any
        );
      } catch (error) {
        console.error("Error bulk deleting KPI Children:", error);
        alert("Có lỗi xảy ra khi xóa các KPI Child");
      }
    }
  };

  // Toggle chế độ chọn nhiều
  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedChildIds([]);
  };

  // Handle input cho target_value - chỉ cho phép số dương
  const handleTargetValueChange = (value: string) => {
    // Chỉ cho phép số và dấu chấm thập phân
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Đảm bảo chỉ có 1 dấu chấm
    const parts = numericValue.split('.');
    if (parts.length > 2) return;
    
    // Không cho phép số âm
    const finalValue = numericValue.startsWith('-') ? numericValue.slice(1) : numericValue;
    
    setKpiChildForm({ ...kpiChildForm, target_value: finalValue });
  };

  // Handle input cho score - cho phép nhập số
  const handleScoreChange = (value: string) => {
    // Chỉ cho phép số và dấu chấm thập phân
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Đảm bảo chỉ có 1 dấu chấm
    const parts = numericValue.split('.');
    if (parts.length > 2) return;
    
    setKpiChildForm({ ...kpiChildForm, score: numericValue });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Quản lý KPI</h1>
          <p className="text-white/60">Quản lý các chỉ số đánh giá hiệu suất</p>
        </div>

        {/* KPI Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <div className="space-y-3">
            {kpis?.map((kpi: any) => (
              <div
                key={kpi.id}
                className="bg-white/5 rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 hover:bg-white/10 transition cursor-pointer">
                  <div
                    className="flex items-center gap-3 flex-1"
                    onClick={() => handleToggleKpi(kpi.id)}
                  >
                    {selectedKpiId === kpi.id ? (
                      <ChevronDown className="w-5 h-5 text-purple-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-white/60" />
                    )}
                    <div>
                      <h3 className="text-white font-medium">{kpi.name}</h3>
                      {kpi.description && (
                        <p className="text-white/60 text-sm">
                          {kpi.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditKpi(kpi);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>
                </div>

                {/* KPI Child List */}
                {selectedKpiId === kpi.id && (
                  <div className="bg-white/5 p-4 border-t border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-white font-medium">Chi tiết KPI</h4>
                      <div className="flex items-center gap-2">
                        {isSelectionMode && (
                          <>
                            <button
                              onClick={handleSelectAllChildren}
                              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition text-sm"
                            >
                              {selectedChildIds.length ===
                              filteredKpiChildren.length
                                ? "Bỏ chọn tất cả"
                                : "Chọn tất cả"}
                            </button>
                            {selectedChildIds.length > 0 && (
                              <button
                                onClick={handleBulkDeleteKpiChild}
                                className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition text-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                                Xóa ({selectedChildIds.length})
                              </button>
                            )}
                            <button
                              onClick={handleToggleSelectionMode}
                              className="flex items-center gap-2 bg-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 transition text-sm"
                            >
                              Hủy
                            </button>
                          </>
                        )}
                        {!isSelectionMode && filteredKpiChildren?.length > 0 && (
                          <button
                            onClick={handleToggleSelectionMode}
                            className="flex items-center gap-2 bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa nhiều
                          </button>
                        )}
                        <button
                          onClick={handleCreateKpiChild}
                          className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Thêm chi tiết
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {filteredKpiChildren?.length > 0 ? (
                        filteredKpiChildren.map((child: any) => (
                          <div
                            key={child.id}
                            className={`flex items-center justify-between p-3 rounded-lg transition ${
                              isSelectionMode
                                ? "cursor-pointer hover:bg-white/10"
                                : "bg-white/5 hover:bg-white/10"
                            } ${
                              selectedChildIds.includes(child.id)
                                ? "bg-purple-600/30 border border-purple-400"
                                : ""
                            }`}
                            onClick={() =>
                              isSelectionMode &&
                              handleToggleSelectChild(child.id)
                            }
                          >
                            <div className="flex items-center gap-3">
                              {isSelectionMode && (
                                <input
                                  type="checkbox"
                                  checked={selectedChildIds.includes(child.id)}
                                  onChange={() =>
                                    handleToggleSelectChild(child.id)
                                  }
                                  className="w-4 h-4 rounded accent-purple-600"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              )}
                              <div>
                                <p className="text-white">{child.name}</p>
                                {child.description && (
                                  <p className="text-white/60 text-sm">
                                    {child.description}
                                  </p>
                                )}
                                <div className="flex gap-3 mt-1">
                                  {child.operator && (
                                    <p className="text-blue-400 text-sm">
                                      Toán tử: {child.operator}
                                    </p>
                                  )}
                                  {child.score && (
                                    <p className="text-green-400 text-sm">
                                      Điểm: {child.score}
                                    </p>
                                  )}
                                  {child.target_value && (
                                    <p className="text-purple-400 text-sm">
                                      Mục tiêu: {child.target_value}
                                    </p>
                                  )}
                                   {child.unit?.name && (
                                    <p className="text-yellow-400 text-sm">
                                      Đơn vị: {child.unit.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            {!isSelectionMode && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditKpiChild(child)}
                                  className="p-2 hover:bg-white/10 rounded-lg transition"
                                >
                                  <Edit2 className="w-4 h-4 text-blue-400" />
                                </button>
                                <button
                                  onClick={() => handleDeleteKpiChild(child.id)}
                                  className="p-2 hover:bg-white/10 rounded-lg transition"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-white/60 text-center py-4">
                          Chưa có chi tiết KPI
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination cho KPI */}
          {totalKpi > kpiLimit && (
            <Pagination
              currentPage={kpiPage}
              totalPages={Math.ceil(totalKpi / kpiLimit)}
              totalItems={totalKpi}
              onPageChange={setKpiPage}
              itemsPerPage={kpiLimit}
            />
          )}
        </div>

        {/* KPI Modal */}
        {showKpiModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  {editingKpi ? "Chỉnh sửa KPI" : "Thêm KPI mới"}
                </h3>
                <button
                  onClick={() => setShowKpiModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Tên KPI *</label>
                  <input
                    type="text"
                    value={kpiForm.name}
                    onChange={(e) =>
                      setKpiForm({ ...kpiForm, name: e.target.value })
                    }
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none"
                    placeholder="Nhập tên KPI"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Mô tả</label>
                  <textarea
                    value={kpiForm.description}
                    onChange={(e) =>
                      setKpiForm({ ...kpiForm, description: e.target.value })
                    }
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none h-24 resize-none"
                    placeholder="Nhập mô tả"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowKpiModal(false)}
                    className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveKpi}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    {editingKpi ? "Cập nhật" : "Tạo mới"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Child Modal */}
        {showKpiChildModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  {editingKpiChild
                    ? "Chỉnh sửa chi tiết KPI"
                    : "Thêm chi tiết KPI"}
                </h3>
                <button
                  onClick={() => setShowKpiChildModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">
                    Tên chi tiết KPI *
                  </label>
                  <input
                    type="text"
                    value={kpiChildForm.name}
                    onChange={(e) =>
                      setKpiChildForm({ ...kpiChildForm, name: e.target.value })
                    }
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none"
                    placeholder="Nhập tên chi tiết KPI"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Mô tả</label>
                  <textarea
                    value={kpiChildForm.description}
                    onChange={(e) =>
                      setKpiChildForm({
                        ...kpiChildForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none h-20 resize-none"
                    placeholder="Nhập mô tả"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Toán tử *</label>
                  <select
                    value={kpiChildForm.operator}
                    onChange={(e) =>
                      setKpiChildForm({
                        ...kpiChildForm,
                        operator: e.target.value,
                      })
                    }
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="+" className="text-black">+ (Cộng)</option>
                    <option value="-" className="text-black">- (Trừ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">Điểm *</label>
                  <input
                    type="text"
                    value={kpiChildForm.score}
                    onChange={(e) => handleScoreChange(e.target.value)}
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none"
                    placeholder="Nhập điểm"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Giá trị mục tiêu *</label>
                  <input
                    type="text"
                    value={kpiChildForm.target_value}
                    onChange={(e) => handleTargetValueChange(e.target.value)}
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none"
                    placeholder="Nhập giá trị mục tiêu (chỉ số dương)"
                  />
                  <p className="text-white/40 text-xs mt-1">
                    Chỉ nhập số dương (không cho phép số âm)
                  </p>
                </div>

                <div>
                  <label className="block text-white mb-2">Đơn vị *</label>
                  <select
                    value={kpiChildForm.unit_id}
                    onChange={(e) =>
                      setKpiChildForm({
                        ...kpiChildForm,
                        unit_id: e.target.value,
                      })
                    }
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="" className="text-black">
                      Chọn đơn vị
                    </option>

                    {units?.map((unit: any) => (
                      <option
                        key={unit.id}
                        value={unit.id}
                        className="text-black"
                      >
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowKpiChildModal(false)}
                    className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveKpiChild}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    {editingKpiChild ? "Cập nhật" : "Tạo mới"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}