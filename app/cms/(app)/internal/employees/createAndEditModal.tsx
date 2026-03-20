import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Calendar,
  User,
  CreditCard,
  GraduationCap,
  FileText,
  Phone,
  Zap,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Switch } from "@/components/ui";

interface EmployeeModalProps {
  showCreateModal: boolean;
  setShowCreateModal: (open: boolean) => void;
  formData: any;
  setFormData: (data: any) => void;
  editingEmployee: any;
  departments: any[];
  positions: any[];
  contacts: any[];
  managers: any[];
  skills: any[];
  levelPositionRoles: any[];
  shiftWorks: any[];
saturdayAttendances: any[];
attendancePlaces: any[];
attendancePolicies: any[];
  handleSave: () => void;
}

const SECTIONS = [
  {
    key: "basic",
    label: "Cơ Bản",
    labelFull: "Thông Tin Cơ Bản",
    icon: User,
    fields: ["name", "email", "birthday", "gen", "birth_place", "address", "join_date"],
  },
  {
    key: "cccd",
    label: "CCCD",
    labelFull: "Thông Tin CCCD",
    icon: CreditCard,
    fields: ["citizen_card", "issue_date", "issue_place"],
  },
  {
    key: "education",
    label: "Học Vấn",
    labelFull: "Học Vấn",
    icon: GraduationCap,
    fields: ["degree_level", "major", "school_name", "graduation_year", "certificate_name"],
  },
  {
    key: "contract",
    label: "Hợp Đồng",
    labelFull: "Hợp Đồng & Lương",
    icon: FileText,
    fields: ["department_id", "position", "level_id", "contract_type", "base_salary", "allowance", "manager_id"],
  },
  {
    key: "contact",
    label: "Liên Hệ",
    labelFull: "Thông Tin Liên Hệ",
    icon: Phone,
    fields: ["phone", "emergency_contract"],
  },
  {
    key: "skills",
    label: "Kỹ Năng",
    labelFull: "Kỹ Năng",
    icon: Zap,
    fields: ["skill_group_id", "skills"],
  },
  {
  key: "attendance",
  label: "Chấm Công",
  labelFull: "Chấm Công",
  icon: Clock,
  fields: ["shift_work_id", "saturday_attendance_id", "attendance_place_id"],
},
];

const isSectionComplete = (sectionKey: string, formData: any): boolean => {
  const section = SECTIONS.find((s) => s.key === sectionKey);
  if (!section) return false;
  return section.fields.every((field) => {
    if (field === "skills") return formData.skills?.length > 0;
    const val = formData[field];
    return val !== undefined && val !== null && val !== "";
  });
};

const CreateAndEditModalEmployee: React.FC<EmployeeModalProps> = ({
  showCreateModal,
  setShowCreateModal,
  formData,
  setFormData,
  editingEmployee,
  departments,
  positions,
  contacts,
  managers,
  skills,
  levelPositionRoles,
  shiftWorks,
saturdayAttendances,
attendancePlaces,
attendancePolicies,
  handleSave,
}) => {
  const [activeSection, setActiveSection] = useState("basic");

  const currentSectionIndex = SECTIONS.findIndex((s) => s.key === activeSection);
  const completedCount = SECTIONS.filter((s) => isSectionComplete(s.key, formData)).length;

  const goNext = () => {
    if (currentSectionIndex < SECTIONS.length - 1)
      setActiveSection(SECTIONS[currentSectionIndex + 1].key);
  };
  const goPrev = () => {
    if (currentSectionIndex > 0)
      setActiveSection(SECTIONS[currentSectionIndex - 1].key);
  };

  // ── Reusable sub-components ──────────────────────────────────────────────

  const SearchableSelect = ({
    value,
    onValueChange,
    placeholder,
    items,
    labelKey = "name",
    valueKey = "id",
    searchPlaceholder = "Tìm kiếm...",
  }: any) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white w-full h-10 text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[260px] bg-[#0d0d1a] border-purple-500/30 text-white">
        <div className="px-2 pb-2 sticky top-0 bg-[#0d0d1a] z-10 border-b border-purple-500/20">
          <Input
            placeholder={searchPlaceholder}
            className="h-8 bg-purple-500/20 border-purple-500/30 text-white placeholder:text-white/50 text-sm"
            onChange={(e) => {
              const input = e.target;
              const opts = input.closest('[role="listbox"]')?.querySelectorAll('[role="option"]');
              const q = input.value.toLowerCase();
              opts?.forEach((el) => {
                (el as HTMLElement).style.display =
                  el.textContent?.toLowerCase().includes(q) ? "" : "none";
              });
            }}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        {items?.map((item: any) => (
          <SelectItem key={item[valueKey]} value={item[valueKey].toString()}>
            {item[labelKey]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const DateInput = ({ id, value, onChange, label }: any) => (
    <div>
      <Label
        htmlFor={id}
        className="text-white/60 text-[10px] mb-1.5 block font-semibold tracking-widest uppercase"
      >
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="date"
          value={value}
          onChange={onChange}
          className="bg-black/30 border-purple-500/30 text-white h-10 text-sm [color-scheme:dark] pr-10
            [&::-webkit-calendar-picker-indicator]:opacity-0
            [&::-webkit-calendar-picker-indicator]:absolute
            [&::-webkit-calendar-picker-indicator]:right-0
            [&::-webkit-calendar-picker-indicator]:w-10
            [&::-webkit-calendar-picker-indicator]:h-full
            [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
        <Calendar className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
      </div>
    </div>
  );

  const FL = ({ children }: { children: React.ReactNode }) => (
    <Label className="text-white/60 text-[10px] mb-1.5 block font-semibold tracking-widest uppercase">
      {children}
    </Label>
  );

  const FI = (placeholder: string, value: string, onChange: (v: string) => void, type = "text") => (
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-black/30 border-purple-500/30 text-white h-10 text-sm placeholder:text-white/20"
    />
  );

  // ── Section renderers ────────────────────────────────────────────────────

  const renderSection = () => {
    switch (activeSection) {
      case "basic":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {editingEmployee && (
              <div>
                <FL>Mã Nhân Viên</FL>
                <Input value={formData.id} disabled className="bg-black/20 border-purple-500/20 text-white/40 h-10 text-sm" />
              </div>
            )}
            <div>
              <FL>Họ Tên *</FL>
              {FI("Nhập họ tên", formData.name, (v) => setFormData({ ...formData, name: v }))}
            </div>
            <div>
              <FL>Email *</FL>
              {FI("email@example.com", formData.email, (v) => setFormData({ ...formData, email: v }), "email")}
            </div>
            <DateInput
              id="birthday"
              label="Ngày Sinh *"
              value={formData.birthday}
              onChange={(e: any) => setFormData({ ...formData, birthday: e.target.value })}
            />
            <div>
              <FL>Giới Tính *</FL>
              <Select
                value={formData.gen?.toString()}
                onValueChange={(v) => setFormData({ ...formData, gen: parseInt(v) })}
              >
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white h-10 text-sm w-full">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d0d1a] border-purple-500/30 text-white">
                  <SelectItem value="1">Nam</SelectItem>
                  <SelectItem value="2">Nữ</SelectItem>
                  <SelectItem value="3">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <FL>Nơi Sinh *</FL>
              {FI("Tỉnh/Thành phố", formData.birth_place, (v) => setFormData({ ...formData, birth_place: v }))}
            </div>
            <div className="sm:col-span-2">
              <FL>Địa Chỉ *</FL>
              {FI("Số nhà, đường, phường, quận, tỉnh/thành", formData.address, (v) => setFormData({ ...formData, address: v }))}
            </div>
            <DateInput
              id="join_date"
              label="Ngày Gia Nhập *"
              value={formData.join_date}
              onChange={(e: any) => setFormData({ ...formData, join_date: e.target.value })}
            />
          </div>
        );

      case "cccd":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="sm:col-span-2">
              <FL>Số CCCD *</FL>
              {FI("001234567890", formData.citizen_card, (v) => setFormData({ ...formData, citizen_card: v }))}
            </div>
            <DateInput
              id="issue_date"
              label="Ngày Cấp *"
              value={formData.issue_date}
              onChange={(e: any) => setFormData({ ...formData, issue_date: e.target.value })}
            />
            <div>
              <FL>Nơi Cấp *</FL>
              {FI("Cục Cảnh sát...", formData.issue_place, (v) => setFormData({ ...formData, issue_place: v }))}
            </div>
          </div>
        );

      case "education":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <FL>Trình Độ *</FL>
              <Select
                value={formData.degree_level}
                onValueChange={(v) => setFormData({ ...formData, degree_level: v })}
              >
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white h-10 text-sm w-full">
                  <SelectValue placeholder="Chọn trình độ" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d0d1a] border-purple-500/30 text-white">
                  {["Trung cấp", "Cao đẳng", "Đại học", "Thạc sĩ", "Tiến sĩ"].map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <FL>Chuyên Ngành *</FL>
              {FI("Công nghệ thông tin", formData.major, (v) => setFormData({ ...formData, major: v }))}
            </div>
            <div>
              <FL>Trường *</FL>
              {FI("Tên trường", formData.school_name, (v) => setFormData({ ...formData, school_name: v }))}
            </div>
            <div>
              <FL>Năm Tốt Nghiệp *</FL>
              {FI("2023", formData.graduation_year, (v) => setFormData({ ...formData, graduation_year: v }), "number")}
            </div>
            <div className="sm:col-span-2">
              <FL>Chứng Chỉ *</FL>
              {FI("AWS, PMP, TOEIC...", formData.certificate_name, (v) => setFormData({ ...formData, certificate_name: v }))}
            </div>
          </div>
        );

      case "contract":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <FL>Phòng Ban *</FL>
              <SearchableSelect
                value={formData.department_id}
                onValueChange={(v: string) => setFormData({ ...formData, department_id: v })}
                placeholder="Chọn phòng ban..."
                items={departments}
                searchPlaceholder="Tìm phòng ban..."
              />
            </div>
            <div>
              <FL>Chức Vụ *</FL>
              <SearchableSelect
                value={formData.position}
                onValueChange={(v: string) => setFormData({ ...formData, position: v })}
                placeholder="Chọn chức vụ..."
                items={positions}
                labelKey="title"
                searchPlaceholder="Tìm chức vụ..."
              />
            </div>
            <div>
              <FL>Cấp Bậc *</FL>
              <SearchableSelect
                value={formData.level_id}
                onValueChange={(v: string) => setFormData({ ...formData, level_id: v })}
                placeholder="Chọn cấp bậc..."
                items={levelPositionRoles}
                searchPlaceholder="Tìm cấp bậc..."
              />
            </div>
            <div>
              <FL>Loại Hợp Đồng *</FL>
              <Select
                value={formData.contract_type}
                onValueChange={(v) => setFormData({ ...formData, contract_type: v })}
              >
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white h-10 text-sm w-full">
                  <SelectValue placeholder="Chọn loại hợp đồng" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d0d1a] border-purple-500/30 text-white">
                  {contacts.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <FL>Lương Cơ Bản (VNĐ) *</FL>
              {FI("10,000,000", formData.base_salary, (v) => setFormData({ ...formData, base_salary: v }), "number")}
            </div>
            <div>
              <FL>Phụ Cấp (VNĐ) *</FL>
              {FI("2,000,000", formData.allowance, (v) => setFormData({ ...formData, allowance: v }), "number")}
            </div>
            <div className="sm:col-span-2">
              <FL>Người Duyệt *</FL>
              <SearchableSelect
                value={formData.manager_id}
                onValueChange={(v: string) => setFormData({ ...formData, manager_id: v })}
                placeholder="Chọn người duyệt..."
                items={managers}
                searchPlaceholder="Tìm người duyệt..."
              />
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <FL>Số Điện Thoại *</FL>
              {FI("0123456789", formData.phone, (v) => setFormData({ ...formData, phone: v }))}
            </div>
            <div>
              <FL>Liên Lạc Khẩn Cấp *</FL>
              {FI("Tên người liên hệ - SĐT", formData.emergency_contract, (v) => setFormData({ ...formData, emergency_contract: v }))}
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-4">
            <div>
              <FL>Nhóm Kỹ Năng *</FL>
              <Select
                value={formData.skill_group_id}
                onValueChange={(value) => {
                  const selectedGroup = skills.find((g: any) => g.id === Number(value));
                  setFormData({
                    ...formData,
                    skill_group_id: value,
                    skills: selectedGroup
                      ? selectedGroup.skills.map((s: any) => ({ skill_id: s.id, value: "", name: s.name }))
                      : [],
                  });
                }}
                disabled={editingEmployee !== null && formData?.skills?.length > 0}
              >
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white h-10 text-sm w-full">
                  <SelectValue placeholder="Chọn nhóm kỹ năng" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d0d1a] border-purple-500/30 text-white">
                  {skills.map((group: any) => (
                    <SelectItem key={group.id} value={group.id.toString()}>{group.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.skills?.length > 0 && (
              <div>
                <FL>Điểm Kỹ Năng (0–100) *</FL>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formData.skills.map((skill: any, index: number) => {
                    let skillName = skill.name || "";
                    if (!skillName) {
                      const group = skills.find((g: any) => g.id === Number(formData.skill_group_id));
                      skillName = group?.skills.find((s: any) => s.id === skill.skill_id)?.name || "";
                    }
                    if (!skillName) {
                      for (const group of skills) {
                        const found = group.skills?.find((s: any) => s.id === skill.skill_id);
                        if (found) { skillName = found.name; break; }
                      }
                    }
                    const val = Math.min(Math.max(Number(skill.value) || 0, 0), 100);
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2.5 border border-purple-500/20"
                      >
                        <span className="text-white/80 text-xs flex-1 leading-snug">
                          {skillName || `Skill #${skill.skill_id}`}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="hidden sm:block w-14 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-purple-500 transition-all"
                              style={{ width: `${val}%` }}
                            />
                          </div>
                          <Input
                            placeholder="—"
                            value={skill.value}
                            onChange={(e) => {
                              const newSkills = [...formData.skills];
                              newSkills[index].value = e.target.value;
                              setFormData({ ...formData, skills: newSkills });
                            }}
                            className="bg-black/30 border-purple-500/30 text-white w-14 text-center text-sm placeholder:text-white/25 h-8"
                          />
                          <span className="text-white/30 text-xs">/100</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

        case "attendance":
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <div>
        <FL>Ca Làm Việc *</FL>
        <SearchableSelect
          value={formData.shift_work_id}
          onValueChange={(v: string) => setFormData({ ...formData, shift_work_id: v })}
          placeholder="Chọn ca làm việc..."
          items={shiftWorks}
          searchPlaceholder="Tìm ca làm việc..."
        />
      </div>

      <div>
        <FL>Chế Độ Thứ 7 *</FL>
        <SearchableSelect
          value={formData.saturday_attendance_id}
          onValueChange={(v: string) => setFormData({ ...formData, saturday_attendance_id: v })}
          placeholder="Chọn chế độ Thứ 7..."
          items={saturdayAttendances}
          searchPlaceholder="Tìm..."
        />
      </div>

      <div>
        <FL>Địa Điểm Chấm Công *</FL>
        <SearchableSelect
          value={formData.attendance_place_id}
          onValueChange={(v: string) => setFormData({ ...formData, attendance_place_id: v })}
          placeholder="Chọn địa điểm..."
          items={attendancePlaces}
          searchPlaceholder="Tìm địa điểm..."
        />
      </div>

      <div>
        <FL>Chính Sách Chấm Công</FL>
        <SearchableSelect
          value={formData.attendance_policy_id}
          onValueChange={(v: string) => setFormData({ ...formData, attendance_policy_id: v })}
          placeholder="Chọn chính sách..."
          items={attendancePolicies}
          searchPlaceholder="Tìm chính sách..."
        />
      </div>

      <div>
        <FL>Số Công Hiện Có</FL>
        {FI("17", formData.leave_grant, (v: string) => setFormData({ ...formData, leave_grant: v }), "number")}
        <p className="text-[10px] text-white/30 mt-1">
          Đã dùng: {(editingEmployee as any)?.leave_usage ?? 0} công
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <FL>Miễn Chấm Công</FL>
        <div className="flex items-center gap-3 h-10 px-3 bg-black/30 border border-purple-500/30 rounded-md">
          <Switch
            checked={!!formData.is_attendance}
            onCheckedChange={(v: boolean) => setFormData({ ...formData, is_attendance: v })}
            className="
    data-[state=checked]:bg-green-500
    data-[state=unchecked]:bg-gray-600
  "
          />
          <span className="text-sm text-white/60">
            {formData.is_attendance ? "Miễn chấm công" : "Phải chấm công"}
          </span>
        </div>
      </div>

      {/* Info chips cho ca làm việc đã chọn */}
      {formData.shift_work_id && (() => {
        const sw = shiftWorks?.find((s: any) => s.id === formData.shift_work_id);
        return sw ? (
          <div className="sm:col-span-2 flex gap-3 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2">
            <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs text-white/60">
              <span className="text-white/80 font-medium">{sw.name}</span>
              <span className="ml-2">Check-in: <span className="text-purple-300">{sw.checkin?.slice(0,5)}</span></span>
              <span className="ml-2">Check-out: <span className="text-purple-300">{sw.checkout?.slice(0,5)}</span></span>
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
      default:
        return null;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
      <DialogContent
        className="
          bg-[#080812] border-purple-500/20 text-white p-0 overflow-hidden
          flex flex-col
          w-screen h-[100dvh] max-w-none rounded-none
          sm:w-[95vw] sm:max-w-5xl sm:h-[90vh] sm:rounded-xl
        "
      >
        {/* ── Header ── */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-purple-500/20 shrink-0 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-sm sm:text-lg font-semibold text-white leading-tight">
              {editingEmployee ? "Chỉnh Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
            </DialogTitle>
            <p className="text-[10px] text-white/35 mt-0.5 hidden sm:block">
              Điền đầy đủ thông tin theo từng mục
            </p>
          </div>
          {/* Progress dots */}
          <div className="shrink-0 flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
            {SECTIONS.map((s) => (
              <div
                key={s.key}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isSectionComplete(s.key, formData)
                    ? "bg-green-400"
                    : s.key === activeSection
                    ? "bg-purple-400"
                    : "bg-white/15"
                }`}
              />
            ))}
            <span className="text-[10px] text-white/35 ml-1">{completedCount}/{SECTIONS.length}</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* ── DESKTOP SIDEBAR ── */}
          <aside className="hidden sm:flex w-52 shrink-0 flex-col border-r border-purple-500/20 bg-black/20 py-3 overflow-y-auto">
            <nav className="space-y-0.5 px-2">
              {SECTIONS.map((section, idx) => {
                const Icon = section.icon;
                const isActive = activeSection === section.key;
                const isDone = isSectionComplete(section.key, formData);
                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                      isActive
                        ? "bg-purple-600/25 border border-purple-500/40 text-white"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 shrink-0 flex items-center justify-center rounded-full text-[10px] font-bold ${
                        isDone ? "bg-green-500/20 text-green-400" : isActive ? "bg-purple-500/25 text-purple-300" : "bg-white/5 text-white/25"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3 h-3" /> : <span>{idx + 1}</span>}
                    </div>
                    <span className="text-xs font-medium truncate flex-1">{section.labelFull}</span>
                    {isActive && <ChevronRight className="w-3 h-3 shrink-0 text-purple-400" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── MAIN COLUMN ── */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* ── MOBILE TAB BAR ── */}
            <div className="sm:hidden shrink-0 border-b border-purple-500/20 bg-black/25">
              <div
                className="flex overflow-x-auto px-2 py-2 gap-1.5"
                style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
              >
                {SECTIONS.map((section, idx) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.key;
                  const isDone = isSectionComplete(section.key, formData);
                  return (
                    <button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-150 ${
                        isActive
                          ? "bg-purple-600/30 border border-purple-500/40"
                          : "border border-transparent active:bg-white/5"
                      }`}
                    >
                      <div className="relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isDone ? "bg-green-500/20" : isActive ? "bg-purple-500/30" : "bg-white/8"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : (
                            <Icon className={`w-4 h-4 ${isActive ? "text-purple-300" : "text-white/30"}`} />
                          )}
                        </div>
                        <span
                          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                            isActive ? "bg-purple-500 text-white" : isDone ? "bg-green-600 text-white" : "bg-white/10 text-white/30"
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-medium whitespace-nowrap leading-tight ${
                          isActive ? "text-white" : "text-white/35"
                        }`}
                      >
                        {section.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Section title bar ── */}
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-purple-500/10 shrink-0 bg-white/[0.015] flex items-center gap-2.5">
              {(() => {
                const section = SECTIONS.find((s) => s.key === activeSection)!;
                const Icon = section.icon;
                return (
                  <>
                    <div className="w-7 h-7 rounded-md bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white leading-tight">{section.labelFull}</h3>
                      <p className="text-[10px] text-white/30">Bước {currentSectionIndex + 1} / {SECTIONS.length}</p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* ── Form fields ── */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              {renderSection()}
            </div>

            {/* ── Footer ── */}
            <div className="px-4 sm:px-6 py-3 border-t border-purple-500/20 shrink-0 bg-black/20">
              {/* Mobile layout */}
              <div className="flex flex-col gap-2 sm:hidden">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goPrev}
                    disabled={currentSectionIndex === 0}
                    className="border-purple-500/30 text-white/70 hover:text-white hover:bg-purple-500/10 text-xs h-10 disabled:opacity-25"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                    Trước
                  </Button>
                  <Button
                    size="sm"
                    onClick={goNext}
                    disabled={currentSectionIndex === SECTIONS.length - 1}
                    className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 text-xs h-10 disabled:opacity-25"
                  >
                    Tiếp
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                    className="border-white/15 text-white/50 hover:text-white hover:bg-white/5 text-xs h-10"
                  >
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 text-xs h-10"
                  >
                    {editingEmployee ? "Cập Nhật" : "Thêm Mới"}
                  </Button>
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden sm:flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  {currentSectionIndex > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goPrev}
                      className="border-purple-500/30 text-white/70 hover:text-white hover:bg-purple-500/10 text-xs h-8"
                    >
                      ← Trước
                    </Button>
                  )}
                  {currentSectionIndex < SECTIONS.length - 1 && (
                    <Button
                      size="sm"
                      onClick={goNext}
                      className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 text-xs h-8"
                    >
                      Tiếp →
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                    className="border-white/20 text-white/60 hover:text-white hover:bg-white/5 text-xs h-8"
                  >
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 text-xs h-8 px-4"
                  >
                    {editingEmployee ? "Cập Nhật" : "Thêm Mới"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAndEditModalEmployee;