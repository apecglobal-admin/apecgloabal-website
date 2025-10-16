import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHeroCarousel from "@/components/page-hero-carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { 
  Target, Building2, History, Crown, Users, Award, Globe, Lightbulb, TrendingUp, Shield,
  DollarSign, MapPin, Phone, Mail, Heart, Brain, Zap, Eye, Rocket, CheckCircle,
  Briefcase, Network, Star, Trophy, FileCheck, Handshake, ArrowRight, ExternalLink,
  Building, Factory, ShoppingCart, Leaf, Lock, Cpu, Cloud, Database, Smartphone,
  TrendingDown, Calendar, ChevronRight, BadgeCheck, GraduationCap, UserCheck
} from "lucide-react"
import { getAllCompanies, getSubsidiaryCompanies } from "@/lib/db"
import type { LucideIcon } from "lucide-react"

// Helper function to get icon for company based on name or industry
const getCompanyIcon = (name: string, industry?: string): LucideIcon => {
  const nameLower = name.toLowerCase()
  const industryLower = industry?.toLowerCase() || ''
  
  // Map based on company name
  if (nameLower.includes('bci') || nameLower.includes('apec bci')) return BadgeCheck
  if (nameLower.includes('life') || nameLower.includes('care')) return Heart
  if (nameLower.includes('ecoop') || nameLower.includes('warehouse') || nameLower.includes('kho')) return ShoppingCart
  if (nameLower.includes('queency') || nameLower.includes('factory') || nameLower.includes('sản xuất')) return Factory
  if (nameLower.includes('security') || nameLower.includes('bảo vệ') || nameLower.includes('nam thiên long')) return Shield
  if (nameLower.includes('kangaroo') || nameLower.includes('ion') || nameLower.includes('điện')) return Zap
  if (nameLower.includes('space') || nameLower.includes('app')) return Smartphone
  if (nameLower.includes('guard') || nameLower.includes('cam') || nameLower.includes('camera')) return Lock
  
  // Map based on industry
  if (industryLower.includes('tech') || industryLower.includes('công nghệ')) return Cpu
  if (industryLower.includes('health') || industryLower.includes('sức khỏe')) return Heart
  if (industryLower.includes('security') || industryLower.includes('an ninh')) return Shield
  if (industryLower.includes('commerce') || industryLower.includes('thương mại')) return ShoppingCart
  if (industryLower.includes('finance') || industryLower.includes('tài chính')) return DollarSign
  
  // Default icon
  return Building2
}

export default async function AboutPage() {
  // Lấy dữ liệu công ty từ database
  const dbCompanies = await getAllCompanies()
  
  // Lấy các công ty con (không phải công ty mẹ)
  const subsidiaryCompanies = await getSubsidiaryCompanies()
  
  // Tính tổng số nhân viên từ tất cả các công ty
  const totalEmployees = dbCompanies.reduce((sum, company) => sum + (company.employee_count || 0), 0)

  // Thông tin tổng quan
  const companyInfo = {
    fullName: "Tập Đoàn Kinh Tế APEC GLOBAL",
    legalName: "Công ty Cổ Phần Tập Đoàn Kinh Tế ApecGlobal",
    slogan: "Kiến Tạo Giá Trị - Làm Chủ Tương Lai",
    sloganEn: "Creating Value - Owning the Future",
    capital: "2.868 Tỷ Đồng",
    parentCompany: "IMP HOLDING HOA KỲ",
    sectors: ["Tài chính", "Công nghệ", "Thương mại", "Kinh tế cộng đồng", "Kinh tế tuần hoàn"],
    address: "04 Lê Tuấn Mậu, Phường 13, Quận 06, TP. HCM",
    hotline: "1900 3165",
    email: "info@apecglobal.vn",
    website: "www.apecglobal.vn",
    foundingYear: "2004",
    expansionPeriod: "2019-2024"
  }

  // Giá trị cốt lõi TÂM
  const coreValues = [
    {
      icon: Eye,
      title: "TÂM Sáng",
      description: "Tâm phải sáng thì tâm mới cao",
      accent: "red"
    },
    {
      icon: Shield,
      title: "TÂM Bảo",
      description: "Khát vọng đam mê tinh thần trách nhiệm cao",
      accent: "blue"
    },
    {
      icon: Heart,
      title: "TÂM Huyết",
      description: "Khát vọng đam mê tinh thần trách nhiệm cao",
      accent: "green"
    },
    {
      icon: Rocket,
      title: "TÂM Khởi",
      description: "Cho là nhân, tất cả vì lợi ích và sức khỏe cộng đồng",
      accent: "purple"
    },
    {
      icon: Brain,
      title: "TÂM Thục",
      description: "Thấu hiểu nội Tâm Tỏ trái tim đến trái tim",
      accent: "orange"
    },
    {
      icon: Zap,
      title: "TÂM Đạo",
      description: "Chân thành, yêu thương và chia sẻ",
      accent: "indigo"
    }
  ]

  // Lãnh đạo cấp cao
  const leadership = [
    {
      name: "Mr. Nguyễn Ngọc Tùng",
      position: "Chủ Tịch Tri HĐQT",
      description: "PhD Viện Khoa Học Công Nghệ Sài Gòn",
      image: null
    },
    {
      name: "Mr. Brook Taylor",
      position: "Phó Chủ Tịch Tri HĐQT",
      description: "Phát Triển Điều Hành Tại Hoa Kỳ",
      image: null
    }
  ]

  // Cố vấn cấp cao
  const advisors = [
    {
      name: "Ms. Trương Thị Ny",
      position: "Cố Vấn Chiến Lược Cấp Cao",
      description: "Ủy Viên Đặc Biệt và Đại Diện Hội Đồng Phát Triển Kinh Tế Châu Âu (EEDC)",
      region: "Châu Âu"
    },
    {
      name: "Mr. Trần Luân Kim",
      position: "Phó Chủ Tịch Liên Minh Cố Vấn Phát Triển",
      description: "Tiến Sĩ Cấp Cao Nguyên Bộ Quốc Hội",
      region: "Việt Nam"
    },
    {
      name: "Mr. Trần Văn Luyện",
      position: "Tiến Sĩ - Nhà Khoa Học",
      description: "Giám Đốc TT Nghiên Cứu Phát Triển CN Sinh Học",
      region: "Việt Nam"
    },
    {
      name: "Mr. Jonathan Lee",
      position: "Đại Sứ Thương Mại",
      description: "Khu Vực Đông Nam Á",
      region: "Đông Nam Á"
    },
    {
      name: "Mr. William Carter",
      position: "Đại Sứ Thương Mại",
      description: "Vương Quốc Anh",
      region: "Châu Âu"
    },
    {
      name: "Mr. Li Wei Chen",
      position: "Đại Sứ Thương Mại",
      description: "Trung Hoa Đại Lục",
      region: "Châu Á"
    }
  ]

  // Đối tác chiến lược
  const strategicPartners = [
    {
      name: "ASI",
      fullName: "Quỹ Đầu Tư An Sinh Capital",
      type: "Quỹ Đầu Tư",
      icon: DollarSign
    },
    {
      name: "EDEN",
      fullName: "Quỹ Đầu Tư Eden Capital",
      type: "Quỹ Đầu Tư",
      icon: TrendingUp
    },
    {
      name: "ARIC",
      fullName: "Quỹ Khởi Nghiệp ARI COIN",
      type: "Quỹ Khởi Nghiệp",
      icon: Rocket
    },
    {
      name: "HappyLand",
      fullName: "Tập Đoàn Khang Thông",
      type: "Tập Đoàn",
      icon: Building2
    },
    {
      name: "METTITECH",
      fullName: "Tập Đoàn Metitech Hoa Kỳ",
      type: "Công Nghệ",
      icon: Cpu
    },
    {
      name: "SST",
      fullName: "Viện CN KH Sài Gòn",
      type: "Viện Nghiên Cứu",
      icon: GraduationCap
    }
  ]

  // Fallback data nếu database chưa có dữ liệu
  const defaultMemberBrands = [
    { name: "Apec BCI", description: "Thẻ Quyền Năng & Hội Thương Mại", icon: BadgeCheck, slug: "apec-bci" },
    { name: "Life Care", description: "Trung Tâm Chăm Sóc Sức Khỏe", icon: Heart, slug: "life-care" },
    { name: "Ecoop", description: "Tổng Kho Thương Mại A.I", icon: ShoppingCart, slug: "ecoop" },
    { name: "Queency", description: "Sản Xuất Bào Tử Vi Khuẩn", icon: Factory, slug: "queency" },
    { name: "Nam Thiên Long Security", description: "An Ninh Bảo Vệ", icon: Shield, slug: "nam-thien-long" },
    { name: "Kangaroo I-On", description: "Điện Tử Trương Ion Bạc", icon: Zap, slug: "kangaroo-ion" },
    { name: "Apec Space", description: "Siêu Ứng Dụng", icon: Smartphone, slug: "apec-space" },
    { name: "GuardCam", description: "An Ninh 5.0", icon: Lock, slug: "guardcam" }
  ]
  
  // Map công ty con từ database với icon, hoặc dùng fallback nếu database trống
  const memberBrands = subsidiaryCompanies.length > 0 
    ? subsidiaryCompanies
        .filter(company => company.slug !== 'apecglobal')
        .map(company => ({
          name: company.name,
          description: company.short_description || company.description || company.industry || 'Công ty thành viên',
          icon: getCompanyIcon(company.name, company.industry),
          slug: company.slug,
          logo: company.logo_url || company.logo || company.logoUrl || null
        }))
    : defaultMemberBrands

  // Dự án đầu tư 2019-2024
  const investmentProjects = [
    {
      category: "Công Nghệ",
      description: "Tạo nền tảng đổi mới đột phá, ứng dụng trí tuệ nhân tạo toàn vẹn và công nghệ tiên tiến",
      projects: [
        "Siêu Ứng Dụng Apec Space",
        "Điện Tử Trương Ion Bạc",
        "An Ninh 5.0 GuardCam",
        "Tổng Kho Ecoop A.I"
      ],
      icon: Cpu,
      color: "blue"
    },
    {
      category: "Thương Mại",
      description: "Phát triển hệ sinh thái kinh doanh toàn diện, nâng chuỗi giá trị",
      projects: [
        "Hội Thương Mại Apec BCI",
        "Thẻ Quyền Năng Apec BCI",
        "Câu Lạc Bộ Sinh Viên Khởi Nghiệp"
      ],
      icon: ShoppingCart,
      color: "green"
    },
    {
      category: "Sức Khỏe",
      description: "Chăm sóc sức khỏe cộng đồng với công nghệ hiện đại",
      projects: [
        "Trung Tâm CSSK LifeCare - HappyLand",
        "Sản Xuất Queency Bào Tử Vi Khuẩn",
        "Nước Linh Chi Trà Thảo Dược"
      ],
      icon: Heart,
      color: "red"
    }
  ]

  // Mục tiêu 2025-2029
  const goals2025_2029 = [
    {
      year: "2025",
      title: "Xây Dựng Hệ Sinh Thái",
      items: [
        "Khai trương 3-5 trung tâm/quận",
        "Mở 5-7 spa/chung cư",
        "Thiết lập 3-5 điểm/phường",
        "Hình thành mạng lưới cốt lõi"
      ],
      icon: Building,
      color: "blue"
    },
    {
      year: "2025-2027",
      title: "Mở Rộng Quốc Tế",
      items: [
        "Văn phòng: Singapore, Hàn Quốc, Mỹ, Nhật, UAE",
        "Đại lý tại 63 tỉnh thành Việt Nam",
        "Trung Tâm Xúc Tiến Thương Mại Toàn Cầu",
        "Hội nghị thương mại quốc tế hàng năm"
      ],
      icon: Globe,
      color: "green"
    },
    {
      year: "2025-2029",
      title: "Làm Chủ Công Nghệ",
      items: [
        "Ứng dụng 3D tương tác mua sắm",
        "Tích hợp AI vào bán hàng & chăm sóc KH",
        "Blockchain trong chuỗi cung ứng",
        "Chi phí thấp: 10 USD cho AI-3D"
      ],
      icon: Cpu,
      color: "purple"
    },
    {
      year: "2029",
      title: "IPO Đa Quốc Gia",
      items: [
        "IPO tại Mỹ",
        "IPO tại Singapore",
        "IPO tại Việt Nam",
        "Trở thành tập đoàn đầu tư đa quốc gia"
      ],
      icon: TrendingUp,
      color: "red"
    }
  ]

  // Chứng chỉ và giải thưởng
  const certifications = [
    { name: "ISO Certified Quality International", icon: Award },
    { name: "Top 10 Doanh Nghiệp Việt Nam Uy Tín", icon: Trophy },
    { name: "Giấy Chứng Nhận Đầu Tư 5.000.000 USD", icon: FileCheck },
    { name: "Hiệp Hội Doanh Nghiệp Việt Nam Tại Nhật Bản", icon: Globe },
    { name: "Chứng Nhận Top 10 Sản Phẩm", icon: Star },
    { name: "Certified Quality Standard", icon: BadgeCheck }
  ]

  // Hero slides for About page
  const heroSlides = [
    {
      title: "TẬP ĐOÀN KINH TẾ APEC GLOBAL",
      subtitle: "Kiến Tạo Giá Trị - Làm Chủ Tương Lai | Vốn hoạt động 2.868 tỷ đồng, thuộc hệ sinh thái IMP Holding Hoa Kỳ",
      gradient: "from-red-400 via-white to-purple-400",
      backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Tìm Hiểu Thêm",
        href: "#overview",
        gradient: "from-red-600 to-purple-600",
        hoverGradient: "from-red-700 to-purple-700"
      },
      secondaryButton: {
        text: "Liên Hệ Với Chúng Tôi",
        href: "/contact",
        borderColor: "border-red-500/50",
        hoverBg: "bg-red-500/20",
        hoverBorder: "border-red-400"
      }
    },
    {
      title: "HỆ SINH THÁI ĐA NGÀNH",
      subtitle: "Tài chính, Công nghệ, Thương mại, Kinh tế cộng đồng và Kinh tế tuần hoàn - Kết nối doanh nghiệp và cộng đồng",
      gradient: "from-blue-400 via-white to-cyan-400",
      backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Xem Công Ty Thành Viên",
        href: "#member-companies",
        gradient: "from-blue-600 to-cyan-600",
        hoverGradient: "from-blue-700 to-cyan-700"
      },
      secondaryButton: {
        text: "Dự Án Đầu Tư",
        href: "#investment-projects",
        borderColor: "border-blue-500/50",
        hoverBg: "bg-blue-500/20",
        hoverBorder: "border-blue-400"
      }
    },
    {
      title: "MỤC TIÊU 2025-2029",
      subtitle: "IPO 3 thương hiệu tại Mỹ - Singapore - Việt Nam | Mở rộng văn phòng quốc tế | Làm chủ công nghệ AI-3D-Blockchain",
      gradient: "from-green-400 via-white to-emerald-400",
      backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Xem Mục Tiêu",
        href: "#goals",
        gradient: "from-green-600 to-emerald-600",
        hoverGradient: "from-green-700 to-emerald-700"
      },
      secondaryButton: {
        text: "Đối Tác Chiến Lược",
        href: "#partners",
        borderColor: "border-green-500/50",
        hoverBg: "bg-green-500/20",
        hoverBorder: "border-green-400"
      }
    }
  ]

  const accentColors = {
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', hover: 'hover:border-red-300', gradient: 'from-red-100 to-red-200' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:border-blue-300', gradient: 'from-blue-100 to-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', hover: 'hover:border-green-300', gradient: 'from-green-100 to-green-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:border-purple-300', gradient: 'from-purple-100 to-purple-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:border-orange-300', gradient: 'from-orange-100 to-orange-200' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200', hover: 'hover:border-indigo-300', gradient: 'from-indigo-100 to-indigo-200' }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        <div className="hero-carousel-container relative z-10">
          <PageHeroCarousel slides={heroSlides} />
        </div>
      </section>

      {/* Company Overview */}
      <section id="overview" className="section-standard bg-gradient-to-br from-gray-50/50 via-white to-red-50/30">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4 mr-2" />
              Thông Tin Tổng Quan
            </div>
            <h2 className="heading-h2 mb-4">
              Về <span className="text-red-600">Tập Đoàn</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
              <span className="font-semibold text-gray-900">{companyInfo.fullName}</span> với slogan{" "}
              <span className="text-red-600 font-semibold italic">"{companyInfo.slogan}"</span>{" "}
              hướng tới nền kinh tế tuần hoàn bền vững, kết nối doanh nghiệp và cộng đồng.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Vốn hoạt động */}
            <div className="group p-6 bg-white rounded-2xl border-2 border-red-200 hover:border-red-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-red-100 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold text-gray-900">Vốn Hoạt Động</h4>
                  <p className="text-2xl font-bold text-red-600">{companyInfo.capital}</p>
                  <p className="text-sm text-gray-600">Thuộc hệ sinh thái {companyInfo.parentCompany}</p>
                </div>
              </div>
            </div>

            {/* Lĩnh vực */}
            <div className="group p-6 bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold text-gray-900">Lĩnh Vực Trọng Điểm</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {companyInfo.sectors.map((sector, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Liên hệ */}
            <div className="group p-6 bg-white rounded-2xl border-2 border-green-200 hover:border-green-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold text-gray-900">Trụ Sở & Liên Hệ</h4>
                  <p className="text-sm text-gray-600">{companyInfo.address}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">{companyInfo.hotline}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hành trình phát triển */}
          <div className="bg-gradient-to-r from-red-50 via-purple-50 to-blue-50 rounded-3xl p-8 border border-gray-100">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-red-600 mb-2">{companyInfo.foundingYear}</div>
                <p className="text-gray-600">Thành lập các lĩnh vực chính</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">{companyInfo.expansionPeriod}</div>
                <p className="text-gray-600">Mở rộng công nghệ & thương mại</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">2025-2029</div>
                <p className="text-gray-600">IPO đa quốc gia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission & Core Values (TÂM) */}
      <section id="vision" className="section-standard">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4 mr-2" />
              Tầm Nhìn - Sứ Mệnh - Giá Trị
            </div>
            <h2 className="heading-h2 mb-4">
              Định Hướng <span className="text-red-600">Chiến Lược</span>
            </h2>
          </div>

          {/* Tầm nhìn & Sứ mệnh */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="heading-h4 text-red-600 mb-4">Tầm Nhìn</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Trong 10 năm, ApecGlobal trở thành tập đoàn đầu tư đa quốc gia.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Xây dựng hệ sinh thái - cộng đồng khỏe mạnh, tạo ra nền kinh tế tuần hoàn, 
                  góp phần thúc đẩy an sinh xã hội và phát triển bền vững.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="heading-h4 text-red-600 mb-4">Sứ Mệnh</h3>
                <p className="text-gray-600 leading-relaxed">
                  Đầu tư, tái thiết lập doanh nghiệp, nâng tầm giá trị thương hiệu, tri thức hiện đại.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Chứng tỏ kiến tạo giá trị và tạo nền tảng bền vững. Giúp cộng đồng và các doanh nghiệp phát triển toàn diện.
                </p>
              </div>
            </div>
          </div>

          {/* 6 Giá trị TÂM */}
          <div className="text-center mb-12">
            <h3 className="heading-h3 mb-4">
              Giá Trị Cốt Lõi <span className="text-red-600">TÂM</span>
            </h3>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              6 giá trị TÂM định hướng mọi hoạt động và quyết định của Tập Đoàn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon
              const colors = accentColors[value.accent as keyof typeof accentColors]
              
              return (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-2xl transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} group-hover:${index % 2 === 0 ? 'rotate-2' : '-rotate-2'} transition-transform`}></div>
                  <div className="relative card-feature p-6 bg-white rounded-2xl">
                    <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`w-7 h-7 ${colors.text}`} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="leadership" className="section-standard bg-gradient-to-br from-gray-50/50 to-blue-50/30">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              Đội Ngũ Lãnh Đạo
            </div>
            <h2 className="heading-h2 mb-4">
              Lãnh Đạo <span className="text-red-600">Cấp Cao</span>
            </h2>
          </div>

          {/* Lãnh đạo chính */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {leadership.map((leader, index) => (
              <div key={index} className="group bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCheck className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{leader.name}</h3>
                    <p className="text-red-600 font-semibold mb-3">{leader.position}</p>
                    <p className="text-gray-600 text-sm">{leader.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cố vấn cấp cao */}
          <div className="text-center mb-12">
            <h3 className="heading-h3 mb-4">
              Cố Vấn Cấp Cao & <span className="text-red-600">Đại Sứ Thương Mại</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisors.map((advisor, index) => (
              <div key={index} className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{advisor.name}</h4>
                    <p className="text-red-600 text-sm font-semibold mb-2">{advisor.position}</p>
                    <p className="text-gray-600 text-xs mb-2">{advisor.description}</p>
                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {advisor.region}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Partners */}
      <section id="partners" className="section-standard">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              <Handshake className="w-4 h-4 mr-2" />
              Đối Tác Chiến Lược
            </div>
            <h2 className="heading-h2 mb-4">
              Hợp Tác <span className="text-red-600">Chiến Lược</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Các đối tác chiến lược hàng đầu cùng phát triển hệ sinh thái
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategicPartners.map((partner, index) => {
              const IconComponent = partner.icon
              return (
                <div key={index} className="group bg-white rounded-xl border-2 border-green-200 hover:border-green-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{partner.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{partner.fullName}</p>
                      <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        {partner.type}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Member Companies */}
      <section id="member-companies" className="section-standard bg-gradient-to-br from-gray-50/50 to-purple-50/30">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <Building className="w-4 h-4 mr-2" />
              Hệ Sinh Thái Thương Hiệu
            </div>
            <h2 className="heading-h2 mb-4">
              Công Ty Con & <span className="text-red-600">Thương Hiệu</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Hệ sinh thái đa ngành với các thương hiệu hàng đầu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {memberBrands.map((brand, index) => {
              const IconComponent = brand.icon
              const colors = [
                accentColors.red,
                accentColors.blue,
                accentColors.green,
                accentColors.purple,
                accentColors.orange,
                accentColors.indigo
              ]
              const color = colors[index % colors.length]
              
              return (
                <Link 
                  key={index} 
                  href={`/companies/${brand.slug}`}
                  className={`group bg-white rounded-xl border-2 ${color.border} ${color.hover} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 block`}
                >
                  <div className={`w-12 h-12 ${color.bg} rounded-lg flex items-center justify-center mb-4 overflow-hidden group-hover:scale-110 transition-transform`}>
                    {brand.logo ? (
                      <Image
                        src={brand.logo.startsWith('/') ? brand.logo : `${brand.logo}`}
                        alt={`${brand.name} logo`}
                        width={48}
                        height={48}
                        className="object-contain w-full h-full p-1"
                      />
                    ) : (
                      <IconComponent className={`w-6 h-6 ${color.text}`} />
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">{brand.name}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2">{brand.description}</p>
                  <div className="mt-3 flex items-center text-xs text-gray-500 group-hover:text-red-600 transition-colors">
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/companies" className="inline-flex items-center btn-primary group">
              Xem Tất Cả Công Ty
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Investment Projects 2019-2024 */}
      <section id="investment-projects" className="section-standard">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6">
              <Rocket className="w-4 h-4 mr-2" />
              Dự Án Đầu Tư
            </div>
            <h2 className="heading-h2 mb-4">
              Dự Án Đầu Tư <span className="text-red-600">2019-2024</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Các dự án trọng điểm trong giai đoạn phát triển và mở rộng
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {investmentProjects.map((project, index) => {
              const IconComponent = project.icon
              const colors = accentColors[project.color as keyof typeof accentColors]
              
              return (
                <div key={index} className={`group bg-white rounded-2xl border-2 ${colors.border} ${colors.hover} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8`}>
                  <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.category}</h3>
                  <p className="text-gray-600 text-sm mb-6">{project.description}</p>
                  <ul className="space-y-3">
                    {project.projects.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Goals 2025-2029 */}
      <section id="goals" className="section-standard bg-gradient-to-br from-gray-50/50 to-green-50/30">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Mục Tiêu Phát Triển
            </div>
            <h2 className="heading-h2 mb-4">
              Mục Tiêu <span className="text-red-600">2025-2029</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Lộ trình phát triển và mở rộng quốc tế trong 5 năm tới
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {goals2025_2029.map((goal, index) => {
              const IconComponent = goal.icon
              const colors = accentColors[goal.color as keyof typeof accentColors]
              
              return (
                <div key={index} className={`group bg-white rounded-2xl border-2 ${colors.border} ${colors.hover} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8`}>
                  <div className="flex items-start space-x-6 mb-6">
                    <div className={`flex-shrink-0 w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm font-bold mb-2`}>
                        {goal.year}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{goal.title}</h3>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {goal.items.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <ChevronRight className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Highlight IPO 2029 */}
          <div className="mt-12 bg-gradient-to-r from-red-50 via-purple-50 to-blue-50 rounded-3xl p-8 border-2 border-red-200">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold mb-4">
                <TrendingUp className="w-4 h-4 mr-2" />
                Mục Tiêu Lớn 2029
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                IPO 3 Thương Hiệu Tại <span className="text-red-600">Mỹ - Singapore - Việt Nam</span>
              </h3>
              <p className="text-lg text-gray-600">
                Trở thành tập đoàn đầu tư đa quốc gia với hệ sinh thái khỏe mạnh
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Awards */}
      <section id="certifications" className="section-standard">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Chứng Chỉ & Giải Thưởng
            </div>
            <h2 className="heading-h2 mb-4">
              Năng Lực & <span className="text-red-600">Thành Tựu</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Các chứng chỉ quốc tế và giải thưởng uy tín
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => {
              const IconComponent = cert.icon
              return (
                <div key={index} className="group bg-white rounded-xl border-2 border-yellow-200 hover:border-yellow-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 leading-snug">{cert.name}</h4>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Investment Policy */}
      <section id="investment-policy" className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
              <Handshake className="w-4 h-4 mr-2" />
              Chính Sách Đầu Tư
            </div>
            <h2 className="heading-h2 mb-4">
              Đầu Tư & <span className="text-red-600">Hợp Tác</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Các hình thức đầu tư và hợp tác chiến lược
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Đầu tư 100% */}
            <div className="group bg-white rounded-2xl border-2 border-red-200 hover:border-red-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Đầu Tư 100%</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Chi nhánh/mở rộng</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Bảo vệ, sức khỏe, thương mại</span>
                </li>
              </ul>
            </div>

            {/* Hợp tác liên kết */}
            <div className="group bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Network className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hợp Tác Liên Kết</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Bệnh viện, phòng khám, spa</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Đối tác TM trong/ngoài nước</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Nhà sản xuất</span>
                </li>
              </ul>
            </div>

            {/* Ưu tiên */}
            <div className="group bg-white rounded-2xl border-2 border-green-200 hover:border-green-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ưu Tiên</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Kinh tế cộng đồng, tuần hoàn</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Chuyển đổi số</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Chi phí thấp (10 USD cho AI-3D)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/contact" className="inline-flex items-center btn-primary group text-lg px-8 py-4">
              Liên Hệ Hợp Tác
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-standard bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 text-white">
        <div className="container-standard">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Cùng Xây Dựng Tương Lai
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Tham gia hệ sinh thái ApecGlobal - Nơi công nghệ gặp gỡ cơ hội
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group">
                Liên Hệ Ngay
                <Phone className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link href="/services" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur text-white border-2 border-white/30 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 group">
                Xem Dịch Vụ
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}