import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHeroCarousel from "@/components/page-hero-carousel"
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
    author: featuredNewsItem.author_name || "Ban Biên Tập",
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
        author: item.author_name || "Ban Biên Tập",
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

  // Hero slides for News page
  const heroSlides = [
    {
      title: "TIN TỨC & SỰ KIỆN",
      subtitle: "Cập nhật những tin tức mới nhất về công nghệ AI, sự kiện và thành tựu của ApecGlobal Group trong hành trình phát triển",
      gradient: "from-purple-400 via-white to-blue-400",
      backgroundImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Đọc Tin Mới Nhất",
        href: "#latest-news",
        gradient: "from-purple-600 to-blue-600",
        hoverGradient: "from-purple-700 to-blue-700"
      },
      secondaryButton: {
        text: "Tìm Kiếm Tin Tức",
        href: "/news/search",
        borderColor: "border-purple-500/50",
        hoverBg: "bg-purple-500/20",
        hoverBorder: "border-purple-400"
      }
    },
    {
      title: "CÔNG NGHỆ AI MỚI NHẤT",
      subtitle: "Khám phá những xu hướng công nghệ trí tuệ nhân tạo mới nhất và cách ApecGlobal ứng dụng vào thực tế",
      gradient: "from-blue-400 via-white to-cyan-400",
      backgroundImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Tin Tức Công Nghệ",
        href: "/news/category/technology",
        gradient: "from-blue-600 to-cyan-600",
        hoverGradient: "from-blue-700 to-cyan-700"
      },
      secondaryButton: {
        text: "Dự Án AI",
        href: "/projects",
        borderColor: "border-blue-500/50",
        hoverBg: "bg-blue-500/20",
        hoverBorder: "border-blue-400"
      }
    },
    {
      title: "SỰ KIỆN & HOẠT ĐỘNG",
      subtitle: "Tham gia các sự kiện, hội thảo và hoạt động cộng đồng do ApecGlobal Group tổ chức và tham gia",
      gradient: "from-green-400 via-white to-emerald-400",
      backgroundImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Sự Kiện Sắp Tới",
        href: "/news/category/events",
        gradient: "from-green-600 to-emerald-600",
        hoverGradient: "from-green-700 to-emerald-700"
      },
      secondaryButton: {
        text: "Liên Hệ Tham Gia",
        href: "/contact",
        borderColor: "border-green-500/50",
        hoverBg: "bg-green-500/20",
        hoverBorder: "border-green-400"
      }
    },
    {
      title: "THÀNH TỰU & GIẢI THƯỞNG",
      subtitle: "Tự hào về những thành tựu, giải thưởng và sự công nhận mà ApecGlobal Group đã đạt được",
      gradient: "from-orange-400 via-white to-amber-400",
      backgroundImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Xem Thành Tựu",
        href: "/news/category/achievements",
        gradient: "from-orange-600 to-amber-600",
        hoverGradient: "from-orange-700 to-amber-700"
      },
      secondaryButton: {
        text: "Về Chúng Tôi",
        href: "/about",
        borderColor: "border-orange-500/50",
        hoverBg: "bg-orange-500/20",
        hoverBorder: "border-orange-400"
      }
    }
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        <div className="hero-carousel-container relative z-10">
          <PageHeroCarousel slides={heroSlides} />
        </div>
      </section>

      {/* Categories Filter - AI Style */}
      <section className="section-gray">
        <div className="container-standard">
          <div className="relative mb-8 text-center">
            <h3 className="heading-h4 inline-flex items-center">
              <span className="w-8 h-8 mr-2 rounded-full bg-red-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/>
                  <path d="M2 15h10"/>
                  <path d="m5 12-3 3 3 3"/>
                </svg>
              </span>
              Lọc Theo Danh Mục
            </h3>
          </div>
          
          <div className="card-elevated p-6 mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.map((category, index) => 
                category.name === "Tất cả" ? (
                  <Button
                    key={index}
                    variant={category.active ? "default" : "outline"}
                    className={`${
                      category.active
                        ? "w-full"
                        : "w-full"
                    } rounded-full h-10 flex items-center justify-center`}
                  >
                    <span className="mr-1 text-body-sm">#</span>
                    <span className="text-body-sm truncate">{category.name}</span>
                    <Badge variant="secondary" className="ml-1 badge-secondary text-body-sm">
                      {category.count}
                    </Badge>
                  </Button>
                ) : (
                  <Link href={`/news/category/${encodeURIComponent(category.name)}`} key={index} className="w-full">
                    <Button
                      variant={category.active ? "default" : "outline"}
                      className={`${
                        category.active
                          ? "w-full"
                          : "w-full"
                      } rounded-full h-10 flex items-center justify-center`}
                    >
                      <span className="mr-1 text-body-sm">#</span>
                      <span className="text-body-sm truncate">{category.name}</span>
                      <Badge variant="secondary" className="ml-1 badge-secondary text-body-sm">
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
      <section id="latest-news" className="section-standard">
        <div className="container-standard">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-red-700 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <h2 className="heading-h2">Tin Nổi Bật</h2>
            </div>
            <div className="hidden md:flex items-center">
              <span className="h-[1px] w-24 bg-gradient-to-r from-red-500 to-transparent"></span>
            </div>
          </div>
          
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-red-300 rounded-tl-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-red-300 rounded-br-xl"></div>
            
            <Card className="card-feature overflow-hidden">
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
                        <Badge className={`${getCategoryColor(featuredNews.category)} badge-standard`}>
                          {featuredNews.category}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-video card-standard rounded-lg flex items-center justify-center">
                      <Newspaper className="icon-xl text-muted" />
                    </div>
                  )}
                </div>
                
                <div className="p-8 space-y-5 flex flex-col">
                  <div className="flex items-center space-x-2 text-muted text-body-sm">
                    <Calendar className="icon-standard" />
                    <span>{featuredNews.date}</span>
                  </div>
                  
                  <h3 className="heading-h3 leading-tight">{featuredNews.title}</h3>
                  
                  <p className="text-body leading-relaxed flex-grow">{featuredNews.excerpt}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4 text-muted text-body-sm">
                      <div className="flex items-center space-x-1">
                        <User className="icon-standard" />
                        <span>{featuredNews.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="icon-standard" />
                        <span>{featuredNews.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="icon-standard" />
                        <span>{featuredNews.views}</span>
                      </div>
                    </div>
                    
                    <Link href={featuredNews.slug ? `/news/${encodeURIComponent(featuredNews.slug)}` : `/news/redirect?slug=${encodeURIComponent(featuredNews.title)}`}>
                      <Button className="bg-red-700 hover:bg-red-800 text-white transition-all duration-300 shadow-lg shadow-red-700/30">
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-red-700 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-red-700">Tin Tức Mới Nhất</h2>
            </div>
            <div className="hidden md:flex items-center">
              <span className="h-[1px] w-24 bg-gradient-to-r from-red-500 to-transparent"></span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article, index) => (
              <Card
                key={index}
                className="group bg-white border-gray-200 hover:border-red-300 transition-all duration-500 hover:shadow-lg hover:shadow-red-200/20 backdrop-blur-sm overflow-hidden"
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
                        <div className="flex items-center space-x-1 text-white text-xs bg-red-700/80 px-2 py-1 rounded-full backdrop-blur-sm">
                          <Calendar className="h-3 w-3 text-white" />
                          <span>{article.date}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <Newspaper className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-700 text-lg leading-tight line-clamp-2 group-hover:text-red-800 transition-colors duration-300">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-black/70 text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-black/60 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 text-red-700" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-red-700" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3 text-red-700" />
                      <span>{article.views}</span>
                    </div>
                  </div>
                  
                  <Link href={article.slug ? `/news/${encodeURIComponent(article.slug)}` : `/news/redirect?slug=${encodeURIComponent(article.title)}`} className="w-full block">
                    <Button variant="outline" className="w-full border-gray-300 text-black hover:bg-red-50 hover:border-red-300 transition-all duration-300 group-hover:border-red-300">
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
      <section className="py-20 px-4 relative overflow-hidden bg-white">
        {/* Background circuit pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50h100M50 0v100" stroke="black" strokeWidth="0.5" fill="none" />
                <circle cx="50" cy="50" r="3" fill="black" />
                <circle cx="0" cy="50" r="3" fill="black" />
                <circle cx="100" cy="50" r="3" fill="black" />
                <circle cx="50" cy="0" r="3" fill="black" />
                <circle cx="50" cy="100" r="3" fill="black" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
          </svg>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-red-300 rounded-tl-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-red-300 rounded-br-3xl"></div>
            
            <Card className="bg-white border-gray-200 shadow-2xl shadow-red-200/20 backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-700"></div>
              
              <CardHeader className="text-center pt-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <CardTitle className="text-red-700 text-3xl font-bold">
                  Đăng Ký Nhận Tin
                </CardTitle>
                <p className="text-black/80 mt-2 max-w-md mx-auto">
                  Nhận thông tin cập nhật mới nhất về công nghệ AI và tự động hóa từ ApecGlobal Group
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6 p-8">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-red-200 rounded-lg blur opacity-30"></div>
                  <div className="relative flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      placeholder="Nhập địa chỉ email của bạn"
                      className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder:text-black/50 focus:outline-none focus:border-red-500 backdrop-blur-sm"
                    />
                    <Button className="bg-red-700 hover:bg-red-800 text-white px-8 shadow-lg shadow-red-700/30 transition-all duration-300">
                      <span className="mr-2">Đăng Ký</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-6 pt-2">
                  <div className="flex items-center text-black/60 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-red-700">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span>Bảo mật thông tin</span>
                  </div>
                  <div className="flex items-center text-black/60 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-red-700">
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
