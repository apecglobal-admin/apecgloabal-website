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
  Loader2,
} from "lucide-react";
import EmployeeOverview from "./tabs/overview";
import EmployeeSkills from "./tabs/skills";
import EmployeeProjects from "./tabs/projects";
import EmployeeAchievements from "./tabs/achievements";
import EmployeeCareerRequests from "./tabs/career";
import EmployeeCards from "./tabs/card";
import {
  listEmployeeById,
  listSkill,
} from "@/src/features/employee/employeeApi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useEmployeeData } from "@/src/hook/employeeHook";

interface EmployeeDetailModalProps {
  employeeId: any;
  open: boolean;
  onClose: () => void;
  skillsList: any;
}

export default function EmployeeDetailModal({
  employeeId,
  open,
  onClose,
  skillsList,
}: EmployeeDetailModalProps) {
  const dispatch = useDispatch();
  const { employeeById } = useEmployeeData();

  useEffect(() => {
  if (open && employeeId && (!employeeById || employeeById.id !== employeeId)) {
    dispatch(listEmployeeById(employeeId as any) as any);
  }
}, [dispatch, employeeId, open]);

  const skillsData =
    employeeById?.skills?.map((skill: any) => ({
      skill: skill.name,
      value: parseInt(skill.value) || 0,
    })) || [];

  // Tính số lượng dự án từ project_list thay vì rada_chart
  const projectList = employeeById?.projects?.project_list || [];
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

  const performanceData = employeeById?.projects?.performance_chart || [];

  // Lấy thông tin hợp đồng mới nhất
  const latestContract = employeeById?.contracts?.[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <DialogContent className="bg-black/95 border-purple-500/30 text-white max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden w-[95vw] sm:w-full p-3 sm:p-6">
        <DialogHeader className="overflow-x-hidden">
          <DialogTitle className="text-lg sm:text-2xl font-bold text-white flex flex-row items-center gap-2 sm:gap-3 overflow-x-hidden">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-x-hidden">
              <span className="truncate text-base sm:text-2xl">
                {employeeById?.name}
              </span>
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-[10px] sm:text-xs w-fit px-1.5 py-0.5 sm:px-2 max-w-full truncate">
                Level {employeeById?.level} | EXP: {employeeById?.exp}/
                {employeeById?.next_exp}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 h-auto lg:h-[calc(90vh-120px)] overflow-x-hidden">
          <Tabs
            defaultValue="overview"
            className="flex flex-col lg:flex-row gap-3 sm:gap-4 w-full overflow-x-hidden"
            orientation="vertical"
          >
            <TabsList className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible h-fit bg-black/50 p-1.5 sm:p-2 gap-1.5 sm:gap-2 w-full lg:w-48 shrink-0 no-scrollbar">
              <TabsTrigger
                value="overview"
                className="whitespace-nowrap lg:w-full lg:justify-start text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 shrink-0"
              >
                Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="whitespace-nowrap lg:w-full lg:justify-start text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 shrink-0"
              >
                Kỹ năng
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="whitespace-nowrap lg:w-full lg:justify-start text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 shrink-0"
              >
                Dự án
              </TabsTrigger>
              <TabsTrigger
                value="career"
                className="whitespace-nowrap lg:w-full lg:justify-start text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 shrink-0"
              >
                Yêu cầu
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="whitespace-nowrap lg:w-full lg:justify-start text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 shrink-0"
              >
                Thành tích
              </TabsTrigger>
              <TabsTrigger
                value="cards"
                className="whitespace-nowrap lg:w-full lg:justify-start text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 shrink-0"
              >
                Thẻ tín dụng
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto overflow-x-hidden lg:pr-2">
              <TabsContent value="overview">
                <EmployeeOverview
                  employee={employeeById}
                  latestContract={latestContract}
                />
              </TabsContent>
              <TabsContent value="skills">
                <EmployeeSkills
                  employee={employeeById}
                  skillsData={skillsData}
                  listSkills={skillsList}
                />
              </TabsContent>

              <TabsContent value="projects">
                <EmployeeProjects
                  employee={employeeById}
                  performanceData={performanceData}
                  projectStatusData={projectStatusData}
                />
              </TabsContent>

              <TabsContent value="achievements">
                <EmployeeAchievements employee={employeeById} />
              </TabsContent>

              <TabsContent value="career">
                <EmployeeCareerRequests employee={employeeById} />
              </TabsContent>

              <TabsContent value="cards">
                <EmployeeCards employee={employeeById} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
