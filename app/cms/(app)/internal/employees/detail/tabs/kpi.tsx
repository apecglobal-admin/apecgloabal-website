import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { updateKPIEmployees } from "@/src/features/kpi/kpiApi";

interface EmployeeKpi {
  id: number;
  weight: number;
  score: number;
  max_weight: number;
  max_score: number;
  kpi: {
    id: number;
    name: string;
  };
}

interface EmployeeKpisProps {
  employee: {
    id: number;
    kpis: EmployeeKpi[];
    [key: string]: any;
  };
}

const EmployeeKpis: React.FC<EmployeeKpisProps> = ({ employee }) => {
  const dispatch = useDispatch();

  const [kpisData, setKpisData] = useState<{ 
    id: number;
    kpi: string; 
    weight: number; 
    score: number;
    max_weight: number;
    max_score: number;
    scorePercentage: number; // Để hiển thị trên biểu đồ
  }[]>([]);
  const [backupKpisData, setBackupKpisData] = useState<typeof kpisData>([]);
  const [isEditing, setIsEditing] = useState(false);

  console.log("employee in EmployeeKpis:", employee);
  
  useEffect(() => {
    if (employee?.kpis && employee.kpis.length > 0) {
      const formattedData = employee.kpis.map((item: EmployeeKpi) => ({
        id: item.id,
        kpi: item.kpi.name,
        weight: item.weight,
        score: item.score,
        max_weight: item.max_weight,
        max_score: item.max_score,
        scorePercentage: item.max_score > 0 ? (item.score / item.max_score) * 100 : 0
      }));
      setKpisData(formattedData);
      setBackupKpisData(JSON.parse(JSON.stringify(formattedData)));
    }
  }, [employee]);

  const handleWeightChange = (kpiId: number, newWeight: number) => {
    setKpisData((prev) =>
      prev.map((k) => (k.id === kpiId ? { ...k, weight: newWeight } : k))
    );
  };

  const handleSave = async () => {
    try {
      // Tạo payload để gửi lên API
      const updatedKpis = kpisData.map((kpiData) => ({
        id: kpiData.id,
        weight: kpiData.weight.toString()
      }));

      const payload = {
        id: employee.id,
        kpis: updatedKpis
      };

      console.log("Update KPIs payload:", payload);

      // Uncomment khi đã có action
      const res = await dispatch(
        updateKPIEmployees(payload) as any
      );
      
      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success("Cập nhật KPI thành công!");
        setBackupKpisData(JSON.parse(JSON.stringify(kpisData)));
      }
      
    } catch (error) {
      console.error("Error updating KPIs:", error);
      toast.error("Có lỗi xảy ra khi cập nhật KPI");
    }
  };

  const handleCancel = () => {
    setKpisData(JSON.parse(JSON.stringify(backupKpisData)));
  };

  // Tính tổng weight để hiển thị
  const totalWeight = kpisData.reduce((sum, k) => sum + k.weight, 0);
  const totalMaxWeight = kpisData.reduce((sum, k) => sum + k.max_weight, 0);

  return (
    <div className="space-y-3 sm:space-y-4 mt-0 overflow-x-hidden">
      {/* --- Thông tin tổng quan --- */}
      <div className="flex items-center gap-4 text-white/80 text-sm">
        <span>
          Tổng trọng số: <strong className={Math.abs(totalWeight - totalMaxWeight) < 0.1 ? "text-green-400" : "text-yellow-400"}>
            {totalWeight.toFixed(2)}/100
          </strong>
        </span>
        {Math.abs(totalWeight - totalMaxWeight) >= 0.1 && (
          <span className="text-yellow-400 text-xs">
            (Tổng trọng số nên bằng {totalMaxWeight.toFixed(2)})
          </span>
        )}
      </div>

      {/* --- Biểu đồ KPI (theo score/max_score) --- */}
      <Card className="bg-black/50 border-purple-500/30 overflow-x-hidden">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white text-sm sm:text-lg">
            Biểu đồ KPI (% Hoàn thành)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 overflow-x-hidden">
          {kpisData.length > 0 ? (
            <div className="w-full overflow-x-hidden">
              <ResponsiveContainer
                width="100%"
                height={300}
                className="sm:h-[400px]"
              >
                <RadarChart data={kpisData}>
                  <PolarGrid stroke="#a855f7" strokeOpacity={0.3} />
                  <PolarAngleAxis
                    dataKey="kpi"
                    tick={{ fill: "#fff", fontSize: 10 }}
                    className="sm:text-xs"
                    tickLine={{ stroke: "#a855f7" }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "#fff", fontSize: 10 }}
                    className="sm:text-xs"
                    tickLine={{ stroke: "#a855f7" }}
                  />
                  <Radar
                    name="% Hoàn thành"
                    dataKey="scorePercentage"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid #a855f7",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#fff" }}
                    formatter={(value: any, name: string, props: any) => {
                      const item = props.payload;
                      return [
                        `${value.toFixed(2)}% (${item.score}/${item.max_score})`,
                        name
                      ];
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#fff", fontSize: "12px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-white/60 text-center py-8 text-xs sm:text-base">
              Chưa có dữ liệu KPI
            </p>
          )}
        </CardContent>
      </Card>

      {/* --- Chi tiết KPI với slider chỉnh weight --- */}
      <Card className="bg-black/50 border-purple-500/30 overflow-x-hidden">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white text-sm sm:text-lg">
            Chi tiết KPI
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 overflow-x-hidden">
          <div className="space-y-6 overflow-x-hidden">
            {kpisData.length > 0 ? (
              kpisData.map((kpi, index) => (
                <div key={index} className="space-y-3 p-4 bg-white/5 rounded-lg">
                  <div className="text-white font-medium text-sm sm:text-base">
                    {kpi.kpi}
                  </div>
                  
                  {/* Score Display (Read-only) */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-white/80 text-xs sm:text-sm">
                      <span>Điểm số (Score)</span>
                      <span>{kpi.score}/{kpi.max_score} ({kpi.scorePercentage.toFixed(2)}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${kpi.scorePercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Weight Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-white/80 text-xs sm:text-sm">
                      <span>Trọng số (Weight)</span>
                      <span>{kpi.weight.toFixed(2)}/{kpi.max_weight}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={kpi.max_weight}
                      step={0.01}
                      value={kpi.weight}
                      onChange={(e) =>
                        handleWeightChange(kpi.id, Number(e.target.value))
                      }
                      className="w-full accent-blue-600"
                      disabled={!isEditing}
                    />
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(kpi.weight / kpi.max_weight) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60 text-center py-4 text-xs sm:text-base">
                Chưa có dữ liệu KPI
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* --- Nút điều khiển --- */}
      {isEditing ? (
        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
            onClick={() => {
              handleSave();
              setIsEditing(false);
            }}
          >
            Lưu
          </button>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
            onClick={() => {
              handleCancel();
              setIsEditing(false);
            }}
          >
            Hủy
          </button>
        </div>
      ) : (
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          onClick={() => setIsEditing(true)}
        >
          Chỉnh sửa
        </button>
      )}
    </div>
  );
};

export default EmployeeKpis;