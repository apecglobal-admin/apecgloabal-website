"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { 
  listAchivements, 
  listAchivementById, 
  listAchivementCategory,
  createAchivement,
  updateAchievement,
  uploadDocument,
  uploadImage,
  deleteAchivements
} from "@/src/features/achievement/achievementsApi";
import { listEmployee } from "@/src/features/employee/employeeApi";
import { useAchievementData } from "@/src/hook/achievementHook";
import { useEmployeeData } from "@/src/hook/employeeHook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Target, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Loader2,
  Users,
  Search,
  Download,
  Eye,
  ArrowLeft
} from "lucide-react";

const AchievementsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { employees } = useEmployeeData();
  const { achievements, achievementById, listAchivementCategories } = useAchievementData();
  
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    achievement_category_id: "",
    document: "",
  });

  const employeesData = employees || [];
  const achievementsData = achievements?.data || [];
  const categories = listAchivementCategories || [];

  useEffect(() => {
    dispatch(listAchivements({ limit: 100, page: 1 } as any) as any);
    dispatch(listEmployee({ limit: 100, page: 1 } as any) as any);
    dispatch(listAchivementCategory() as any);
  }, [dispatch]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "award":
        return <Award className="w-5 h-5" />;
      case "target":
        return <Target className="w-5 h-5" />;
      case "file-text":
        return <FileText className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const colors: { [key: string]: string } = {
      "Chứng chỉ": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Năng suất": "bg-green-500/20 text-green-400 border-green-500/30",
      "Giải thưởng": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };
    return colors[categoryName] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const handleViewDetail = async (achievementId: string) => {
    setIsLoading(true);
    await dispatch(listAchivementById(achievementId as any) as any);
    setShowDetailModal(true);
    setIsLoading(false);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  const handleOpenModal = async (mode: "create" | "edit", achievement?: any) => {
  setModalMode(mode);
  if (mode === "edit" && achievement) {
    setSelectedAchievement(achievement);
    
    setShowModal(true);
    setIsLoading(true);
    
    const result = await dispatch(listAchivementById(achievement.id as any) as any);
  
    if (result.payload) {
      const achievementData = result.payload;
      
      setFormData({
        title: achievementData.title || "",
        description: achievementData.description || "",
        achievement_category_id: achievementData.category?.id?.toString() || "",
        document: achievementData.document || "",
      });
      
      if (achievementData.employees && achievementData.employees.length > 0) {
        const employeeIds = achievementData.employees.map((emp: any) => emp.id);
        setSelectedEmployees(employeeIds);
      } else {
        setSelectedEmployees([]);
      }
    }
    
    setIsLoading(false);
  } else {
    setFormData({
      title: "",
      description: "",
      achievement_category_id: "",
      document: "",
    });
    setSelectedEmployees([]);
    setShowModal(true);
  }
};

  const handleRemoveDocument = () => {
    setFormData({ ...formData, document: "" });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAchievement(null);
    setFormData({
      title: "",
      description: "",
      achievement_category_id: "",
      document: "",
    });
    setSelectedEmployees([]);
    setSearchEmployee("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const fileType = file.type;
      let result;

      if (fileType.startsWith("image/")) {
        result = await dispatch(uploadImage({ file } as any) as any);
      } else {
        result = await dispatch(uploadDocument({ file } as any) as any);
      }

      if (result.payload?.data?.url) {
        setFormData({ ...formData, document: result.payload.data.url });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleToggleEmployee = (employeeId: number) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.achievement_category_id || selectedEmployees.length === 0) {
      alert("Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 nhân viên");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        achievement_category_id: parseInt(formData.achievement_category_id),
        document: formData.document,
        employees: selectedEmployees,
      };

      if (modalMode === "create") {
        await dispatch(createAchivement(payload as any) as any);
      } else {
        await dispatch(updateAchievement({ 
          id: selectedAchievement.id, 
          ...payload 
        } as any) as any);
      }

      dispatch(listAchivements({ limit: 100, page: 1 } as any) as any);
      handleCloseModal();
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (ids: string[]) => {
    if (!confirm(`Bạn có chắc muốn xóa ${ids.length} thành tích?`)) return;

    setIsLoading(true);
    try {
      await dispatch(deleteAchivements(ids as any) as any);
      dispatch(listAchivements({ limit: 100, page: 1 } as any) as any);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employeesData.filter((emp: any) =>
    emp.name?.toLowerCase().includes(searchEmployee.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchEmployee.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Quản lý Thành tích</h1>
            <p className="text-white/60 mt-1">
              Tổng số: <span className="text-white font-semibold">{achievementsData.length}</span> thành tích
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal("create")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm thành tích
          </Button>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementsData.map((achievement: any) => (
            <Card 
              key={achievement.id}
              className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`${getCategoryColor(achievement.category.name)} p-3 rounded-lg border`}>
                      {getCategoryIcon(achievement.category.icon)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{achievement.title}</CardTitle>
                      <Badge className={`${getCategoryColor(achievement.category.name)} border`}>
                        {achievement.category.name}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewDetail(achievement.id)}
                      className="text-green-400 hover:bg-green-500/20"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenModal("edit", achievement)}
                      className="text-blue-400 hover:bg-blue-500/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete([achievement.id])}
                      className="text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {achievement.description && (
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{achievement.description}</p>
                )}
                {achievement.document && (
                  <a
                    href={achievement.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Tải tài liệu
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {achievementsData.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-12 text-center">
              <Award className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 text-lg">Chưa có thành tích nào</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && achievementById && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-900 border-white/20 text-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCloseDetailModal}
                    className="text-white/60 hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <CardTitle className="text-2xl">Chi tiết thành tích</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCloseDetailModal}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Achievement Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-white/60 mb-1">Tên thành tích</h3>
                    <p className="text-xl font-semibold">{achievementById.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-white/60 mb-2">Danh mục</h3>
                    <Badge className={`${getCategoryColor(achievementById.category.name)} border`}>
                      {getCategoryIcon(achievementById.category.icon)}
                      <span className="ml-2">{achievementById.category.name}</span>
                    </Badge>
                  </div>

                  {achievementById.description && (
                    <div>
                      <h3 className="text-sm text-white/60 mb-1">Mô tả</h3>
                      <p className="text-white/80">{achievementById.description}</p>
                    </div>
                  )}

                  {achievementById.document && (
                    <div>
                      <h3 className="text-sm text-white/60 mb-2">Tài liệu</h3>
                      <a
                        href={achievementById.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/30"
                      >
                        <Download className="w-4 h-4" />
                        Tải xuống tài liệu
                      </a>
                    </div>
                  )}
                </div>

                {/* Employees List */}
                <div>
                  <h3 className="text-sm text-white/60 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Nhân viên đạt được ({achievementById.employees?.length || 0})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto bg-white/5 rounded-lg border border-white/20 p-3">
                    {achievementById.employees && achievementById.employees.length > 0 ? (
                      achievementById.employees.map((item: any) => (
                        <div
                          key={item.id || item.employee?.id}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <img
                            src={item.avatar || item.employee?.avatar || "https://via.placeholder.com/40"}
                            alt={item.name || item.employee?.name}
                            className="w-10 h-10 rounded-full border-2 border-white/20"
                          />
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.name || item.employee?.name}</p>
                            <p className="text-white/60 text-sm">ID: {item.id || item.employee?.id}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/60 text-center py-4">Chưa có nhân viên nào</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/20">
                <Button
                  onClick={handleCloseDetailModal}
                  variant="ghost"
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => {
                    handleCloseDetailModal();
                    handleOpenModal("edit", achievementById);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create/Edit Modal - Horizontal Layout */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-900 border-white/20 text-white max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {modalMode === "create" ? "Thêm thành tích mới" : "Chỉnh sửa thành tích"}
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCloseModal}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && modalMode === "edit" ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    <p className="text-white/60">Đang tải dữ liệu...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Form Fields */}
                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Tên thành tích <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập tên thành tích"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Danh mục <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={formData.achievement_category_id}
                          onChange={(e) => setFormData({ ...formData, achievement_category_id: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id} className="bg-gray-800">
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                          placeholder="Nhập mô tả"
                        />
                      </div>

                      {/* Document Upload */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Tài liệu đính kèm</label>
                        <div className="space-y-3">
                          {/* Current Document Display */}
                          {formData.document && (
                            <div className="bg-white/5 rounded-lg border border-white/20 p-3">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium mb-1">Tài liệu hiện tại</p>
                                    <a
                                      href={formData.document}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300 text-xs truncate block"
                                    >
                                      {formData.document}
                                    </a>
                                  </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <a
                                    href={formData.document}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                                  >
                                    <Download className="w-4 h-4 text-blue-400" />
                                  </a>
                                  <button
                                    onClick={handleRemoveDocument}
                                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* File Upload Input */}
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            disabled={uploadingFile}
                          />
                          {uploadingFile && (
                            <div className="flex items-center gap-2 text-blue-400">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Đang tải lên...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Employee Selection */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nhân viên <span className="text-red-400">*</span>
                        </label>
                        <div className="space-y-3">
                          {/* Search */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                            <input
                              type="text"
                              value={searchEmployee}
                              onChange={(e) => setSearchEmployee(e.target.value)}
                              placeholder="Tìm kiếm nhân viên..."
                              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {/* Selected count */}
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Users className="w-4 h-4" />
                            Đã chọn: <span className="text-blue-400 font-medium">{selectedEmployees.length}</span>
                          </div>

                          {/* Employee list */}
                          <div className="h-[400px] overflow-y-auto bg-white/5 rounded-lg border border-white/20 p-2 space-y-1">
                            {filteredEmployees.map((emp: any) => (
                              <label
                                key={emp.id}
                                className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedEmployees.includes(emp.id)}
                                  onChange={() => handleToggleEmployee(emp.id)}
                                  className="w-4 h-4 rounded border-white/20"
                                />
                                <img
                                  src={emp.avatar_url || "https://via.placeholder.com/40"}
                                  alt={emp.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <p className="text-white text-sm font-medium">{emp.name}</p>
                                  <p className="text-white/60 text-xs">{emp.email}</p>
                                </div>
                              </label>
                            ))}
                            {filteredEmployees.length === 0 && (
                              <p className="text-white/60 text-sm text-center py-4">
                                Không tìm thấy nhân viên
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-6 border-t border-white/20 mt-6">
                    <Button
                      onClick={handleCloseModal}
                      variant="ghost"
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading || uploadingFile}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : uploadingFile ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang tải file...
                        </>
                      ) : (
                        modalMode === "create" ? "Tạo thành tích" : "Cập nhật"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;