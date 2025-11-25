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
  Edit,
  Loader2,
  Building2,
  Layers,
  Link as LinkIcon,
  FileText,
  Package,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useEcoSystemData } from "@/src/hook/ecoHook";
import { useDispatch } from "react-redux";
import {
  listEcoSystems,
  updateEcoSystem,
  updateEcoSystemItem,
} from "@/src/features/ecosystem/ecoApi";

interface EcoSystemItem {
  id: number;
  title: string;
  subtitle: string | null;
  link: string | null;
  content: string | null;
}

interface EcoSystem {
  id: string;
  name: string;
  description: string;
  ecosystem_items: EcoSystemItem[];
}

interface EcoSystemFormData {
  id?: string;
  name: string;
  description: string;
}

interface EcoSystemItemFormData {
  id?: number;
  title: string;
  subtitle: string;
  link: string;
  content: string;
}

function EcoSystemManagementContent() {
  const dispatch = useDispatch();
  const { listEcoSystem } = useEcoSystemData();

  const [isEcoDialogOpen, setIsEcoDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEcoSystem, setSelectedEcoSystem] = useState<EcoSystem | null>(
    null
  );

  const [ecoFormData, setEcoFormData] = useState<EcoSystemFormData>({
    name: "",
    description: "",
  });

  const [itemFormData, setItemFormData] = useState<EcoSystemItemFormData>({
    title: "",
    subtitle: "",
    link: "",
    content: "",
  });

  useEffect(() => {
    dispatch(listEcoSystems() as any);
  }, [dispatch]);

  // Handle edit ecosystem
  const handleEditEcoSystem = (eco: EcoSystem) => {
    setSelectedEcoSystem(eco);
    setEcoFormData({
      id: eco.id,
      name: eco.name,
      description: eco.description,
    });
    setIsEcoDialogOpen(true);
  };

  // Handle edit ecosystem item
  const handleEditItem = (item: EcoSystemItem) => {
    setItemFormData({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || "",
      link: item.link || "",
      content: item.content || "",
    });
    setIsItemDialogOpen(true);
  };

  // Submit ecosystem update
  const handleSubmitEcoSystem = async () => {
    if (!ecoFormData.name) {
      toast.error("Vui lòng nhập tên Ecosystem");
      return;
    }

    setIsLoading(true);
    try {
      const res = await dispatch(
        updateEcoSystem({
          id: ecoFormData.id,
          name: ecoFormData.name,
          description: ecoFormData.description,
        } as any) as any
      );
      if (res.payload.status == 200 || res.payload.status == 201) {
        toast.success(res.payload.data.message);
        setIsEcoDialogOpen(false);
        dispatch(listEcoSystems() as any);
      }
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit item update
  const handleSubmitItem = async () => {
    if (!itemFormData.title) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    setIsLoading(true);
    try {
      const res = await dispatch(
        updateEcoSystemItem({
          id: itemFormData.id,
          title: itemFormData.title,
          subtitle: itemFormData.subtitle,
          link: itemFormData.link,
          content: itemFormData.content,
        } as any) as any
      );
      if (res.payload.status == 200 || res.payload.status == 201) {
        toast.success(res.payload.data.message);
        setIsItemDialogOpen(false);
        dispatch(listEcoSystems() as any);
      }
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset forms
  const resetEcoForm = () => {
    setEcoFormData({
      name: "",
      description: "",
    });
    setSelectedEcoSystem(null);
  };

  const resetItemForm = () => {
    setItemFormData({
      title: "",
      subtitle: "",
      link: "",
      content: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quản Lý Hệ Sinh Thái
            </h1>
            <p className="text-white/80">
              Quản lý các module và công cụ trong hệ sinh thái Apec
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white/80">
                Tổng Ecosystems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-white">
                  {listEcoSystem?.length || 0}
                </p>
                <Package className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white/80">
                Tổng Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-white">
                  {listEcoSystem?.reduce(
                    (total: number, eco: EcoSystem) =>
                      total + eco.ecosystem_items.length,
                    0
                  ) || 0}
                </p>
                <Layers className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white/80">
                Items có Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-white">
                  {listEcoSystem?.reduce(
                    (total: number, eco: EcoSystem) =>
                      total +
                      eco.ecosystem_items.filter((item) => item.link).length,
                    0
                  ) || 0}
                </p>
                <LinkIcon className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ecosystems List */}
        <div className="space-y-6">
          {listEcoSystem && listEcoSystem.length > 0 ? (
            listEcoSystem.map((eco: EcoSystem) => (
              <Card
                key={eco.id}
                className="bg-black/50 border-purple-500/30 hover:border-purple-500/50 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="h-6 w-6 text-purple-400" />
                        <CardTitle className="text-white text-2xl">
                          {eco.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-white/70 text-base">
                        {eco.description}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditEcoSystem(eco)}
                      className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-500/50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Sửa
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {eco.ecosystem_items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-500/30 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-lg mb-1">
                              {item.title}
                            </h4>
                            {item.subtitle && (
                              <p className="text-white/60 text-sm">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditItem(item)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 text-white h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {item.link && (
                            <div className="flex items-center gap-2 text-xs">
                              <LinkIcon className="h-3 w-3 text-blue-400 flex-shrink-0" />
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 truncate"
                              >
                                {item.link}
                              </a>
                            </div>
                          )}

                          {item.content && (
                            <div className="flex items-start gap-2 text-xs">
                              <FileText className="h-3 w-3 text-green-400 flex-shrink-0 mt-0.5" />
                              <p className="text-white/70 line-clamp-2">
                                {item.content}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="h-16 w-16 text-white/30 mb-4" />
                <p className="text-white/60 text-lg">Chưa có Ecosystem nào</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit Ecosystem Dialog */}
        <Dialog
          open={isEcoDialogOpen}
          onOpenChange={(open) => {
            setIsEcoDialogOpen(open);
            if (!open) resetEcoForm();
          }}
        >
          <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Chỉnh Sửa Ecosystem</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="eco-name" className="text-white">
                  Tên Ecosystem <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="eco-name"
                  value={ecoFormData.name}
                  onChange={(e) =>
                    setEcoFormData({ ...ecoFormData, name: e.target.value })
                  }
                  placeholder="VD: E-learning Hub"
                  className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="eco-description" className="text-white">
                  Mô Tả
                </Label>
                <Textarea
                  id="eco-description"
                  value={ecoFormData.description}
                  onChange={(e) =>
                    setEcoFormData({
                      ...ecoFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Nhập mô tả cho Ecosystem"
                  rows={3}
                  className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEcoDialogOpen(false);
                  resetEcoForm();
                }}
                disabled={isLoading}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmitEcoSystem}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Cập Nhật
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog
          open={isItemDialogOpen}
          onOpenChange={(open) => {
            setIsItemDialogOpen(open);
            if (!open) resetItemForm();
          }}
        >
          <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Chỉnh Sửa Ecosystem Item
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="item-title" className="text-white">
                  Tiêu Đề <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="item-title"
                  value={itemFormData.title}
                  onChange={(e) =>
                    setItemFormData({ ...itemFormData, title: e.target.value })
                  }
                  placeholder="VD: Video hướng dẫn"
                  className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <Label htmlFor="item-subtitle" className="text-white">
                  Phụ Đề
                </Label>
                <Input
                  id="item-subtitle"
                  value={itemFormData.subtitle}
                  onChange={(e) =>
                    setItemFormData({
                      ...itemFormData,
                      subtitle: e.target.value,
                    })
                  }
                  placeholder="VD: 30+ khóa kỹ năng và quy trình nội bộ"
                  className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Link */}
              <div className="space-y-2">
                <Label htmlFor="item-link" className="text-white">
                  Link
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="item-link"
                    type="url"
                    value={itemFormData.link}
                    onChange={(e) =>
                      setItemFormData({ ...itemFormData, link: e.target.value })
                    }
                    placeholder="https://example.com"
                    className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/50"
                  />
                  {itemFormData.link && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(itemFormData.link, "_blank")}
                      className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="item-content" className="text-white">
                  Nội Dung
                </Label>
                <Textarea
                  id="item-content"
                  value={itemFormData.content}
                  onChange={(e) =>
                    setItemFormData({
                      ...itemFormData,
                      content: e.target.value,
                    })
                  }
                  placeholder="Nhập mô tả chi tiết"
                  rows={4}
                  className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsItemDialogOpen(false);
                  resetItemForm();
                }}
                disabled={isLoading}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmitItem}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Cập Nhật
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function EcoSystemManagementPage() {
  return (
    <InternalLayout>
      <EcoSystemManagementContent />
    </InternalLayout>
  );
}
