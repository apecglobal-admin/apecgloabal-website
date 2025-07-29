"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminLayout from "@/components/admin/layout";

export default function DeleteAuthor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [author, setAuthor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newsCount, setNewsCount] = useState(0);

  // Lấy thông tin tác giả
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch(`/api/authors/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAuthor(data);
          
          // Lấy số lượng tin tức của tác giả
          const newsResponse = await fetch(`/api/news?author_id=${id}`);
          if (newsResponse.ok) {
            const newsData = await newsResponse.json();
            setNewsCount(newsData.pagination.total);
          }
        } else {
          throw new Error("Không thể lấy thông tin tác giả");
        }
      } catch (error) {
        console.error("Error fetching author:", error);
        setError("Không thể lấy thông tin tác giả");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/authors/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Có lỗi xảy ra khi xóa tác giả");
      }

      // Chuyển hướng về trang danh sách tác giả
      router.push("/admin/authors");
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/admin/authors" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Xóa tác giả</h1>
            <p className="text-gray-500">Xác nhận xóa tác giả</p>
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
        ) : author ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Xác nhận xóa tác giả</CardTitle>
              <CardDescription>
                Bạn có chắc chắn muốn xóa tác giả này? Hành động này không thể hoàn tác.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={author.avatar_url || "/placeholder-avatar.svg"} alt={author.name} />
                  <AvatarFallback>{author.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{author.name}</h3>
                  {author.email && <p className="text-gray-500">{author.email}</p>}
                </div>
              </div>
              
              <div className="space-y-4">
                {author.bio && (
                  <div>
                    <h3 className="font-medium">Tiểu sử:</h3>
                    <p>{author.bio}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium">Số bài viết:</h3>
                  <p>{newsCount}</p>
                </div>
                
                {newsCount > 0 && (
                  <Alert className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                    <AlertDescription>
                      Tác giả này đang được sử dụng trong {newsCount} bài viết. Bạn cần gỡ bỏ tác giả khỏi các bài viết trước khi xóa.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/admin/authors/edit/${id}`}>
                <Button variant="outline">Hủy và quay lại</Button>
              </Link>
              <Button 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={loading || newsCount > 0}
              >
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
            <AlertDescription>Không tìm thấy tác giả</AlertDescription>
          </Alert>
        )}
      </div>
    </AdminLayout>
  );
}