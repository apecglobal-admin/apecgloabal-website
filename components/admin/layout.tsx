"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Newspaper,
  Users,
  Tag,
  Settings,
  BarChart3,
  FileText,
  MessageSquare,
  Image as ImageIcon,
  Menu,
  X,
  LogOut,
  Home,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: { title: string; href: string }[];
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   // Lấy thông tin người dùng từ cookie hoặc localStorage
  //   const fetchUser = async () => {
  //     try {
  //       const response = await fetch("/api/users/me");
  //       if (response.ok) {
  //         const userData = await response.json();
  //         setUser(userData);
  //       } else {
  //         // Nếu không có thông tin người dùng, chuyển hướng đến trang đăng nhập
  //         router.push("/admin/login");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //       router.push("/admin/login");
  //     }
  //   };

  //   fetchUser();
  // }, []); // Chỉ chạy một lần khi component mount

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(title);
    }
  };

  const navItems: NavItem[] = [
    {
      title: "Bảng điều khiển",
      href: "/admin",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Quản lý tin tức",
      href: "/admin/news",
      icon: <Newspaper className="h-5 w-5" />,
      submenu: [
        { title: "Danh sách tin tức", href: "/admin/news" },
        { title: "Thêm tin tức mới", href: "/admin/news/create" },
      ],
    },
    {
      title: "Quản lý người dùng",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      submenu: [
        { title: "Danh sách người dùng", href: "/admin/users" },
        { title: "Thêm người dùng mới", href: "/admin/users/create" },
      ],
    },
    {
      title: "Quản lý danh mục",
      href: "/admin/categories",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: "Quản lý tác giả",
      href: "/admin/authors",
      icon: <FileText className="h-5 w-5" />,
      submenu: [
        { title: "Danh sách tác giả", href: "/admin/authors" },
        { title: "Thêm tác giả mới", href: "/admin/authors/create" },
      ],
    },
    {
      title: "Quản lý bình luận",
      href: "/admin/comments",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Quản lý hình ảnh",
      href: "/admin/images",
      icon: <ImageIcon className="h-5 w-5" />,
    },
    {
      title: "Thống kê",
      href: "/admin/statistics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Cài đặt",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b dark:border-gray-700">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold dark:text-white">ApecGlobal Admin</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex flex-col gap-1 p-2 h-[calc(100vh-4rem)] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 ${
                      pathname.startsWith(item.href) ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                    onClick={() => toggleSubmenu(item.title)}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.title}</span>
                    {openSubmenu === item.title ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  {openSubmenu === item.title && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link key={subitem.href} href={subitem.href}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start ${
                              pathname === subitem.href ? "bg-gray-100 dark:bg-gray-700" : ""
                            }`}
                          >
                            {subitem.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 ${
                      pathname === item.href ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4">
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Xem trang chủ
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-8" />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.svg" alt={user.username} />
                      <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/profile">Hồ sơ cá nhân</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings">Cài đặt</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}