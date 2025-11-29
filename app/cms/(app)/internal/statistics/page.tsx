"use client";

import { listStatistics } from "@/src/features/statistics/statisticsApi";
import { useStatisticsData } from "@/src/hook/statisticsHook";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  DollarSign,
  Activity,
  MessageSquare,
  Ticket,
  Settings,
  Award,
  BarChart3,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Component để hiển thị card thống kê
const StatCard = ({ item, icon: Icon }: any) => {
  const getChangeColor = () => {
    if (!item.change_type) return "text-gray-400";
    return item.change_type === "+" ? "text-green-400" : "text-red-400";
  };

  const getChangeIcon = () => {
    if (!item.change_type) return null;
    return item.change_type === "+" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const progressPercentage = item.progress_total 
    ? (item.progress_current / item.progress_total) * 100 
    : null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-300 mb-1">{item.title}</p>
          {item.description && (
            <p className="text-xs text-gray-400">{item.description}</p>
          )}
        </div>
        {Icon && (
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-3xl font-bold text-white">
            {item.value}
            {item.unit && <span className="text-xl ml-1">{item.unit}</span>}
          </p>
        </div>
        
        {item.change_value && (
          <div className={`flex items-center gap-1 ${getChangeColor()} font-semibold`}>
            {getChangeIcon()}
            <span className="text-sm">{item.change_value}%</span>
          </div>
        )}
      </div>

      {progressPercentage !== null && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{item.progress_current}</span>
            <span>{item.progress_total}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Component cho section lớn
const StatSection = ({ section }: any) => {
  const getIcon = (sectionId: string) => {
    const iconMap: any = {
      "1": Users,
      "2": Briefcase,
      "3": Users,
      "4": DollarSign,
      "5": Activity,
      "6": Settings,
      "7": Award,
      "13": BarChart3,
      "14": Award
    };
    return iconMap[sectionId] || Activity;
  };

  const Icon = getIcon(section.id);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">{section.name}</h2>
      </div>
      
      <div className={`grid gap-6 ${
        section.dashboard_items.length === 1 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        section.dashboard_items.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
        section.dashboard_items.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      }`}>
        {section.dashboard_items.map((item: any) => (
          <StatCard 
            key={item.id} 
            item={item}
            icon={section.id === "5" ? 
              (item.id === 6 ? Activity : item.id === 7 ? MessageSquare : Ticket) : 
              null
            }
          />
        ))}
      </div>
    </div>
  );
};

export default function StatisticsPage() {
  const dispatch = useDispatch();
  const { statistics } = useStatisticsData();

  useEffect(() => {
    dispatch(listStatistics() as any);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <Link href="/cms">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            CMS
          </Button>
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-white">Thống Kê</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Thống Kê Dashboard 
        </h1>
        <p className="text-white/60">
          Tổng quan hiệu suất và hoạt động của doanh nghiệp
        </p>
      </div>

      {/* Main Content */}
      <div className="py-4">
        {statistics && statistics.length > 0 ? (
          <div className="space-y-8">
            {statistics.map((section: any) => (
              <StatSection key={section.id} section={section} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-white/60">Đang tải dữ liệu thống kê...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}