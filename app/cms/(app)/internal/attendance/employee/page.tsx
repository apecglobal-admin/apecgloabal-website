"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useDispatch } from "react-redux";
import { useAttendanceData } from "@/src/hook/attendanceHook";
import {
  exportExcelAttendance,
  listTimeSheet,
  notificationAttendance,
  openORLockAttendance,
} from "@/src/features/attendance/attendanceApi";
import { BellRing, Download, LockOpen, PencilOff } from "lucide-react";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const Svg = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);
const IcoUserCheck = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </Svg>
);
const IcoUserX = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="17" y1="8" x2="23" y2="14" />
    <line x1="23" y1="8" x2="17" y2="14" />
  </Svg>
);
const IcoTrendingUp = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </Svg>
);
const IcoTimer = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Svg>
);
const IcoSearch = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);
const IcoChevronLeft = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <polyline points="15 18 9 12 15 6" />
  </Svg>
);
const IcoChevronRight = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <polyline points="9 18 15 12 9 6" />
  </Svg>
);
const IcoEye = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);
const IcoDownload = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Svg>
);
const IcoMoreVertical = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </Svg>
);
const IcoPrinter = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </Svg>
);
const IcoLayoutGrid = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </Svg>
);
const IcoTable2 = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
  </Svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
interface ApiAttendance {
  id: string | null;
  day: number;
  dow: number;
  score: number | null;
  checkin: string | null;
  checkout: string | null;
}
interface ApiStatics {
  late: number;
  total_score: number;
  total_work_days: number;
}
interface ApiEmployee {
  id: number;
  name: string;
  attendances: ApiAttendance[];
  statics: ApiStatics;
}
interface TimeSheetData {
  year: number;
  month: number;
  daysInMonth: number;
  employees: ApiEmployee[];
}

// ── Score helpers ─────────────────────────────────────────────────────────────
type ScoreStatus = "off" | "present" | "late" | "absent";

function scoreToStatus(score: number | null, hasRecord: boolean): ScoreStatus {
  if (!hasRecord || score === null) return "off";
  if (score >= 0.8) return "present";
  if (score > 0) return "late";
  return "absent";
}

const STATUS_CELL: Record<ScoreStatus, { text: string; bg: string }> = {
  present: { text: "text-green-300", bg: "bg-green-500/20" },
  late: { text: "text-amber-300", bg: "bg-amber-500/20" },
  absent: { text: "text-red-300", bg: "bg-red-500/20" },
  off: { text: "text-white/20", bg: "" },
};
const STATUS_BADGE: Record<
  ScoreStatus,
  { label: string; color: string; border: string }
> = {
  present: {
    label: "Đúng giờ",
    color: "text-green-400",
    border: "border-green-500/30",
  },
  late: {
    label: "Đi muộn",
    color: "text-amber-400",
    border: "border-amber-500/30",
  },
  absent: {
    label: "Thiếu",
    color: "text-red-400",
    border: "border-red-500/30",
  },
  off: { label: "Không có", color: "text-white/30", border: "border-white/10" },
};

function shortTime(t: string | null): string {
  if (!t) return "—";
  return t.slice(0, 5);
}

const DOW_LABEL = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTH_NAMES = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];
const COL_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function buildDayGrid(
  year: number,
  month: number,
  daysInMonth: number,
): number[][] {
  const firstDow = new Date(year, month - 1, 1).getDay();
  const startOffset = firstDow === 0 ? 6 : firstDow - 1;
  const totalSlots = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const weeks: number[][] = [];
  for (let i = 0; i < totalSlots; i += 7) {
    const week: number[] = [];
    for (let j = 0; j < 7; j++) {
      const d = i + j - startOffset + 1;
      week.push(d >= 1 && d <= daysInMonth ? d : 0);
    }
    weeks.push(week);
  }
  return weeks;
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ── Drag-to-scroll hook ───────────────────────────────────────────────────────
function useDragScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.getBoundingClientRect().left;
    scrollLeftRef.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const el = containerRef.current;
    const x = e.pageX - el.getBoundingClientRect().left;
    const walk = x - startX.current;
    el.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  const stopDrag = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
      containerRef.current.style.userSelect = "";
    }
  }, []);

  return {
    containerRef,
    onMouseDown,
    onMouseMove,
    onMouseUp: stopDrag,
    onMouseLeave: stopDrag,
  };
}

// ── Attendance Sheet ──────────────────────────────────────────────────────────
function AttendanceSheet({
  employees,
  year,
  month,
  daysInMonth,
  todayStr,
}: {
  employees: ApiEmployee[];
  year: number;
  month: number;
  daysInMonth: number;
  todayStr: string;
}) {
  const weeks = buildDayGrid(year, month, daysInMonth);
  const drag = useDragScroll();

  return (
    <div
      ref={drag.containerRef}
      onMouseDown={drag.onMouseDown}
      onMouseMove={drag.onMouseMove}
      onMouseUp={drag.onMouseUp}
      onMouseLeave={drag.onMouseLeave}
      className="overflow-x-auto rounded-xl border border-purple-500/25 cursor-grab"
      style={
        {
          WebkitUserSelect: "none",
          MozUserSelect: "none",
        } as React.CSSProperties
      }
    >
      <table
        className="border-collapse text-xs"
        style={{ minWidth: `${180 + weeks.length * 7 * 30 + 100}px` }}
        // ngăn text bị bôi xanh khi drag
        onDragStart={(e) => e.preventDefault()}
      >
        <thead>
          <tr className="bg-purple-900/60">
            <th
              rowSpan={2}
              className="border border-purple-500/30 px-3 py-2 text-left text-white font-bold whitespace-nowrap bg-purple-800/50 sticky left-0 z-10 min-w-[160px]"
            >
              Họ &amp; Tên
            </th>
            {weeks.map((_, wi) => (
              <th
                key={wi}
                colSpan={7}
                className="border border-purple-500/30 px-1 py-2 text-center text-[11px] font-bold text-purple-200 bg-purple-800/60 tracking-wide"
              >
                Tuần {wi + 1}
              </th>
            ))}
            <th className="border border-purple-500/30 px-2 py-1 text-center text-[10px] font-bold text-green-300 bg-green-900/40 whitespace-nowrap">
              ✓<br />
              Đúng
            </th>
            <th className="border border-purple-500/30 px-2 py-1 text-center text-[10px] font-bold text-amber-300 bg-amber-900/40 whitespace-nowrap">
              M<br />
              Muộn
            </th>
            <th className="border border-purple-500/30 px-2 py-1 text-center text-[10px] font-bold text-red-300   bg-red-900/40   whitespace-nowrap">
              X<br />
              Thiếu
            </th>
          </tr>
          <tr className="bg-black/50">
            {weeks.map((week, wi) =>
              week.map((day, di) => {
                const isWeekend = di >= 5;
                const isToday = day
                  ? toDateStr(year, month, day) === todayStr
                  : false;
                return (
                  <th
                    key={`${wi}-${di}`}
                    className={`border border-purple-500/20 w-8 py-1 text-center font-semibold select-none
                      ${isWeekend ? "bg-purple-900/30 text-purple-400/80" : "text-white/50"}
                      ${isToday ? "ring-2 ring-inset ring-yellow-400/70" : ""}`}
                  >
                    <div className="text-[9px]">{COL_LABELS[di]}</div>
                    {day > 0 && (
                      <div
                        className={`text-[9px] font-normal mt-0.5 ${isToday ? "text-yellow-300 font-bold" : "text-white/30"}`}
                      >
                        {day}
                      </div>
                    )}
                  </th>
                );
              }),
            )}
          </tr>
        </thead>

        <tbody>
          {employees.map((emp, empIdx) => {
            const recMap: Record<number, ApiAttendance> = {};
            emp.attendances.forEach((a) => {
              recMap[a.day] = a;
            });

            let cntPresent = 0,
              cntLate = 0,
              cntAbsent = 0;
            emp.attendances.forEach((a) => {
              if (!a.id) return;
              const st = scoreToStatus(a.score, true);
              if (st === "present") cntPresent++;
              else if (st === "late") cntLate++;
              else if (st === "absent") cntAbsent++;
            });

            return (
              <tr
                key={emp.id}
                className={`${empIdx % 2 === 0 ? "bg-black/20" : "bg-white/[0.02]"} hover:bg-purple-500/5 transition-colors`}
              >
                <td className="border border-purple-500/20 px-3 py-1.5 font-medium text-white/85 whitespace-nowrap sticky left-0 z-10 bg-[#0a0818]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/25 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <span className="text-purple-300 text-[10px] font-bold">
                        {(emp.name.split(" ").pop() ?? emp.name)[0]}
                      </span>
                    </div>
                    <span className="truncate max-w-[120px]">{emp.name}</span>
                  </div>
                </td>

                {weeks.map((week, wi) =>
                  week.map((day, di) => {
                    const isWeekend = di >= 5;
                    if (day === 0)
                      return (
                        <td
                          key={`${wi}-${di}`}
                          className={`border border-purple-500/10 w-8 h-8 ${isWeekend ? "bg-purple-900/10" : ""}`}
                        />
                      );

                    const rec = recMap[day];
                    const hasRec = !!rec?.id;
                    const score = rec?.score ?? null;
                    const status = scoreToStatus(score, hasRec);
                    const cell = STATUS_CELL[status];
                    const isToday = toDateStr(year, month, day) === todayStr;
                    const displayScore = hasRec && score !== null ? Number(score).toFixed(3) : "";
                    const title = hasRec
                      ? `${toDateStr(year, month, day)} | Score: ${Number(score).toFixed(3)} | In: ${shortTime(rec.checkin)} Ra: ${shortTime(rec.checkout)}`
                      : toDateStr(year, month, day);

                    return (
                      <td
                        key={`${wi}-${di}`}
                        title={title}
                        className={`border border-purple-500/10 w-8 h-8 text-center align-middle select-none
                          ${isWeekend ? "bg-purple-900/10" : ""}
                          ${isToday ? "ring-2 ring-inset ring-yellow-400/60" : ""}
                          ${hasRec ? cell.bg : ""}`}
                      >
                        <span className={`text-[9px] font-bold ${cell.text}`}>
                          {displayScore}
                        </span>
                      </td>
                    );
                  }),
                )}

                <td className="border border-purple-500/20 text-center font-bold text-green-300 bg-green-900/10 px-1 text-xs">
                  {cntPresent || "—"}
                </td>
                <td className="border border-purple-500/20 text-center font-bold text-amber-300 bg-amber-900/10 px-1 text-xs">
                  {cntLate || "—"}
                </td>
                <td className="border border-purple-500/20 text-center font-bold text-red-300   bg-red-900/10   px-1 text-xs">
                  {cntAbsent || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function AttendanceDetailModal({
  employee,
  year,
  month,
  todayStr,
  open,
  onClose,
}: {
  employee: ApiEmployee | null;
  year: number;
  month: number;
  todayStr: string;
  open: boolean;
  onClose: () => void;
}) {
  if (!employee) return null;
  const records = employee.attendances.filter((a) => a.id !== null);
  const { late, total_score, total_work_days } = employee.statics;
  let cntPresent = 0,
    cntLate = 0,
    cntAbsent = 0;
  records.forEach((a) => {
    const st = scoreToStatus(a.score, true);
    if (st === "present") cntPresent++;
    else if (st === "late") cntLate++;
    else cntAbsent++;
  });
  const rate =
    total_work_days > 0 ? Math.round((total_score / total_work_days) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#080812] border-purple-500/20 text-white max-w-2xl w-[95vw] max-h-[92vh] overflow-y-auto p-0">
        <div className="bg-purple-900/35 border-b border-purple-500/20 px-5 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <DialogTitle className="text-base font-bold text-white">
              Chi Tiết Chấm Công
            </DialogTitle>
            <Button
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 gap-1.5 text-xs h-8 shrink-0"
            >
              <IcoPrinter className="w-3.5 h-3.5" /> In
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-black/30 rounded-xl px-4 py-3 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/30 border border-purple-400/40 flex items-center justify-center shrink-0">
                <span className="text-purple-200 font-bold text-base">
                  {(employee.name.split(" ").pop() ?? employee.name)[0]}
                </span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  {employee.name}
                </p>
                <p className="text-purple-300/70 text-xs">
                  {MONTH_NAMES[month - 1]} {year}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 ml-auto">
              {[
                { label: "Đúng giờ", val: cntPresent, color: "text-green-300" },
                { label: "Đi muộn", val: late, color: "text-amber-300" },
                { label: "Thiếu", val: cntAbsent, color: "text-red-300" },
                {
                  label: "Tổng điểm",
                  val: Number(total_score).toFixed(1),
                  color: "text-purple-300",
                },
                {
                  label: "Tỉ lệ",
                  val: `${rate}%`,
                  color:
                    rate >= 80
                      ? "text-green-300"
                      : rate >= 50
                        ? "text-amber-300"
                        : "text-red-300",
                },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-[10px] text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-5">
          <div>
            <p className="text-[11px] font-semibold text-white/45 uppercase tracking-wider mb-2">
              Chi tiết từng ngày
            </p>
            <div className="rounded-xl border border-purple-500/20 overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-[#0d0a1f] border-b border-purple-500/20">
                    <tr>
                      {[
                        "Ngày",
                        "Thứ",
                        "Trạng thái",
                        "Score",
                        "Giờ vào",
                        "Giờ ra",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-white/50 font-semibold whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((a) => {
                      const st = scoreToStatus(a.score, true);
                      const badge = STATUS_BADGE[st];
                      const cell = STATUS_CELL[st];
                      const isToday =
                        toDateStr(year, month, a.day) === todayStr;
                      return (
                        <tr
                          key={a.id}
                          className={`border-b border-purple-500/10 hover:bg-white/[0.025] ${isToday ? "bg-yellow-500/5" : ""}`}
                        >
                          <td className="px-3 py-1.5 text-white/70 font-medium font-mono">
                            {String(a.day).padStart(2, "0")}/
                            {String(month).padStart(2, "0")}
                          </td>
                          <td className="px-3 py-1.5 text-white/40">
                            {DOW_LABEL[a.dow]}
                          </td>
                          <td className="px-3 py-1.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-medium ${cell.bg} ${badge.color} ${badge.border}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-3 py-1.5">
                            <span className={`font-bold text-xs ${cell.text}`}>
                              {a.score !== null ? Number(a.score).toFixed(3) : "—"}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 text-white/55 font-mono">
                            {shortTime(a.checkin)}
                          </td>
                          <td className="px-3 py-1.5 text-white/55 font-mono">
                            {shortTime(a.checkout)}
                          </td>
                        </tr>
                      );
                    })}
                    {records.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-white/30"
                        >
                          Chưa có dữ liệu chấm công
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px]">
            {(["present", "late", "absent"] as ScoreStatus[]).map((st) => (
              <div key={st} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${STATUS_CELL[st].bg}`} />
                <span className={STATUS_CELL[st].text}>
                  {STATUS_BADGE[st].label}
                </span>
                <span className="text-white/30">
                  {st === "present"
                    ? "(≥80%)"
                    : st === "late"
                      ? "(0–79%)"
                      : "(≤0%)"}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="w-3 h-3 ring-2 ring-yellow-400/70 rounded-sm" />
              <span className="text-white/40">Hôm nay</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EmployeeAttendancePage() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayYear = parseInt(todayStr.slice(0, 4));
  const todayMonth = parseInt(todayStr.slice(5, 7));

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMonth, setViewMonth] = useState(todayMonth);
  const [viewYear, setViewYear] = useState(todayYear);
  const [detailEmp, setDetailEmp] = useState<ApiEmployee | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"sheet" | "table">("sheet");
  const [isExporting, setIsExporting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [isSendingNotify, setIsSendingNotify] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("cmsToken") : null;
  const dispatch = useDispatch();
  const { timeSheet } = useAttendanceData();

  useEffect(() => {
    dispatch(listTimeSheet({ token, year: viewYear, month: viewMonth }) as any);
  }, [viewYear, viewMonth]);

  const tsData = timeSheet as TimeSheetData | null | undefined;
  const employees = tsData?.employees ?? [];
  const daysInMonth =
    tsData?.daysInMonth ?? new Date(viewYear, viewMonth, 0).getDate();

  const filtered = useMemo(
    () =>
      employees.filter((emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [employees, searchTerm],
  );

  const total = employees.length;
  const isCurrentMonth = viewMonth === todayMonth && viewYear === todayYear;
  const todayDay = parseInt(todayStr.slice(8, 10));

  const todayStats = useMemo(() => {
    if (!isCurrentMonth) return null;
    let present = 0,
      late = 0,
      absent = 0,
      noData = 0;
    employees.forEach((emp) => {
      const a = emp.attendances.find((x) => x.day === todayDay);
      if (!a?.id) {
        noData++;
        return;
      }
      const st = scoreToStatus(a.score, true);
      if (st === "present") present++;
      else if (st === "late") late++;
      else absent++;
    });
    return { present, late, absent, noData };
  }, [employees, isCurrentMonth, todayDay]);

  const avgRate = useMemo(() => {
    if (!employees.length) return 0;
    const sum = employees.reduce((acc, emp) => {
      const wd = emp.statics.total_work_days || 1;
      return acc + emp.statics.total_score / wd;
    }, 0);
    return Math.round((sum / employees.length) * 100);
  }, [employees]);

  const prevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };
  const openDetail = (emp: ApiEmployee) => {
    setDetailEmp(emp);
    setDetailOpen(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await dispatch(
        exportExcelAttendance({
          token,
          year: viewYear,
          month: viewMonth,
        }) as any,
      ).unwrap();
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleLock = async () => {
    if (
      !confirm(
        "Bạn có chắc muốn khóa chấm công tháng này? Sau khi khóa, nhân viên sẽ không thể chỉnh sửa chấm công của tháng này nữa. Bạn có thể mở khóa nếu cần.",
      )
    ) {
      return;
    }
    setIsLocking(true);
    try {
      const res = await dispatch(
        openORLockAttendance({
          token,
          year: viewYear,
          month: viewMonth,
        }) as any,
      ).unwrap();

      if (
        res.status === 200 ||
        res.status === 201 ||
        res.data.statusCode === 200
      ) {
        setIsLocked((prev) => !prev);
        alert(res.data.message);
      }
    } catch (e) {
      console.error("Lock failed:", e);
    } finally {
      setIsLocking(false);
    }
  };

  const handleSendNotify = async () => {
    setIsSendingNotify(true);
    try {
      const res = await dispatch(
        notificationAttendance({
          token,
          year: viewYear,
          month: viewMonth,
        }) as any,
      ).unwrap();

      if (
        res.status === 200 ||
        res.status === 201 ||
        res.data.statusCode === 200
      ) {
        alert(res.data.message);
      }
    } catch (e) {
      console.error("Send notify failed:", e);
    } finally {
      setIsSendingNotify(false);
    }
  };

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Tổng Hợp Ngày Công
          </h1>
          <p className="text-sm text-white/60">
            Theo dõi và quản lý chấm công nhân viên
          </p>
        </div>
      </div>

      {/* Today snapshot */}
      {todayStats && (
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white">
                Tổng quan hôm nay
              </p>
              <span className="text-xs text-white/40">
                {todayStr.split("-").reverse().join("/")}
              </span>
            </div>
            <div className="flex rounded-full overflow-hidden h-3 mb-3 bg-white/5">
              {[
                { val: todayStats.present, cls: "bg-green-500" },
                { val: todayStats.late, cls: "bg-amber-500" },
                { val: todayStats.absent, cls: "bg-red-500" },
                { val: todayStats.noData, cls: "bg-white/10" },
              ].map((seg, i) =>
                seg.val > 0 ? (
                  <div
                    key={i}
                    className={`${seg.cls} transition-all`}
                    style={{ width: `${(seg.val / total) * 100}%` }}
                  />
                ) : null,
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {[
                {
                  label: "Đúng giờ",
                  val: todayStats.present,
                  color: "bg-green-500",
                },
                {
                  label: "Đi muộn",
                  val: todayStats.late,
                  color: "bg-amber-500",
                },
                { label: "Thiếu", val: todayStats.absent, color: "bg-red-500" },
                {
                  label: "Chưa có",
                  val: todayStats.noData,
                  color: "bg-white/10",
                },
              ].map((leg) => (
                <div
                  key={leg.label}
                  className="flex items-center gap-1.5 text-xs text-white/55"
                >
                  <div className={`w-2 h-2 rounded-full ${leg.color}`} />
                  {leg.label}:{" "}
                  <span className="text-white/80 font-semibold">{leg.val}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-1 bg-black/30 border border-purple-500/30 rounded-lg px-2 shrink-0">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                <IcoChevronLeft className="h-4 w-4 text-white/60" />
              </button>
              <span className="text-sm font-medium text-white px-2 min-w-[110px] text-center">
                {MONTH_NAMES[viewMonth - 1]} {viewYear}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                <IcoChevronRight className="h-4 w-4 text-white/60" />
              </button>
            </div>
            <div className="relative flex-1">
              <IcoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/35"
              />
            </div>
            <div className="flex items-center gap-1 bg-black/30 border border-purple-500/30 rounded-lg p-1 shrink-0">
              {[
                {
                  mode: "sheet" as const,
                  Icon: IcoLayoutGrid,
                  label: "Bảng công",
                },
                { mode: "table" as const, Icon: IcoTable2, label: "Tổng hợp" },
              ].map(({ mode, Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === mode
                      ? "bg-purple-600 text-white shadow"
                      : "text-white/50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main content */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader className="px-4 md:px-6 py-4">
          <CardTitle className="text-white text-base md:text-lg flex items-center justify-between">
            <span>
              {viewMode === "sheet" ? "Bảng Chấm Công" : "Tổng Hợp Ngày Công"}
              <span className="ml-2 text-sm font-normal text-white/45">
                ({filtered.length})
              </span>
            </span>
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-xs text-white/35 font-normal">
                {MONTH_NAMES[viewMonth - 1]} {viewYear}
              </span>

              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 flex items-center gap-1.5 text-sm h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Đang xuất...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> <span className="hidden sm:inline">Xuất báo cáo</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleSendNotify}
                disabled={isSendingNotify}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 flex items-center gap-1.5 text-sm h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingNotify ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <BellRing className="h-4 w-4" /><span className="hidden sm:inline"> Gửi thông báo</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleLock}
                disabled={isLocking}
                className={`bg-gradient-to-r text-white border-0 flex items-center gap-1.5 text-sm h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                  isLocked
                    ? "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    : "from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                }`}
              >
                {isLocking ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Đang xử lý...
                  </>
                ) : isLocked ? (
                  <>
                    <LockOpen className="h-4 w-4" /> <span className="hidden sm:inline">Mở bảng công</span>
                  </>
                ) : (
                  <>
                    <PencilOff className="h-4 w-4" /> <span className="hidden sm:inline">Khóa bảng công</span>
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent
          className={viewMode === "sheet" ? "px-4 md:px-6 pb-5" : "px-0 pb-4"}
        >
          {!tsData && (
            <div className="text-center py-12 text-white/40">
              Đang tải dữ liệu...
            </div>
          )}

          {tsData && viewMode === "sheet" && (
            <>
              <AttendanceSheet
                employees={filtered}
                year={viewYear}
                month={viewMonth}
                daysInMonth={daysInMonth}
                todayStr={todayStr}
              />
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px]">
                {(["present", "late", "absent"] as ScoreStatus[]).map((st) => (
                  <div key={st} className="flex items-center gap-1.5">
                    <div
                      className={`w-3 h-3 rounded-sm ${STATUS_CELL[st].bg}`}
                    />
                    <span className={STATUS_CELL[st].text}>
                      {STATUS_BADGE[st].label}
                    </span>
                    <span className="text-white/30">
                      {st === "present"
                        ? "(score ≥0.8)"
                        : st === "late"
                          ? "(0–0.79)"
                          : "(≤0)"}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 ml-auto">
                  <div className="w-3 h-3 ring-2 ring-yellow-400/70 rounded-sm" />
                  <span className="text-white/40">Hôm nay</span>
                </div>
              </div>
            </>
          )}

          {tsData && viewMode === "table" && (
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-purple-500/30">
                    <TableHead className="text-white/60 font-medium">
                      Nhân Viên
                    </TableHead>
                    <TableHead className="text-white/60 font-medium text-center">
                      Đúng Giờ
                    </TableHead>
                    <TableHead className="text-white/60 font-medium text-center">
                      Đi Muộn
                    </TableHead>
                    <TableHead className="text-white/60 font-medium text-center">
                      Thiếu
                    </TableHead>
                    <TableHead className="text-white/60 font-medium text-center">
                      Tổng Điểm
                    </TableHead>
                    <TableHead className="text-white/60 font-medium text-center">
                      Ngày Công
                    </TableHead>
                    <TableHead className="text-white/60 font-medium">
                      Tỉ Lệ
                    </TableHead>
                    <TableHead className="text-white/60 font-medium text-right">
                      Thao Tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((emp) => {
                    let cntPresent = 0,
                      cntLate = 0,
                      cntAbsent = 0;
                    emp.attendances.forEach((a) => {
                      if (!a.id) return;
                      const st = scoreToStatus(a.score, true);
                      if (st === "present") cntPresent++;
                      else if (st === "late") cntLate++;
                      else cntAbsent++;
                    });
                    const wd = emp.statics.total_work_days || 1;
                    const rate = Math.round(
                      (emp.statics.total_score / wd) * 100,
                    );
                    return (
                      <TableRow
                        key={emp.id}
                        className="border-b border-purple-500/20 hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                              <span className="text-purple-300 text-sm font-bold">
                                {(emp.name.split(" ").pop() ?? emp.name)[0]}
                              </span>
                            </div>
                            <p className="text-white font-medium text-sm">
                              {emp.name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-green-400 font-semibold">
                            {cntPresent || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={
                              cntLate > 0
                                ? "text-amber-400 font-semibold"
                                : "text-white/25"
                            }
                          >
                            {cntLate || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={
                              cntAbsent > 0
                                ? "text-red-400 font-semibold"
                                : "text-white/25"
                            }
                          >
                            {cntAbsent || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-purple-300 font-semibold">
                            {Number(emp.statics.total_score).toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-white/60 text-sm">
                            {emp.statics.total_work_days}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 min-w-[100px]">
                            <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${rate >= 80 ? "bg-green-500" : rate >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                                style={{ width: `${Math.max(0, rate)}%` }}
                              />
                            </div>
                            <span
                              className={`text-xs font-semibold w-9 text-right ${rate >= 80 ? "text-green-400" : rate >= 50 ? "text-amber-400" : "text-red-400"}`}
                            >
                              {rate}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                                >
                                  <IcoMoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-slate-900 text-white border border-white/20"
                              >
                                <DropdownMenuItem
                                  onClick={() => openDetail(emp)}
                                  className="cursor-pointer focus:bg-white/10"
                                >
                                  <IcoEye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer focus:bg-white/10">
                                  <IcoDownload className="mr-2 h-4 w-4" />
                                  Xuất dữ liệu
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-12 text-white/35"
                      >
                        Không tìm thấy nhân viên nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AttendanceDetailModal
        employee={detailEmp}
        year={viewYear}
        month={viewMonth}
        todayStr={todayStr}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
