'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function NewsRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function redirectToCorrectSlug() {
      try {
        const slug = searchParams.get('slug');
        
        if (!slug) {
          setError('Không tìm thấy tham số slug');
          setIsLoading(false);
          return;
        }
        
        // Gọi API để tìm tin tức với slug đúng
        const response = await fetch(`/api/news/find-by-slug?slug=${encodeURIComponent(slug)}`);
        
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Không tìm thấy tin tức');
          setIsLoading(false);
          return;
        }
        
        const data = await response.json();
        
        // Chuyển hướng đến trang tin tức với slug đúng
        router.push(data.redirectTo);
      } catch (error) {
        console.error('Error redirecting:', error);
        setError('Đã xảy ra lỗi khi chuyển hướng');
        setIsLoading(false);
      }
    }
    
    redirectToCorrectSlug();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="bg-black/50 backdrop-blur-md p-8 rounded-xl border border-purple-500/30 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Không tìm thấy tin tức</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/news')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            Quay lại trang tin tức
          </button>
        </div>
      </div>
    );
  }

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