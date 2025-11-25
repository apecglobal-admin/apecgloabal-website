
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
;
import {
  Save,
  X,
  Edit,
  Users,
  CheckSquare,
  Target,
  Calendar,
  DollarSign,
  Clock,
 
  Briefcase,
} from "lucide-react";


interface ProjectDetailsProps {
  project: any;
  companies: any[];
  setShowEditProjectModal: (show: boolean) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  formatCurrency: (amount: number) => string;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  companies,
  setShowEditProjectModal,
  getStatusColor,
  getStatusText,
  formatCurrency,
}) => {
  // Lấy tên công ty theo company_id
  const companyName = companies.find((company) => company.id === project?.company_id)?.name || 'Không tìm thấy công ty';

  return (
    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-400" />
                Thông Tin Cơ Bản
              </CardTitle>
              <Button
                onClick={() => setShowEditProjectModal(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh Sửa
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-purple-500/20 flex items-center justify-center">
                {project?.company_logo ? (
                  <img src={project.company_logo} alt={project.company_name} className="w-full h-full object-cover" />
                ) : (
                  <Briefcase className="h-6 w-6 text-purple-400" />
                )}
              </div>
              <div>
                <p className="text-white/60 text-xs">Công ty</p>
                <p className="text-white font-medium">{companyName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-sm mb-1">Trạng thái</p>
                <Badge className={getStatusColor(project?.status)}>
                  {getStatusText(project?.status)}
                </Badge>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Ưu tiên</p>
                <Badge
                  className={
                    project?.priority === 'high'
                      ? 'bg-red-600/20 text-red-400 border-red-500/30'
                      : project?.priority === 'medium'
                      ? 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                  }
                >
                  {project?.priority === 'high'
                    ? 'Cao'
                    : project?.priority === 'medium'
                    ? 'Trung bình'
                    : 'Thấp'}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-1">Mô tả</p>
              <p className="text-white/80 text-sm leading-relaxed">
                {project?.description || 'Chưa có mô tả'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-sm mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Ngày bắt đầu
                </p>
                <p className="text-white font-medium">
                  {project?.start_date ? new Date(project.start_date).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Ngày kết thúc
                </p>
                <p className="text-white font-medium">
                  {project?.end_date ? new Date(project.end_date).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
              </div>
            </div>

            {(project?.budget || project?.spent) && (
              <div className="grid grid-cols-2 gap-4">
                {project?.budget && (
                  <div>
                    <p className="text-white/60 text-sm mb-1 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Ngân sách
                    </p>
                    <p className="text-green-400 font-medium">{formatCurrency(project.budget)}</p>
                  </div>
                )}
                {project?.spent && (
                  <div>
                    <p className="text-white/60 text-sm mb-1 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Đã chi
                    </p>
                    <p className="text-orange-400 font-medium">{formatCurrency(project.spent)}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Stats */}
        <Card className="bg-black/50 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              Thống Kê Dự Án
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Tiến độ hoàn thành</span>
                <span className="text-blue-400 font-bold text-lg">{project?.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${project?.progress || 0}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{project?.members?.length || 0}</div>
                <p className="text-white/60 text-sm">Thành viên</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-center">
                <CheckSquare className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">{project?.tasks?.length || 0}</div>
                <p className="text-white/60 text-sm">Công việc</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
                <Target className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">{project?.milestones?.length || 0}</div>
                <p className="text-white/60 text-sm">Cột mốc</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">{project?.team_size || 0}</div>
                <p className="text-white/60 text-sm">Quy mô team</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
};

export default ProjectDetails;
