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

  // Check login status on component mount with session validation
  useEffect(() => {
    const validateSession = async () => {
      console.log('Checking login status...')
      const savedLoginStatus = localStorage.getItem("internal_logged_in")
      const savedUser = localStorage.getItem("internal_user")
      
      console.log('Saved login status:', savedLoginStatus)
      console.log('Saved user:', savedUser)

      if (savedLoginStatus === "true" && savedUser) {
        console.log('Found localStorage data, validating session...')
        
        try {
          // Validate session by checking if we can access internal API
          const response = await fetch('/api/auth/validate', {
            method: 'GET',
            credentials: 'include'
          })
          
          if (response.ok) {
            console.log('Session is valid, redirecting to dashboard immediately')
            // Redirect ngay lập tức thay vì set state
            window.location.replace('/internal/dashboard')
            return
          } else {
            console.log('Session expired, clearing localStorage')
            localStorage.removeItem("internal_logged_in")
            localStorage.removeItem("internal_user")
            setIsLoggedIn(false)
          }
        } catch (error) {
          console.log('Session validation failed, clearing localStorage')
          localStorage.removeItem("internal_logged_in")
          localStorage.removeItem("internal_user")
          setIsLoggedIn(false)
        }
      } else {
        console.log('User is not logged in')
        setIsLoggedIn(false)
      }
      
      setIsLoading(false)
    }

    validateSession()
  }, [])

  // Simplified redirect logic - only used for fresh login
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      console.log('Fresh login detected, redirecting...')
      window.location.replace('/internal/dashboard')
    }
  }, [isLoggedIn, isLoading])

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
      
      // Redirect immediately after successful login
      console.log('Login successful, redirecting to dashboard')
      window.location.replace('/internal/dashboard')
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
            
{/* Debug buttons - Uncomment if needed for debugging
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-xs mb-2">Debug Mode:</p>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    console.log('Force setting logged in state and redirecting...')
                    localStorage.setItem("internal_logged_in", "true")
                    localStorage.setItem("internal_user", "admin")
                    window.location.replace('/internal/dashboard')
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white text-sm"
                >
                  [DEBUG] Force Login & Redirect
                </Button>
                <Button
                  onClick={() => {
                    console.log('Clearing localStorage...')
                    localStorage.removeItem("internal_logged_in")
                    localStorage.removeItem("internal_user")
                    setIsLoggedIn(false)
                    setLoginForm({ username: "", password: "" })
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white text-sm"
                >
                  [DEBUG] Clear Storage
                </Button>
              </div>
            </div>
            */}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Nếu đã đăng nhập, hiển thị loading trong khi chuyển hướng (should not show anymore)
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      <p className="ml-4 text-white">Đang chuyển hướng đến dashboard...</p>
    </div>
  )
}