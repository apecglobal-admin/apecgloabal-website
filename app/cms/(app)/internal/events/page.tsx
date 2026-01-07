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
  List,
  Grid,
} from "lucide-react";
import Link from "next/link";
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

// ============= UTILITY FUNCTIONS =============
const parseUTCDate = (dateString: string): string => {
  const datePart = dateString.split('T')[0];
  return datePart;
};

const formatDate = (dateString: string): string => {
  const datePart = dateString.split('T')[0];
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`;
};

const formatTime = (timeString: string): string => {
  return timeString?.substring(0, 5);
};

const createLocalDateTime = (dateString: string, timeString: string): Date => {
  const datePart = dateString.includes('T') ? dateString.split('T')[0] : dateString;
  const timePart = timeString.substring(0, 5);
  return new Date(`${datePart}T${timePart}:00`);
};

const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function EventPage() {
  const dispatch = useDispatch();
  const { events, totalEvent } = useEventData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

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

    const startDateTime = createLocalDateTime(formData.date, formData.time);
    const endDateTime = createLocalDateTime(formData.end_date, formData.end_time);

    if (endDateTime <= startDateTime) {
      return [];
    }

    return events.filter((event: Event) => {
      if (
        modalMode === "edit" &&
        selectedEvent &&
        event.id === selectedEvent.id
      ) {
        return false;
      }

      const eventStartDate = parseUTCDate(event.date);
      const eventEndDate = parseUTCDate(event.end_date);
      
      const eventStart = createLocalDateTime(eventStartDate, event.time);
      const eventEnd = createLocalDateTime(eventEndDate, event.end_time);

      const hasConflict = startDateTime < eventEnd && endDateTime > eventStart;

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

  const filteredEvents = useMemo(() => {
    if (!selectedDate || !events) return events;
    
    const dateStr = formatDateToString(selectedDate);

    return events.filter((event: Event) => {
      const eventStartDate = parseUTCDate(event.date);
      const eventEndDate = parseUTCDate(event.end_date);
      return dateStr >= eventStartDate && dateStr <= eventEndDate;
    });
  }, [selectedDate, events]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const hasEventOnDate = (date: Date) => {
    if (!events) return false;

    const dateStr = formatDateToString(date);

    return events.some((event: Event) => {
      const eventStartDate = parseUTCDate(event.date);
      const eventEndDate = parseUTCDate(event.end_date);
      return dateStr >= eventStartDate && dateStr <= eventEndDate;
    });
  };

  const getEventsOnDate = (date: Date) => {
    if (!events) return [];

    const dateStr = formatDateToString(date);

    return events.filter((event: Event) => {
      const eventStartDate = parseUTCDate(event.date);
      const eventEndDate = parseUTCDate(event.end_date);
      return dateStr >= eventStartDate && dateStr <= eventEndDate;
    });
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
        date: parseUTCDate(event.date),
        time: event.time.substring(0, 5),
        end_date: parseUTCDate(event.end_date),
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      const startDateTime = createLocalDateTime(formData.date, formData.time);
      const endDateTime = createLocalDateTime(formData.end_date, formData.end_time);

      if (endDateTime <= startDateTime) {
        toast.error("Thời gian kết thúc phải sau thời gian bắt đầu!");
        return;
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
    const deleteIds = ids
      ? Array.isArray(ids)
        ? ids
        : [ids]
      : selectedEvents;

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

  // Calendar Component
  const CalendarView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } =
      getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric",
    });
    const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    const handlePrevMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
      );
    };

    const handleNextMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
      );
    };

    const handleToday = () => {
      setCurrentMonth(new Date());
    };

    const handleDateClick = (date: Date) => {
      const eventsOnDate = getEventsOnDate(date);
      
      if (eventsOnDate.length === 1) {
        handleViewDetail(eventsOnDate[0]);
      } else if (eventsOnDate.length > 1) {
        handleViewDetail(eventsOnDate[0]);
      }
    };

    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-white/10 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <h3 className="text-xl sm:text-2xl font-bold text-white capitalize">
              {monthName}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              onClick={handleToday}
              variant="ghost"
              size="sm"
              className="flex-1 sm:flex-none bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs sm:text-sm"
            >
              Hôm nay
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handlePrevMonth}
                variant="ghost"
                size="sm"
                className="bg-slate-700 hover:bg-slate-600"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </Button>
              <Button
                onClick={handleNextMonth}
                variant="ghost"
                size="sm"
                className="bg-slate-700 hover:bg-slate-600"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </Button>
            </div>
            <Button
              onClick={() => setShowCalendar(!showCalendar)}
              variant="ghost"
              size="sm"
              className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-600 text-xs sm:text-sm text-white"
            >
              {showCalendar ? "Ẩn" : "Hiện"} Lịch
            </Button>
          </div>
        </div>

        {showCalendar && (
          <>
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-gray-400 font-semibold text-xs sm:text-sm py-1 sm:py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = new Date(year, month, day);
                const isToday = date.toDateString() === new Date().toDateString();
                const hasEvents = hasEventOnDate(date);
                const eventsCount = getEventsOnDate(date).length;

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(date)}
                    className={`
                      aspect-square p-1 sm:p-2 rounded-lg transition-all relative
                      ${isToday ? "ring-1 sm:ring-2 ring-purple-500" : ""}
                      ${
                        hasEvents
                          ? "bg-gradient-to-br from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 text-white cursor-pointer"
                          : "bg-slate-700/50 hover:bg-slate-700 text-gray-300"
                      }
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-sm sm:text-lg font-semibold">{day}</span>
                      {hasEvents && (
                        <div className="flex gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                          {Array.from({ length: Math.min(eventsCount, 3) }).map(
                            (_, i) => (
                              <div
                                key={i}
                                className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-yellow-400"
                              />
                            )
                          )}
                          {eventsCount > 3 && (
                            <span className="text-[8px] sm:text-xs text-yellow-400 ml-0.5 sm:ml-1">
                              +{eventsCount - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/50" />
                <span className="text-gray-300">Có sự kiện</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded ring-1 sm:ring-2 ring-purple-500" />
                <span className="text-gray-300">Hôm nay</span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/cms" className="hover:text-white transition-colors">
            CMS
          </Link>
          <span>/</span>
          <span className="text-white">Quản Lý Sự Kiện</span>
        </div>

        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Quản Lý Sự Kiện
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Theo dõi và quản lý tất cả sự kiện của ApecGlobal Group
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex gap-2 bg-slate-800/50 rounded-lg p-1">
              <Button
                onClick={() => setViewMode("calendar")}
                variant="ghost"
                size="sm"
                className={`flex-1 sm:flex-none ${
                  viewMode === "calendar"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Lịch</span>
              </Button>
              <Button
                onClick={() => setViewMode("list")}
                variant="ghost"
                size="sm"
                className={`flex-1 sm:flex-none ${
                  viewMode === "list"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Danh sách</span>
              </Button>
            </div>
            
            <Button
              onClick={() => handleOpenModal("create")}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Tạo Sự Kiện Mới
            </Button>
          </div>
        </div>

        {viewMode === "calendar" && <CalendarView />}

        {viewMode === "list" && filteredEvents && filteredEvents.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedEvents.length === filteredEvents.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-white font-medium text-sm sm:text-base">
                  {selectedEvents.length > 0
                    ? `Đã chọn ${selectedEvents.length} sự kiện`
                    : "Chọn tất cả"}
                </span>
              </label>

              {selectedEvents.length > 0 && (
                <Button
                  onClick={() => handleDelete()}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-sm"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Xóa {selectedEvents.length} sự kiện
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {filteredEvents.map((event: Event) => (
                <div
                  key={event.id}
                  id={`event-${event.id}`}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] ${
                    selectedEvents.includes(event.id)
                      ? "border-purple-500 ring-2 ring-purple-500/50"
                      : "border-white/10"
                  }`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={() => handleToggleSelect(event.id)}
                        className="w-4 h-4 sm:w-5 sm:h-5 mt-1 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                          {event.title}
                        </h3>
                        <span className="inline-block px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                          {event.event_type.name}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                      {event.description}
                    </p>

                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                        <span className="truncate">
                          {formatDate(event.date)} - {formatDate(event.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                        <span>
                          {formatTime(event.time)} - {formatTime(event.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                        <span className="line-clamp-1">{event.address}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewDetail(event)}
                        variant="ghost"
                        size="sm"
                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs sm:text-sm"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Xem</span>
                      </Button>
                      <Button
                        onClick={() => handleOpenModal("edit", event)}
                        variant="ghost"
                        size="sm"
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs sm:text-sm"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Sửa</span>
                      </Button>
                      <Button
                        onClick={() => handleDelete(event.id)}
                        variant="ghost"
                        size="sm"
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2 sm:px-3"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(viewMode === "list" || !selectedDate) && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalEvent || 0}
                onPageChange={handlePageChange}
                itemsPerPage={limit}
              />
            )}
          </>
        ) : viewMode === "list" ? (
          <div className="text-center py-12 sm:py-20">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-12 border border-white/10">
              <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Chưa có sự kiện nào
              </h3>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
                Chưa có sự kiện nào. Hãy tạo sự kiện mới!
              </p>
              <Button
                onClick={() => handleOpenModal("create")}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Tạo Sự Kiện Mới
              </Button>
            </div>
          </div>
        ) : null}

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
            <div className="bg-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-white/20 my-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {modalMode === "create"
                    ? "Tạo Sự Kiện Mới"
                    : "Chỉnh Sửa Sự Kiện"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div
                className={`grid ${
                  conflictingEvents.length > 0 ? "lg:grid-cols-3" : ""
                } gap-4 sm:gap-6`}
              >
                <div
                  className={
                    conflictingEvents.length > 0 ? "lg:col-span-2" : ""
                  }
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                        Tên Sự Kiện *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                        Mô Tả *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                          Ngày Bắt Đầu *
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                          Giờ Bắt Đầu *
                        </label>
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                          Ngày Kết Thúc *
                        </label>
                        <input
                          type="date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                          Giờ Kết Thúc *
                        </label>
                        <input
                          type="time"
                          name="end_time"
                          value={formData.end_time}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                        Địa Điểm *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                        Loại Sự Kiện
                      </label>
                      <select
                        name="event_type_id"
                        value={formData.event_type_id}
                        onChange={handleInputChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      <label className="text-gray-300 text-sm sm:text-base">
                        Kích hoạt sự kiện
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                      <Button
                        onClick={handleCloseModal}
                        variant="ghost"
                        className="flex-1 bg-slate-600 hover:bg-slate-700 text-sm sm:text-base"
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm sm:text-base"
                      >
                        {modalMode === "create" ? "Tạo Sự Kiện" : "Cập Nhật"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  {conflictingEvents.length > 0 ? (
                    <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                        <h3 className="text-base sm:text-lg font-semibold text-red-400">
                          Cảnh báo xung đột
                        </h3>
                      </div>
                      <p className="text-red-300 text-xs sm:text-sm mb-3 sm:mb-4">
                        Có {conflictingEvents.length} sự kiện bị trùng thời
                        gian:
                      </p>
                      <div className="space-y-2 sm:space-y-3 max-h-72 sm:max-h-96 overflow-y-auto">
                        {conflictingEvents.map((event: Event) => (
                          <div
                            key={event.id}
                            className="bg-slate-700/50 rounded-lg p-2 sm:p-3 border border-red-500/30"
                          >
                            <h4 className="text-white font-semibold text-xs sm:text-sm mb-1 sm:mb-2">
                              {event.title}
                            </h4>
                            <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs text-gray-300">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400 flex-shrink-0" />
                                <span className="truncate">
                                  {formatDate(event.date)} -{" "}
                                  {formatDate(event.end_date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400 flex-shrink-0" />
                                <span>
                                  {formatTime(event.time)} -{" "}
                                  {formatTime(event.end_time)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400 flex-shrink-0" />
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
                      <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-900 text-[10px] sm:text-xs font-bold">
                              ✓
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-green-400">
                            Không có xung đột
                          </h3>
                        </div>
                        <p className="text-green-300 text-xs sm:text-sm">
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
            <div className="bg-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-white/20 my-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white pr-4">
                  {selectedEvent.title}
                </h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm font-medium">
                      {selectedEvent.event_type.name}
                    </span>
                    <span
                      className={`inline-block px-3 sm:px-4 py-1 sm:py-2 ${
                        selectedEvent.active_status
                          ? "bg-green-500/20 text-green-300"
                          : "bg-gray-500/20 text-gray-300"
                      } rounded-full text-xs sm:text-sm font-medium`}
                    >
                      {selectedEvent.active_status
                        ? "Đang hoạt động"
                        : "Ngừng hoạt động"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2">
                      Mô Tả
                    </h3>
                    <p className="text-white leading-relaxed text-sm sm:text-base">
                      {selectedEvent.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2 sm:mb-3">
                        Thời Gian Bắt Đầu
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                        <span>{formatDate(selectedEvent.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-white mt-2 text-sm sm:text-base">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                        <span>{formatTime(selectedEvent.time)}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2 sm:mb-3">
                        Thời Gian Kết Thúc
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                        <span>{formatDate(selectedEvent.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-white mt-2 text-sm sm:text-base">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                        <span>{formatTime(selectedEvent.end_time)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2 sm:mb-3">
                      Địa Điểm
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                      <span>{selectedEvent.address}</span>
                    </div>
                  </div>

                  <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleOpenModal("edit", selectedEvent);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Chỉnh Sửa
                    </Button>
                    <Button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleDelete(selectedEvent.id);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-3 sm:p-4 border border-purple-500/30 lg:sticky lg:top-4">
                    <div className="text-center mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-purple-300">
                        Lịch Sự Kiện
                      </h3>
                    </div>

                    <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-3 sm:mb-4 transform hover:scale-105 transition-transform">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-1.5 sm:py-2">
                        <div className="text-[10px] sm:text-xs font-semibold uppercase">
                          {(() => {
                            const d = new Date(parseUTCDate(selectedEvent.date) + 'T00:00:00');
                            return d.toLocaleDateString("vi-VN", { weekday: "long" });
                          })()}
                        </div>
                      </div>
                      <div className="bg-white p-3 sm:p-4 text-center">
                        <div className="text-3xl sm:text-5xl font-bold text-gray-800">
                          {parseUTCDate(selectedEvent.date).split('-')[2]}
                        </div>
                        <div className="text-sm sm:text-lg font-semibold text-gray-600 mt-1">
                          {(() => {
                            const d = new Date(parseUTCDate(selectedEvent.date) + 'T00:00:00');
                            return d.toLocaleDateString("vi-VN", {
                              month: "long",
                              year: "numeric",
                            });
                          })()}
                        </div>
                        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-purple-600">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="font-semibold text-sm sm:text-base">
                              {formatTime(selectedEvent.time)}
                            </span>
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                            Bắt đầu
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center my-2 sm:my-3">
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                        <div className="text-gray-400 text-[10px] sm:text-xs font-semibold my-1">
                          {(() => {
                            const start = createLocalDateTime(parseUTCDate(selectedEvent.date), selectedEvent.time);
                            const end = createLocalDateTime(parseUTCDate(selectedEvent.end_date), selectedEvent.end_time);
                            const diffMs = end.getTime() - start.getTime();
                            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                            const diffDays = Math.floor(diffHours / 24);

                            if (diffDays > 0) {
                              return `${diffDays} ngày ${diffHours % 24} giờ`;
                            }
                            return `${diffHours} giờ`;
                          })()}
                        </div>
                        <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-1.5 sm:py-2">
                        <div className="text-[10px] sm:text-xs font-semibold uppercase">
                          {(() => {
                            const d = new Date(parseUTCDate(selectedEvent.end_date) + 'T00:00:00');
                            return d.toLocaleDateString("vi-VN", { weekday: "long" });
                          })()}
                        </div>
                      </div>
                      <div className="bg-white p-3 sm:p-4 text-center">
                        <div className="text-3xl sm:text-5xl font-bold text-gray-800">
                          {parseUTCDate(selectedEvent.end_date).split('-')[2]}
                        </div>
                        <div className="text-sm sm:text-lg font-semibold text-gray-600 mt-1">
                          {(() => {
                            const d = new Date(parseUTCDate(selectedEvent.end_date) + 'T00:00:00');
                            return d.toLocaleDateString("vi-VN", {
                              month: "long",
                              year: "numeric",
                            });
                          })()}
                        </div>
                        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-blue-600">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="font-semibold text-sm sm:text-base">
                              {formatTime(selectedEvent.end_time)}
                            </span>
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                            Kết thúc
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}