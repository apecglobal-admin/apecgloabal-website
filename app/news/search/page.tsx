import Link from "next/link"
import { Metadata } from "next"
import { Calendar, Clock, User, Eye, ArrowRight, Search } from "lucide-react"
import { format } from "date-fns"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { query } from "@/lib/db"

// Hàm để tính thời gian đọc dựa trên độ dài nội dung
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200; // Tốc độ đọc trung bình
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} phút đọc`;
}

// Hàm để định dạng ngày tháng
const formatDate = (date: Date): string => {
  return format(new Date(date), "dd 'Tháng' MM, yyyy");
}

// Hàm để lấy màu cho danh mục
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Công Nghệ":
      return "bg-blue-600"
    case "Kinh Doanh":
      return "bg-green-600"
    case "Giải Thưởng":
      return "bg-yellow-600"
    case "Milestone":
      return "bg-purple-600"
    case "Đối Tác":
      return "bg-orange-600"
    case "Đầu Tư":
      return "bg-red-600"
    case "Sự Kiện":
      return "bg-indigo-600"
    default:
      return "bg-gray-600"
  }
}

// Hàm để tìm kiếm tin tức
async function searchNews(query: string) {
  try {
    const result = await query(
      `SELECT n.*, a.name as author_name
       FROM news n
       LEFT JOIN authors a ON n.author_id = a.id
       WHERE n.published = true AND 
             (n.title ILIKE $1 OR n.content ILIKE $1 OR n.excerpt ILIKE $1)
       ORDER BY n.published_at DESC`,
      [`%${query}%`]
    );

    return result.rows;
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
}

// Tạo metadata cho trang
export const metadata: Metadata = {
  title: 'Tìm kiếm tin tức - ApecGlobal',
  description: 'Tìm kiếm tin tức từ ApecGlobal Group và các công ty thành viên',
};

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const searchQuery = searchParams.q || '';
  const newsItems = searchQuery ? await searchNews(searchQuery) : [];
  
  // Chuyển đổi dữ liệu tin tức
  const news = newsItems.map((item) => {
    return {
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      date: formatDate(item.published_at),
      author: item.author_name || "Ban Biên Tập",
      readTime: calculateReadTime(item.content),
      views: item.view_count.toLocaleString(),
      category: item.category,
      featured: item.featured,
      image: item.image_url || "/placeholder.svg?height=400&width=800",
    }
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Tìm Kiếm Tin Tức
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Tìm kiếm tin tức từ ApecGlobal Group và các công ty thành viên.
          </p>
          
          {/* Search Form */}
          <form className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  name="q"
                  placeholder="Nhập từ khóa tìm kiếm..."
                  defaultValue={searchQuery}
                  className="w-full px-10 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500"
                />
              </div>
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8">
                Tìm Kiếm
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {searchQuery ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-8">
                Kết quả tìm kiếm cho: <span className="text-purple-400">"{searchQuery}"</span>
              </h2>
              
              {news.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {news.map((article, index) => (
                    <Card
                      key={index}
                      className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                          <div className="flex items-center space-x-1 text-white/60 text-sm">
                            <Calendar className="h-3 w-3" />
                            <span>{article.date}</span>
                          </div>
                        </div>
                        <CardTitle className="text-white text-lg leading-tight line-clamp-2">{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-white/80 text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
                        <div className="flex items-center justify-between text-white/60 text-xs">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{article.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{article.readTime}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{article.views}</span>
                          </div>
                        </div>
                        <Link href={`/news/${article.id}`} className="w-full">
                          <Button variant="outline" className="w-full border-purple-500/30 text-white hover:bg-purple-500/20">
                            Đọc Thêm
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-black/30 border border-purple-500/30 rounded-lg">
                  <Search className="h-16 w-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Không tìm thấy kết quả</h3>
                  <p className="text-white/80 max-w-lg mx-auto mb-6">
                    Không tìm thấy tin tức nào phù hợp với từ khóa "{searchQuery}". Vui lòng thử lại với từ khóa khác.
                  </p>
                  <Link href="/news">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Xem tất cả tin tức
                    </Button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-black/30 border border-purple-500/30 rounded-lg">
              <Search className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Bắt đầu tìm kiếm</h3>
              <p className="text-white/80 max-w-lg mx-auto mb-6">
                Nhập từ khóa vào ô tìm kiếm phía trên để tìm kiếm tin tức.
              </p>
              <Link href="/news">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Xem tất cả tin tức
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}