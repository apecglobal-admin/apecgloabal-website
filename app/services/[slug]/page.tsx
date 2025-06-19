import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Award, 
  Users, 
  Clock, 
  Shield, 
  Zap,
  ArrowLeft,
  Calendar,
  FileText,
  MessageSquare,
  Phone
} from "lucide-react";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { query } from "@/lib/db";

// Hàm để lấy dữ liệu dịch vụ theo slug
async function getServiceBySlug(slug: string) {
  try {
    const result = await query(
      `SELECT s.*, c.name as company_name, c.logo_url as company_logo
       FROM services s
       LEFT JOIN companies c ON s.company_id = c.id
       WHERE s.slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error getting service:', error);
    return null;
  }
}

// Hàm để lấy các dịch vụ liên quan
async function getRelatedServices(id: string, company_id: number, limit: number = 3) {
  try {
    const result = await query(
      `SELECT s.*, c.name as company_name
       FROM services s
       LEFT JOIN companies c ON s.company_id = c.id
       WHERE s.id != $1 AND s.company_id = $2
       ORDER BY s.is_featured DESC
       LIMIT $3`,
      [id, company_id, limit]
    );

    return result.rows;
  } catch (error) {
    console.error('Error getting related services:', error);
    return [];
  }
}

// Tạo metadata động cho trang
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  
  if (!service) {
    return {
      title: 'Không tìm thấy dịch vụ',
      description: 'Dịch vụ không tồn tại hoặc đã bị xóa',
    };
  }
  
  return {
    title: `${service.title} | ${service.company_name}`,
    description: service.description,
  };
}

// Hàm để lấy màu gradient dựa trên tên công ty
const getCompanyGradient = (companyName: string) => {
  switch (companyName) {
    case "ApecTech":
      return "from-purple-600 to-blue-600"
    case "GuardCam":
      return "from-red-600 to-orange-600"
    case "EmoCommerce":
      return "from-green-600 to-teal-600"
    case "TimeLoop":
      return "from-blue-600 to-cyan-600"
    case "ApecNeuroOS":
      return "from-indigo-600 to-purple-600"
    default:
      return "from-purple-600 to-blue-600"
  }
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  
  if (!service) {
    notFound();
  }
  
  const relatedServices = await getRelatedServices(service.id, service.company_id);
  
  // Chuẩn bị dữ liệu dịch vụ
  const serviceData = {
    id: service.id,
    slug: service.slug,
    title: service.title,
    description: service.description,
    features: service.features || [],
    company: service.company_name,
    companyLogo: service.company_logo || "/placeholder-logo.svg",
    price: service.price_range || "Liên hệ báo giá",
    category: service.category || "Dịch vụ",
    gradient: getCompanyGradient(service.company_name),
  };
  
  // Dữ liệu mẫu cho các tab
  const overviewContent = `
    ${service.description}
    
    Dịch vụ ${service.title} của ${service.company_name} cung cấp giải pháp toàn diện cho doanh nghiệp của bạn. 
    Với đội ngũ chuyên gia giàu kinh nghiệm và công nghệ tiên tiến, chúng tôi cam kết mang đến trải nghiệm dịch vụ 
    tốt nhất và kết quả vượt trội.
    
    Chúng tôi tự hào về khả năng cung cấp các giải pháp tùy chỉnh phù hợp với nhu cầu cụ thể của từng khách hàng, 
    đồng thời đảm bảo tính bảo mật, hiệu suất và khả năng mở rộng.
  `;
  
  const benefitsContent = [
    "Tối ưu hóa hiệu suất và năng suất làm việc",
    "Giảm chi phí vận hành và bảo trì",
    "Tăng cường bảo mật và an toàn dữ liệu",
    "Cải thiện trải nghiệm người dùng và khách hàng",
    "Khả năng mở rộng linh hoạt theo nhu cầu kinh doanh",
    "Hỗ trợ kỹ thuật 24/7 từ đội ngũ chuyên gia",
    "Cập nhật và nâng cấp thường xuyên",
    "Đào tạo và hướng dẫn sử dụng chi tiết",
  ];
  
  const processSteps = [
    {
      step: "01",
      title: "Tư Vấn & Phân Tích",
      description: "Tìm hiểu nhu cầu và phân tích yêu cầu chi tiết của doanh nghiệp",
    },
    {
      step: "02",
      title: "Thiết Kế & Lên Kế Hoạch",
      description: "Thiết kế giải pháp tùy chỉnh và lập kế hoạch triển khai",
    },
    {
      step: "03",
      title: "Phát Triển & Kiểm Thử",
      description: "Phát triển giải pháp và kiểm thử kỹ lưỡng để đảm bảo chất lượng",
    },
    {
      step: "04",
      title: "Triển Khai & Hỗ Trợ",
      description: "Triển khai hệ thống và cung cấp hỗ trợ liên tục",
    },
  ];
  
  const faqItems = [
    {
      question: `Dịch vụ ${service.title} có phù hợp với doanh nghiệp nhỏ không?`,
      answer: `Có, dịch vụ ${service.title} được thiết kế để phù hợp với mọi quy mô doanh nghiệp, từ startup đến doanh nghiệp lớn. Chúng tôi cung cấp các gói dịch vụ linh hoạt có thể tùy chỉnh theo nhu cầu và ngân sách của bạn.`,
    },
    {
      question: "Thời gian triển khai dịch vụ là bao lâu?",
      answer: "Thời gian triển khai phụ thuộc vào quy mô và độ phức tạp của dự án. Thông thường, các dự án nhỏ có thể hoàn thành trong 2-4 tuần, trong khi các dự án lớn hơn có thể mất 2-3 tháng. Chúng tôi luôn cung cấp lộ trình triển khai chi tiết trong quá trình tư vấn.",
    },
    {
      question: "Có hỗ trợ kỹ thuật sau khi triển khai không?",
      answer: "Có, chúng tôi cung cấp hỗ trợ kỹ thuật 24/7 cho tất cả khách hàng. Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng giải quyết mọi vấn đề và đảm bảo hệ thống của bạn hoạt động trơn tru.",
    },
    {
      question: "Làm thế nào để bắt đầu sử dụng dịch vụ?",
      answer: "Để bắt đầu, bạn có thể liên hệ với chúng tôi qua form liên hệ trên website hoặc gọi trực tiếp đến số hotline. Chúng tôi sẽ sắp xếp một buổi tư vấn miễn phí để hiểu rõ nhu cầu của bạn và đề xuất giải pháp phù hợp nhất.",
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />
      
      {/* Breadcrumb - AI Style */}
      <section className="pt-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center text-white/60 text-sm">
            <Link href="/" className="hover:text-cyan-400 transition-colors duration-300">Trang chủ</Link>
            <span className="mx-2 text-purple-500/50">/</span>
            <Link href="/services" className="hover:text-cyan-400 transition-colors duration-300">Dịch vụ</Link>
            <span className="mx-2 text-purple-500/50">/</span>
            <span className="text-cyan-400/80 truncate max-w-[200px]">{serviceData.title}</span>
          </div>
        </div>
      </section>
      
      {/* Service Header - AI Style */}
      <section className="py-16 px-4 relative">
        {/* Background Animation Effect */}
        <div className="absolute inset-0 bg-black/50">
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>
        
        <div className="container mx-auto relative">
          <Link 
            href="/services" 
            className="inline-flex items-center text-white/60 hover:text-cyan-400 mb-8 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-black/30 border border-purple-500/30 flex items-center justify-center mr-2 group-hover:border-cyan-500/50 transition-colors duration-300">
              <ArrowLeft className="h-4 w-4 group-hover:text-cyan-400 transition-colors duration-300" />
            </div>
            Quay lại danh sách dịch vụ
          </Link>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge className={`bg-gradient-to-r ${serviceData.gradient} px-3 py-1 text-xs font-medium uppercase tracking-wider`}>
                  {serviceData.category}
                </Badge>
                <div className="flex items-center space-x-1 bg-black/30 py-1 px-2 rounded-full">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-white/60 text-xs ml-1">4.9/5</span>
                </div>
              </div>
              
              <div>
                <div className="inline-block relative mb-2">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-lg blur opacity-30"></div>
                  <h1 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
                    {serviceData.title}
                  </h1>
                </div>
                
                <p className="text-white/80 text-lg leading-relaxed">
                  {serviceData.description}
                </p>
              </div>
              
              <div className="flex items-center p-4 bg-black/30 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-600/10 to-cyan-600/10 overflow-hidden relative flex-shrink-0 border border-purple-500/20">
                  <Image 
                    src={serviceData.companyLogo} 
                    alt={serviceData.company}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-white/60 text-sm">Cung cấp bởi</p>
                  <p className="text-white font-medium">{serviceData.company}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                  <Link href={`/services/demo/${serviceData.slug}`}>
                    <Button className={`relative bg-gradient-to-r ${serviceData.gradient} hover:opacity-90 shadow-lg shadow-purple-900/20`}>
                      <span className="mr-2">Yêu Cầu Demo</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Button>
                  </Link>
                </div>
                
                <Button 
                  variant="outline" 
                  className="border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <Phone className="mr-2 h-4 w-4 text-cyan-400" />
                  Liên Hệ Tư Vấn
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl blur opacity-30"></div>
              <div className="relative bg-black/60 rounded-xl p-8 border border-purple-500/30 backdrop-blur-sm">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                    Tính Năng Nổi Bật
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {serviceData.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 group">
                      <div className="w-6 h-6 rounded-full bg-black/30 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-500/20 transition-colors duration-300">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      </div>
                      <p className="text-white/80 group-hover:text-white transition-colors duration-300">{feature}</p>
                    </div>
                  ))}
                </div>
                
                <div className="h-px w-full bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-purple-500/30 my-6"></div>
                
                <div className="text-center">
                  <p className="text-white/60 mb-2">Giá khởi điểm từ</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">{serviceData.price}</p>
                  <Link href={`/services/demo/${serviceData.slug}`} className="w-full block">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg shadow-purple-900/20">
                      Nhận Báo Giá Chi Tiết
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Service Details Tabs - AI Style */}
      <section className="py-20 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/0"></div>
        
        <div className="container mx-auto relative">
          <Tabs defaultValue="overview" className="w-full">
            <div className="relative max-w-2xl mx-auto mb-12">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full blur opacity-30"></div>
              <TabsList className="relative grid grid-cols-4 bg-black/60 border border-purple-500/30 rounded-full backdrop-blur-sm overflow-hidden">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-full transition-all duration-300"
                >
                  Tổng Quan
                </TabsTrigger>
                <TabsTrigger 
                  value="benefits" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-full transition-all duration-300"
                >
                  Lợi Ích
                </TabsTrigger>
                <TabsTrigger 
                  value="process" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-full transition-all duration-300"
                >
                  Quy Trình
                </TabsTrigger>
                <TabsTrigger 
                  value="faq" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-full transition-all duration-300"
                >
                  FAQ
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="mt-6 animate-fade-in-up">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="prose prose-invert prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: overviewContent.replace(/\n/g, '<br />') }} />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 mt-16">
                    <div className="group bg-black/30 p-6 rounded-xl border border-purple-500/20 text-center hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <Shield className="h-8 w-8 text-purple-400" />
                      </div>
                      <h3 className="text-white font-medium mb-2 group-hover:text-cyan-300 transition-colors duration-300">Bảo Mật Tối Đa</h3>
                      <p className="text-white/70 text-sm">Hệ thống bảo mật đa lớp bảo vệ dữ liệu của bạn với công nghệ AI tiên tiến</p>
                    </div>
                    <div className="group bg-black/30 p-6 rounded-xl border border-purple-500/20 text-center hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="h-8 w-8 text-cyan-400" />
                      </div>
                      <h3 className="text-white font-medium mb-2 group-hover:text-cyan-300 transition-colors duration-300">Hiệu Suất Cao</h3>
                      <p className="text-white/70 text-sm">Tối ưu hóa hiệu suất và tốc độ xử lý với thuật toán machine learning</p>
                    </div>
                    <div className="group bg-black/30 p-6 rounded-xl border border-purple-500/20 text-center hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <Users className="h-8 w-8 text-green-400" />
                      </div>
                      <h3 className="text-white font-medium mb-2 group-hover:text-cyan-300 transition-colors duration-300">Hỗ Trợ 24/7</h3>
                      <p className="text-white/70 text-sm">Đội ngũ chuyên gia và hệ thống AI chatbot luôn sẵn sàng hỗ trợ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="benefits" className="mt-6 animate-fade-in-up">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                      Lợi Ích Khi Sử Dụng Dịch Vụ
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 stagger-animation">
                    {benefitsContent.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-4 group">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${serviceData.gradient} flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform duration-300`}>
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white/90 text-lg group-hover:text-cyan-300 transition-colors duration-300">{benefit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl blur opacity-30"></div>
                    <div className="relative bg-black/60 p-6 rounded-xl border border-yellow-500/20 backdrop-blur-sm">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-900/20">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">Cam Kết Chất Lượng</h3>
                      </div>
                      <p className="text-white/70">
                        Chúng tôi cam kết cung cấp dịch vụ chất lượng cao nhất với sự hài lòng của khách hàng là ưu tiên hàng đầu. 
                        Nếu bạn không hài lòng với dịch vụ của chúng tôi trong 30 ngày đầu tiên, chúng tôi sẽ hoàn tiền 100%.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="process" className="mt-6 animate-fade-in-up">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center mb-12">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                      Quy Trình Triển Khai AI
                    </h3>
                  </div>
                  
                  <div className="space-y-16">
                    {processSteps.map((step, index) => (
                      <div key={index} className="relative group">
                        {index < processSteps.length - 1 && (
                          <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-cyan-600 to-purple-600/30"></div>
                        )}
                        <div className="flex items-start space-x-6">
                          <div className="relative">
                            {/* Glowing effect */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/30 to-cyan-600/30 blur-xl animate-pulse"></div>
                            
                            {/* Main circle */}
                            <div className={`relative w-12 h-12 rounded-full bg-gradient-to-r ${serviceData.gradient} flex items-center justify-center flex-shrink-0 z-10 shadow-lg shadow-purple-900/30 group-hover:scale-110 transition-transform duration-300`}>
                              <span className="text-white font-bold">{step.step}</span>
                            </div>
                          </div>
                          <div className="pt-1">
                            <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">{step.title}</h4>
                            <p className="text-white/70 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-16 relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl blur opacity-30"></div>
                    <div className="relative bg-black/60 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h4 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-2">Sẵn sàng bắt đầu?</h4>
                        <p className="text-white/70">Liên hệ với chúng tôi ngay hôm nay để bắt đầu quy trình triển khai AI</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button className={`bg-gradient-to-r ${serviceData.gradient} hover:opacity-90 shadow-lg shadow-purple-900/20`}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Đặt Lịch Tư Vấn
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 transition-all duration-300"
                        >
                          <FileText className="mr-2 h-4 w-4 text-cyan-400" />
                          Tải Tài Liệu
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq" className="mt-6 animate-fade-in-up">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center mb-12">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                      Câu Hỏi Thường Gặp
                    </h3>
                  </div>
                  
                  <div className="space-y-6 stagger-animation">
                    {faqItems.map((item, index) => (
                      <div key={index} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div className="relative bg-black/60 p-6 rounded-xl border border-purple-500/20 group-hover:border-cyan-500/30 transition-colors duration-300 backdrop-blur-sm">
                          <h4 className="text-white font-medium mb-3 group-hover:text-cyan-300 transition-colors duration-300">{item.question}</h4>
                          <p className="text-white/70">{item.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 text-center">
                    <p className="text-white/70 mb-6">Bạn có câu hỏi khác? Hãy liên hệ với chúng tôi</p>
                    <div className="relative inline-block">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                      <Button className="relative bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg shadow-purple-900/30">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Đặt Câu Hỏi
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Related Services - AI Style */}
      {relatedServices.length > 0 && (
        <section className="py-20 px-4 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/0"></div>
          
          <div className="container mx-auto relative">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-16"></div>
            
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Dịch Vụ Liên Quan
                </h2>
              </div>
              <div className="hidden md:block h-[1px] w-1/4 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 stagger-animation">
              {relatedServices.map((relatedService, index) => (
                <Link href={`/services/${relatedService.slug || relatedService.id}`} key={index} className="group">
                  <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden h-full">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    
                    <CardContent className="p-6">
                      <Badge className={`bg-gradient-to-r ${getCompanyGradient(relatedService.company_name)} px-3 py-1 text-xs font-medium uppercase tracking-wider mb-3`}>
                        {relatedService.company_name}
                      </Badge>
                      <h3 className="text-white font-medium mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">{relatedService.title}</h3>
                      <p className="text-white/60 text-sm mb-6 line-clamp-3">{relatedService.description}</p>
                      <Button 
                        variant="outline" 
                        className="w-full border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 transition-all duration-300"
                      >
                        <span className="mr-2">Xem Chi Tiết</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section - AI Style */}
      <section className="py-24 px-4 relative overflow-hidden">
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
        
        {/* AI Nodes Animation */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                boxShadow: '0 0 10px 2px rgba(45, 212, 191, 0.3)'
              }}
            ></div>
          ))}
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-purple-500/20 rounded-tl-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-cyan-500/20 rounded-br-3xl"></div>
            
            <Card className={`bg-gradient-to-r ${serviceData.gradient} border-none shadow-2xl shadow-purple-900/20 overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/20"></div>
              
              <CardContent className="p-12 text-center relative">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center animate-pulse border border-white/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                    <line x1="16" y1="8" x2="2" y2="22"></line>
                    <line x1="17.5" y1="15" x2="9" y2="15"></line>
                  </svg>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-md">
                  Sẵn sàng nâng cấp doanh nghiệp với AI?
                </h2>
                
                <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto drop-shadow-md">
                  Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và nhận báo giá chi tiết cho dịch vụ <span className="font-semibold">{serviceData.title}</span>.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Button className="bg-white text-purple-700 hover:bg-white/90 shadow-lg shadow-purple-900/20 group">
                    <Phone className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    Gọi Ngay: 1900 1234
                  </Button>
                  
                  <Link href={`/services/demo/${serviceData.slug}`}>
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white/10 backdrop-blur-sm group"
                    >
                      <span className="mr-2">Yêu Cầu Demo</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}