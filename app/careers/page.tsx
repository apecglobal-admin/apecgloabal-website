import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHeroCarousel from "@/components/page-hero-carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Heart,
  Coffee,
  Gamepad2,
  GraduationCap,
  Shield,
  Send,
  Search,
  Filter,
  Star,
  Award,
  Globe,
  Code,
  Brain,
  Rocket,
  Target,
} from "lucide-react"
import { getAllJobs, getAllCompanies } from "@/lib/db"
import { Job, Company } from "@/lib/schema"

export default async function CareersPage() {
  // Hero slides data
  const heroSlides = [
    {
      title: "Tham Gia Đội Ngũ ApecGlobal",
      subtitle: "Khám phá cơ hội nghề nghiệp tuyệt vời cùng chúng tôi. Nơi tài năng được phát triển và ước mơ trở thành hiện thực.",
      backgroundImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      heroImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-blue-400 via-purple-500 to-cyan-500",
      primaryButton: {
        text: "Xem Vị Trí Tuyển Dụng",
        href: "#jobs",
        gradient: "from-blue-600 to-purple-600",
        hoverGradient: "from-blue-700 to-purple-700"
      },
      secondaryButton: {
        text: "Tìm Hiểu Văn Hóa",
        href: "#culture",
        borderColor: "border-blue-500/50",
        hoverBg: "bg-blue-500/20",
        hoverBorder: "border-blue-400"
      }
    },
    {
      title: "Môi Trường Làm Việc Hiện Đại",
      subtitle: "Văn phòng hiện đại, công nghệ tiên tiến và đội ngũ tài năng. Nơi bạn có thể phát huy hết khả năng của mình.",
      backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      heroImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-green-400 via-blue-500 to-purple-500",
      primaryButton: {
        text: "Khám Phá Văn Phóng",
        href: "#office",
        gradient: "from-green-600 to-blue-600",
        hoverGradient: "from-green-700 to-blue-700"
      },
      secondaryButton: {
        text: "Phúc Lợi Nhân Viên",
        href: "#benefits",
        borderColor: "border-green-500/50",
        hoverBg: "bg-green-500/20",
        hoverBorder: "border-green-400"
      }
    },
    {
      title: "Phát Triển Sự Nghiệp",
      subtitle: "Chương trình đào tạo chuyên sâu, mentorship và cơ hội thăng tiến rõ ràng. Đầu tư vào tương lai của bạn.",
      backgroundImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      heroImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-purple-400 via-pink-500 to-red-500",
      primaryButton: {
        text: "Chương Trình Đào Tạo",
        href: "#training",
        gradient: "from-purple-600 to-pink-600",
        hoverGradient: "from-purple-700 to-pink-700"
      },
      secondaryButton: {
        text: "Lộ Trình Thăng Tiến",
        href: "#career-path",
        borderColor: "border-purple-500/50",
        hoverBg: "bg-purple-500/20",
        hoverBorder: "border-purple-400"
      }
    },
    {
      title: "Ứng Tuyển Ngay Hôm Nay",
      subtitle: "Sẵn sàng bắt đầu hành trình mới? Gửi CV của bạn và tham gia cùng chúng tôi xây dựng tương lai công nghệ.",
      backgroundImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-cyan-400 via-blue-500 to-indigo-600",
      primaryButton: {
        text: "Ứng Tuyển Ngay",
        href: "#apply",
        gradient: "from-cyan-600 to-blue-600",
        hoverGradient: "from-cyan-700 to-blue-700"
      },
      secondaryButton: {
        text: "Liên Hệ HR",
        href: "#contact-hr",
        borderColor: "border-cyan-500/50",
        hoverBg: "bg-cyan-500/20",
        hoverBorder: "border-cyan-400"
      }
    }
  ]

  // Lấy dữ liệu việc làm từ database
  const dbJobs = await getAllJobs()
  const dbCompanies = await getAllCompanies()
  
  // Tạo map để tra cứu tên công ty dựa trên company_id
  const companyMap = new Map<number, string>()
  dbCompanies.forEach((company: Company) => {
    companyMap.set(company.id, company.name)
  })
  
  // Chuyển đổi dữ liệu từ database sang định dạng hiển thị
  const jobOpenings = dbJobs.map((job: Job) => {
    const companyName = companyMap.get(job.company_id) || "Unknown"
    return {
      title: job.title,
      company: companyName,
      location: job.location,
      type: job.type,
      salary: job.salary_range,
      experience: job.experience_required,
      skills: job.skills || ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
      description: job.description,
      urgent: job.urgent,
      remote: job.remote_ok,
    }
  })

  const benefits = [
    {
      icon: DollarSign,
      title: "Lương Cạnh Tranh",
      description: "Mức lương hấp dẫn + thưởng hiệu suất + cổ phần công ty",
      color: "text-green-400",
    },
    {
      icon: Heart,
      title: "Bảo Hiểm Toàn Diện",
      description: "Bảo hiểm sức khỏe cao cấp cho nhân viên và gia đình",
      color: "text-red-400",
    },
    {
      icon: Coffee,
      title: "Môi Trường Linh Hoạt",
      description: "Làm việc hybrid, flexible time, unlimited coffee",
      color: "text-orange-400",
    },
    {
      icon: GraduationCap,
      title: "Phát Triển Nghề Nghiệp",
      description: "Đào tạo chuyên sâu, conference, certification support",
      color: "text-blue-400",
    },
    {
      icon: Gamepad2,
      title: "Work-Life Balance",
      description: "Game room, gym, team building, 20 ngày phép/năm",
      color: "text-purple-400",
    },
    {
      icon: Rocket,
      title: "Công Nghệ Tiên Tiến",
      description: "Làm việc với latest tech stack và cutting-edge projects",
      color: "text-cyan-400",
    },
  ]

  const companyValues = [
    {
      icon: Target,
      title: "Innovation First",
      description: "Luôn đặt sự đổi mới và sáng tạo lên hàng đầu",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Văn hóa làm việc nhóm và hỗ trợ lẫn nhau",
    },
    {
      icon: TrendingUp,
      title: "Continuous Learning",
      description: "Học hỏi và phát triển không ngừng",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Tạo ra tác động tích cực trên quy mô toàn cầu",
    },
  ]

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-green-600"
      case "Part-time":
        return "bg-blue-600"
      case "Contract":
        return "bg-orange-600"
      case "Internship":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  const getCompanyColor = (company: string) => {
    switch (company) {
      case "ApecTech":
        return "border-blue-500/50 bg-blue-500/10"
      case "GuardCam":
        return "border-green-500/50 bg-green-500/10"
      case "EmoCommerce":
        return "border-pink-500/50 bg-pink-500/10"
      case "TimeLoop":
        return "border-orange-500/50 bg-orange-500/10"
      case "ApecNeuroOS":
        return "border-purple-500/50 bg-purple-500/10"
      default:
        return "border-gray-500/50 bg-gray-500/10"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Hero Section */}
      <section className="py-8 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="container mx-auto relative z-10">
          <PageHeroCarousel slides={heroSlides} />
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-black/50 border-purple-500/30 text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <Users className="h-8 w-8 mx-auto text-purple-400 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">200+</div>
                <div className="text-white/60">Nhân viên</div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-purple-500/30 text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <TrendingUp className="h-8 w-8 mx-auto text-green-400 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">95%</div>
                <div className="text-white/60">Tỷ lệ hài lòng</div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-purple-500/30 text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <Award className="h-8 w-8 mx-auto text-yellow-400 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">15+</div>
                <div className="text-white/60">Giải thưởng</div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-purple-500/30 text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <Globe className="h-8 w-8 mx-auto text-blue-400 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">5+</div>
                <div className="text-white/60">Quốc gia</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Search & Filter */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Vị Trí Đang Tuyển Dụng
            </h2>
            <p className="text-white/60 text-lg">Khám phá cơ hội nghề nghiệp tại các công ty thành viên</p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
              <Input
                placeholder="Tìm kiếm vị trí, công ty, kỹ năng..."
                className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
              />
            </div>
            <Button variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/20">
              <Filter className="h-4 w-4 mr-2" />
              Bộ Lọc
            </Button>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <Card
                key={index}
                className={`bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-[1.02] ${getCompanyColor(job.company)}`}
              >
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-4 gap-6">
                    {/* Job Info */}
                    <div className="lg:col-span-3 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white hover:text-purple-300 transition-colors">
                              {job.title}
                            </h3>
                            {job.urgent && <Badge className="bg-red-600 animate-pulse">Urgent</Badge>}
                            {job.remote && (
                              <Badge variant="outline" className="border-green-500/30 text-green-300">
                                Remote OK
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-white/60 text-sm mb-3">
                            <span className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.company}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.experience}
                            </span>
                          </div>
                        </div>
                        <Badge className={getJobTypeColor(job.type)}>{job.type}</Badge>
                      </div>

                      <p className="text-white/80 leading-relaxed">{job.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="border-blue-500/30 text-blue-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Salary & Apply */}
                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-4 text-center">
                        <div className="text-lg font-bold text-white mb-1">{job.salary}</div>
                        <p className="text-white/60 text-sm">Mức lương</p>
                      </div>

                      <div className="space-y-2">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 transform transition-all duration-300">
                          Ứng Tuyển Ngay
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-purple-500/30 text-white hover:bg-purple-500/20"
                        >
                          Lưu Vị Trí
                        </Button>
                      </div>

                      <div className="flex items-center justify-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-white/60 text-xs ml-1">4.8/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Quyền Lợi & Phúc Lợi
            </h2>
            <p className="text-white/60 text-lg">Những gì chúng tôi mang lại cho đội ngũ</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <Card
                  key={index}
                  className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 group"
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto bg-black/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className={`h-8 w-8 ${benefit.color}`} />
                    </div>
                    <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 text-center text-sm leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-white/60 text-lg">Những nguyên tắc định hướng văn hóa công ty</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl flex items-center justify-center">
                  <Send className="h-6 w-6 mr-3 text-purple-400" />
                  Ứng Tuyển Nhanh
                </CardTitle>
                <p className="text-white/80">Gửi thông tin của bạn và chúng tôi sẽ liên hệ sớm nhất</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Họ và tên *</label>
                    <Input
                      placeholder="Nhập họ và tên"
                      className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Email *</label>
                    <Input
                      type="email"
                      placeholder="Nhập địa chỉ email"
                      className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Số điện thoại</label>
                    <Input
                      placeholder="Nhập số điện thoại"
                      className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Vị trí ứng tuyển</label>
                    <select className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-md text-white">
                      <option value="">Chọn vị trí</option>
                      {jobOpenings.map((job, idx) => (
                        <option key={idx} value={job.title}>
                          {job.title} - {job.company}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Giới thiệu bản thân</label>
                  <Textarea
                    placeholder="Chia sẻ về kinh nghiệm và động lực của bạn..."
                    rows={4}
                    className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">CV/Resume</label>
                  <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 text-center hover:border-purple-500/60 transition-colors">
                    <div className="text-white/60">
                      <p>Kéo thả file CV hoặc click để chọn</p>
                      <p className="text-sm mt-1">Hỗ trợ: PDF, DOC, DOCX (Max: 5MB)</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-3 hover:scale-105 transform transition-all duration-300">
                  Gửi Hồ Sơ Ứng Tuyển
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
