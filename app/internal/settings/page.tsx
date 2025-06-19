"use client"

import InternalLayout from "@/components/internal-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, User, Shield, Bell, Database, Palette, Key, Save, RefreshCw, Download, Upload } from "lucide-react"

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Thông Tin Cá Nhân",
      icon: User,
      description: "Cập nhật thông tin tài khoản và hồ sơ",
      color: "text-blue-400",
    },
    {
      title: "Bảo Mật",
      icon: Shield,
      description: "Quản lý mật khẩu và xác thực hai yếu tố",
      color: "text-green-400",
    },
    {
      title: "Thông Báo",
      icon: Bell,
      description: "Cài đặt thông báo email và push notification",
      color: "text-orange-400",
    },
    {
      title: "Hệ Thống",
      icon: Database,
      description: "Cấu hình hệ thống và sao lưu dữ liệu",
      color: "text-purple-400",
    },
    {
      title: "Giao Diện",
      icon: Palette,
      description: "Tùy chỉnh giao diện và ngôn ngữ",
      color: "text-pink-400",
    },
    {
      title: "API & Tích Hợp",
      icon: Key,
      description: "Quản lý API keys và tích hợp bên thứ ba",
      color: "text-cyan-400",
    },
  ]

  const systemStats = [
    { label: "Phiên bản hệ thống", value: "v2.4.1", status: "latest" },
    { label: "Cơ sở dữ liệu", value: "PostgreSQL 15", status: "healthy" },
    { label: "Bộ nhớ sử dụng", value: "68%", status: "normal" },
    { label: "Dung lượng ổ đĩa", value: "45%", status: "normal" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "latest":
      case "healthy":
        return "bg-green-600"
      case "normal":
        return "bg-blue-600"
      case "warning":
        return "bg-orange-600"
      case "critical":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <InternalLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
        <div className="container mx-auto px-4 py-8 pt-24">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-8">
            <Link href="/internal">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cổng Nội Bộ
              </Button>
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white">Cài Đặt</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Cài Đặt Hệ Thống</h1>
              <p className="text-white/60">Quản lý cấu hình và tùy chỉnh hệ thống</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                <Save className="h-4 w-4 mr-2" />
                Lưu Thay Đổi
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Khôi Phục
              </Button>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {settingsSections.map((section, index) => {
              const IconComponent = section.icon
              return (
                <Card
                  key={index}
                  className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <CardHeader className="text-center">
                    <IconComponent className={`h-12 w-12 mx-auto ${section.color} mb-4`} />
                    <CardTitle className="text-white">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 text-center text-sm">{section.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Main Settings Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Settings */}
            <div className="lg:col-span-2">
              <Card className="bg-black/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-400" />
                    Thông Tin Cá Nhân
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Họ và tên</label>
                      <Input defaultValue="Nguyễn Văn Admin" className="bg-black/30 border-purple-500/30 text-white" />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Email</label>
                      <Input
                        defaultValue="admin@apecglobal.com"
                        className="bg-black/30 border-purple-500/30 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Số điện thoại</label>
                      <Input defaultValue="+84 123 456 789" className="bg-black/30 border-purple-500/30 text-white" />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Phòng ban</label>
                      <select className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-md text-white">
                        <option value="admin">Quản trị</option>
                        <option value="apectech">ApecTech</option>
                        <option value="guardcam">GuardCam</option>
                        <option value="emocommerce">EmoCommerce</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Chức vụ</label>
                    <Input
                      defaultValue="System Administrator"
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="bg-black/50 border-purple-500/30 mt-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-400" />
                    Cài Đặt Bảo Mật
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Mật khẩu hiện tại</label>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu hiện tại"
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Mật khẩu mới</label>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        className="bg-black/30 border-purple-500/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Xác nhận mật khẩu</label>
                      <Input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        className="bg-black/30 border-purple-500/30 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Xác thực hai yếu tố (2FA)</h4>
                      <p className="text-white/60 text-sm">Tăng cường bảo mật cho tài khoản</p>
                    </div>
                    <Button
                      variant="outline"
                      className="bg-transparent border-2 border-green-500/50 text-green-300 hover:bg-green-500/20"
                    >
                      Kích hoạt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <div>
              <Card className="bg-black/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Database className="h-5 w-5 mr-2 text-purple-400" />
                    Trạng Thái Hệ Thống
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-medium">{stat.label}</p>
                        <p className="text-white/60 text-xs">{stat.value}</p>
                      </div>
                      <Badge className={`${getStatusColor(stat.status)} text-white`}>{stat.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="bg-black/50 border-purple-500/30 mt-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-orange-400" />
                    Thông Báo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Email thông báo</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Push notification</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">SMS cảnh báo</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Báo cáo hàng tuần</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </CardContent>
              </Card>

              {/* Backup & Export */}
              <Card className="bg-black/50 border-purple-500/30 mt-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Download className="h-5 w-5 mr-2 text-cyan-400" />
                    Sao Lưu & Xuất Dữ Liệu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Sao lưu dữ liệu
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-2 border-green-500/50 text-green-300 hover:bg-green-500/20"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Khôi phục dữ liệu
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Xuất báo cáo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </InternalLayout>
  )
}