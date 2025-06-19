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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Gọi API đăng nhập
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: loginForm.username, 
          password: loginForm.password,
          source: 'internal'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Đăng nhập thất bại");
      }
      
      // Kiểm tra quyền truy cập portal
      if (!data.user.permissions?.portal_access) {
        throw new Error("Bạn không có quyền truy cập cổng nội bộ");
      }
      
      // Lưu trạng thái đăng nhập vào localStorage (cho khả năng tương thích ngược)
      localStorage.setItem("internal_logged_in", "true");
      localStorage.setItem("internal_user", loginForm.username);
      
      setIsLoggedIn(true);
      
      // Chuyển hướng đến dashboard
      router.push("/internal/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Gọi API đăng xuất
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      // Xóa dữ liệu đăng nhập khỏi localStorage
      localStorage.removeItem("internal_logged_in");
      localStorage.removeItem("internal_user");
      
      setIsLoggedIn(false);
      setLoginForm({ username: "", password: "" });
    } catch (error) {
      console.error("Logout error:", error);
    }
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
              <h4 className="text-blue-300 font-medium mb-2">Thông tin đăng nhập:</h4>
              <div className="text-white/80 text-sm space-y-1">
                <p>
                  <strong>Admin:</strong> admin / 123456
                </p>
                <p>
                  <strong>Nhân viên:</strong> Email / Số điện thoại
                </p>
                <p className="text-xs text-blue-300 mt-2">
                  * Nhân viên đăng nhập bằng email và số điện thoại từ hệ thống
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
  } else {
    // Nếu đã đăng nhập, chuyển hướng đến dashboard
    router.push("/internal/dashboard")
    
    // Hiển thị loading trong khi chuyển hướng
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }
}