import Link from "next/link"
import { Metadata } from "next"
import { Calendar, Clock, User, Eye, ArrowRight } from "lucide-react"
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

// Hàm để lấy tin tức theo danh mục
async function getNewsByCategory(category: string) {
  try {
    const result = await query(
      `SELECT n.*, a.name as author_name
       FROM news n
       LEFT JOIN authors a ON n.author_id = a.id
       WHERE n.category = $1 AND n.published = true
       ORDER BY n.published_at DESC`,
      [category]
    );

    return result.rows;
  } catch (error) {
    console.error('Error getting news by category:', error);
    return [];
  }
}

// Hàm để lấy danh sách các danh mục và số lượng tin tức
async function getCategories() {
  try {
    const result = await query(
      `SELECT category, COUNT(*) as count
       FROM news
       WHERE published = true
       GROUP BY category
       ORDER BY count DESC`
    );

    return result.rows;
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

// Tạo metadata động cho trang
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const decodedCategory = decodeURIComponent(params.category);
  
  return {
    title: `Tin tức ${decodedCategory} - ApecGlobal`,
    description: `Danh sách tin tức thuộc danh mục ${decodedCategory} từ ApecGlobal Group`,
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const decodedCategory = decodeURIComponent(params.category);
  const newsItems = await getNewsByCategory(decodedCategory);
  const categories = await getCategories();
  
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
  
  // Tìm tin tức nổi bật (featured) hoặc lấy tin đầu tiên
  const featuredNewsItem = news.find(item => item.featured) || news[0];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Tin Tức: {decodedCategory}
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Danh sách tin tức thuộc danh mục {decodedCategory} từ ApecGlobal Group và các công ty thành viên.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/news">
              <Button
                variant="outline"
                className="border-purple-500/30 text-white hover:bg-purple-500/20"
              >
                Tất cả
              </Button>
            </Link>
            {categories.map((category, index) => (
              <Link href={`/news/category/${encodeURIComponent(category.category)}`} key={index}>
                <Button
                  variant={category.category === decodedCategory ? "default" : "outline"}
                  className={`${
                    category.category === decodedCategory
                      ? "bg-gradient-to-r from-purple-600 to-blue-600"
                      : "border-purple-500/30 text-white hover:bg-purple-500/20"
                  }`}
                >
                  {category.category}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News (if available) */}
      {featuredNewsItem && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Tin Nổi Bật</h2>
            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-video bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg overflow-hidden relative">
                  {featuredNewsItem.image && (
                    <img 
                      src={featuredNewsItem.image} 
                      alt={featuredNewsItem.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Badge className={getCategoryColor(featuredNewsItem.category)}>{featuredNewsItem.category}</Badge>
                    <div className="flex items-center space-x-2 text-white/60 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredNewsItem.date}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">{featuredNewsItem.title}</h3>
                  <p className="text-white/80 leading-relaxed">{featuredNewsItem.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-white/60 text-sm">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{featuredNewsItem.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredNewsItem.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{featuredNewsItem.views}</span>
                      </div>
                    </div>
                    <Link href={`/news/${featuredNewsItem.id}`}>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Đọc Thêm
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Tất Cả Tin Tức {decodedCategory}</h2>
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
            <div className="text-center py-12">
              <p className="text-white/80 text-xl">Không có tin tức nào trong danh mục này.</p>
              <Link href="/news" className="mt-6 inline-block">
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