import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Target,
  TrendingUp,
  CreditCard,
  Shield,
  DollarSign,
} from "lucide-react";

interface EmployeeDetailModalProps {
  employee: any;
  open: boolean;
  onClose: () => void;
}

export default function EmployeeDetailModal({
  employee,
  open,
  onClose,
}: EmployeeDetailModalProps) {
  if (!employee) return null;

  const skillsData =
    employee.skills?.map((skill: any) => ({
      skill: skill.name,
      value: parseInt(skill.value) || 0,
    })) || [];

  // Tính số lượng dự án từ project_list thay vì rada_chart
  const projectList = employee.projects?.project_list || [];
  const projectStatusData = [
    {
      status: "Đang thực hiện",
      value: projectList.filter((p: any) => p.project_status_id === 2).length,
    },
    {
      status: "Tạm dừng",
      value: projectList.filter((p: any) => p.project_status_id === 3).length,
    },
    {
      status: "Hoàn thành",
      value: projectList.filter((p: any) => p.project_status_id === 4).length,
    },
  ];

  const performanceData = employee.projects?.performance_chart || [];

  // Lấy thông tin hợp đồng mới nhất
  const latestContract = employee.contracts?.[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 border-purple-500/30 text-white max-w-6xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-white flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
              <User className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
              <span className="truncate">{employee.name}</span>
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs w-fit">
                Level {employee.level} | EXP: {employee.exp}/{employee.next_exp}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[calc(90vh-120px)]">
          <Tabs
            defaultValue="overview"
            className="flex flex-col lg:flex-row gap-4 w-full"
            orientation="vertical"
          >
            <TabsList className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible h-fit bg-black/50 p-2 gap-2 w-full lg:w-48 shrink-0">
              <TabsTrigger
                value="overview"
                className="whitespace-nowrap lg:w-full lg:justify-start"
              >
                Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="whitespace-nowrap lg:w-full lg:justify-start"
              >
                Kỹ năng
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="whitespace-nowrap lg:w-full lg:justify-start"
              >
                Dự án
              </TabsTrigger>
              <TabsTrigger
                value="career"
                className="whitespace-nowrap lg:w-full lg:justify-start"
              >
                Yêu cầu
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="whitespace-nowrap lg:w-full lg:justify-start"
              >
                Thành tích
              </TabsTrigger>
              <TabsTrigger
                value="cards"
                className="whitespace-nowrap lg:w-full lg:justify-start"
              >
                Thẻ tín dụng
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto lg:pr-2">
              <TabsContent value="overview" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="bg-black/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">
                        Thông tin cá nhân
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-white/80">
                        <Mail className="h-4 w-4 text-purple-400" />
                        <span>{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Phone className="h-4 w-4 text-purple-400" />
                        <span>{employee.phone || "Chưa cập nhật"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <span>
                          Sinh nhật:{" "}
                          {employee.birthday
                            ? new Date(employee.birthday).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        <span>{employee.address || "Chưa cập nhật"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        <span>
                          Nơi sinh: {employee.birth_place || "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Phone className="h-4 w-4 text-red-400" />
                        <span>
                          SĐT khẩn cấp:{" "}
                          {employee.emergency_contract || "Chưa cập nhật"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">
                        Giấy tờ tùy thân
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-white/80">
                        <span className="text-white/60">CCCD/CMND: </span>
                        <span>{employee.citizen_card || "Chưa cập nhật"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <span>
                          Ngày cấp:{" "}
                          {employee.issue_date
                            ? new Date(employee.issue_date).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        <span>
                          Nơi cấp: {employee.issue_place || "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <div className="text-white/80">
                          <span className="text-white/60">Giới tính: </span>
                          <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                            {employee.gen == 1
                              ? "Nam"
                              : employee.gen == 2
                              ? "Nữ"
                              : "Khác"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">
                        Thông tin công việc
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-white/80">
                        <Briefcase className="h-4 w-4 text-blue-400" />
                        <span>{employee.position || "Chưa xác định"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span>
                          Ngày vào:{" "}
                          {employee.join_date
                            ? new Date(employee.join_date).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <TrendingUp className="h-4 w-4 text-blue-400" />
                        <span>
                          Cấp bậc:{" "}
                          {employee.careers?.[0]?.career_level ||
                            "Chưa xác định"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60">Trạng thái:</span>
                        <Badge
                          className={
                            employee.status === "active"
                              ? "bg-green-600/20 text-green-400 border-green-500/30"
                              : "bg-red-600/20 text-red-400 border-red-500/30"
                          }
                        >
                          {employee.status === "active"
                            ? "Hoạt động"
                            : "Không hoạt động"}
                        </Badge>
                      </div>
                      {employee.salary && (
                        <div className="flex items-center gap-2 text-white/80">
                          <DollarSign className="h-4 w-4 text-green-400" />
                          <span>
                            Lương:{" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(employee.salary)}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {latestContract && (
                    <Card className="bg-black/50 border-purple-500/30">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-400" />
                          Hợp đồng lao động
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-white/80">
                          <span className="text-white/60">Loại hợp đồng: </span>
                          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                            {latestContract.contract_type === 1
                              ? "Thử việc"
                              : latestContract.contract_type === 2
                              ? "Chính thức"
                              : "Hợp đồng dự án"}
                          </Badge>
                        </div>
                        <div className="text-white/80">
                          <span className="text-white/60">Lương cơ bản: </span>
                          <span className="font-semibold text-green-400">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(latestContract.base_salary)}
                          </span>
                        </div>
                        <div className="text-white/80">
                          <span className="text-white/60">Phụ cấp: </span>
                          <span>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(latestContract.allowance)}
                          </span>
                        </div>
                        {latestContract.start_date && (
                          <div className="text-white/80">
                            <span className="text-white/60">
                              Ngày bắt đầu:{" "}
                            </span>
                            <span>
                              {new Date(
                                latestContract.start_date
                              ).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        )}
                        {latestContract.end_date && (
                          <div className="text-white/80">
                            <span className="text-white/60">
                              Ngày kết thúc:{" "}
                            </span>
                            <span>
                              {new Date(
                                latestContract.end_date
                              ).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        )}
                        {latestContract.note && (
                          <div className="text-white/80 text-sm">
                            <span className="text-white/60">Ghi chú: </span>
                            <p className="mt-1">{latestContract.note}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-black/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-purple-400" />
                        Học vấn
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {employee.educations?.[0] ? (
                        <div className="text-white/80">
                          <p className="font-semibold">
                            {employee.educations[0].school_name}
                          </p>
                          <p className="text-sm text-white/60">
                            {employee.educations[0].major || ""}
                          </p>
                          <p className="text-sm text-white/60">
                            {employee.educations[0].degree_level === "tien_si"
                              ? "Tiến sĩ"
                              : employee.educations[0].degree_level ===
                                "thac_si"
                              ? "Thạc sĩ"
                              : employee.educations[0].degree_level ===
                                "dai_hoc"
                              ? "Đại học"
                              : employee.educations[0].degree_level ||
                                "Chưa cập nhật"}
                          </p>
                          <p className="text-sm text-white/60">
                            Năm tốt nghiệp:{" "}
                            {employee.educations[0].graduation_year ||
                              "Chưa cập nhật"}
                          </p>
                          {employee.educations[0].grade && (
                            <p className="text-sm text-white/60">
                              Xếp loại: {employee.educations[0].grade}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-white/60">Chưa cập nhật</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-400" />
                        Chứng chỉ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {employee.certificates &&
                      employee.certificates.length > 0 ? (
                        <div className="space-y-2">
                          {employee.certificates.map((cert: any) => (
                            <div
                              key={cert.id}
                              className="bg-black/30 p-3 rounded-lg border border-yellow-500/20"
                            >
                              <p className="text-white/80 font-semibold">
                                {cert.certificate_name}
                              </p>
                              <p className="text-white/50 text-xs">
                                Cấp ngày:{" "}
                                {new Date(cert.created_at).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/60">Chưa có chứng chỉ</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {employee.bio && (
                  <Card className="bg-black/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">
                        Giới thiệu
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80">{employee.bio}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="skills" className="space-y-4 mt-0">
                <Card className="bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Biểu đồ kỹ năng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {skillsData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={skillsData}>
                          <PolarGrid stroke="#a855f7" strokeOpacity={0.3} />
                          <PolarAngleAxis
                            dataKey="skill"
                            tick={{ fill: "#fff", fontSize: 12 }}
                            tickLine={{ stroke: "#a855f7" }}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: "#fff" }}
                            tickLine={{ stroke: "#a855f7" }}
                          />
                          <Radar
                            name="Kỹ năng"
                            dataKey="value"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.6}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#000",
                              border: "1px solid #a855f7",
                            }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Legend wrapperStyle={{ color: "#fff" }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-white/60 text-center py-8">
                        Chưa có dữ liệu kỹ năng
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Chi tiết kỹ năng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {skillsData.length > 0 ? (
                        skillsData.map((skill: any, index: number) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-white/80">
                              <span>{skill.skill}</span>
                              <span>{skill.value}%</span>
                            </div>
                            <div className="w-full bg-black/50 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${skill.value}%` }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-white/60 text-center py-4 col-span-2">
                          Chưa có dữ liệu kỹ năng
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {employee.skill_groups && employee.skill_groups.length > 0 && (
                  <Card className="bg-black/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Nhóm kỹ năng</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {employee.skill_groups.map((group: any) => (
                          <Badge
                            key={group.id}
                            className="bg-purple-600/20 text-purple-400 border-purple-500/30"
                          >
                            {group.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="projects" className="space-y-4 mt-0">
                <div className="flex w-full gap-4">
                  <Card className="bg-black/50 border-purple-500/30 w-1/2">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Hiệu suất 6 tháng gần nhất
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {performanceData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                          <LineChart data={performanceData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#a855f7"
                              strokeOpacity={0.2}
                            />
                            <XAxis
                              dataKey="month"
                              stroke="#fff"
                              tick={{ fill: "#fff", fontSize: 12 }}
                            />
                            <YAxis
                              stroke="#fff"
                              tick={{ fill: "#fff", fontSize: 12 }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#000",
                                border: "1px solid #a855f7",
                              }}
                              labelStyle={{ color: "#fff" }}
                            />
                            <Legend wrapperStyle={{ color: "#fff" }} />
                            <Line
                              type="monotone"
                              dataKey="scores"
                              stroke="#8b5cf6"
                              strokeWidth={2}
                              dot={{ fill: "#8b5cf6", r: 4 }}
                              activeDot={{ r: 6 }}
                              name="Điểm hiệu suất"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-white/60 text-center py-8">
                          Chưa có dữ liệu hiệu suất
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 border-purple-500/30 w-1/2">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Biểu đồ trạng thái dự án
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {projectStatusData.length > 0 &&
                      projectStatusData.some((d) => d.value > 0) ? (
                        <ResponsiveContainer width="100%" height={350}>
                          <RadarChart data={projectStatusData}>
                            <PolarGrid stroke="#3b82f6" strokeOpacity={0.3} />
                            <PolarAngleAxis
                              dataKey="status"
                              tick={{ fill: "#fff", fontSize: 12 }}
                              tickLine={{ stroke: "#3b82f6" }}
                            />
                            <PolarRadiusAxis
                              angle={90}
                              domain={[
                                0,
                                Math.max(
                                  ...projectStatusData.map((d) => d.value)
                                ) + 2,
                              ]}
                              tick={{ fill: "#fff" }}
                              tickLine={{ stroke: "#3b82f6" }}
                            />
                            <Radar
                              name="Số dự án"
                              dataKey="value"
                              stroke="#3b82f6"
                              fill="#3b82f6"
                              fillOpacity={0.6}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#000",
                                border: "1px solid #3b82f6",
                              }}
                              labelStyle={{ color: "#fff" }}
                            />
                            <Legend wrapperStyle={{ color: "#fff" }} />
                          </RadarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-white/60 text-center py-8">
                          Chưa có dữ liệu dự án
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Danh sách dự án
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {employee.projects?.project_list?.length > 0 ? (
                        employee.projects.project_list.map((project: any) => (
                          <div
                            key={project.id}
                            className="bg-black/30 p-4 rounded-lg border border-purple-500/20"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-white font-semibold">
                                {project.project.name}
                              </h4>
                              <Badge
                                className={
                                  project.project_status.id === 2
                                    ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                                    : project.project_status.id === 3
                                    ? "bg-yellow-600/20 text-yellow-400 border-yellow-500/30"
                                    : "bg-green-600/20 text-green-400 border-green-500/30"
                                }
                              >
                                {project.project_status.name}
                              </Badge>
                            </div>
                            <p className="text-white/60 text-sm mb-2">
                              {project.project.description}
                            </p>
                            <div className="flex gap-4 text-xs text-white/50">
                              <span>
                                Team: {project.project.team_size} người
                              </span>
                              <span>Tiến độ: {project.project.progress}%</span>
                              {project.role && (
                                <span>Vai trò: {project.role}</span>
                              )}
                            </div>
                            {project.project.budget > 0 && (
                              <div className="text-xs text-white/50 mt-1">
                                Ngân sách:{" "}
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(project.project.budget)}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-white/60 text-center py-4">
                          Chưa tham gia dự án nào
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4 mt-0">
                <Card className="bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-400" />
                      Thành tích & Giải thưởng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {employee.achievements?.length > 0 ? (
                        employee.achievements.map((achievement: any) => (
                          <div
                            key={achievement.id}
                            className="bg-black/30 p-4 rounded-lg border border-yellow-500/20"
                          >
                            <div className="flex items-center gap-3">
                              <Award className="h-8 w-8 text-yellow-400" />
                              <div>
                                <h4 className="text-white font-semibold">
                                  {achievement.title}
                                </h4>
                                <p className="text-white/60 text-sm">
                                  {achievement.achievement_category?.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-white/60 text-center py-4 col-span-2">
                          Chưa có thành tích nào
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {employee.careers && employee.careers.length > 0 && (
                  <Card className="bg-black/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        Tiến độ Career Path
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {employee.careers.map((career: any) => (
                        <div key={career.career_level_id} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-white font-semibold">
                                {career.career_level}
                              </h4>
                              <p className="text-white/60 text-sm">
                                Level Order: {career.level_order}
                              </p>
                            </div>
                            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                              {career.progress.percent}%
                            </Badge>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm text-white/60 mb-1">
                              <span>
                                Hoàn thành: {career.progress.completed}/
                                {career.progress.total}
                              </span>
                            </div>
                            <div className="w-full bg-black/50 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                                style={{ width: `${career.progress.percent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="career" className="space-y-4 mt-0">
                <Card className="bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-400" />
                      Yêu cầu cá nhân
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {employee.personal_requests?.length > 0 ? (
                        employee.personal_requests.map((request: any) => (
                          <div
                            key={request.id}
                            className="bg-black/30 p-4 rounded-lg border border-purple-500/20"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-white font-semibold">
                                {request.title}
                              </h4>
                              <Badge
                                className={
                                  request.status_requests.id === 1
                                    ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                                    : request.status_requests.id === 2
                                    ? "bg-green-600/20 text-green-400 border-green-500/30"
                                    : request.status_requests.id === 3
                                    ? "bg-red-600/20 text-red-400 border-red-500/30"
                                    : "bg-yellow-600/20 text-yellow-400 border-yellow-500/30"
                                }
                              >
                                {request.status_requests.name}
                              </Badge>
                            </div>
                            <p className="text-white/60 text-sm mb-2">
                              {request.description}
                            </p>
                            <div className="flex gap-2 text-xs flex-wrap">
                              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                                {request.type_requests.name}
                              </Badge>
                              <span className="text-white/50">
                                {new Date(
                                  request.date_request
                                ).toLocaleDateString("vi-VN")}
                              </span>
                              {request.process !== null && (
                                <span className="text-white/50">
                                  Tiến độ: {request.process}%
                                </span>
                              )}
                              {request.rate !== null && (
                                <span className="text-white/50">
                                  Mức đề xuất: {request.rate}%
                                </span>
                              )}
                            </div>
                            {request.results && (
                              <div className="mt-2 p-2 bg-green-600/10 rounded border border-green-500/20">
                                <p className="text-green-400 text-sm">
                                  Kết quả: {request.results}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-white/60 text-center py-4">
                          Chưa có yêu cầu nào
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cards" className="space-y-4 mt-0">
                {employee.cards && employee.cards.length > 0 ? (
                  employee.cards.map((card: any) => (
                    <Card
                      key={card.id}
                      className="bg-black/50 border-purple-500/30"
                    >
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                          <div className="flex-1">
                            <CardTitle className="text-white flex items-center gap-2 flex-wrap">
                              <CreditCard className="h-5 w-5 text-purple-400" />
                              <span className="text-base sm:text-lg">
                                {card.name}
                              </span>
                            </CardTitle>
                            <Badge
                              className={
                                card.isActive
                                  ? "bg-green-600/20 text-green-400 border-green-500/30 mt-2"
                                  : "bg-gray-600/20 text-gray-400 border-gray-500/30 mt-2"
                              }
                            >
                              {card.isActive
                                ? "Đang hoạt động"
                                : "Chưa kích hoạt"}
                            </Badge>
                          </div>
                          <img
                            src={card.src}
                            alt={card.name}
                            className="w-24 sm:w-32 h-auto rounded-lg"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-white/80">
                              <span className="text-white/60 text-sm">
                                Hạn mức tối đa:
                              </span>
                              <p className="text-lg font-semibold text-purple-400">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(card.max_credit)}
                              </p>
                            </div>
                            <div className="text-white/80">
                              <span className="text-white/60 text-sm">
                                Số tiền khả dụng:
                              </span>
                              <p className="text-lg font-semibold text-green-400">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(card.available_money)}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-white/80">
                              <span className="text-white/60 text-sm">
                                Ngày thanh toán:
                              </span>
                              <p className="text-lg font-semibold">
                                Ngày {card.pay_date} hàng tháng
                              </p>
                            </div>
                            <div className="text-white/80">
                              <span className="text-white/60 text-sm">
                                Lãi suất:
                              </span>
                              <p className="text-lg font-semibold text-yellow-400">
                                {card.interest_rate}%/tháng
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                          <h5 className="text-white font-semibold mb-3">
                            Quyền lợi thẻ:
                          </h5>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {card.benefits.map((benefit: any) => (
                              <div
                                key={benefit.id}
                                className="bg-black/30 p-3 rounded-lg border border-purple-500/20"
                              >
                                <div className="flex gap-2">
                                  <div className="text-purple-400 text-xl mt-1">
                                    {benefit.icon.includes("FaMedkit")
                                      ? "🏥"
                                      : benefit.icon.includes("FaWallet")
                                      ? "💰"
                                      : benefit.icon.includes("FaShieldAlt")
                                      ? "🛡️"
                                      : benefit.icon.includes("FaUsers")
                                      ? "👥"
                                      : benefit.icon.includes("FaShoppingCart")
                                      ? "🛒"
                                      : benefit.icon.includes("FaChartLine")
                                      ? "📈"
                                      : benefit.icon.includes("FaMoneyBillWave")
                                      ? "💵"
                                      : benefit.icon.includes("FaStore")
                                      ? "🏪"
                                      : benefit.icon.includes("FaCheckCircle")
                                      ? "✅"
                                      : benefit.icon.includes("FaGraduationCap")
                                      ? "🎓"
                                      : benefit.icon.includes("FaGem")
                                      ? "💎"
                                      : benefit.icon.includes("FaMedal")
                                      ? "🏅"
                                      : benefit.icon.includes("FaCheckDouble")
                                      ? "✔️"
                                      : benefit.icon.includes("FaStar")
                                      ? "⭐"
                                      : "🎯"}
                                  </div>
                                  <div className="flex-1">
                                    <p
                                      className="text-white/80 text-sm"
                                      dangerouslySetInnerHTML={{
                                        __html: benefit.features,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-black/50 border-purple-500/30">
                    <CardContent className="py-8">
                      <p className="text-white/60 text-center">
                        Chưa có thẻ tín dụng nào
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
