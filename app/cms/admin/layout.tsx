'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const savedUser = localStorage.getItem("internal_user");
        const savedLoginStatus = localStorage.getItem("internal_logged_in");
        
        // Kiểm tra đăng nhập
        if (savedLoginStatus !== "true" || !savedUser) {
          router.push("/cms");
          return;
        }
        
        // Kiểm tra quyền admin
        if (savedUser === "admin") {
          setIsAuthorized(true);
        } else {
          // Không có quyền admin
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mb-4"></div>
            <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-pulse"></div>
          </div>
          <p className="text-white/60 animate-pulse">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center relative">
            <AlertTriangle className="h-10 w-10 text-red-500 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Không có quyền truy cập</h2>
          <p className="text-white/60 mb-6 leading-relaxed">
            Bạn không có quyền truy cập vào khu vực quản trị. Vui lòng liên hệ với quản trị viên để được cấp quyền.
          </p>
          <button
            onClick={() => router.push("/cms/dashboard")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/20"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      {/* Admin Header */}
      <div className="mb-6 p-4 bg-black/50 border border-purple-500/30 rounded-lg hover:border-purple-500/60 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Shield className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Khu vực Quản trị</h3>
            <p className="text-white/80 text-sm">Bạn đang trong khu vực quản trị hệ thống</p>
          </div>
        </div>
      </div>
      
      <div className="animate-slide-up">
        {children}
      </div>
    </div>
  );
}