"use client"

import { Suspense, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Eye, Search, Filter, Calendar, User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import InternalLayout from "@/components/cms-layout";
import { Pagination, usePagination } from "@/components/ui/pagination";
import { toast } from "sonner";

// Interface cho tin tức
interface NewsItem {
  id: number;
  title: string;
  category: string;
  author_name?: string;
  published: boolean;
  published_at?: string;
  view_count: number;
  featured?: boolean;
  excerpt?: string;
  content?: string;
  image_url?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

function NewsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4 bg-purple-500/20" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-20 bg-purple-500/20" />
                  <Skeleton className="h-4 w-24 bg-purple-500/20" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 bg-purple-500/20" />
                <Skeleton className="h-9 w-9 bg-purple-500/20" />
                <Skeleton className="h-9 w-9 bg-purple-500/20" />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function NewsContent({ 
  searchTerm, 
  categoryFilter, 
  statusFilter,
  newsData,
  loading,
  onRefresh,
  setDeletingNews
}: { 
  searchTerm: string; 
  categoryFilter: string; 
  statusFilter: string;
  newsData: NewsItem[];
  loading: boolean;
  onRefresh: () => void;
  setDeletingNews: (news: NewsItem | null) => void;
}) {
  const getStatusColor = (published: boolean) => {
    return published 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  const getStatusText = (published: boolean) => {
    return published ? 'Đã xuất bản' : 'Bản nháp';
  };

  // Filter news based on search and filters
  const filteredNews = newsData.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (news.author_name && news.author_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || news.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "published" && news.published) ||
                         (statusFilter === "draft" && !news.published);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedNews,
    totalItems,
    itemsPerPage,
    goToPage
  } = usePagination(filteredNews, 5);

  if (loading) {
    return <NewsLoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      {paginatedNews.length > 0 ? (
        <>
          {paginatedNews.map((news) => (
        <Card key={news.id} className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <CardTitle className="text-lg text-white hover:text-purple-300 transition-colors">{news.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                    {news.category}
                  </Badge>
                  {news.author_name && (
                    <div className="flex items-center gap-1 text-white/80">
                      <User className="h-4 w-4" />
                      <span>{news.author_name}</span>
                    </div>
                  )}
                  <Badge className={getStatusColor(news.published)}>
                    {getStatusText(news.published)}
                  </Badge>
                  {news.published_at && (
                    <div className="flex items-center gap-1 text-white/80">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(news.published_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-white/80">
                    <Eye className="h-4 w-4" />
                    <span>{news.view_count || 0} lượt xem</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/news/${news.id}`}>
                  <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/cms/news/edit/${news.id}`}>
                  <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setDeletingNews(news)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={goToPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-white/60">
          <p>Không tìm thấy tin tức nào phù hợp</p>
        </div>
      )}
    </div>
  );
}

function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingNews, setDeletingNews] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch news data from API
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news?limit=100'); // Lấy nhiều tin tức hơn để filter
      const data = await response.json();
      
      if (response.ok) {
        setNewsData(data.news || []);
      } else {
        toast.error('Lỗi khi tải tin tức: ' + data.error);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async () => {
    if (!deletingNews) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/news/${deletingNews.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (response.ok) {
        setDeletingNews(null)
        toast.success('Xóa tin tức thành công!')
        // Refresh data
        fetchNews()
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản lý tin tức
          </h1>
          <p className="text-white/80">Quản lý tất cả tin tức và bài viết trên website</p>
        </div>
        <Link href="/cms/news/create">
          <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Tạo tin tức mới
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input 
                  placeholder="Tìm kiếm tin tức..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-purple-500/30">
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="Công nghệ">Công nghệ</SelectItem>
                <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                <SelectItem value="Tuyển dụng">Tuyển dụng</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-purple-500/30">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white">
            Danh sách tin tức
          </CardTitle>
          <CardDescription className="text-white/80">
            Tất cả tin tức và bài viết trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewsContent 
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            newsData={newsData}
            loading={loading}
            onRefresh={fetchNews}
            setDeletingNews={setDeletingNews}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingNews} onOpenChange={() => setDeletingNews(null)}>
        <DialogContent className="bg-black/90 border-red-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Xác Nhận Xóa Tin Tức
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-white/80">
              Bạn có chắc chắn muốn xóa tin tức <span className="font-semibold text-red-400">{deletingNews?.title}</span> không?
            </p>
            <p className="text-sm text-red-400">
              ⚠️ Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.
            </p>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setDeletingNews(null)}
                className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20"
                disabled={deleting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa Tin Tức
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NewsPageWithLayout() {
  return (
    <InternalLayout>
      <NewsPage />
    </InternalLayout>
  );
}