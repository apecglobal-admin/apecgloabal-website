"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Home,
  Users,
  BarChart3,
  FileText,
  Briefcase,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Shield,
  Building2,
  Package,
  UserPlus,
  Folder,
  CalendarClock,
  Columns4,
  Loader2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useAuthData } from "@/src/hook/authHook";
import { listSideBars, userInfoCMS } from "@/src/features/auth/authApi";

interface CMSLayoutProps {
  children: React.ReactNode;
}

// Mapping từ tên menu đến icon và màu sắc
const iconMapping: Record<string, { icon: any; color: string }> = {
  "Nhân viên": { icon: Users, color: "text-blue-400" },
  "Dự án": { icon: Briefcase, color: "text-cyan-400" },
  "Phòng ban": { icon: Folder, color: "text-pink-400" },
  "Chức vụ": { icon: Shield, color: "text-indigo-400" },
  "Sự kiện": { icon: CalendarClock, color: "text-indigo-400" },
  "Chính sách": { icon: Columns4, color: "text-indigo-400" },
  "hỗ trợ": { icon: Columns4, color: "text-indigo-400" },
  "Thông báo": { icon: Bell, color: "text-green-400" },
  "Hình ảnh": { icon: FileText, color: "text-green-400" },
  "Liên hệ": { icon: Package, color: "text-green-400" },
  "Thống kê": { icon: BarChart3, color: "text-green-400" },
  "Hệ sinh thái": { icon: Building2, color: "text-green-400" },
  "Phân quyền": { icon: Shield, color: "text-red-400" },
  Dashboard: { icon: Home, color: "text-purple-400" },
};

export default function CMSLayout({ children }: CMSLayoutProps) {
  const dispatch = useDispatch();
  const { sidebars, userInfo } = useAuthData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  const router = useRouter();
  const pathname = usePathname();

  // Load data một lần duy nhất khi layout mount
  useEffect(() => {
    const cmsToken = localStorage.getItem("cmsToken");
    if (!cmsToken) {
      router.push("/cms");
      return;
    }

    // Kiểm tra nếu đã có data trong Redux thì không cần load lại
    const hasData =  userInfo;

    console.log("hasData:", hasData);
    
    if (!hasData) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          await Promise.all([
            dispatch(listSideBars() as any),
            dispatch(userInfoCMS() as any),
          ]);
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, router, sidebars, userInfo]); 
  
  useEffect(() => {
    if (sidebars && sidebars.length > 0 && Object.keys(expandedGroups).length === 0) {
      const initialExpandedState: Record<number, boolean> = {};
      sidebars.forEach((_: any, index: number) => {
        initialExpandedState[index] = true;
      });
      setExpandedGroups(initialExpandedState);
    }
  }, [sidebars]); // Chỉ phụ thuộc vào sidebars

  const toggleGroup = (groupIndex: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupIndex]: !prev[groupIndex],
    }));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("cmsToken");
      router.push("/cms");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
        {/* Header Skeleton */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-b border-purple-500/30 z-40">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-lg bg-gray-800" />
              <Skeleton className="h-6 w-48 bg-gray-800" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full bg-gray-800" />
              <Skeleton className="h-6 w-24 bg-gray-800 hidden sm:block" />
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="fixed left-0 top-0 h-full w-64 bg-black/80 backdrop-blur-md border-r border-purple-500/30 hidden lg:block">
          <div className="p-6 h-full overflow-y-auto">
            {/* User Info Skeleton */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-full bg-gray-800" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24 bg-gray-800" />
                  <Skeleton className="h-4 w-16 bg-gray-800" />
                </div>
              </div>
              <Skeleton className="h-9 w-full rounded-md bg-gray-800" />
            </div>

            {/* Menu Skeleton */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-8 w-full rounded-lg bg-gray-800" />
                  <div className="space-y-1 pl-2">
                    <Skeleton className="h-10 w-full rounded-lg bg-gray-800/50" />
                    <Skeleton className="h-10 w-full rounded-lg bg-gray-800/50" />
                    <Skeleton className="h-10 w-full rounded-lg bg-gray-800/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Loading */}
        <div className="lg:ml-64 min-h-screen pt-16">
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-purple-500 mx-auto mb-4" />
              <p className="text-white text-sm sm:text-base">Đang tải dữ liệu....</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-b border-purple-500/30 z-40">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="lg:hidden">
              <Button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="bg-transparent border border-purple-500/30 text-white hover:bg-purple-500/20"
                size="sm"
              >
                {isSidebarOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs sm:text-sm">A</span>
              </div>
              <span className="text-sm sm:text-lg font-bold text-white truncate">
                ApecGlobal Internal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 px-2 sm:px-3"
            >
              <Bell className="h-4 w-4 sm:mr-2" />
              <Badge className="bg-red-600 text-white text-xs ml-1">5</Badge>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                <img
                  src={userInfo?.avatar_url}
                  alt="avatar"
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <span className="text-white text-xs sm:text-sm hidden sm:block truncate max-w-[100px]">
                {userInfo ? userInfo.username : "Administrator"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-black/80 backdrop-blur-md border-r border-purple-500/30 transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4 sm:p-4 h-full overflow-y-auto custom-scrollbar">
          {/* User Info */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <img
                  src={userInfo?.avatar_url}
                  alt="avatar"
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium text-sm truncate">
                  {userInfo ? userInfo.username : "Administrator"}
                </p>
                <Badge className="bg-green-600 text-white text-xs">Online</Badge>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              disabled={isLoggingOut}
              className="w-full bg-transparent border-2 border-red-500/50 text-red-300 hover:bg-red-500/20 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang đăng xuất...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng Xuất
                </>
              )}
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {sidebars && sidebars.length > 0 ? (
              sidebars.map((group: any, groupIndex: number) => (
                <div key={groupIndex} className="mb-2">
                  {/* Group Header - Clickable */}
                  <button
                    onClick={() => toggleGroup(groupIndex)}
                    className="w-full flex items-center justify-between px-3 sm:px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider truncate">
                      {group.name}
                    </span>
                    {expandedGroups[groupIndex] ? (
                      <ChevronUp className="h-4 w-4 text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
                    )}
                  </button>

                  {/* Group Items - Collapsible */}
                  <div
                    className={`mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                      expandedGroups[groupIndex]
                        ? "max-h-[2000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {group.permission_groups &&
                      group.permission_groups.map(
                        (item: any, itemIndex: number) => {
                          const iconData = iconMapping[item.name] || {
                            icon: FileText,
                            color: "text-gray-400",
                          };
                          const Icon = iconData.icon;
                          const isActive = pathname === item.href;
                          const isAdminMenu = item.name === "Phân quyền";

                          return (
                            <Link
                              key={itemIndex}
                              href={item.href}
                              prefetch={false}
                              onClick={() => setIsSidebarOpen(false)}
                            >
                              <div
                                className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 group ${
                                  isActive
                                    ? isAdminMenu
                                      ? "bg-red-500/20 border border-red-500/50 text-white"
                                      : "bg-purple-500/20 border border-purple-500/50 text-white"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                <Icon
                                  className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                                    isActive
                                      ? isAdminMenu
                                        ? "text-red-400"
                                        : "text-purple-400"
                                      : iconData.color
                                  }`}
                                />
                                <span className="font-medium text-sm truncate flex-1">
                                  {item.name}
                                </span>
                                {isActive && (
                                  <ChevronRight
                                    className={`h-4 w-4 flex-shrink-0 ${
                                      isAdminMenu
                                        ? "text-red-400"
                                        : "text-purple-400"
                                    }`}
                                  />
                                )}
                              </div>
                            </Link>
                          );
                        }
                      )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto mb-2" />
                <p className="text-white/60 text-xs sm:text-sm">Đang tải menu...</p>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center">
          <div className="bg-gray-900/90 border border-purple-500/30 rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-2xl">
            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-purple-500" />
            <div className="text-center">
              <p className="text-white text-lg sm:text-xl font-semibold mb-1">
                Đang đăng xuất...
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Vui lòng đợi trong giây lát
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen pt-16">
        <main>{children}</main>
      </div>
    </div>
  );
}