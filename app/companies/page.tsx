"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Brain, Shield, Heart, Clock, Cpu, ExternalLink, Users, Calendar, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { Company } from "@/lib/schema"

// Hàm để lấy icon dựa trên tên công ty
const getCompanyIcon = (name: string) => {
  switch (name) {
    case "ApecTech":
      return Brain
    case "GuardCam":
      return Shield
    case "EmoCommerce":
      return Heart
    case "TimeLoop":
      return Clock
    case "ApecNeuroOS":
      return Cpu
    default:
      return Brain
  }
}

// Hàm để lấy màu gradient dựa trên tên công ty
const getCompanyColor = (name: string) => {
  switch (name) {
    case "ApecTech":
      return "from-blue-500 to-cyan-500"
    case "GuardCam":
      return "from-green-500 to-emerald-500"
    case "EmoCommerce":
      return "from-pink-500 to-rose-500"
    case "TimeLoop":
      return "from-orange-500 to-amber-500"
    case "ApecNeuroOS":
      return "from-purple-500 to-violet-500"
    default:
      return "from-blue-500 to-cyan-500"
  }
}

// Hàm để lấy chuyên môn dựa trên tên công ty
const getCompanySpecialties = (name: string) => {
  switch (name) {
    case "ApecTech":
      return ["Machine Learning", "Natural Language Processing", "Computer Vision", "Educational Technology"]
    case "GuardCam":
      return ["Computer Vision", "IoT Security", "Real-time Monitoring", "Facial Recognition"]
    case "EmoCommerce":
      return ["Emotion AI", "E-commerce", "Customer Analytics", "Personalization"]
    case "TimeLoop":
      return ["Behavioral Analytics", "Time Optimization", "Data Visualization", "Productivity Tools"]
    case "ApecNeuroOS":
      return ["Operating Systems", "Enterprise Software", "AI Integration", "Automation"]
    default:
      return ["Technology", "Innovation", "Digital Transformation", "Software Development"]
  }
}

// Hàm để lấy mô tả ngắn dựa trên tên công ty
const getCompanyShortDescription = (name: string) => {
  switch (name) {
    case "ApecTech":
      return "AI và học tập số"
    case "GuardCam":
      return "Bảo mật công nghệ"
    case "EmoCommerce":
      return "Thương mại điện tử cảm xúc"
    case "TimeLoop":
      return "Phân tích hành vi và thời gian"
    case "ApecNeuroOS":
      return "Hệ điều hành doanh nghiệp tương lai"
    default:
      return "Công nghệ tiên tiến"
  }
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy dữ liệu công ty từ API
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        const dbCompanies = await response.json();
        
        // Chuyển đổi dữ liệu từ API sang định dạng hiển thị
        const formattedCompanies = dbCompanies.map((company: Company) => {
          return {
            name: company.name,
            icon: getCompanyIcon(company.name),
            description: getCompanyShortDescription(company.name),
            fullDescription: company.description,
            color: getCompanyColor(company.name),
            href: `/companies/${company.slug}`,
            founded: new Date(company.established_date).getFullYear().toString(),
            employees: `${company.employee_count}+`,
            projects: "10+", // Giá trị mặc định vì chưa có dữ liệu thực tế
            specialties: getCompanySpecialties(company.name),
          };
        });
        
        setCompanies(formattedCompanies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Công Ty Thành Viên
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Khám phá hệ sinh thái công nghệ đa dạng của ApecGlobal với 5 công ty thành viên, mỗi công ty chuyên sâu về
            một lĩnh vực công nghệ cụ thể.
          </p>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="space-y-12">
              {companies.map((company, index) => {
              const IconComponent = company.icon
              return (
                <Card
                  key={company.name}
                  className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
                >
                  <div className="grid md:grid-cols-3 gap-8 p-8">
                    {/* Company Info */}
                    <div className="md:col-span-2 space-y-6">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-r ${company.color} flex items-center justify-center`}
                        >
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{company.name}</h3>
                          <p className="text-purple-300">{company.description}</p>
                        </div>
                      </div>

                      <p className="text-white/80 text-lg leading-relaxed">{company.fullDescription}</p>

                      <div className="flex flex-wrap gap-2">
                        {company.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="border-purple-500/30 text-purple-300">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <Link href={company.href} className="inline-block mt-4">
                        <Button className={`bg-gradient-to-r ${company.color} hover:opacity-90 transition-opacity`}>
                          Tìm Hiểu Chi Tiết
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    {/* Company Stats */}
                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-4 w-4 text-purple-400" />
                          <span className="text-white/60 text-sm">Thành lập</span>
                        </div>
                        <span className="text-white font-semibold">{company.founded}</span>
                      </div>

                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span className="text-white/60 text-sm">Nhân viên</span>
                        </div>
                        <span className="text-white font-semibold">{company.employees}</span>
                      </div>

                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          <span className="text-white/60 text-sm">Dự án</span>
                        </div>
                        <span className="text-white font-semibold">{company.projects}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="bg-black/50 border-purple-500/30 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Quan Tâm Đến Việc Hợp Tác?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80">
                Chúng tôi luôn tìm kiếm những đối tác và nhân tài để cùng phát triển hệ sinh thái công nghệ ApecGlobal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Liên Hệ Hợp Tác
                  </Button>
                </Link>
                <Link href="/careers">
                  <Button variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/20">
                    Cơ Hội Nghề Nghiệp
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
