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
  Phone,
  Mail,
  Clock,
  Calendar,
  Edit,
  Loader2,
  Building2,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useContactData } from "@/src/hook/contactHook";
import { useDispatch } from "react-redux";
import {
  listContactInfo,
  updateContact,
} from "@/src/features/contact/contactApi";

interface ContactFormData {
  id?: string;
  title: string;
  content: string;
  email: string;
  phone: string;
  start_time: string;
  end_time: string;
  work_day_from: string;
  work_day_to: string;
}

export default function ContactManagementContent() {
  const dispatch = useDispatch();
  const { contacts } = useContactData();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    title: "",
    content: "",
    email: "",
    phone: "",
    start_time: "",
    end_time: "",
    work_day_from: "",
    work_day_to: "",
  });

  useEffect(() => {
    dispatch(listContactInfo() as any);
  }, [dispatch]);

  // Handle edit
  const handleEdit = (contact: any) => {
    setFormData({
      id: contact.id,
      title: contact.title || "",
      content: contact.content || "",
      email: contact.email || "",
      phone: contact.phone || "",
      start_time: contact.start_time || "",
      end_time: contact.end_time || "",
      work_day_from: contact.work_day_from || "",
      work_day_to: contact.work_day_to || "",
    });
    setIsEditDialogOpen(true);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!formData.title) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    setIsLoading(true);

    try {
      const res = await dispatch(
        updateContact({
          id: formData.id,
          title: formData.title,
          content: formData.content,
          email: formData.email,
          phone: formData.phone,
          start_time: formData.start_time,
          end_time: formData.end_time,
          work_day_from: formData.work_day_from,
          work_day_to: formData.work_day_to,
        } as any) as any
      );
      if (res.payload.status == 200 || res.payload.status == 201) {
        toast.success(res.payload.data.message);
        setIsEditDialogOpen(false);
      }
      // Refresh list
      dispatch(listContactInfo() as any);
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      email: "",
      phone: "",
      start_time: "",
      end_time: "",
      work_day_from: "",
      work_day_to: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quản Lý Thông Tin Liên Hệ
            </h1>
            <p className="text-white/80">
              Quản lý thông tin liên hệ và giờ làm việc của công ty
            </p>
          </div>
        </div>

        {/* Contact Information Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contacts && contacts.length > 0 ? (
            contacts.map((contact: any) => {
              return (
                <Card
                  key={contact.id}
                  className="bg-black/50 border-blue-500/30 hover:border-blue-500/50 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">
                          {contact.title}
                        </CardTitle>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(contact)}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Content */}
                    {contact.content && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-white/60 mb-1">Nội dung</p>
                        <p className="text-white font-medium">
                          {contact.content}
                        </p>
                      </div>
                    )}

                    {/* Email */}
                    {contact.email && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-white/60 mb-1">Email</p>
                        <p className="text-white font-medium truncate">
                          {contact.email}
                        </p>
                      </div>
                    )}

                    {/* Phone */}
                    {contact.phone && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-white/60 mb-1">
                          Số điện thoại
                        </p>
                        <p className="text-white font-medium">
                          {contact.phone}
                        </p>
                      </div>
                    )}

                    {/* Working Hours */}
                    {contact.start_time && contact.end_time && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-white/60" />
                          <p className="text-xs text-white/60">Giờ làm việc</p>
                        </div>
                        <p className="text-white font-medium">
                          {contact.start_time} - {contact.end_time}
                        </p>
                      </div>
                    )}

                    {/* Working Days */}
                    {contact.work_day_from && contact.work_day_to && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-3 w-3 text-white/60" />
                          <p className="text-xs text-white/60">Ngày làm việc</p>
                        </div>
                        <p className="text-white font-medium">
                          {contact.work_day_from} - {contact.work_day_to}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="bg-black/50 border-blue-500/30 col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Building2 className="h-16 w-16 text-white/30 mb-4" />
                <p className="text-white/60 text-lg">
                  Chưa có thông tin liên hệ
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent className="bg-black/90 border-blue-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Chỉnh Sửa Thông Tin Liên Hệ
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Tiêu Đề <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề (VD: Hotline, Email, Giờ Làm Việc)"
                  className="bg-black/50 border-blue-500/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-white">
                  Nội Dung
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Nhập nội dung (VD: 1900-xxxx, support@apecglobal.com)"
                  rows={3}
                  className="bg-black/50 border-blue-500/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Nhập email"
                  className="bg-black/50 border-blue-500/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Số Điện Thoại
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Nhập số điện thoại"
                  className="bg-black/50 border-blue-500/30 text-white placeholder:text-white/50"
                />
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time" className="text-white">
                    Giờ Bắt Đầu
                  </Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    className="bg-black/50 border-blue-500/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time" className="text-white">
                    Giờ Kết Thúc
                  </Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) =>
                      setFormData({ ...formData, end_time: e.target.value })
                    }
                    className="bg-black/50 border-blue-500/30 text-white"
                  />
                </div>
              </div>

              {/* Working Days */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="work_day_from" className="text-white">
                    Ngày Làm Việc Từ
                  </Label>
                  <Input
                    id="work_day_from"
                    value={formData.work_day_from}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        work_day_from: e.target.value,
                      })
                    }
                    placeholder="VD: Thứ 2"
                    className="bg-black/50 border-blue-500/30 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work_day_to" className="text-white">
                    Ngày Làm Việc Đến
                  </Label>
                  <Input
                    id="work_day_to"
                    value={formData.work_day_to}
                    onChange={(e) =>
                      setFormData({ ...formData, work_day_to: e.target.value })
                    }
                    placeholder="VD: Thứ 7"
                    className="bg-black/50 border-blue-500/30 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
                disabled={isLoading}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
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
