"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHeroCarousel from "@/components/page-hero-carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Users, Briefcase, Globe } from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa Chỉ",
      details: ["Tầng 15, Tòa nhà Keangnam", "Phạm Hùng, Nam Từ Liêm", "Hà Nội, Việt Nam"],
      color: "text-purple-400",
    },
    {
      icon: Phone,
      title: "Điện Thoại",
      details: ["+84 24 3123 4567", "+84 24 3123 4568", "Hotline: 1900 1234"],
      color: "text-blue-400",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@apecglobal.com", "business@apecglobal.com", "careers@apecglobal.com"],
      color: "text-green-400",
    },
    {
      icon: Clock,
      title: "Giờ Làm Việc",
      details: ["Thứ 2 - Thứ 6: 8:00 - 18:00", "Thứ 7: 8:00 - 12:00", "Chủ nhật: Nghỉ"],
      color: "text-orange-400",
    },
  ]

  const departments = [
    {
      icon: Briefcase,
      title: "Hợp Tác Kinh Doanh",
      description: "Thảo luận về cơ hội hợp tác và đối tác chiến lược",
      email: "business@apecglobal.com",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: Users,
      title: "Nhân Sự & Tuyển Dụng",
      description: "Tìm hiểu về cơ hội nghề nghiệp tại ApecGlobal",
      email: "careers@apecglobal.com",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MessageSquare,
      title: "Hỗ Trợ Khách Hàng",
      description: "Hỗ trợ kỹ thuật và giải đáp thắc mắc",
      email: "support@apecglobal.com",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Globe,
      title: "Truyền Thông & PR",
      description: "Liên hệ báo chí và truyền thông",
      email: "media@apecglobal.com",
      color: "from-pink-500 to-purple-500",
    },
  ]

  // Hero slides for Contact page
  const heroSlides = [
    {
      title: "LIÊN HỆ VỚI CHÚNG TÔI",
      subtitle: "Hãy kết nối với ApecGlobal Group để khám phá cơ hội hợp tác, tìm hiểu về sản phẩm dịch vụ hoặc gia nhập đội ngũ của chúng tôi",
      gradient: "from-purple-400 via-white to-blue-400",
      backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Gửi Tin Nhắn",
        href: "#contact-form",
        gradient: "from-purple-600 to-blue-600",
        hoverGradient: "from-purple-700 to-blue-700"
      },
      secondaryButton: {
        text: "Thông Tin Liên Hệ",
        href: "#contact-info",
        borderColor: "border-purple-500/50",
        hoverBg: "bg-purple-500/20",
        hoverBorder: "border-purple-400"
      }
    },
    {
      title: "HỢP TÁC KINH DOANH",
      subtitle: "Khám phá cơ hội hợp tác chiến lược và phát triển kinh doanh cùng ApecGlobal Group trong lĩnh vực công nghệ AI",
      gradient: "from-blue-400 via-white to-cyan-400",
      backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Thảo Luận Hợp Tác",
        href: "#contact-form",
        gradient: "from-blue-600 to-cyan-600",
        hoverGradient: "from-blue-700 to-cyan-700"
      },
      secondaryButton: {
        text: "Về Chúng Tôi",
        href: "/about",
        borderColor: "border-blue-500/50",
        hoverBg: "bg-blue-500/20",
        hoverBorder: "border-blue-400"
      }
    },
    {
      title: "TUYỂN DỤNG & NGHỀ NGHIỆP",
      subtitle: "Tham gia đội ngũ ApecGlobal Group và cùng chúng tôi xây dựng tương lai công nghệ AI tại Việt Nam",
      gradient: "from-green-400 via-white to-emerald-400",
      backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Ứng Tuyển Ngay",
        href: "#contact-form",
        gradient: "from-green-600 to-emerald-600",
        hoverGradient: "from-green-700 to-emerald-700"
      },
      secondaryButton: {
        text: "Văn Hóa Công Ty",
        href: "/about",
        borderColor: "border-green-500/50",
        hoverBg: "bg-green-500/20",
        hoverBorder: "border-green-400"
      }
    },
    {
      title: "HỖ TRỢ KHÁCH HÀNG",
      subtitle: "Đội ngũ hỗ trợ chuyên nghiệp của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc về sản phẩm và dịch vụ",
      gradient: "from-orange-400 via-white to-amber-400",
      backgroundImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Yêu Cầu Hỗ Trợ",
        href: "#contact-form",
        gradient: "from-orange-600 to-amber-600",
        hoverGradient: "from-orange-700 to-amber-700"
      },
      secondaryButton: {
        text: "Dịch Vụ",
        href: "/services",
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

      {/* Contact Information */}
      <section id="contact-info" className="section-gray">
        <div className="container-standard">
          <div className="grid-4-col mb-16">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon
              return (
                <Card key={index} className="card-standard">
                  <CardHeader className="text-center">
                    <IconComponent className="icon-xl mx-auto mb-4" />
                    <CardTitle className="heading-h4">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-body-sm">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section id="contact-form" className="section-standard">
        <div className="container-standard">
          <div className="grid-2-col">
            {/* Contact Form */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="heading-h3 flex items-center">
                  <Send className="icon-standard mr-3" />
                  Gửi Tin Nhắn
                </CardTitle>
                <p className="text-body">Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại trong vòng 24 giờ.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body text-body-sm mb-2">Họ và tên *</label>
                    <Input
                      placeholder="Nhập họ và tên"
                      className="bg-white border-gray-300 text-primary placeholder:text-muted"
                    />
                  </div>
                  <div>
                    <label className="block text-body text-body-sm mb-2">Email *</label>
                    <Input
                      type="email"
                      placeholder="Nhập địa chỉ email"
                      className="bg-white border-gray-300 text-black placeholder:text-black/50"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black/80 text-sm mb-2">Số điện thoại</label>
                    <Input
                      placeholder="Nhập số điện thoại"
                      className="bg-white border-gray-300 text-black placeholder:text-black/50"
                    />
                  </div>
                  <div>
                    <label className="block text-black/80 text-sm mb-2">Công ty</label>
                    <Input
                      placeholder="Tên công ty"
                      className="bg-white border-gray-300 text-black placeholder:text-black/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-black/80 text-sm mb-2">Chủ đề *</label>
                  <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black">
                    <option value="">Chọn chủ đề</option>
                    <option value="business">Hợp tác kinh doanh</option>
                    <option value="careers">Cơ hội nghề nghiệp</option>
                    <option value="support">Hỗ trợ kỹ thuật</option>
                    <option value="media">Truyền thông</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-black/80 text-sm mb-2">Tin nhắn *</label>
                  <Textarea
                    placeholder="Nhập nội dung tin nhắn..."
                    rows={5}
                    className="bg-white border-gray-300 text-black placeholder:text-black/50"
                  />
                </div>
                <Button className="w-full bg-red-700 hover:bg-red-800 text-white text-lg py-3">
                  Gửi Tin Nhắn
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Map & Office Info */}
            <div className="space-y-8">
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-red-700">Văn Phòng Chính</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="h-16 w-16 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-red-700 mt-1" />
                      <div>
                        <p className="text-black font-medium">ApecGlobal Group Headquarters</p>
                        <p className="text-black/80 text-sm">
                          Tầng 15, Tòa nhà Keangnam
                          <br />
                          Phạm Hùng, Nam Từ Liêm
                          <br />
                          Hà Nội, Việt Nam
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-red-700" />
                      <span className="text-black">+84 24 3123 4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-red-700" />
                      <span className="text-black">info@apecglobal.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-red-700">Giờ Làm Việc</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-black/80">Thứ 2 - Thứ 6</span>
                    <span className="text-black">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/80">Thứ 7</span>
                    <span className="text-black">8:00 - 12:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/80">Chủ nhật</span>
                    <span className="text-black/60">Nghỉ</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-700">
            Liên Hệ Theo Phòng Ban
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => {
              const IconComponent = dept.icon
              return (
                <Card
                  key={index}
                  className="bg-white border-gray-200 hover:border-red-300 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-red-700 flex items-center justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-red-700">{dept.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-black/80 text-sm">{dept.description}</p>
                    <div className="space-y-2">
                      <p className="text-black/60 text-xs">Email trực tiếp:</p>
                      <p className="text-red-700 text-sm font-medium">{dept.email}</p>
                    </div>
                    <Button variant="outline" className="w-full border-gray-300 text-black hover:bg-red-50 hover:border-red-300">
                      Liên Hệ Ngay
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-700">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-700">Làm thế nào để trở thành đối tác của ApecGlobal?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black/80">
                  Bạn có thể liên hệ với chúng tôi qua email business@apecglobal.com hoặc điền form liên hệ với chủ đề
                  "Hợp tác kinh doanh". Đội ngũ của chúng tôi sẽ liên hệ lại trong vòng 24 giờ.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-700">ApecGlobal có tuyển dụng thường xuyên không?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black/80">
                  Có, chúng tôi luôn tìm kiếm những nhân tài xuất sắc. Bạn có thể xem các vị trí tuyển dụng hiện tại tại
                  trang Careers hoặc gửi CV về careers@apecglobal.com.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-700">Tôi có thể đến thăm văn phòng ApecGlobal không?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black/80">
                  Chúng tôi hoan nghênh việc đến thăm văn phòng, tuy nhiên vui lòng đặt lịch hẹn trước qua điện thoại
                  hoặc email để đảm bảo có người tiếp đón bạn.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
