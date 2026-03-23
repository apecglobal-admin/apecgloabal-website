"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEmployeeData } from "@/src/hook/employeeHook";
import { useDispatch } from "react-redux";
import { useCompanyData } from "@/src/hook/companyHook";
import { listEmployee, listManager } from "@/src/features/employee/employeeApi";
import { listCompanies } from "@/src/features/company/companyApi";
import { useDepartmentData } from "@/src/hook/departmentHook";
import { listDepartment } from "@/src/features/department/departmentApi";
import { useProjectData } from "@/src/hook/projectHook";
import {
  createProject,
  updateProject,
  listStatusProject,
  listProjectById,
} from "@/src/features/project/projectApi";

// ── SVG Icons (no lucide dependency) ─────────────────────────────────────────

const Svg = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

const IcoInfo       = ({ className }: { className?: string }) => <Svg className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Svg>;
const IcoCalendar   = ({ className }: { className?: string }) => <Svg className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Svg>;
const IcoBudget     = ({ className }: { className?: string }) => <Svg className={className}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Svg>;
const IcoTeam       = ({ className }: { className?: string }) => <Svg className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
const IcoDoc        = ({ className }: { className?: string }) => <Svg className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></Svg>;
const IcoChevLeft   = ({ className }: { className?: string }) => <Svg className={className}><polyline points="15 18 9 12 15 6"/></Svg>;
const IcoChevRight  = ({ className }: { className?: string }) => <Svg className={className}><polyline points="9 18 15 12 9 6"/></Svg>;
const IcoCheck      = ({ className }: { className?: string }) => <Svg className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Svg>;
const IcoSave       = ({ className }: { className?: string }) => <Svg className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></Svg>;
const IcoLoader     = ({ className }: { className?: string }) => <Svg className={className}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></Svg>;
const IcoBuilding   = ({ className }: { className?: string }) => <Svg className={className}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></Svg>;
const IcoUser       = ({ className }: { className?: string }) => <Svg className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>;
const IcoUpload     = ({ className }: { className?: string }) => <Svg className={className}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></Svg>;
const IcoX          = ({ className }: { className?: string }) => <Svg className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;
const IcoCircle     = ({ className }: { className?: string }) => <Svg className={className}><circle cx="12" cy="12" r="10"/></Svg>;
const IcoSearch     = ({ className }: { className?: string }) => <Svg className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>;
const IcoFilter     = ({ className }: { className?: string }) => <Svg className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></Svg>;

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  } catch { return ""; }
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface Project {
  id?: number;
  name: string;
  description: string;
  manager_id: number | null;
  progress: number;
  budget: number;
  spent: number;
  start_date: string;
  end_date: string;
  team_size: number;
  project_status_id: number;
  company_id: number;
  departments: number[];
  employees: number[];
  status?: string;
  priority?: string;
  technologies?: string | null;
  client_name?: string | null;
  client_contact?: string | null;
  is_featured?: boolean;
  image_url?: string | null;
  slug?: string | null;
  gallery?: any;
  features?: string | null;
  challenges?: string | null;
  solutions?: string | null;
  results?: string | null;
  testimonials?: any;
  display_order?: number;
  progress_state?: string | null;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId?: Project | null;
}

// ── Sections config ───────────────────────────────────────────────────────────

const SECTIONS = [
  {
    key: "basic",
    label: "Cơ Bản",
    labelFull: "Thông Tin Cơ Bản",
    icon: IcoInfo,
    fields: ["name", "company_id", "manager_id", "project_status_id"],
  },
  {
    key: "timeline",
    label: "Thời Gian",
    labelFull: "Thời Gian & Tiến Độ",
    icon: IcoCalendar,
    fields: ["start_date", "end_date", "progress"],
  },
  {
    key: "budget",
    label: "Ngân Sách",
    labelFull: "Ngân Sách & Quy Mô",
    icon: IcoBudget,
    fields: ["budget", "spent", "team_size"],
  },
  {
    key: "team",
    label: "Nhân Sự",
    labelFull: "Phòng Ban & Nhân Viên",
    icon: IcoTeam,
    fields: ["departments", "employees"],
  },
  {
    key: "documents",
    label: "Tài Liệu",
    labelFull: "Tài Liệu Đính Kèm",
    icon: IcoDoc,
    fields: [],
  },
];

const isSectionComplete = (sectionKey: string, formData: Project): boolean => {
  const section = SECTIONS.find((s) => s.key === sectionKey);
  if (!section || section.fields.length === 0) return false;
  return section.fields.every((field) => {
    const val = (formData as any)[field];
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null && val !== "" && val !== 0;
  });
};

// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectCreateUpdateModal({ isOpen, onClose, onSuccess, projectId = null }: ProjectModalProps) {
  const dispatch = useDispatch();
  const { employees, totalEmployees, managers } = useEmployeeData();
  const { companies, totalCompany } = useCompanyData();
  const { departments, totalDepartment } = useDepartmentData();
  const { statusProject, project } = useProjectData();

  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  // Search/filter states
  const [deptSearch, setDeptSearch]     = useState("");
  const [empSearch, setEmpSearch]       = useState("");
  const [onlySelDepts, setOnlySelDepts] = useState(false);
  const [onlySelEmps, setOnlySelEmps]   = useState(false);

  // Files
  const [selectedFiles, setSelectedFiles]         = useState<File[]>([]);
  const [existingDocs, setExistingDocs]           = useState<any[]>([]);
  const [deletedDocIds, setDeletedDocIds]         = useState<number[]>([]);

  const EMPTY_FORM: Project = {
    name: "", description: "", manager_id: null, progress: 0, budget: 0, spent: 0,
    start_date: "", end_date: "", team_size: 0, project_status_id: 1, company_id: 0,
    departments: [], employees: [], status: "planning", priority: "medium",
    technologies: null, client_name: null, client_contact: null, is_featured: false,
    image_url: null, slug: null, gallery: null, features: null, challenges: null,
    solutions: null, results: null, testimonials: null, display_order: 0, progress_state: null,
  };

  const [formData, setFormData] = useState<Project>(EMPTY_FORM);

  const isEditMode = !!project?.id;
  const currentSectionIndex = SECTIONS.findIndex((s) => s.key === activeSection);
  const completedCount = SECTIONS.filter((s) => isSectionComplete(s.key, formData)).length;

  // Load lists when open
  useEffect(() => {
    if (!isOpen) return;
    dispatch(listEmployee({ limit: totalEmployees, page: 1, search: "" } as any) as any);
    dispatch(listManager() as any);
    dispatch(listCompanies({ limit: totalCompany, page: 1, search: "" } as any) as any);
    dispatch(listDepartment({ limit: totalDepartment, page: 1, search: "" } as any) as any);
    dispatch(listStatusProject() as any);
  }, [isOpen, dispatch, totalEmployees, totalCompany, totalDepartment]);

  // Load or reset project data
  useEffect(() => {
    if (projectId) {
      dispatch(listProjectById(projectId as any) as any);
    } else {
      resetForm();
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (isOpen && projectId && project) {
      setFormData({
        ...project,
        start_date: formatDateForInput(project.start_date),
        end_date:   formatDateForInput(project.end_date),
        departments: project.departments ? project.departments.map((d: any) => d.id || d) : [],
        employees:   project.members     ? project.members.map((e: any) => e.id || e)     : [],
      });
      setExistingDocs(Array.isArray(project.documents) ? project.documents : []);
    } else if (isOpen && !projectId) {
      resetForm();
    }
  }, [isOpen, projectId, project]);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSelectedFiles([]);
    setDeletedDocIds([]);
    setDeptSearch(""); setEmpSearch("");
    setOnlySelDepts(false); setOnlySelEmps(false);
    setExistingDocs([]);
    setActiveSection("basic");
  };

  const handleClose = () => { if (!isEditMode) resetForm(); onClose(); };

  // Filtered lists
  const filteredDepts = useMemo(() => {
    let r = departments || [];
    if (deptSearch.trim()) r = r.filter((d: any) => d.name.toLowerCase().includes(deptSearch.toLowerCase()));
    if (onlySelDepts)      r = r.filter((d: any) => formData.departments.includes(d.id));
    return r;
  }, [departments, deptSearch, onlySelDepts, formData.departments]);

  const filteredEmps = useMemo(() => {
    let r = employees || [];
    if (empSearch.trim()) r = r.filter((e: any) =>
      e.name.toLowerCase().includes(empSearch.toLowerCase()) ||
      e.email.toLowerCase().includes(empSearch.toLowerCase())
    );
    if (onlySelEmps) r = r.filter((e: any) => formData.employees.includes(e.id));
    return r;
  }, [employees, empSearch, onlySelEmps, formData.employees]);

  // Actions
  const toggleDept = (id: number) => setFormData(p => ({
    ...p, departments: p.departments.includes(id) ? p.departments.filter(x => x !== id) : [...p.departments, id],
  }));
  const toggleEmp = (id: number) => setFormData(p => ({
    ...p, employees: p.employees.includes(id) ? p.employees.filter(x => x !== id) : [...p.employees, id],
  }));

  const goNext = () => { if (currentSectionIndex < SECTIONS.length - 1) setActiveSection(SECTIONS[currentSectionIndex + 1].key); };
  const goPrev = () => { if (currentSectionIndex > 0) setActiveSection(SECTIONS[currentSectionIndex - 1].key); };

  const handleSave = async () => {
    if (!formData.name || !formData.company_id) { toast.error("Vui lòng nhập tên dự án và chọn công ty"); return; }
    if (!formData.project_status_id)             { toast.error("Vui lòng chọn trạng thái dự án"); return; }
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("name",              formData.name);
      fd.append("description",       formData.description || "");
      fd.append("manager_id",        formData.manager_id?.toString() || "");
      fd.append("progress",          formData.progress?.toString() || "0");
      fd.append("budget",            formData.budget?.toString() || "0");
      fd.append("spent",             formData.spent?.toString() || "0");
      fd.append("start_date",        formData.start_date || "");
      fd.append("end_date",          formData.end_date || "");
      fd.append("team_size",         formData.team_size?.toString() || "0");
      fd.append("project_status_id", formData.project_status_id?.toString() || "");
      fd.append("company_id",        formData.company_id?.toString() || "");
      fd.append("departments",       JSON.stringify(formData.departments));
      fd.append("employees",         JSON.stringify(formData.employees));
      selectedFiles.forEach(f => fd.append("documents", f));
      if (deletedDocIds.length) fd.append("deleted_documents", JSON.stringify(deletedDocIds));

      const res = await dispatch(
        isEditMode && project?.id
          ? updateProject({ id: project.id, data: fd } as any) as any
          : createProject(fd as any) as any
      );

      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(res.payload.data.message || (isEditMode ? "Cập nhật thành công!" : "Tạo dự án thành công!"));
        onSuccess();
        handleClose();
      }
    } catch (e) {
      toast.error("Lỗi kết nối server");
    } finally {
      setSaving(false);
    }
  };

  // ── Shared field components ───────────────────────────────────────────────

  const FL = ({ children }: { children: React.ReactNode }) => (
    <Label className="text-white/60 text-[10px] mb-1.5 block font-semibold tracking-widest uppercase">
      {children}
    </Label>
  );

  const FI = (placeholder: string, value: any, onChange: (v: string) => void, type = "text") => (
    <Input type={type} placeholder={placeholder} value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-black/30 border-purple-500/30 text-white h-10 text-sm placeholder:text-white/20"
    />
  );

  const DateInput = ({ id, label, value, onChange }: any) => (
    <div>
      <FL>{label}</FL>
      <div className="relative">
        <Input id={id} type="date" value={value} onChange={onChange}
          className="bg-black/30 border-purple-500/30 text-white h-10 text-sm [color-scheme:dark] pr-10
            [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute
            [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10
            [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
        <IcoCalendar className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
      </div>
    </div>
  );

  const SearchableSelect = ({ value, onValueChange, placeholder, items, labelKey = "name", valueKey = "id", searchPlaceholder = "Tìm kiếm..." }: any) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white w-full h-10 text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[260px] bg-[#0d0d1a] border-purple-500/30 text-white">
        <div className="px-2 pb-2 sticky top-0 bg-[#0d0d1a] z-10 border-b border-purple-500/20">
          <Input placeholder={searchPlaceholder}
            className="h-8 bg-purple-500/20 border-purple-500/30 text-white placeholder:text-white/50 text-sm"
            onChange={e => {
              const opts = e.target.closest('[role="listbox"]')?.querySelectorAll('[role="option"]');
              const q = e.target.value.toLowerCase();
              opts?.forEach(el => { (el as HTMLElement).style.display = el.textContent?.toLowerCase().includes(q) ? "" : "none"; });
            }}
            onKeyDown={e => e.stopPropagation()}
          />
        </div>
        {items?.map((item: any) => (
          <SelectItem key={item[valueKey]} value={item[valueKey].toString()}>{item[labelKey]}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  // ── Section renderers ─────────────────────────────────────────────────────

  const renderSection = () => {
    switch (activeSection) {

      case "basic":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="sm:col-span-2">
              <FL>Tên Dự Án *</FL>
              {FI("Nhập tên dự án", formData.name, v => setFormData({ ...formData, name: v }))}
            </div>
            <div className="sm:col-span-2">
              <FL>Mô Tả</FL>
              <Textarea value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3} placeholder="Mô tả chi tiết về dự án"
                className="bg-black/30 border-purple-500/30 text-white text-sm placeholder:text-white/20 resize-none"
              />
            </div>
            <div>
              <FL>Công Ty *</FL>
              <SearchableSelect
                value={formData.company_id ? formData.company_id.toString() : ""}
                onValueChange={(v: string) => setFormData({ ...formData, company_id: parseInt(v), manager_id: null })}
                placeholder="Chọn công ty..."
                items={companies || []}
                searchPlaceholder="Tìm công ty..."
              />
            </div>
            <div>
              <FL>Quản Lý Dự Án</FL>
              <SearchableSelect
                value={formData.manager_id?.toString() || ""}
                onValueChange={(v: string) => setFormData({ ...formData, manager_id: v ? parseInt(v) : null })}
                placeholder="Chọn quản lý..."
                items={managers || []}
                searchPlaceholder="Tìm quản lý..."
              />
            </div>
            <div>
              <FL>Trạng Thái *</FL>
              <Select value={formData.project_status_id.toString()}
                onValueChange={v => setFormData({ ...formData, project_status_id: parseInt(v) })}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white h-10 text-sm w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d0d1a] border-purple-500/30 text-white">
                  {(statusProject || []).map((s: any) => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <FL>Ưu Tiên</FL>
              <Select value={formData.priority || "medium"}
                onValueChange={v => setFormData({ ...formData, priority: v })}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white h-10 text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0d0d1a] border-purple-500/30 text-white">
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="critical">Khẩn cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "timeline":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <DateInput id="start_date" label="Ngày Bắt Đầu"
              value={formData.start_date}
              onChange={(e: any) => setFormData({ ...formData, start_date: e.target.value })}
            />
            <DateInput id="end_date" label="Ngày Kết Thúc"
              value={formData.end_date}
              onChange={(e: any) => setFormData({ ...formData, end_date: e.target.value })}
            />
            <div className="sm:col-span-2">
              <FL>Tiến Độ: {formData.progress}%</FL>
              <div className="space-y-2">
                <input type="range" min={0} max={100} value={formData.progress}
                  onChange={e => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-full appearance-none bg-white/10 cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-purple-500"
                />
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${
                    formData.progress >= 100 ? "bg-green-500" : formData.progress >= 50 ? "bg-purple-500" : "bg-amber-500"
                  }`} style={{ width: `${formData.progress}%` }} />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <FL>Ghi Chú Tiến Độ</FL>
              {FI("Mô tả trạng thái tiến độ...", formData.progress_state || "", v => setFormData({ ...formData, progress_state: v }))}
            </div>
          </div>
        );

      case "budget":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <FL>Ngân Sách (VNĐ) *</FL>
              {FI("0", formData.budget, v => setFormData({ ...formData, budget: parseFloat(v) || 0 }), "number")}
            </div>
            <div>
              <FL>Đã Chi (VNĐ)</FL>
              {FI("0", formData.spent, v => setFormData({ ...formData, spent: parseFloat(v) || 0 }), "number")}
            </div>
            {/* Spending bar */}
            {formData.budget > 0 && (
              <div className="sm:col-span-2">
                <div className="flex justify-between text-[10px] text-white/40 mb-1">
                  <span>Tỉ lệ sử dụng ngân sách</span>
                  <span className={
                    formData.spent / formData.budget > 0.9 ? "text-red-400" :
                    formData.spent / formData.budget > 0.7 ? "text-amber-400" : "text-green-400"
                  }>
                    {Math.round((formData.spent / formData.budget) * 100)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${
                    formData.spent / formData.budget > 0.9 ? "bg-red-500" :
                    formData.spent / formData.budget > 0.7 ? "bg-amber-500" : "bg-green-500"
                  }`} style={{ width: `${Math.min((formData.spent / formData.budget) * 100, 100)}%` }} />
                </div>
              </div>
            )}
            <div>
              <FL>Quy Mô Team *</FL>
              {FI("0", formData.team_size, v => setFormData({ ...formData, team_size: parseInt(v) || 0 }), "number")}
            </div>
            <div>
              <FL>Công Nghệ Sử Dụng</FL>
              {FI("React, Node.js, PostgreSQL...", formData.technologies || "", v => setFormData({ ...formData, technologies: v }))}
            </div>
            <div>
              <FL>Tên Khách Hàng</FL>
              {FI("Tên công ty / cá nhân", formData.client_name || "", v => setFormData({ ...formData, client_name: v }))}
            </div>
            <div>
              <FL>Liên Hệ Khách Hàng</FL>
              {FI("Email / SĐT", formData.client_contact || "", v => setFormData({ ...formData, client_contact: v }))}
            </div>
          </div>
        );

      case "team":
        return (
          <div className="space-y-5">
            {/* Departments */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FL>Phòng Ban Tham Gia ({formData.departments.length})</FL>
                <div className="flex gap-1">
                  <button onClick={() => {
                    const ids = filteredDepts.map((d: any) => d.id);
                    setFormData(p => ({ ...p, departments: [...new Set([...p.departments, ...ids])] }));
                  }} className="text-[10px] text-purple-400 hover:text-purple-300 px-2 py-1 rounded hover:bg-purple-500/10">
                    Chọn tất cả
                  </button>
                  <button onClick={() => setFormData(p => ({ ...p, departments: [] }))}
                    className="text-[10px] text-white/40 hover:text-white/60 px-2 py-1 rounded hover:bg-white/5">
                    Bỏ chọn
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <IcoSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                  <Input value={deptSearch} onChange={e => setDeptSearch(e.target.value)}
                    placeholder="Tìm phòng ban..."
                    className="bg-black/30 border-purple-500/30 text-white h-9 pl-8 text-sm placeholder:text-white/25"
                  />
                </div>
                <button onClick={() => setOnlySelDepts(v => !v)}
                  className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-colors ${
                    onlySelDepts ? "bg-purple-600 border-purple-500 text-white" : "bg-black/30 border-purple-500/30 text-white/50 hover:bg-purple-500/10"
                  }`}>
                  <IcoFilter className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="bg-black/30 border border-purple-500/20 rounded-xl p-2 max-h-48 overflow-y-auto space-y-0.5">
                {!formData.company_id ? (
                  <div className="flex items-center justify-center py-8 text-white/30 text-xs gap-2">
                    <IcoBuilding className="w-4 h-4" />Chọn công ty trước
                  </div>
                ) : filteredDepts.length === 0 ? (
                  <div className="py-8 text-center text-white/30 text-xs">Không có phòng ban</div>
                ) : filteredDepts.map((dept: any) => {
                  const sel = formData.departments.includes(dept.id);
                  return (
                    <div key={dept.id} onClick={() => toggleDept(dept.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        sel ? "bg-purple-500/20 border border-purple-500/30" : "hover:bg-purple-500/10 border border-transparent"
                      }`}>
                      <div className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                        sel ? "border-purple-400 bg-purple-500" : "border-white/25"
                      }`}>
                        {sel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <IcoBuilding className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className={`text-xs flex-1 ${sel ? "text-white font-medium" : "text-white/60"}`}>{dept.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Employees */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FL>Nhân Viên Tham Gia ({formData.employees.length})</FL>
                <div className="flex gap-1">
                  <button onClick={() => {
                    const ids = filteredEmps.map((e: any) => e.id);
                    setFormData(p => ({ ...p, employees: [...new Set([...p.employees, ...ids])] }));
                  }} className="text-[10px] text-blue-400 hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-500/10">
                    Chọn tất cả
                  </button>
                  <button onClick={() => setFormData(p => ({ ...p, employees: [] }))}
                    className="text-[10px] text-white/40 hover:text-white/60 px-2 py-1 rounded hover:bg-white/5">
                    Bỏ chọn
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <IcoSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                  <Input value={empSearch} onChange={e => setEmpSearch(e.target.value)}
                    placeholder="Tìm nhân viên..."
                    className="bg-black/30 border-blue-500/30 text-white h-9 pl-8 text-sm placeholder:text-white/25"
                  />
                </div>
                <button onClick={() => setOnlySelEmps(v => !v)}
                  className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-colors ${
                    onlySelEmps ? "bg-blue-600 border-blue-500 text-white" : "bg-black/30 border-blue-500/30 text-white/50 hover:bg-blue-500/10"
                  }`}>
                  <IcoFilter className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="bg-black/30 border border-blue-500/20 rounded-xl p-2 max-h-52 overflow-y-auto space-y-0.5">
                {filteredEmps.length === 0 ? (
                  <div className="py-8 text-center text-white/30 text-xs">Không có nhân viên</div>
                ) : filteredEmps.map((emp: any) => {
                  const sel = formData.employees.includes(emp.id);
                  return (
                    <div key={emp.id} onClick={() => toggleEmp(emp.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        sel ? "bg-blue-500/20 border border-blue-500/30" : "hover:bg-blue-500/10 border border-transparent"
                      }`}>
                      <div className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                        sel ? "border-blue-400 bg-blue-500" : "border-white/25"
                      }`}>
                        {sel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                        <span className="text-blue-300 text-[9px] font-bold">{emp.name?.split(" ").pop()?.[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-tight ${sel ? "text-white font-medium" : "text-white/60"}`}>{emp.name}</p>
                        <p className="text-[10px] text-white/30 truncate">{emp.email}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="space-y-4">
            {/* Existing docs */}
            {existingDocs.length > 0 && (
              <div className="space-y-2">
                <FL>Tài Liệu Hiện Có ({existingDocs.length})</FL>
                {existingDocs.map(doc => (
                  <div key={doc.id}
                    className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/25 rounded-lg px-3 py-2.5">
                    <IcoDoc className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{doc.name}</p>
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-[10px] underline">Xem tài liệu</a>
                    </div>
                    <button onClick={() => {
                      setDeletedDocIds(p => [...p, doc.id]);
                      setExistingDocs(p => p.filter(d => d.id !== doc.id));
                    }} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors shrink-0">
                      <IcoX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Queued files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <FL>File Mới Sẽ Upload ({selectedFiles.length})</FL>
                {selectedFiles.map((file, i) => (
                  <div key={i}
                    className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/25 rounded-lg px-3 py-2.5">
                    <IcoDoc className="w-4 h-4 text-purple-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{file.name}</p>
                      <p className="text-white/30 text-[10px]">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => setSelectedFiles(p => p.filter((_, j) => j !== i))}
                      className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors shrink-0">
                      <IcoX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload zone */}
            <div>
              <FL>Thêm Tài Liệu</FL>
              <label htmlFor="proj-file-upload"
                className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-purple-500/30
                  rounded-xl p-8 cursor-pointer hover:border-purple-500/60 hover:bg-purple-500/5 transition-colors">
                <IcoUpload className="w-8 h-8 text-purple-400" />
                <div className="text-center">
                  <p className="text-white/70 text-sm font-medium">Nhấn để chọn file</p>
                  <p className="text-white/30 text-xs mt-1">PDF, DOC, XLS, TXT, hoặc hình ảnh</p>
                </div>
                <input id="proj-file-upload" type="file" multiple className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    if (files.length) { setSelectedFiles(p => [...p, ...files]); e.target.value = ""; }
                  }}
                />
              </label>
            </div>
          </div>
        );

      default: return null;
    }
  };

  if (!isOpen) return null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="
        bg-[#080812] border-purple-500/20 text-white p-0 overflow-hidden flex flex-col
        w-screen h-[100dvh] max-w-none rounded-none
        sm:w-[95vw] sm:max-w-4xl sm:h-[90vh] sm:rounded-xl
      ">

        {/* ── Header ── */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-purple-500/20 shrink-0 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-sm sm:text-lg font-semibold text-white leading-tight">
              {isEditMode ? "Cập Nhật Dự Án" : "Tạo Dự Án Mới"}
            </DialogTitle>
            <p className="text-[10px] text-white/35 mt-0.5 hidden sm:block">
              Điền đầy đủ thông tin theo từng mục
            </p>
          </div>
          {/* Progress dots */}
          <div className="shrink-0 flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
            {SECTIONS.map((s) => (
              <div key={s.key} className={`w-1.5 h-1.5 rounded-full transition-colors ${
                isSectionComplete(s.key, formData) ? "bg-green-400" :
                s.key === activeSection ? "bg-purple-400" : "bg-white/15"
              }`} />
            ))}
            <span className="text-[10px] text-white/35 ml-1">{completedCount}/{SECTIONS.length}</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden sm:flex w-52 shrink-0 flex-col border-r border-purple-500/20 bg-black/20 py-3 overflow-y-auto">
            <nav className="space-y-0.5 px-2">
              {SECTIONS.map((section, idx) => {
                const Icon = section.icon;
                const isActive = activeSection === section.key;
                const isDone = isSectionComplete(section.key, formData);
                return (
                  <button key={section.key} onClick={() => setActiveSection(section.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                      isActive ? "bg-purple-600/25 border border-purple-500/40 text-white"
                               : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                    }`}>
                    <div className={`w-5 h-5 shrink-0 flex items-center justify-center rounded-full text-[10px] font-bold ${
                      isDone ? "bg-green-500/20 text-green-400" :
                      isActive ? "bg-purple-500/25 text-purple-300" : "bg-white/5 text-white/25"
                    }`}>
                      {isDone ? <IcoCheck className="w-3 h-3" /> : <span>{idx + 1}</span>}
                    </div>
                    <span className="text-xs font-medium truncate flex-1">{section.labelFull}</span>
                    {isActive && <IcoChevRight className="w-3 h-3 shrink-0 text-purple-400" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* MAIN COLUMN */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* MOBILE TAB BAR */}
            <div className="sm:hidden shrink-0 border-b border-purple-500/20 bg-black/25">
              <div className="flex overflow-x-auto px-2 py-2 gap-1.5"
                style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
                {SECTIONS.map((section, idx) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.key;
                  const isDone = isSectionComplete(section.key, formData);
                  return (
                    <button key={section.key} onClick={() => setActiveSection(section.key)}
                      className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-150 ${
                        isActive ? "bg-purple-600/30 border border-purple-500/40" : "border border-transparent active:bg-white/5"
                      }`}>
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isDone ? "bg-green-500/20" : isActive ? "bg-purple-500/30" : "bg-white/8"
                        }`}>
                          {isDone
                            ? <IcoCheck className="w-4 h-4 text-green-400" />
                            : <Icon className={`w-4 h-4 ${isActive ? "text-purple-300" : "text-white/30"}`} />
                          }
                        </div>
                        <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                          isActive ? "bg-purple-500 text-white" : isDone ? "bg-green-600 text-white" : "bg-white/10 text-white/30"
                        }`}>{idx + 1}</span>
                      </div>
                      <span className={`text-[10px] font-medium whitespace-nowrap ${isActive ? "text-white" : "text-white/35"}`}>
                        {section.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section title bar */}
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-purple-500/10 shrink-0 bg-white/[0.015] flex items-center gap-2.5">
              {(() => {
                const section = SECTIONS.find(s => s.key === activeSection)!;
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

            {/* Form fields */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              {renderSection()}
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-purple-500/20 shrink-0 bg-black/20">

              {/* Mobile */}
              <div className="flex flex-col gap-2 sm:hidden">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={goPrev}
                    disabled={currentSectionIndex === 0}
                    className="border-purple-500/30 text-white/70 hover:text-white hover:bg-purple-500/10 text-xs h-10 disabled:opacity-25">
                    <IcoChevLeft className="w-3.5 h-3.5 mr-1" />Trước
                  </Button>
                  <Button size="sm" onClick={goNext}
                    disabled={currentSectionIndex === SECTIONS.length - 1}
                    className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 text-xs h-10 disabled:opacity-25">
                    Tiếp<IcoChevRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={handleClose}
                    className="border-white/15 text-white/50 hover:text-white hover:bg-white/5 text-xs h-10">
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 text-xs h-10">
                    {saving ? <IcoLoader className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <IcoSave className="w-3.5 h-3.5 mr-1.5" />}
                    {isEditMode ? "Cập Nhật" : "Tạo Mới"}
                  </Button>
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden sm:flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  {currentSectionIndex > 0 && (
                    <Button variant="outline" size="sm" onClick={goPrev}
                      className="border-purple-500/30 text-white/70 hover:text-white hover:bg-purple-500/10 text-xs h-8">
                      ← Trước
                    </Button>
                  )}
                  {currentSectionIndex < SECTIONS.length - 1 && (
                    <Button size="sm" onClick={goNext}
                      className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 text-xs h-8">
                      Tiếp →
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleClose}
                    className="border-white/20 text-white/60 hover:text-white hover:bg-white/5 text-xs h-8">
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 text-xs h-8 px-4">
                    {saving
                      ? <><IcoLoader className="w-3.5 h-3.5 mr-1.5 animate-spin" />{isEditMode ? "Đang lưu..." : "Đang tạo..."}</>
                      : <><IcoSave className="w-3.5 h-3.5 mr-1.5" />{isEditMode ? "Cập Nhật" : "Tạo Mới"}</>
                    }
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}