"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminLayout from "@/components/admin/layout";

export default function DeleteNews({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [news, setNews] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy thông tin tin tức
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${id}`);
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        } else {
          throw new Error("Không thể lấy thông tin tin tức");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Không thể lấy thông tin tin tức");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Có lỗi xảy ra khi xóa tin tức");
      }

      // Chuyển hướng về trang danh sách tin tức
      router.push("/admin/news");
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/admin/news" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Xóa tin tức</h1>
            <p className="text-gray-500">Xác nhận xóa tin tức</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : news ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Xác nhận xóa tin tức</CardTitle>
              <CardDescription>
                Bạn có chắc chắn muốn xóa tin tức này? Hành động này không thể hoàn tác.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Tiêu đề:</h3>
                  <p>{news.title}</p>
                </div>
                <div>
                  <h3 className="font-medium">Tóm tắt:</h3>
                  <p>{news.excerpt}</p>
                </div>
                <div>
                  <h3 className="font-medium">Danh mục:</h3>
                  <p>{news.category}</p>
                </div>
                <div>
                  <h3 className="font-medium">Ngày tạo:</h3>
                  <p>{new Date(news.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Trạng thái:</h3>
                  <p>{news.published ? "Đã xuất bản" : "Bản nháp"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/admin/news/edit/${id}`}>
                <Button variant="outline">Hủy và quay lại</Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xác nhận xóa
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Alert className="mb-6">
            <AlertDescription>Không tìm thấy tin tức</AlertDescription>
          </Alert>
        )}
      </div>
    </AdminLayout>
  );
}