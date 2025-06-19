import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Eye, ArrowRight, Newspaper, Search } from "lucide-react"
import { getAllNews } from "@/lib/db"
import { News } from "@/lib/schema"
import { format } from "date-fns"

// CSS Animations for AI/Automation style
const styles = {
  '@keyframes slide': {
    '0%': { transform: 'translateY(0)' },
    '100%': { transform: 'translateY(-100px)' }
  },
  '@keyframes pulse': {
    '0%, 100%': { opacity: 0.6 },
    '50%': { opacity: 0.3 }
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' }
  },
  '@keyframes glow': {
    '0%, 100%': { boxShadow: '0 0 5px 2px rgba(139, 92, 246, 0.3)' },
    '50%': { boxShadow: '0 0 20px 5px rgba(139, 92, 246, 0.5)' }
  }
}

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

export default async function NewsPage() {
  // Lấy dữ liệu tin tức từ database
  const dbNews = await getAllNews();
  
  // Tìm tin tức nổi bật (featured)
  const featuredNewsItem = dbNews.find((item: News) => item.featured) || dbNews[0];
  
  // Chuyển đổi dữ liệu tin tức nổi bật
  const featuredNews = {
    id: featuredNewsItem.id,
    slug: featuredNewsItem.slug || featuredNewsItem.id.toString(),
    title: featuredNewsItem.title,
    excerpt: featuredNewsItem.excerpt,
    date: formatDate(featuredNewsItem.published_at),
    author: "Ban Biên Tập", // Giá trị mặc định vì chưa có dữ liệu tác giả thực tế
    readTime: calculateReadTime(featuredNewsItem.content),
    views: featuredNewsItem.view_count.toLocaleString(),
    category: featuredNewsItem.category,
    image: featuredNewsItem.image_url || "/placeholder.svg?height=400&width=800",
  }

  // Chuyển đổi dữ liệu tin tức còn lại
  const news = dbNews
    .filter((item: News) => item.id !== featuredNewsItem.id)
    .map((item: News) => {
      return {
        id: item.id,
        slug: item.slug || item.id.toString(),
        title: item.title,
        excerpt: item.excerpt,
        date: formatDate(item.published_at),
        author: "Ban Biên Tập", // Giá trị mặc định vì chưa có dữ liệu tác giả thực tế
        readTime: calculateReadTime(item.content),
        views: item.view_count.toLocaleString(),
        category: item.category,
        featured: item.featured,
        image: item.image_url || "/placeholder.svg?height=200&width=400",
      }
    });

  // Lấy danh sách danh mục từ tin tức
  const categoriesMap = dbNews.reduce((acc, item: News) => {
    if (!acc[item.category]) {
      acc[item.category] = 0;
    }
    acc[item.category]++;
    return acc;
  }, {} as Record<string, number>);
  
  const categories = [
    { name: "Tất cả", count: dbNews.length, active: true },
    ...Object.entries(categoriesMap).map(([name, count]) => ({
      name,
      count,
      active: false
    }))
  ]

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Hero Section - AI/Automation Style */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background Animation Effect */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '24px 24px'
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-black/80 to-black/90"></div>
        </div>
        
        {/* Floating Circuit Lines */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
            animation: 'slide 20s linear infinite'
          }}></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-6 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-30 animate-pulse"></div>
            <h1 className="relative text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Tin Tức & Sự Kiện
            </h1>
          </div>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            Cập nhật những tin tức mới nhất, sự kiện quan trọng và các cột mốc phát triển của 
            <span className="text-cyan-400 font-semibold"> ApecGlobal Group </span>
            và các công ty thành viên.
          </p>
          
          {/* Search Form with AI-style */}
          <form action="/news/search" className="max-w-md mx-auto relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-30"></div>
            <div className="relative">
              <input
                type="text"
                name="q"
                placeholder="Tìm kiếm tin tức..."
                className="w-full px-4 py-3 bg-black/70 border border-purple-500/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-500 backdrop-blur-sm"
              />
              <Button type="submit" className="absolute right-1 top-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                <Search className="h-4 w-4 mr-1" />
                <span className="text-xs">AI Search</span>
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Filter - AI Style */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="relative mb-8 text-center">
            <h3 className="text-xl font-medium text-white/90 inline-flex items-center">
              <span className="w-8 h-8 mr-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/>
                  <path d="M2 15h10"/>
                  <path d="m5 12-3 3 3 3"/>
                </svg>
              </span>
              Lọc Theo Danh Mục
            </h3>
          </div>
          
          <div className="backdrop-blur-sm bg-black/20 p-6 rounded-xl border border-purple-500/20 mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.map((category, index) => 
                category.name === "Tất cả" ? (
                  <Button
                    key={index}
                    variant={category.active ? "default" : "outline"}
                    className={`${
                      category.active
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg shadow-purple-500/20 w-full"
                        : "border-purple-500/30 text-white hover:bg-purple-500/20 hover:border-cyan-500/50 transition-all duration-300 w-full"
                    } rounded-full h-10 flex items-center justify-center`}
                  >
                    <span className="mr-1 text-xs md:text-sm">#</span>
                    <span className="text-xs md:text-sm truncate">{category.name}</span>
                    <Badge variant="secondary" className="ml-1 bg-black/30 text-white text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ) : (
                  <Link href={`/news/category/${encodeURIComponent(category.name)}`} key={index} className="w-full">
                    <Button
                      variant={category.active ? "default" : "outline"}
                      className={`${
                        category.active
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg shadow-purple-500/20 w-full"
                          : "border-purple-500/30 text-white hover:bg-purple-500/20 hover:border-cyan-500/50 transition-all duration-300 w-full"
                      } rounded-full h-10 flex items-center justify-center`}
                    >
                      <span className="mr-1 text-xs md:text-sm">#</span>
                      <span className="text-xs md:text-sm truncate">{category.name}</span>
                      <Badge variant="secondary" className="ml-1 bg-black/30 text-white text-xs">
                        {category.count}
                      </Badge>
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured News - AI Style */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">Tin Nổi Bật</h2>
            </div>
            <div className="hidden md:flex items-center">
              <span className="h-[1px] w-24 bg-gradient-to-r from-purple-500 to-transparent"></span>
            </div>
          </div>
          
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-purple-500/30 rounded-tl-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl"></div>
            
            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-500 backdrop-blur-sm overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-video relative rounded-lg overflow-hidden group">
                  {featuredNews.image ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                      <Image 
                        src={featuredNews.image} 
                        alt={featuredNews.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute bottom-4 left-4 z-20">
                        <Badge className={`${getCategoryColor(featuredNews.category)} px-3 py-1 text-xs font-medium uppercase tracking-wider`}>
                          {featuredNews.category}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-video bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                      <Newspaper className="h-16 w-16 text-white/40" />
                    </div>
                  )}
                </div>
                
                <div className="p-8 space-y-5 flex flex-col">
                  <div className="flex items-center space-x-2 text-white/60 text-sm">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <span>{featuredNews.date}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white leading-tight">{featuredNews.title}</h3>
                  
                  <p className="text-white/80 leading-relaxed flex-grow">{featuredNews.excerpt}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4 text-white/60 text-sm">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-purple-400" />
                        <span>{featuredNews.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-purple-400" />
                        <span>{featuredNews.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-purple-400" />
                        <span>{featuredNews.views}</span>
                      </div>
                    </div>
                    
                    <Link href={featuredNews.slug ? `/news/${encodeURIComponent(featuredNews.slug)}` : `/news/redirect?slug=${encodeURIComponent(featuredNews.title)}`}>
                      <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-purple-900/30">
                        Đọc Thêm
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* News Grid - AI Style */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">Tin Tức Mới Nhất</h2>
            </div>
            <div className="hidden md:flex items-center">
              <span className="h-[1px] w-24 bg-gradient-to-r from-purple-500 to-transparent"></span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article, index) => (
              <Card
                key={index}
                className="group bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden"
              >
                {/* Thêm hình ảnh tin tức */}
                <div className="relative aspect-video w-full overflow-hidden">
                  {article.image ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
                      <Image 
                        src={article.image} 
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 z-20">
                        <Badge className={`${getCategoryColor(article.category)} px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider`}>
                          {article.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3 z-20">
                        <div className="flex items-center space-x-1 text-white/80 text-xs bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                          <Calendar className="h-3 w-3 text-cyan-400" />
                          <span>{article.date}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-video bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <Newspaper className="h-12 w-12 text-white/40" />
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg leading-tight line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 text-purple-400" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-purple-400" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3 text-purple-400" />
                      <span>{article.views}</span>
                    </div>
                  </div>
                  
                  <Link href={article.slug ? `/news/${encodeURIComponent(article.slug)}` : `/news/redirect?slug=${encodeURIComponent(article.title)}`} className="w-full block">
                    <Button variant="outline" className="w-full border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 transition-all duration-300 group-hover:border-cyan-500/50">
                      <span className="mr-2">Đọc Thêm</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup - AI Style */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Background circuit pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50h100M50 0v100" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="50" cy="50" r="3" fill="white" />
                <circle cx="0" cy="50" r="3" fill="white" />
                <circle cx="100" cy="50" r="3" fill="white" />
                <circle cx="50" cy="0" r="3" fill="white" />
                <circle cx="50" cy="100" r="3" fill="white" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
          </svg>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-purple-500/20 rounded-tl-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-cyan-500/20 rounded-br-3xl"></div>
            
            <Card className="bg-black/60 border-none shadow-2xl shadow-purple-900/20 backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600"></div>
              
              <CardHeader className="text-center pt-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <CardTitle className="text-white text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Đăng Ký Nhận Tin
                </CardTitle>
                <p className="text-white/80 mt-2 max-w-md mx-auto">
                  Nhận thông tin cập nhật mới nhất về công nghệ AI và tự động hóa từ ApecGlobal Group
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6 p-8">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30"></div>
                  <div className="relative flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      placeholder="Nhập địa chỉ email của bạn"
                      className="flex-1 px-4 py-3 bg-black/70 border border-purple-500/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-500 backdrop-blur-sm"
                    />
                    <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 shadow-lg shadow-purple-900/30 transition-all duration-300">
                      <span className="mr-2">Đăng Ký</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-6 pt-2">
                  <div className="flex items-center text-white/60 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-cyan-400">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span>Bảo mật thông tin</span>
                  </div>
                  <div className="flex items-center text-white/60 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-purple-400">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    <span>Không spam</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
