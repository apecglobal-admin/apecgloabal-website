import React from "react";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  TrendingUp,
  DollarSign,
  Shield,
  GraduationCap,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface EmployeeOverviewProps {
  employee: any;
  latestContract?: any;
}

const EmployeeOverview: React.FC<EmployeeOverviewProps> = ({
  employee,
  latestContract,
}) => {
  return (
    <div className="space-y-3 sm:space-y-4 mt-0 overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 overflow-x-hidden">

        {/* --- Thông tin cá nhân --- */}
        <Card className="bg-black/50 border-purple-500/30 overflow-x-hidden">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-sm sm:text-lg">
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0 sm:pt-0 overflow-x-hidden">
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-base overflow-x-hidden">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400 shrink-0" />
              <span className="truncate min-w-0">{employee?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-base overflow-x-hidden">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400 shrink-0" />
              <span className="truncate min-w-0">
                {employee?.phone || "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-base overflow-x-hidden">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400 shrink-0" />
              <span className="truncate min-w-0">
                Sinh nhật:{" "}
                {employee?.birthday
                  ? new Date(employee?.birthday).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-start gap-2 text-white/80 text-xs sm:text-base overflow-x-hidden">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400 shrink-0 mt-0.5" />
              <span className="break-words min-w-0">
                {employee?.address || "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-base overflow-x-hidden">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400 shrink-0" />
              <span className="truncate min-w-0">
                Nơi sinh: {employee?.birth_place || "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-base overflow-x-hidden">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 shrink-0" />
              <span className="truncate min-w-0">
                SĐT khẩn cấp: {employee?.emergency_contract || "Chưa cập nhật"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* --- Giấy tờ tùy thân --- */}
        <Card className="bg-black/50 border-purple-500/30 overflow-x-hidden">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-sm sm:text-lg">
              Giấy tờ tùy thân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0 sm:pt-0 overflow-x-hidden">
            <div className="text-white/80 text-xs sm:text-base overflow-x-hidden">
              <span className="text-white/60">CCCD/CMND: </span>
              <span className="break-all">
                {employee?.citizen_card || "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-base overflow-x-hidden">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400 shrink-0" />
              <span className="truncate min-w-0">
                Ngày cấp:{" "}
                {employee?.issue_date
                  ? new Date(employee?.issue_date).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-start gap-2 text-white/80 text-xs sm:text-base overflow-x-hidden">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400 shrink-0 mt-0.5" />
              <span className="break-words min-w-0">
                Nơi cấp: {employee?.issue_place || "Chưa cập nhật"}
              </span>
            </div>
            <div className="pt-2 border-t border-white/10">
              <div className="text-white/80 text-xs sm:text-base">
                <span className="text-white/60">Giới tính: </span>
                <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 text-[10px] sm:text-xs">
                  {employee?.gen == 1
                    ? "Nam"
                    : employee?.gen == 2
                    ? "Nữ"
                    : "Khác"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- Thông tin công việc --- */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-sm sm:text-lg">
              Thông tin công việc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0 sm:pt-0">
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-base">
              <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400 shrink-0" />
              <span>Phòng ban: {employee?.positions.name || "Chưa xác định"}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-base">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400 shrink-0" />
              <span>
                Ngày vào:{" "}
                {employee?.join_date
                  ? new Date(employee?.join_date).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-base">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400 shrink-0" />
              <span>
                Cấp bậc: {employee?.levels?.name || "Chưa xác định"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-base">
              <span className="text-white/60">Trạng thái:</span>
              <Badge
                className={
                  employee?.status === "active"
                    ? "bg-green-600/20 text-green-400 border-green-500/30 text-[10px] sm:text-xs"
                    : "bg-red-600/20 text-red-400 border-red-500/30 text-[10px] sm:text-xs"
                }
              >
                {employee?.status === "active"
                  ? "Hoạt động"
                  : "Không hoạt động"}
              </Badge>
            </div>
            {employee?.salary && (
              <div className="flex items-center gap-2 text-white/80 text-xs sm:text-base">
                <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400 shrink-0" />
                <span>
                  Lương:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(employee?.salary)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- Hợp đồng lao động --- */}
        {latestContract && (
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-white text-sm sm:text-lg flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                Hợp đồng lao động
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="text-white/80 text-xs sm:text-base">
                <span className="text-white/60">Loại hợp đồng: </span>
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-[10px] sm:text-xs">
                  {latestContract.contract_type === 1
                    ? "Thử việc"
                    : latestContract.contract_type === 2
                    ? "Chính thức"
                    : "Hợp đồng dự án"}
                </Badge>
              </div>
              <div className="text-white/80 text-xs sm:text-base">
                <span className="text-white/60">Lương cơ bản: </span>
                <span className="font-semibold text-green-400">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(latestContract.base_salary)}
                </span>
              </div>
              <div className="text-white/80 text-xs sm:text-base">
                <span className="text-white/60">Phụ cấp: </span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(latestContract.allowance)}
                </span>
              </div>
              {latestContract.start_date && (
                <div className="text-white/80 text-xs sm:text-base">
                  <span className="text-white/60">Ngày bắt đầu: </span>
                  <span>
                    {new Date(latestContract.start_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                </div>
              )}
              {latestContract.end_date && (
                <div className="text-white/80 text-xs sm:text-base">
                  <span className="text-white/60">Ngày kết thúc: </span>
                  <span>
                    {new Date(latestContract.end_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                </div>
              )}
              {latestContract.note && (
                <div className="text-white/80 text-xs sm:text-sm">
                  <span className="text-white/60">Ghi chú: </span>
                  <p className="mt-1">{latestContract.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* --- Học vấn --- */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-sm sm:text-lg flex items-center gap-2">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              Học vấn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3 sm:p-6 pt-0 sm:pt-0">
            {employee?.educations?.[0] ? (
              <div className="text-white/80 text-xs sm:text-base">
                <p className="font-semibold">
                  {employee?.educations[0].school_name}
                </p>
                <p className="text-xs sm:text-sm text-white/60">
                  {employee?.educations[0].major || ""}
                </p>
                <p className="text-xs sm:text-sm text-white/60">
                  {employee?.educations[0].degree_level === "tien_si"
                    ? "Tiến sĩ"
                    : employee?.educations[0].degree_level === "thac_si"
                    ? "Thạc sĩ"
                    : employee?.educations[0].degree_level === "dai_hoc"
                    ? "Đại học"
                    : employee?.educations[0].degree_level ||
                      "Chưa cập nhật"}
                </p>
                <p className="text-xs sm:text-sm text-white/60">
                  Năm tốt nghiệp:{" "}
                  {employee?.educations[0].graduation_year || "Chưa cập nhật"}
                </p>
                {employee?.educations[0].grade && (
                  <p className="text-xs sm:text-sm text-white/60">
                    Xếp loại: {employee?.educations[0].grade}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-white/60 text-xs sm:text-base">Chưa cập nhật</p>
            )}
          </CardContent>
        </Card>

        {/* --- Chứng chỉ --- */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-sm sm:text-lg flex items-center gap-2">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
              Chứng chỉ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            {employee?.certificates && employee?.certificates.length > 0 ? (
              <div className="space-y-2">
                {employee?.certificates.map((cert: any) => (
                  <div
                    key={cert.id}
                    className="bg-black/30 p-2 sm:p-3 rounded-lg border border-yellow-500/20"
                  >
                    <p className="text-white/80 font-semibold text-xs sm:text-base">
                      {cert.certificate_name}
                    </p>
                    <p className="text-white/50 text-[10px] sm:text-xs">
                      Cấp ngày:{" "}
                      {new Date(cert.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-xs sm:text-base">
                Chưa có chứng chỉ
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- Giới thiệu --- */}
      {employee?.bio && (
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-sm sm:text-lg">
              Giới thiệu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <p className="text-white/80 text-xs sm:text-base">{employee?.bio}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeOverview;
