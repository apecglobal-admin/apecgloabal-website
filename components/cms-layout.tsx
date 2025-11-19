"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Shield,
  Building2,
  Package,
  UserPlus,
  Folder,
  CalendarClock,
  Columns4,
} from "lucide-react";

interface InternalLayoutProps {
  children: React.ReactNode;
}

export default function InternalLayout({ children }: InternalLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cmsToken = localStorage.getItem("cmsToken");
    if (!cmsToken) {
      router.push("/cms");
    }
  }, []);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/cms/dashboard",
      icon: Home,
      color: "text-purple-400",
    },
    {
      name: "Nhân Viên",
      href: "/cms/employees",
      icon: Users,
      color: "text-blue-400",
    },
    {
      name: "Dự Án",
      href: "/cms/projects",
      icon: Briefcase,
      color: "text-cyan-400",
    },
    {
      name: "Phòng Ban",
      href: "/cms/departments",
      icon: Folder,
      color: "text-pink-400",
    },
    {
      name: "Chức Vụ",
      href: "/cms/positions",
      icon: Shield,
      color: "text-indigo-400",
    },
    {
      name: "Sự kiện",
      href: "/cms/events",
      icon: CalendarClock,
      color: "text-indigo-400",
    },
    {
      name: "Chính sách",
      href: "/cms/policies",
      icon: Columns4,
      color: "text-indigo-400",
    },
    {
      name: "Hỗ trợ",
      href: "/cms/supports",
      icon: Columns4,
      color: "text-indigo-400",
    },
    {
      name: "Báo Cáo",
      href: "/cms/reports",
      icon: BarChart3,
      color: "text-green-400",
    },
    {
      name: "Tin Tức",
      href: "/cms/news",
      icon: FileText,
      color: "text-yellow-400",
    },
    {
      name: "Tài Liệu",
      href: "/cms/documents",
      icon: FileText,
      color: "text-orange-400",
    },
    {
      name: "Dịch Vụ",
      href: "/cms/services",
      icon: Package,
      color: "text-emerald-400",
    },
    {
      name: "Tuyển Dụng",
      href: "/cms/jobs",
      icon: UserPlus,
      color: "text-amber-400",
    },
    {
      name: "Cài Đặt",
      href: "/cms/settings",
      icon: Settings,
      color: "text-gray-400",
    },
  ];

  const adminMenuItems = [
    {
      name: "Công Ty",
      href: "/cms/companies",
      icon: Building2,
      color: "text-indigo-400",
    },
    {
      name: "Phân Quyền",
      href: "/cms/roles",
      icon: Shield,
      color: "text-red-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("cmsToken");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-b border-purple-500/30 z-40">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
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
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-bold text-white">
                ApecGlobal Internal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <Bell className="h-4 w-4 mr-2" />
              <Badge className="bg-red-600 text-white text-xs ml-1">5</Badge>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">AD</span>
              </div>
              <span className="text-white text-sm hidden sm:block">
                Administrator
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
        <div className="p-6 h-full overflow-y-auto custom-scrollbar">
          {/* User Info */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AD</span>
              </div>
              <div>
                <p className="text-white font-medium">Administrator</p>
                <Badge className="bg-green-600 text-white text-xs">
                  Online
                </Badge>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full bg-transparent border-2 border-red-500/50 text-red-300 hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng Xuất
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">
              Menu Chính
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-purple-500/20 border border-purple-500/50 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive ? "text-purple-400" : item.color
                      }`}
                    />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 ml-auto text-purple-400" />
                    )}
                  </div>
                </Link>
              );
            })}

            {/* Admin menu */}
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4 mt-8">
              Quản Trị
            </p>
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-red-500/20 border border-red-500/50 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive ? "text-red-400" : item.color
                      }`}
                    />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 ml-auto text-red-400" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen pt-16">
        <main>{children}</main>
      </div>
    </div>
  );
}
