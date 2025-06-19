import Header from "@/components/header"
import Footer from "@/components/footer"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Hãy kết nối với ApecGlobal Group để khám phá cơ hội hợp tác, tìm hiểu về sản phẩm dịch vụ hoặc gia nhập đội
            ngũ của chúng tôi.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon
              return (
                <Card
                  key={index}
                  className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
                >
                  <CardHeader className="text-center">
                    <IconComponent className={`h-12 w-12 mx-auto ${info.color} mb-4`} />
                    <CardTitle className="text-white">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-white/80 text-sm">
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
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center">
                  <Send className="h-6 w-6 mr-3 text-purple-400" />
                  Gửi Tin Nhắn
                </CardTitle>
                <p className="text-white/80">Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại trong vòng 24 giờ.</p>
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
                    <label className="block text-white/80 text-sm mb-2">Công ty</label>
                    <Input
                      placeholder="Tên công ty"
                      className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Chủ đề *</label>
                  <select className="w-full px-3 py-2 bg-black/30 border border-purple-500/30 rounded-md text-white">
                    <option value="">Chọn chủ đề</option>
                    <option value="business">Hợp tác kinh doanh</option>
                    <option value="careers">Cơ hội nghề nghiệp</option>
                    <option value="support">Hỗ trợ kỹ thuật</option>
                    <option value="media">Truyền thông</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Tin nhắn *</label>
                  <Textarea
                    placeholder="Nhập nội dung tin nhắn..."
                    rows={5}
                    className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-3">
                  Gửi Tin Nhắn
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Map & Office Info */}
            <div className="space-y-8">
              <Card className="bg-black/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Văn Phòng Chính</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="h-16 w-16 text-white/40" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-white font-medium">ApecGlobal Group Headquarters</p>
                        <p className="text-white/80 text-sm">
                          Tầng 15, Tòa nhà Keangnam
                          <br />
                          Phạm Hùng, Nam Từ Liêm
                          <br />
                          Hà Nội, Việt Nam
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-blue-400" />
                      <span className="text-white">+84 24 3123 4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-green-400" />
                      <span className="text-white">info@apecglobal.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Giờ Làm Việc</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">Thứ 2 - Thứ 6</span>
                    <span className="text-white">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Thứ 7</span>
                    <span className="text-white">8:00 - 12:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Chủ nhật</span>
                    <span className="text-white/60">Nghỉ</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Liên Hệ Theo Phòng Ban
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => {
              const IconComponent = dept.icon
              return (
                <Card
                  key={index}
                  className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105"
                >
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${dept.color} flex items-center justify-center mb-4`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-white">{dept.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-white/80 text-sm">{dept.description}</p>
                    <div className="space-y-2">
                      <p className="text-white/60 text-xs">Email trực tiếp:</p>
                      <p className="text-purple-300 text-sm font-medium">{dept.email}</p>
                    </div>
                    <Button variant="outline" className="w-full border-purple-500/30 text-white hover:bg-purple-500/20">
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
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Làm thế nào để trở thành đối tác của ApecGlobal?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Bạn có thể liên hệ với chúng tôi qua email business@apecglobal.com hoặc điền form liên hệ với chủ đề
                  "Hợp tác kinh doanh". Đội ngũ của chúng tôi sẽ liên hệ lại trong vòng 24 giờ.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">ApecGlobal có tuyển dụng thường xuyên không?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Có, chúng tôi luôn tìm kiếm những nhân tài xuất sắc. Bạn có thể xem các vị trí tuyển dụng hiện tại tại
                  trang Careers hoặc gửi CV về careers@apecglobal.com.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Tôi có thể đến thăm văn phòng ApecGlobal không?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
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
