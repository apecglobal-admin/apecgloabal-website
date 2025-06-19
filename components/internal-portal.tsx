"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Lock,
  Calendar,
  FileText,
  Settings,
  Users,
  Shield,
  Bell,
  BarChart3,
  Home,
  Database,
  Briefcase,
} from "lucide-react"

export default function InternalPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check login status on component mount
  useEffect(() => {
    const savedLoginStatus = localStorage.getItem("internal_logged_in")
    const savedUser = localStorage.getItem("internal_user")

    if (savedLoginStatus === "true" && savedUser) {
      setIsLoggedIn(true)
      setLoginForm({ username: savedUser, password: "" })
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo login - accept admin/123456 or demo/password
    if (
      (loginForm.username === "admin" && loginForm.password === "123456") ||
      (loginForm.username === "demo" && loginForm.password === "password") ||
      (loginForm.username && loginForm.password)
    ) {
      setIsLoggedIn(true)
      // Save login status to localStorage
      localStorage.setItem("internal_logged_in", "true")
      localStorage.setItem("internal_user", loginForm.username)
      // Redirect to dashboard
      router.push("/internal/dashboard")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("internal_logged_in")
    localStorage.removeItem("internal_user")
    setLoginForm({ username: "", password: "" })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto text-purple-400 mb-4" />
            <CardTitle className="text-white text-2xl">Đăng Nhập Hệ Thống</CardTitle>
            <p className="text-white/60">Truy cập cổng thông tin nội bộ ApecGlobal</p>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <h4 className="text-blue-300 font-medium mb-2">Thông tin đăng nhập demo:</h4>
              <div className="text-white/80 text-sm space-y-1">
                <p>
                  <strong>Admin:</strong> admin / 123456
                </p>
                <p>
                  <strong>Demo:</strong> demo / password
                </p>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
              >
                Đăng Nhập
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Chào mừng đến Cổng Nội Bộ
        </h2>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="bg-green-600 text-white">Trực tuyến</Badge>
          <span className="text-white/60">Xin chào, {loginForm.username === "admin" ? "Admin" : "User"}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20 hover:border-purple-400 hover:text-white"
          >
            Đăng Xuất
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Link href="/internal/dashboard">
          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
            <CardContent className="p-4 text-center">
              <Home className="h-8 w-8 mx-auto text-purple-400 mb-2" />
              <p className="text-white text-sm font-medium">Dashboard</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/internal/employees">
          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto text-blue-400 mb-2" />
              <p className="text-white text-sm font-medium">Nhân Viên</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/internal/reports">
          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 mx-auto text-green-400 mb-2" />
              <p className="text-white text-sm font-medium">Báo Cáo</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/internal/documents">
          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 mx-auto text-orange-400 mb-2" />
              <p className="text-white text-sm font-medium">Tài Liệu</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/internal/projects">
          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
            <CardContent className="p-4 text-center">
              <Briefcase className="h-8 w-8 mx-auto text-cyan-400 mb-2" />
              <p className="text-white text-sm font-medium">Dự Án</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/internal/settings">
          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
            <CardContent className="p-4 text-center">
              <Settings className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-white text-sm font-medium">Cài Đặt</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <Bell className="h-8 w-8 mx-auto text-purple-400 mb-2" />
            <p className="text-white text-sm">Thông Báo</p>
            <Badge variant="destructive" className="mt-1 bg-red-600 text-white">
              5
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto text-blue-400 mb-2" />
            <p className="text-white text-sm">Lịch Sự Kiện</p>
            <Badge className="mt-1 bg-blue-600 text-white">3</Badge>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <Database className="h-8 w-8 mx-auto text-green-400 mb-2" />
            <p className="text-white text-sm">Cơ Sở Dữ Liệu</p>
            <Badge className="mt-1 bg-green-600 text-white">Online</Badge>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto text-red-400 mb-2" />
            <p className="text-white text-sm">Bảo Mật</p>
            <Badge className="mt-1 bg-red-600 text-white">Secure</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="h-5 w-5 mr-2 text-purple-400" />
              Hoạt Động Gần Đây
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="text-white font-medium">Báo cáo Q4 đã được phê duyệt</h4>
              <p className="text-white/60 text-sm">2 giờ trước</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="text-white font-medium">Nhân viên mới được thêm vào hệ thống</h4>
              <p className="text-white/60 text-sm">5 giờ trước</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="text-white font-medium">Dự án ApecTech hoàn thành milestone</h4>
              <p className="text-white/60 text-sm">1 ngày trước</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-400" />
              Thống Kê Nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white">Tổng nhân viên</span>
              <Badge className="bg-blue-600 text-white">200+</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Dự án đang chạy</span>
              <Badge className="bg-green-600 text-white">15</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Tài liệu mới</span>
              <Badge className="bg-orange-600 text-white">8</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Báo cáo chờ duyệt</span>
              <Badge className="bg-red-600 text-white">3</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
