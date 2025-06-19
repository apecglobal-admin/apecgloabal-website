"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-4">
      <div className="bg-black/50 backdrop-blur-md p-8 rounded-xl border border-purple-500/30 max-w-md w-full text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl font-bold text-white">404</span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Không tìm thấy trang</h1>
        <p className="text-white/70 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full">
              <Home className="mr-2 h-4 w-4" />
              Trang chủ
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-purple-500/30 text-white hover:bg-purple-500/20 w-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
}