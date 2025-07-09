import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, User, Eye, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import { format } from "date-fns"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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

// Hàm để định dạng nội dung thành HTML
const formatContentToHtml = (content: string): string => {
  if (!content) return '';
  
  // Chia nội dung thành các đoạn
  const paragraphs = content.split(/\n\n+/);
  
  // Chuyển đổi mỗi đoạn thành thẻ <p>
  const htmlParagraphs = paragraphs.map(paragraph => {
    // Bỏ qua đoạn trống
    if (!paragraph.trim()) return '';
    
    // Xử lý các dòng trong đoạn (thêm <br> cho xuống dòng đơn)
    const formattedParagraph = paragraph
      .replace(/\n/g, '<br />');
    
    return `<p>${formattedParagraph}</p>`;
  });
  
  // Kết hợp các đoạn lại với nhau
  return htmlParagraphs.join('\n');
}

// Hàm để lấy màu cho danh mục
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Technology":
      return "bg-blue-600"
    case "E-commerce":
      return "bg-green-600"
    case "Security":
      return "bg-yellow-600"
    case "Enterprise":
      return "bg-purple-600"
    case "Productivity":
      return "bg-orange-600"
    default:
      return "bg-gray-600"
  }
}

// Hàm tạo slug an toàn
function createSafeSlug(text: string) {
  if (!text) return '';
  
  // Chuyển đổi tiếng Việt sang không dấu
  const vietnameseMap: Record<string, string> = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'đ': 'd',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
    'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
    'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
    'Đ': 'D',
    'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
    'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
    'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
    'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
    'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y'
  };
  
  // Chuyển đổi tiếng Việt sang không dấu
  let slug = text.split('').map(char => vietnameseMap[char] || char).join('');
  
  // Chuyển đổi sang chữ thường
  slug = slug.toLowerCase();
  
  // Thay thế các ký tự đặc biệt bằng dấu gạch ngang
  slug = slug.replace(/[^a-z0-9]+/g, '-');
  
  // Loại bỏ dấu gạch ngang ở đầu và cuối
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
}

// Hàm để lấy dữ liệu tin tức theo slug
async function getNewsBySlug(slug: string) {
  try {
    console.log('Fetching news with slug:', slug);
    
    // Chuẩn hóa slug để tìm kiếm
    let normalizedSlug;
    try {
      normalizedSlug = decodeURIComponent(slug);
    } catch (error) {
      console.log('Error decoding slug:', error);
      normalizedSlug = slug; // Sử dụng slug gốc nếu không thể giải mã
    }
    console.log('Normalized slug:', normalizedSlug);
    
    // Kiểm tra xem bảng authors có tồn tại không
    let result;
    try {
      result = await query(
        `SELECT n.*, a.name as author_name, a.avatar_url as author_avatar
         FROM news n
         LEFT JOIN authors a ON n.author_id = a.id
         WHERE n.slug = $1`,
        [normalizedSlug]
      );
    } catch (err) {
      console.log('Error with authors join, trying without authors:', err);
      // Nếu có lỗi, thử truy vấn không có bảng authors
      result = await query(
        `SELECT * FROM news WHERE slug = $1`,
        [normalizedSlug]
      );
    }

    console.log('Query result:', result?.rows?.length > 0 ? 'Found' : 'Not found');
    
    if (!result || result.rows.length === 0) {
      // Thử tìm bằng ID nếu slug là số
      if (!isNaN(Number(normalizedSlug))) {
        console.log('Trying to find by ID:', normalizedSlug);
        result = await query(
          `SELECT * FROM news WHERE id = $1`,
          [Number(normalizedSlug)]
        );
        
        if (result.rows.length === 0) {
          // Thử tìm bằng cách tạo slug an toàn từ tiêu đề
          console.log('Trying to find by title pattern');
          result = await query(
            `SELECT * FROM news WHERE title ILIKE $1`,
            [`%${normalizedSlug.replace(/-/g, '%')}%`]
          );
          
          if (result.rows.length === 0) {
            return null;
          }
        }
      } else {
        // Thử tìm bằng cách tạo slug an toàn từ tiêu đề
        console.log('Trying to find by title pattern');
        result = await query(
          `SELECT * FROM news WHERE title ILIKE $1`,
          [`%${normalizedSlug.replace(/-/g, '%')}%`]
        );
        
        if (result.rows.length === 0) {
          return null;
        }
      }
    }

    // Tăng lượt xem
    await query('UPDATE news SET view_count = view_count + 1 WHERE id = $1', [result.rows[0].id]);

    // Lấy dữ liệu tin tức
    const newsItem = result.rows[0];
    
    // Fallback avatar cho tác giả nếu không có
    const fallbackAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop';
    
    // Gán fallback nếu không có avatar
    if (!newsItem.author_avatar) {
      newsItem.author_avatar = fallbackAvatar;
    }
    
    // Đảm bảo có image_url
    if (!newsItem.image_url) {
      newsItem.image_url = '/placeholder.svg?height=600&width=1200';
    }

    return newsItem;
  } catch (error) {
    console.error('Error getting news:', error);
    return null;
  }
}

// Hàm để lấy tin tức liên quan
async function getRelatedNews(id: string, category: string, limit: number = 3) {
  try {
    let result;
    try {
      result = await query(
        `SELECT n.*, a.name as author_name
         FROM news n
         LEFT JOIN authors a ON n.author_id = a.id
         WHERE n.id != $1 AND n.category = $2 AND n.published = true
         ORDER BY n.published_at DESC
         LIMIT $3`,
        [id, category, limit]
      );
    } catch (err) {
      console.log('Error with authors join in related news, trying without authors:', err);
      // Nếu có lỗi, thử truy vấn không có bảng authors
      result = await query(
        `SELECT * FROM news 
         WHERE id != $1 AND category = $2 AND published = true
         ORDER BY published_at DESC
         LIMIT $3`,
        [id, category, limit]
      );
    }

    const relatedNews = result ? result.rows : [];
    
    // Đảm bảo slug an toàn và image_url cho các bài viết liên quan
    relatedNews.forEach((article, index) => {
      // Đảm bảo có image_url
      if (!article.image_url) {
        article.image_url = '/placeholder.svg?height=300&width=600';
      }
      
      // Đảm bảo slug an toàn
      if (!article.slug) {
        article.slug = createSafeSlug(article.title) || article.id.toString();
      }
    });

    return relatedNews;
  } catch (error) {
    console.error('Error getting related news:', error);
    return [];
  }
}

// Lấy danh sách danh mục
async function getCategories() {
  try {
    const result = await query(
      "SELECT DISTINCT category FROM news WHERE category IS NOT NULL AND published = true ORDER BY category"
    );
    
    return result && result.rows ? result.rows.map(row => row.category) : [];
  } catch (error) {
    console.error('Error getting categories:', error);
    // Trả về một số danh mục mặc định nếu có lỗi
    return ["Technology", "E-commerce", "Security", "Enterprise", "Productivity"];
  }
}

// Tạo metadata động cho trang
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  // Đảm bảo slug an toàn trước khi truy vấn
  let safeSlug = slug;
  try {
    // Thử giải mã slug nếu cần
    safeSlug = decodeURIComponent(slug);
  } catch (error) {
    console.log('Error decoding slug in metadata:', error);
    // Giữ nguyên slug nếu không thể giải mã
  }
  
  const news = await getNewsBySlug(safeSlug);
  
  if (!news) {
    return {
      title: 'Không tìm thấy tin tức',
      description: 'Tin tức không tồn tại hoặc đã bị xóa',
    };
  }
  
  return {
    title: news.title,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: news.image_url ? [{ url: news.image_url }] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  console.log('Rendering news page for slug:', slug);
  
  // Đảm bảo slug an toàn trước khi truy vấn
  let safeSlug = slug;
  try {
    // Thử giải mã slug nếu cần
    safeSlug = decodeURIComponent(slug);
  } catch (error) {
    console.log('Error decoding slug in page component:', error);
    // Giữ nguyên slug nếu không thể giải mã
  }
  
  const news = await getNewsBySlug(safeSlug);
  
  if (!news) {
    console.log('News not found for slug:', slug);
    notFound();
  }
  
  console.log('News found:', news.id, news.title);
  
  const relatedNews = await getRelatedNews(news.id, news.category || '');
  const categories = await getCategories();
  
  // Chuẩn bị dữ liệu tin tức
  const newsData = {
    id: news.id,
    slug: news.slug || news.id.toString(),
    title: news.title || 'Tin tức',
    excerpt: news.excerpt || '',
    content: news.content || '',
    date: news.published_at ? formatDate(news.published_at) : 'Chưa xuất bản',
    author: news.author_name || "Ban Biên Tập",
    authorAvatar: news.author_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480&auto=format&fit=crop",
    readTime: calculateReadTime(news.content || ''),
    views: (news.view_count || 0).toLocaleString(),
    category: news.category || 'Tin tức',
    image: news.image_url || "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1476&auto=format&fit=crop",
    tags: news.tags || [],
  };

  console.log('Image URL for news:', newsData.image);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />
      
      {/* Hero Section with Featured Image */}
      <section className="relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-30">
          {newsData.image && (
            <Image 
              src={newsData.image} 
              alt={newsData.title}
              fill
              className="object-cover blur-sm"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 pt-12 pb-16 px-4">
          <div className="container mx-auto max-w-5xl">
            {/* Breadcrumb */}
            <div className="flex items-center text-white/70 text-sm mb-8 backdrop-blur-sm bg-black/20 inline-flex px-4 py-2 rounded-full">
              <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
              <span className="mx-2">/</span>
              <Link href="/news" className="hover:text-white transition-colors">Tin tức</Link>
              <span className="mx-2">/</span>
              <span className="text-white/90 truncate max-w-[200px]">{newsData.title}</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Left Content */}
              <div className="md:w-2/3">
                <Link 
                  href="/news" 
                  className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại danh sách tin tức
                </Link>
                
                <Badge className={`${getCategoryColor(newsData.category)} mb-4 text-sm px-3 py-1`}>
                  {newsData.category}
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  {newsData.title}
                </h1>
                
                <p className="text-white/80 text-xl mb-8 leading-relaxed">
                  {newsData.excerpt}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm mb-8 p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span>{newsData.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-400" />
                    <span>{newsData.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-400" />
                    <span>{newsData.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-cyan-400" />
                    <span>{newsData.views} lượt xem</span>
                  </div>
                </div>
              </div>
              
              {/* Right Content - Author Card */}
              <div className="md:w-1/3">
                <Card className="bg-black/40 backdrop-blur-md border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 overflow-hidden relative ring-2 ring-purple-500/50 ring-offset-2 ring-offset-black/50">
                        <Image 
                          src={newsData.authorAvatar} 
                          alt={newsData.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-lg">{newsData.author}</h3>
                        <p className="text-white/60 text-sm">Tác giả</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-blue-500/50 text-blue-400 hover:bg-blue-500/20">
                            <Facebook className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-sky-500/50 text-sky-400 hover:bg-sky-500/20">
                            <Twitter className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-blue-700/50 text-blue-600 hover:bg-blue-700/20">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Image */}
      <section className="px-4 -mt-8">
        <div className="container mx-auto max-w-5xl">
          <div className="aspect-video w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl overflow-hidden mb-12 relative shadow-2xl ring-1 ring-purple-500/30 transform hover:scale-[1.01] transition-transform duration-300">
            {newsData.image && (
              <Image 
                src={newsData.image} 
                alt={newsData.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>
      </section>
      
      {/* News Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="md:col-span-8">
              <div className="prose prose-invert prose-lg max-w-none text-white/90 bg-black/20 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-lg">
                <div dangerouslySetInnerHTML={{ 
                  __html: formatContentToHtml(newsData.content || '')
                }} />
              </div>
              
              {/* Tags */}
              {newsData.tags && newsData.tags.length > 0 && (
                <div className="mt-12 bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
                  <h3 className="text-white text-lg font-medium mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Tags:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {newsData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-purple-500/30 text-white bg-purple-500/10 hover:bg-purple-500/20 transition-colors cursor-pointer px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Share */}
              <div className="mt-12 bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
                <h3 className="text-white text-lg font-medium mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Chia sẻ bài viết:
                </h3>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon" className="rounded-full border-blue-500/50 text-blue-400 hover:bg-blue-500/20 h-12 w-12">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-sky-500/50 text-sky-400 hover:bg-sky-500/20 h-12 w-12">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-blue-700/50 text-blue-600 hover:bg-blue-700/20 h-12 w-12">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-purple-500/50 text-purple-400 hover:bg-purple-500/20 h-12 w-12">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="md:col-span-4">
              {/* Categories */}
              <Card className="bg-black/40 backdrop-blur-md border-purple-500/30 mb-8 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-3 px-6">
                  <h3 className="text-white font-medium">Danh mục</h3>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <Link 
                        key={index}
                        href={`/news/category/${category.toLowerCase()}`} 
                        className="flex items-center text-white/80 hover:text-white group"
                      >
                        <div className={`w-2 h-2 rounded-full ${getCategoryColor(category)} mr-3 group-hover:scale-125 transition-transform`}></div>
                        <span className="transition-colors">{category}</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Newsletter Signup */}
              <Card className="bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-md border-purple-500/30 mb-8 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-white font-medium text-lg">Đăng ký nhận tin</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-4">Nhận thông báo về các tin tức công nghệ mới nhất từ ApecTech</p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Email của bạn" 
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-purple-500/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Đăng ký
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Tech Trends */}
              <Card className="bg-black/40 backdrop-blur-md border-purple-500/30 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-3 px-6">
                  <h3 className="text-white font-medium">Xu hướng công nghệ</h3>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-medium">Trí tuệ nhân tạo</h4>
                        <p className="text-white/60 text-xs">Công nghệ đang dẫn đầu xu hướng</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-medium">Blockchain</h4>
                        <p className="text-white/60 text-xs">Ứng dụng vượt ra ngoài tiền điện tử</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-medium">Bảo mật không mật khẩu</h4>
                        <p className="text-white/60 text-xs">Tương lai của xác thực người dùng</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-black/40">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center mb-12">
              <div className="h-1 bg-gradient-to-r from-purple-600 to-blue-600 w-16 mr-4 rounded-full"></div>
              <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Tin tức liên quan</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {relatedNews.map((article, index) => (
                <Link href={article.slug ? `/news/${encodeURIComponent(article.slug)}` : `/news/redirect?slug=${encodeURIComponent(article.title || article.id)}`} key={index}>
                  <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 h-full overflow-hidden group">
                    {/* Thumbnail Image */}
                    <div className="aspect-video w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 overflow-hidden relative">
                      <Image 
                        src={article.image_url || `https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80`} 
                        alt={article.title || 'Tin tức liên quan'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70"></div>
                      <Badge className={`${getCategoryColor(article.category || 'Tin tức')} absolute top-3 left-3`}>
                        {article.category || 'Tin tức'}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-6 relative">
                      <h3 className="text-white font-medium text-lg mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">{article.title || 'Tin tức liên quan'}</h3>
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">{article.excerpt || ''}</p>
                      <div className="flex items-center justify-between text-white/60 text-xs">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-purple-400" />
                          <span>{article.published_at ? formatDate(article.published_at) : 'Chưa xuất bản'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3 text-blue-400" />
                          <span>{article.view_count || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  )
}