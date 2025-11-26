"use client";

import { useState, useEffect } from "react";
import InternalLayout from "@/components/cms-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Bell,
  BarChart3,
  FileText,
  ArrowLeft,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Shield,
  Settings,
  Building2,
  Briefcase,
} from "lucide-react";

export default function InternalDashboard() {
  const [currentUser, setCurrentUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const stats = [
    {
      title: "Tổng Nhân Viên",
      value: "203",
      change: "+12%",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Dự Án Đang Chạy",
      value: "15",
      change: "+3",
      icon: BarChart3,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Doanh Thu Tháng",
      value: "2.4B VNĐ",
      change: "+18%",
      icon: DollarSign,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Hiệu Suất",
      value: "94%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  const recentProjects = [
    {
      name: "AI Education Platform",
      company: "ApecTech",
      progress: 85,
      status: "Đang phát triển",
      deadline: "15/01/2025",
    },
    {
      name: "Smart Security System",
      company: "GuardCam",
      progress: 92,
      status: "Beta Testing",
      deadline: "10/01/2025",
    },
    {
      name: "Emotion Analytics",
      company: "EmoCommerce",
      progress: 100,
      status: "Hoàn thành",
      deadline: "Completed",
    },
  ];

  const notifications = [
    {
      type: "success",
      title: "Báo cáo Q4 đã được phê duyệt",
      time: "2 giờ trước",
      icon: CheckCircle,
    },
    {
      type: "warning",
      title: "Deadline dự án ApecTech sắp đến",
      time: "4 giờ trước",
      icon: AlertTriangle,
    },
    {
      type: "info",
      title: "Họp team lead vào 14:00",
      time: "6 giờ trước",
      icon: Clock,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-600";
      case "Beta Testing":
        return "bg-blue-600";
      case "Đang phát triển":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "info":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-8">
        <Link href="/cms">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            CMS
          </Button>
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-white">Dashboard</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Tổng Quan
          </h1>
          <p className="text-white/60">
            Theo dõi hiệu suất và hoạt động của ApecGlobal Group
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Badge className="bg-green-600 text-white">
            <Activity className="h-3 w-3 mr-1" />
            Hệ thống hoạt động bình thường
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-white mt-2">
                      {stat.value}
                    </p>
                    <p className="text-green-400 text-sm mt-1">
                      {stat.change} từ tháng trước
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Projects Overview */}
        <div className="lg:col-span-2">
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
                  Dự Án Gần Đây
                </span>
                <Link href="/cms/projects">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
                  >
                    Xem Tất Cả
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map((project, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{project.name}</h4>
                      <p className="text-white/60 text-sm">{project.company}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <p className="text-white/60 text-sm mt-1">
                        {project.deadline}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Tiến độ</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="h-5 w-5 mr-2 text-purple-400" />
                Thông Báo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification, index) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-black/30 rounded-lg"
                  >
                    <IconComponent
                      className={`h-5 w-5 mt-0.5 ${getNotificationColor(
                        notification.type
                      )}`}
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-white/60 text-xs mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                );
              })}
              <Button
                variant="outline"
                className="w-full bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
              >
                Xem Tất Cả Thông Báo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admin Section - chỉ hiển thị cho admin */}
      {isAdmin && (
        <div className="mt-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-red-400" />
            <h3 className="text-xl font-bold text-white">Khu vực Quản trị</h3>
            <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
              Admin
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card className="bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-400">
                  Tin tức
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">34</div>
                <p className="text-yellow-300 text-xs">25 published, 9 draft</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/30 hover:border-blue-500/60 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-400">
                  Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">8</div>
                <p className="text-blue-300 text-xs">Active roles</p>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 border-green-500/30 hover:border-green-500/60 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-400">
                  System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">99%</div>
                <p className="text-green-300 text-xs">Uptime</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/cms/companies">
              <Card className="bg-indigo-500/10 border-indigo-500/30 hover:border-indigo-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-4 text-center">
                  <Building2 className="h-8 w-8 mx-auto text-indigo-400 mb-2" />
                  <p className="text-white text-sm font-medium">Công ty</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cms/employees">
              <Card className="bg-blue-500/10 border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto text-blue-400 mb-2" />
                  <p className="text-white text-sm font-medium">Nhân viên</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cms/departments">
              <Card className="bg-pink-500/10 border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-4 text-center">
                  <Building2 className="h-8 w-8 mx-auto text-pink-400 mb-2" />
                  <p className="text-white text-sm font-medium">Phòng ban</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cms/positions">
              <Card className="bg-purple-500/10 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-4 text-center">
                  <Briefcase className="h-8 w-8 mx-auto text-purple-400 mb-2" />
                  <p className="text-white text-sm font-medium">Chức vụ</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cms/news">
              <Card className="bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto text-yellow-400 mb-2" />
                  <p className="text-white text-sm font-medium">Tin tức</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cms/settings">
              <Card className="bg-gray-500/10 border-gray-500/30 hover:border-gray-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-4 text-center">
                  <Settings className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-white text-sm font-medium">Cài đặt</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions for all users */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Thao tác nhanh</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/cms/documents">
            <Card className="bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 mx-auto text-emerald-400 mb-2" />
                <p className="text-white text-sm font-medium">Tài liệu</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cms/projects">
            <Card className="bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 mx-auto text-cyan-400 mb-2" />
                <p className="text-white text-sm font-medium">Dự án</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cms/reports">
            <Card className="bg-orange-500/10 border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 mx-auto text-orange-400 mb-2" />
                <p className="text-white text-sm font-medium">Báo cáo</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cms/jobs">
            <Card className="bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto text-amber-400 mb-2" />
                <p className="text-white text-sm font-medium">Tuyển dụng</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
