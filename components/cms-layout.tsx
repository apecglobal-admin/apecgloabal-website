'use client';

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Home,
  Users,
  Briefcase,
  Folder,
  Shield,
  CalendarClock,
  Columns4,
  Bell,
  FileText,
  Package,
  BarChart3,
  Building2,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  KeyRound,
  Settings
} from "lucide-react";

import { useAuthData } from "@/src/hook/authHook";
import { listSideBars, userInfoCMS, changePassword } from "@/src/features/auth/authApi";
import { logout } from "@/src/features/auth/authSlice";

// Icon mapping
const iconMapping: Record<string, { icon: any; color: string }> = {
  "Nhân viên": { icon: Users, color: "text-blue-400" },
  "Dự án": { icon: Briefcase, color: "text-cyan-400" },
  "Phòng ban": { icon: Folder, color: "text-pink-400" },
  "Chức vụ": { icon: Shield, color: "text-indigo-400" },
  "Sự kiện": { icon: CalendarClock, color: "text-indigo-400" },
  "Chính sách": { icon: Columns4, color: "text-indigo-400" },
  "Thông báo": { icon: Bell, color: "text-green-400" },
  "Hình ảnh": { icon: FileText, color: "text-green-400" },
  "Liên hệ": { icon: Package, color: "text-green-400" },
  "Thống kê": { icon: BarChart3, color: "text-green-400" },
  "Hệ sinh thái": { icon: Building2, color: "text-green-400" },
  Dashboard: { icon: Home, color: "text-purple-400" },
  "Trang chủ": { icon: Home, color: "text-purple-400" },
  Profile: { icon: Users, color: "text-blue-400" },
  "Phân quyền": { icon: Shield, color: "text-red-400" },
  "Cài đặt": { icon: Settings, color: "text-yellow-400" },
  
};

interface CMSLayoutProps {
  children: React.ReactNode;
}

export default function CMSLayout({ children }: CMSLayoutProps) {
  const dispatch = useDispatch();
  const { userInfo, sidebars } = useAuthData();
  const router = useRouter();
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});
  const [expandedSubGroups, setExpandedSubGroups] = useState<Record<string, boolean>>({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const hasLoadedData = useRef(false);

  useEffect(() => {
    const cmsToken = localStorage.getItem("cmsToken");
    if (!cmsToken) {
      router.push("/cms");
      return;
    }

    if (!hasLoadedData.current) {
      const loadData = async () => {
        try {
          await Promise.all([
            dispatch(listSideBars() as any).unwrap(),
            dispatch(userInfoCMS() as any).unwrap(),
          ]);
          hasLoadedData.current = true;
        } catch (error) {
          localStorage.removeItem("cmsToken");
          router.push("/cms");
          console.error("Error loading data:", error);
        }
      };
      loadData();
    }
  }, []);

  // Init expanded state
  useEffect(() => {
    if (sidebars && sidebars.length > 0 && Object.keys(expandedGroups).length === 0) {
      const initState: Record<number, boolean> = {};
      sidebars.forEach((_: any, i: number) => (initState[i] = true));
      setExpandedGroups(initState);
    }
  }, [sidebars]);

  const toggleGroup = (index: number) => {
    setExpandedGroups(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleSubGroup = (key: string) => {
    setExpandedSubGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("cmsToken");
      dispatch(logout());
      router.push("/cms");
    } catch {
      setIsLoggingOut(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");

    // Validation
    if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
      setPasswordError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("Mật khẩu mới không khớp");
      return;
    }

    if (passwordData.new_password.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setIsChangingPassword(true);
    try {
      await dispatch(changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      }) as any).unwrap();

      // Success
      setIsChangePasswordOpen(false);
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: ""
      });
      alert("Đổi mật khẩu thành công!");
    } catch (error: any) {
      setPasswordError(error?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClosePasswordDialog = () => {
    setIsChangePasswordOpen(false);
    setPasswordData({
      old_password: "",
      new_password: "",
      confirm_password: ""
    });
    setPasswordError("");
  };

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
                {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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

            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                    <img
                      src={userInfo?.avatar_url}
                      alt="avatar"
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-white text-xs sm:text-sm hidden sm:block truncate max-w-[100px]">
                    {userInfo?.username || "Administrator"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-white/60 hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-gray-900 border border-purple-500/30 text-white"
              >
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-purple-500/20 focus:bg-purple-500/20"
                  onClick={() => setIsChangePasswordOpen(true)}
                >
                  <KeyRound className="mr-2 h-4 w-4 text-blue-400" />
                  <span>Đổi mật khẩu</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-red-500/20 focus:bg-red-500/20 text-red-300"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={handleClosePasswordDialog}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Đổi mật khẩu</DialogTitle>
            <DialogDescription className="text-gray-400">
              Nhập mật khẩu cũ và mật khẩu mới của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="old_password" className="text-white">
                Mật khẩu cũ
              </Label>
              <Input
                id="old_password"
                type="password"
                value={passwordData.old_password}
                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                className="bg-gray-800 border-purple-500/30 text-white"
                placeholder="Nhập mật khẩu cũ"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new_password" className="text-white">
                Mật khẩu mới
              </Label>
              <Input
                id="new_password"
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                className="bg-gray-800 border-purple-500/30 text-white"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm_password" className="text-white">
                Xác nhận mật khẩu mới
              </Label>
              <Input
                id="confirm_password"
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                className="bg-gray-800 border-purple-500/30 text-white"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            {passwordError && (
              <p className="text-red-400 text-sm">{passwordError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClosePasswordDialog}
              className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-black/80 backdrop-blur-md border-r border-purple-500/30 transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4 h-full overflow-y-auto custom-scrollbar">
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
                  {userInfo?.username || "Administrator"}
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
              <LogOut className="h-4 w-4 mr-2" />
              Đăng Xuất
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {sidebars?.map((group: any, groupIndex: number) => (
              <div key={groupIndex} className="mb-2">
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

                <div
                  className={`mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                    expandedGroups[groupIndex] ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {group.permission_groups?.map((item: any, itemIndex: number) => {
                    const iconData = iconMapping[item.name] || { icon: FileText, color: "text-gray-400" };
                    const Icon = iconData.icon;
                    const subGroupKey = `${groupIndex}-${itemIndex}`;

                    // Nếu có children thì là dropdown
                    if (item.children) {
                      return (
                        <div key={itemIndex}>
                          {/* Dropdown Header */}
                          <button
                            onClick={() => toggleSubGroup(subGroupKey)}
                            className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 group text-white/70 hover:text-white hover:bg-white/10"
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${iconData.color}`} />
                              <span className="font-medium text-sm truncate">{item.name}</span>
                            </div>
                            {expandedSubGroups[subGroupKey] ? (
                              <ChevronUp className="h-4 w-4 text-white/60 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-white/60 flex-shrink-0" />
                            )}
                          </button>

                          {/* Dropdown Children */}
                          <div
                            className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                              expandedSubGroups[subGroupKey] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            {item.children.map((child: any, childIndex: number) => {
                              const childIconData = iconMapping[child.name] || { icon: FileText, color: "text-gray-400" };
                              const ChildIcon = childIconData.icon;
                              const isActive = pathname === child.href;
                              const isAdminMenu = child.name === "Phân quyền";

                              return (
                                <Link 
                                  key={childIndex} 
                                  href={child.href} 
                                  prefetch={false} 
                                  onClick={() => setIsSidebarOpen(false)}
                                >
                                  <div
                                    className={`flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-200 group ${
                                      isActive
                                        ? isAdminMenu
                                          ? "bg-red-500/20 border border-red-500/50 text-white"
                                          : "bg-purple-500/20 border border-purple-500/50 text-white"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                    }`}
                                  >
                                    <ChildIcon
                                      className={`h-4 w-4 flex-shrink-0 ${
                                        isActive ? (isAdminMenu ? "text-red-400" : "text-purple-400") : childIconData.color
                                      }`}
                                    />
                                    <span className="font-medium text-sm truncate flex-1">{child.name}</span>
                                    {isActive && (
                                      <ChevronRight
                                        className={`h-4 w-4 flex-shrink-0 ${isAdminMenu ? "text-red-400" : "text-purple-400"}`}
                                      />
                                    )}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    // Menu item thông thường (không có children)
                    const isActive = pathname === item.href;
                    const isAdminMenu = item.name === "Phân quyền";

                    return (
                      <Link key={itemIndex} href={item.href} prefetch={false} onClick={() => setIsSidebarOpen(false)}>
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
                              isActive ? (isAdminMenu ? "text-red-400" : "text-purple-400") : iconData.color
                            }`}
                          />
                          <span className="font-medium text-sm truncate flex-1">{item.name}</span>
                          {isActive && (
                            <ChevronRight
                              className={`h-4 w-4 flex-shrink-0 ${isAdminMenu ? "text-red-400" : "text-purple-400"}`}
                            />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen pt-16">
        <main>{children}</main>
      </div>
    </div>
  );
}