'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Tự động chuyển hướng sau 3 giây
    const timer = setTimeout(() => {
      router.push('/internal');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-black/50 border-purple-500/30">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
          <CardTitle className="text-xl text-white">
            Khu vực Admin đã được chuyển
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-white/70">
            Phần quản trị đã được tích hợp vào cổng nội bộ. 
            Bạn sẽ được chuyển hướng tự động...
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/internal')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Đi tới Cổng Nội Bộ
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-sm text-white/50">
              Chuyển hướng tự động trong 3 giây...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}