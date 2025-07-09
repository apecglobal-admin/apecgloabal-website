"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateNewsRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/internal/news/create');
  }, [router]);
  
  return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <p className="text-lg">Đang chuyển hướng...</p>
    </div>
  );
}