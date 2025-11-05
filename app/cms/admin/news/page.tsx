import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Eye, Search, Filter, Calendar, User, TrendingUp, FileText, Users, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

// Mock data - sẽ thay bằng API call thực tế
const newsData = [
  {
    id: 1,
    title: "ApecGlobal ra mắt sản phẩm AI mới",
    category: "Công nghệ",
    author: "Nguyễn Văn A",
    status: "published",
    publishedAt: "2024-01-15",
    views: 1250
  },
  {
    id: 2,
    title: "Hợp tác chiến lược với đối tác quốc tế",
    category: "Kinh doanh",
    author: "Trần Thị B",
    status: "draft",
    publishedAt: null,
    views: 0
  },
  {
    id: 3,
    title: "Tuyển dụng 100 nhân viên IT mới",
    category: "Tuyển dụng",
    author: "Lê Văn C",
    status: "published",
    publishedAt: "2024-01-10",
    views: 890
  }
];

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

function NewsContent() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'archived': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Đã xuất bản';
      case 'draft': return 'Bản nháp';
      case 'archived': return 'Lưu trữ';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-4">
      {newsData.map((news) => (
        <Card key={news.id} className="bg-black/50 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <CardTitle className="text-lg text-white hover:text-purple-300 transition-colors">{news.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                    {news.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-white/80">
                    <User className="h-4 w-4" />
                    <span>{news.author}</span>
                  </div>
                  <Badge className={getStatusColor(news.status)}>
                    {getStatusText(news.status)}
                  </Badge>
                  {news.publishedAt && (
                    <div className="flex items-center gap-1 text-white/80">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(news.publishedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-white/80">
                    <Eye className="h-4 w-4" />
                    <span>{news.views} lượt xem</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/news/${news.id}`}>
                  <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/cms/admin/news/edit/${news.id}`}>
                  <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default function AdminNewsPage() {
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
        <Link href="/cms/admin/news/create">
          <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Tạo tin tức mới
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center p-4 sm:p-6">
            <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-green-400 mb-3 sm:mb-4" />
            <CardTitle className="text-white text-base sm:text-lg">Đã xuất bản</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-3xl font-bold text-white text-center">2</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center p-4 sm:p-6">
            <FileText className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-yellow-400 mb-3 sm:mb-4" />
            <CardTitle className="text-white text-base sm:text-lg">Bản nháp</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-3xl font-bold text-white text-center">1</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center p-4 sm:p-6">
            <BarChart3 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-blue-400 mb-3 sm:mb-4" />
            <CardTitle className="text-white text-base sm:text-lg">Tổng lượt xem</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-3xl font-bold text-white text-center">2,140</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center p-4 sm:p-6">
            <Users className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-purple-400 mb-3 sm:mb-4" />
            <CardTitle className="text-white text-base sm:text-lg">Tác giả</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-3xl font-bold text-white text-center">3</p>
          </CardContent>
        </Card>
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
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-purple-500/30">
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="technology">Công nghệ</SelectItem>
                <SelectItem value="business">Kinh doanh</SelectItem>
                <SelectItem value="recruitment">Tuyển dụng</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-purple-500/30">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
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
          <Suspense fallback={<NewsLoadingSkeleton />}>
            <NewsContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}