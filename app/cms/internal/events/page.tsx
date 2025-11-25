"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import InternalLayout from "@/components/cms-layout";
import { Button } from "@/components/ui/button";
import { useEventData } from "@/src/hook/eventHook";
import {
  createEvent,
  listEvent,
  updateEvent,
  deleteEvents,
} from "@/src/features/event/eventApi";
import { toast } from "sonner";
import Pagination from "@/components/pagination";

interface EventType {
  id: number;
  name: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  event_type_id: string;
  active_status: boolean;
  event_status_id: string | null;
  feedback: string | null;
  created_at: string;
  updated_at: string;
  registations: boolean;
  registed_at: string | null;
  end_time: string;
  end_date: string;
  event_type: EventType;
  event_employees: any;
}

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  end_date: string;
  end_time: string;
  address: string;
  event_type_id: string;
  active_status: boolean;
}

export default function EventPage() {
  const dispatch = useDispatch();
  const { events, totalEvent } = useEventData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    end_date: "",
    end_time: "",
    address: "",
    event_type_id: "1",
    active_status: true,
  });

  useEffect(() => {
    dispatch(listEvent({ limit, page } as any) as any);
  }, [dispatch, page, limit, totalEvent]);

  const totalPages = Math.ceil((totalEvent || 0) / limit);

  // Kiểm tra xung đột thời gian
  const conflictingEvents = useMemo(() => {
    if (
      !formData.date ||
      !formData.time ||
      !formData.end_date ||
      !formData.end_time ||
      !events
    ) {
      return [];
    }

    const startDateTime = new Date(`${formData.date}T${formData.time}`);
    const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);

    // Kiểm tra tính hợp lệ của thời gian
    if (endDateTime <= startDateTime) {
      return [];
    }

    return events.filter((event: Event) => {
      // Bỏ qua sự kiện đang được chỉnh sửa
      if (
        modalMode === "edit" &&
        selectedEvent &&
        event.id === selectedEvent.id
      ) {
        return false;
      }

      const eventStart = new Date(`${event.date.split("T")[0]}T${event.time}`);
      const eventEnd = new Date(
        `${event.end_date.split("T")[0]}T${event.end_time}`
      );

      const hasConflict =
        (startDateTime >= eventStart && startDateTime < eventEnd) ||
        (endDateTime > eventStart && endDateTime <= eventEnd) ||
        (startDateTime <= eventStart && endDateTime >= eventEnd);

      return hasConflict;
    });
  }, [
    formData.date,
    formData.time,
    formData.end_date,
    formData.end_time,
    events,
    modalMode,
    selectedEvent,
  ]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatTime = (timeString: string): string => {
    return timeString?.substring(0, 5);
  };

  const handleToggleSelect = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map((event: Event) => event.id));
    }
  };

  const handleOpenModal = (
    mode: "create" | "edit",
    event: Event | null = null
  ) => {
    setModalMode(mode);
    if (event) {
      setSelectedEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date.split("T")[0],
        time: event.time.substring(0, 5),
        end_date: event.end_date.split("T")[0],
        end_time: event.end_time.substring(0, 5),
        address: event.address,
        event_type_id: event.event_type_id,
        active_status: event.active_status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        end_date: "",
        end_time: "",
        address: "",
        event_type_id: "1",
        active_status: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleViewDetail = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Kiểm tra thời gian hợp lệ
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);

      if (endDateTime <= startDateTime) {
        toast.error("Thời gian kết thúc phải sau thời gian bắt đầu!");
        return;
      }

      // Cảnh báo nếu có xung đột nhưng vẫn cho phép tạo
      if (conflictingEvents.length > 0) {
        const confirmCreate = confirm(
          `Có ${conflictingEvents.length} sự kiện bị trùng thời gian. Bạn có chắc chắn muốn tiếp tục?`
        );
        if (!confirmCreate) return;
      }

      if (modalMode === "create") {
        const res = await dispatch(createEvent(formData) as any);
        if (res.payload.status == 200 || res.payload.status == 201) {
          toast.success(res.payload.data.message);
          handleCloseModal();
        }
      } else if (modalMode === "edit" && selectedEvent) {
        const res = await dispatch(
          updateEvent({ id: selectedEvent.id, ...formData }) as any
        );
        if (res.payload.status == 200 || res.payload.status == 201) {
          toast.success(res.payload.data.message);
          handleCloseModal();
        }
      }
      dispatch(listEvent({ limit, page } as any) as any);
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  const handleDelete = async (ids?: string | string[]) => {
    const deleteIds = ids ? (Array.isArray(ids) ? ids : [ids]) : selectedEvents;

    if (deleteIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sự kiện để xóa");
      return;
    }

    const confirmMessage =
      deleteIds.length === 1
        ? "Bạn có chắc chắn muốn xóa sự kiện này?"
        : `Bạn có chắc chắn muốn xóa ${deleteIds.length} sự kiện đã chọn?`;

    if (confirm(confirmMessage)) {
      try {
        const res = await dispatch(deleteEvents(deleteIds as any) as any);
        if (res.payload.status === 200 || res.payload.status === 201) {
          toast.success(res.payload.data.message);
          setSelectedEvents([]);
          dispatch(listEvent({ limit, page } as any) as any);
        }
      } catch (error) {
        console.error("Error deleting events:", error);
        toast.error("Có lỗi xảy ra khi xóa sự kiện");
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg transition-all ${
            i === page
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/cms">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              CMS
            </Button>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white">Quản Lý Sự Kiện</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quản Lý Sự Kiện
            </h1>
            <p className="text-white/60">
              Theo dõi và quản lý tất cả sự kiện của ApecGlobal Group
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal("create")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tạo Sự Kiện Mới
          </Button>
        </div>

        {/* Events Grid */}
        {events && events.length > 0 ? (
          <>
            {/* Selection Header */}
            <div className="flex items-center justify-between mb-4 bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedEvents.length === events.length}
                  onChange={handleSelectAll}
                  className="w-5 h-5 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-white/60">
                  {selectedEvents.length > 0
                    ? `Đã chọn ${selectedEvents.length} sự kiện`
                    : "Chọn tất cả"}
                </span>
              </div>

              {selectedEvents.length > 0 && (
                <Button
                  onClick={() => handleDelete()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa {selectedEvents.length} sự kiện
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: Event) => (
                <div
                  key={event.id}
                  className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border transition-all hover:shadow-2xl ${
                    selectedEvents.includes(event.id)
                      ? "border-purple-500 ring-2 ring-purple-500/50"
                      : "border-white/20 hover:border-purple-500/50"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.id)}
                      onChange={() => handleToggleSelect(event.id)}
                      className="w-5 h-5 mt-1 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div className="flex justify-between items-start flex-1">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {event.title}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                          {event.event_type.name}
                        </span>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          event.active_status ? "bg-green-400" : "bg-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      {formatDate(event.date)} - {formatDate(event.end_date)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Clock className="w-4 h-4 text-purple-400" />
                      {formatTime(event.time)} - {formatTime(event.end_time)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      {event.address}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewDetail(event)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem
                    </Button>
                    <Button
                      onClick={() => handleOpenModal("edit", event)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Sửa
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      variant="ghost"
                      size="sm"
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalEvent}
                onPageChange={setPage}
                maxVisiblePages={5}
                itemsPerPage={limit}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-white/60 text-lg">
              Chưa có sự kiện nào. Hãy tạo sự kiện mới!
            </p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {modalMode === "create"
                    ? "Tạo Sự Kiện Mới"
                    : "Chỉnh Sửa Sự Kiện"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div
                className={`grid grid-cols-1 ${
                  conflictingEvents.length > 0 ? "lg:grid-cols-3" : ""
                } gap-6`}
              >
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Tên Sự Kiện *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Mô Tả *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Ngày Bắt Đầu *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Giờ Bắt Đầu *
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Ngày Kết Thúc *
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Giờ Kết Thúc *
                      </label>
                      <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Địa Điểm *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Loại Sự Kiện
                    </label>
                    <select
                      name="event_type_id"
                      value={formData.event_type_id}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="1">Nội bộ</option>
                      <option value="2">Công khai</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="active_status"
                      checked={formData.active_status}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                    />
                    <label className="text-gray-300">Kích hoạt sự kiện</label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleCloseModal}
                      variant="ghost"
                      className="flex-1 bg-slate-600 hover:bg-slate-700"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {modalMode === "create" ? "Tạo Sự Kiện" : "Cập Nhật"}
                    </Button>
                  </div>
                </div>

                {/* Conflict Warning Section */}
                <div className="lg:col-span-1">
                  {conflictingEvents.length > 0 ? (
                    <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <h3 className="text-lg font-semibold text-red-400">
                          Cảnh báo xung đột
                        </h3>
                      </div>

                      <p className="text-red-300 text-sm mb-4">
                        Có {conflictingEvents.length} sự kiện bị trùng thời
                        gian:
                      </p>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {conflictingEvents.map((event: Event) => (
                          <div
                            key={event.id}
                            className="bg-slate-700/50 rounded-lg p-3 border border-red-500/30"
                          >
                            <h4 className="text-white font-semibold text-sm mb-2">
                              {event.title}
                            </h4>
                            <div className="space-y-1 text-xs text-gray-300">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-red-400" />
                                <span>
                                  {formatDate(event.date)} -{" "}
                                  {formatDate(event.end_date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-red-400" />
                                <span>
                                  {formatTime(event.time)} -{" "}
                                  {formatTime(event.end_time)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-red-400" />
                                <span className="line-clamp-1">
                                  {event.address}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    formData.date &&
                    formData.time &&
                    formData.end_date &&
                    formData.end_time && (
                      <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                            <span className="text-green-900 text-xs font-bold">
                              ✓
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-green-400">
                            Không có xung đột
                          </h3>
                        </div>
                        <p className="text-green-300 text-sm">
                          Thời gian sự kiện này không trùng lặp với bất kỳ sự
                          kiện nào khác.
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {isDetailModalOpen && selectedEvent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                  {selectedEvent.title}
                </h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                    {selectedEvent.event_type.name}
                  </span>
                  <span
                    className={`inline-block ml-3 px-4 py-2 ${
                      selectedEvent.active_status
                        ? "bg-green-500/20 text-green-300"
                        : "bg-gray-500/20 text-gray-300"
                    } rounded-full text-sm font-medium`}
                  >
                    {selectedEvent.active_status
                      ? "Đang hoạt động"
                      : "Ngừng hoạt động"}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Mô Tả
                  </h3>
                  <p className="text-white leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">
                      Thời Gian Bắt Đầu
                    </h3>
                    <div className="flex items-center gap-3 text-white">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <span>{formatDate(selectedEvent.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white mt-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <span>{formatTime(selectedEvent.time)}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">
                      Thời Gian Kết Thúc
                    </h3>
                    <div className="flex items-center gap-3 text-white">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <span>{formatDate(selectedEvent.end_date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white mt-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <span>{formatTime(selectedEvent.end_time)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-3">
                    Địa Điểm
                  </h3>
                  <div className="flex items-center gap-3 text-white">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span>{selectedEvent.address}</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleOpenModal("edit", selectedEvent);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Chỉnh Sửa
                  </Button>
                  <Button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleDelete(selectedEvent.id);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </InternalLayout>
  );
}
