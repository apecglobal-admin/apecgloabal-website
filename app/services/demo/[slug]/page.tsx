import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { query } from "@/lib/db";

// Hàm để lấy dữ liệu dịch vụ theo slug
async function getServiceBySlug(slug: string) {
  try {
    console.log('Fetching service with slug:', slug);
    
    // Kiểm tra xem bảng companies có tồn tại không
    let result;
    try {
      result = await query(
        `SELECT s.*, c.name as company_name, c.logo_url as company_logo
         FROM services s
         LEFT JOIN companies c ON s.company_id = c.id
         WHERE s.slug = $1`,
        [slug]
      );
    } catch (err) {
      console.log('Error with companies join, trying without companies:', err);
      // Nếu có lỗi, thử truy vấn không có bảng companies
      result = await query(
        `SELECT * FROM services WHERE slug = $1`,
        [slug]
      );
    }

    console.log('Query result:', result?.rows?.length > 0 ? 'Found' : 'Not found');
    
    if (!result || result.rows.length === 0) {
      // Thử tìm bằng ID nếu slug là số
      if (!isNaN(Number(slug))) {
        console.log('Trying to find by ID:', slug);
        result = await query(
          `SELECT * FROM services WHERE id = $1`,
          [Number(slug)]
        );
        
        if (result.rows.length === 0) {
          return null;
        }
      } else {
        return null;
      }
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error getting service:', error);
    return null;
  }
}

// Tạo metadata động cho trang
/* export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  
  if (!service) {
    return {
      title: 'Yêu cầu Demo Dịch vụ',
      description: 'Đăng ký nhận demo dịch vụ từ ApecTech',
    };
  }
  
  return {
    title: `Yêu cầu Demo: ${service.title}`,
    description: `Đăng ký nhận demo dịch vụ ${service.title} từ ${service.company_name || 'ApecTech'}`,
  };
} */

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

export default async function ServiceDemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log('Rendering service demo page for slug:', slug);
  const service = await getServiceBySlug(slug);
  
  // Chuẩn bị dữ liệu dịch vụ
  const serviceData = service ? {
    id: service.id,
    slug: service.slug || service.id.toString(),
    title: service.title || 'Dịch vụ',
    description: service.description || 'Mô tả dịch vụ',
    features: service.features || [],
    company: service.company_name || 'ApecTech',
    companyLogo: service.company_logo || "/placeholder-logo.svg",
    gradient: getCompanyGradient(service.company_name || 'ApecTech'),
  } : {
    id: 0,
    slug: params.slug,
    title: 'Dịch vụ',
    description: 'Mô tả dịch vụ',
    features: [],
    company: 'ApecTech',
    companyLogo: "/placeholder-logo.svg",
    gradient: "from-purple-600 to-blue-600",
  };
  
  // Danh sách các lợi ích khi dùng demo
  const demoFeatures = [
    "Trải nghiệm đầy đủ tính năng trong 14 ngày",
    "Hỗ trợ kỹ thuật 1:1 từ chuyên gia",
    "Tùy chỉnh theo nhu cầu doanh nghiệp",
    "Đánh giá hiệu quả thực tế",
    "Không yêu cầu thông tin thanh toán",
    "Hỗ trợ chuyển đổi dữ liệu",
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center text-white/60 text-sm">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-white">Dịch vụ</Link>
            <span className="mx-2">/</span>
            <Link href={`/services/${serviceData.slug}`} className="hover:text-white">{serviceData.title}</Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">Yêu cầu Demo</span>
          </div>
        </div>
      </section>
      
      {/* Demo Request Form */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link 
            href={`/services/${serviceData.slug}`} 
            className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại thông tin dịch vụ
          </Link>
          
          <div className="grid md:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="md:col-span-7 space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Đăng Ký Nhận Demo Dịch Vụ
                </h1>
                <p className="text-white/70 text-lg">
                  Điền thông tin bên dưới để đăng ký trải nghiệm demo dịch vụ {serviceData.title} từ {serviceData.company}
                </p>
              </div>
              
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6 md:p-8">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-white/80 text-sm">Họ và tên *</label>
                        <input 
                          type="text" 
                          placeholder="Nhập họ và tên của bạn"
                          className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/80 text-sm">Email *</label>
                        <input 
                          type="email" 
                          placeholder="Nhập địa chỉ email"
                          className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-white/80 text-sm">Số điện thoại *</label>
                        <input 
                          type="tel" 
                          placeholder="Nhập số điện thoại"
                          className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-white/80 text-sm">Tên công ty</label>
                        <input 
                          type="text" 
                          placeholder="Nhập tên công ty của bạn"
                          className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-white/80 text-sm">Quy mô doanh nghiệp</label>
                      <select className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500">
                        <option value="" className="bg-gray-900">Chọn quy mô doanh nghiệp</option>
                        <option value="1-10" className="bg-gray-900">1-10 nhân viên</option>
                        <option value="11-50" className="bg-gray-900">11-50 nhân viên</option>
                        <option value="51-200" className="bg-gray-900">51-200 nhân viên</option>
                        <option value="201-500" className="bg-gray-900">201-500 nhân viên</option>
                        <option value="501+" className="bg-gray-900">Trên 500 nhân viên</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-white/80 text-sm">Yêu cầu cụ thể</label>
                      <textarea 
                        placeholder="Mô tả nhu cầu và yêu cầu cụ thể của bạn"
                        rows={4}
                        className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500"
                      ></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-white/80 text-sm">Thời gian phù hợp để liên hệ</label>
                      <select className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500">
                        <option value="" className="bg-gray-900">Chọn thời gian phù hợp</option>
                        <option value="morning" className="bg-gray-900">Buổi sáng (8:00 - 12:00)</option>
                        <option value="afternoon" className="bg-gray-900">Buổi chiều (13:00 - 17:00)</option>
                        <option value="evening" className="bg-gray-900">Buổi tối (18:00 - 20:00)</option>
                        <option value="anytime" className="bg-gray-900">Bất kỳ thời gian nào</option>
                      </select>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        id="privacy" 
                        className="mt-1"
                      />
                      <label htmlFor="privacy" className="text-white/70 text-sm">
                        Tôi đồng ý với <Link href="/privacy-policy" className="text-purple-400 hover:text-purple-300">Chính sách bảo mật</Link> và cho phép {serviceData.company} liên hệ với tôi qua email hoặc điện thoại.
                      </label>
                    </div>
                    
                    <Button className={`w-full bg-gradient-to-r ${serviceData.gradient} hover:opacity-90 py-6 text-lg`}>
                      <Send className="mr-2 h-5 w-5" />
                      Gửi Yêu Cầu Demo
                    </Button>
                    
                    <p className="text-white/50 text-sm text-center">
                      Đội ngũ chuyên gia của chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ làm việc.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Info Column */}
            <div className="md:col-span-5 space-y-8">
              <Card className="bg-black/50 border-purple-500/30">
                <CardHeader className={`bg-gradient-to-r ${serviceData.gradient} rounded-t-lg`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden relative flex-shrink-0">
                      <Image 
                        src={serviceData.companyLogo} 
                        alt={serviceData.company}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Dịch vụ cung cấp bởi</p>
                      <h3 className="text-white font-bold">{serviceData.company}</h3>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">{serviceData.title}</h3>
                  <p className="text-white/70 mb-6">{serviceData.description}</p>
                  
                  <h4 className="text-white font-medium mb-3">Tính năng chính:</h4>
                  <div className="space-y-2 mb-6">
                    {serviceData.features.length > 0 ? (
                      serviceData.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <p className="text-white/80 text-sm">{feature}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/60 text-sm italic">Thông tin tính năng đang được cập nhật</p>
                    )}
                  </div>
                  
                  <Link href={`/services/${serviceData.slug}`} className="text-purple-400 hover:text-purple-300 text-sm inline-flex items-center">
                    Xem chi tiết dịch vụ
                    <ArrowLeft className="ml-1 h-3 w-3 rotate-180" />
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="bg-black/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Lợi ích khi dùng Demo</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {demoFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${serviceData.gradient} flex items-center justify-center flex-shrink-0`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-white/80">{feature}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/20">
                <h3 className="text-white font-medium mb-2">Cần hỗ trợ?</h3>
                <p className="text-white/70 text-sm mb-4">
                  Liên hệ với chúng tôi qua hotline hoặc email để được tư vấn trực tiếp.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={`bg-gradient-to-r ${serviceData.gradient}`}>Hotline</Badge>
                    <span className="text-white">1900 1234</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`bg-gradient-to-r ${serviceData.gradient}`}>Email</Badge>
                    <span className="text-white">support@apectech.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}