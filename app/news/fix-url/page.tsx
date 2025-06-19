'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function FixUrlPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const url = searchParams.get('url');
    if (url) {
      // Xử lý URL để loại bỏ các ký tự đặc biệt
      const cleanUrl = url
        .replace(/%/g, '-pct-')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^\w\s-]/g, '-')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Chuyển hướng đến URL đã được làm sạch
      router.push(`/news/${cleanUrl}`);
    } else {
      // Nếu không có URL, chuyển hướng về trang tin tức
      router.push('/news');
    }
  }, [router, searchParams]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
      <div className="bg-black/50 backdrop-blur-md p-8 rounded-xl border border-purple-500/30 max-w-md w-full text-center">
        <Loader2 className="h-12 w-12 text-purple-500 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-4">Đang chuyển hướng...</h1>
        <p className="text-white/70">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
}