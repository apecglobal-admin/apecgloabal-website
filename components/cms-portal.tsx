"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { useDispatch } from "react-redux";
import { loginCMS } from "@/src/features/auth/authApi";
import { toast } from "sonner";

export default function InternalPortal() {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const tokenCMS = localStorage.getItem("cmsToken");
    if(tokenCMS){
      window.location.replace("/cms/dashboard");
    } 
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await dispatch(loginCMS(loginForm as any) as any).unwrap();
      console.log("res", res);
      if (res.status == 200 || res.status == 201) {
        localStorage.setItem("cmsToken", res.data.token);
        window.location.replace("/cms/dashboard");
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto text-purple-400 mb-4" />
            <CardTitle className="text-white text-2xl">
              Đăng Nhập Hệ Thống
            </CardTitle>
            <p className="text-white/60">
              Truy cập cổng thông tin nội bộ ApecGlobal
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                  className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
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
    );
  }

  // Nếu đã đăng nhập, hiển thị loading trong khi chuyển hướng (should not show anymore)
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      <p className="ml-4 text-white">Đang chuyển hướng đến dashboard...</p>
    </div>
  );
}
