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
import {
  updateKPIBalance,
  updateKPIEmployees,
} from "@/src/features/kpi/kpiApi";
import { listEmployeeById } from "@/src/features/employee/employeeApi";
import { RotateCcw } from "lucide-react";

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

  const [kpisData, setKpisData] = useState<
    {
      id: number;
      kpi: string;
      weight: number | null;
      score: number | null;
      max_weight: number | null;
      max_score: number | null;
      scorePercentage: number;
    }[]
  >([]);

  const [backupKpisData, setBackupKpisData] = useState<typeof kpisData>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (employee?.kpis && employee.kpis.length > 0) {
      const formattedData = employee.kpis.map((item: EmployeeKpi) => ({
        id: item.id,
        kpi: item.kpi?.name || "Chưa có tên KPI",
        weight: item.weight ?? null,
        score: item.score ?? null,
        max_weight: item.max_weight ?? null,
        max_score: item.max_score ?? null,
        scorePercentage:
          item.max_score != null && item.max_score > 0 && item.score != null
            ? (item.score / item.max_score) * 100
            : 0,
      }));
      setKpisData(formattedData);
      setBackupKpisData(JSON.parse(JSON.stringify(formattedData)));
    }
  }, [employee]);

  const handleWeightChange = (kpiId: number, newWeight: number) => {
    setKpisData((prev) =>
      prev.map((k) => {
        if (k.id === kpiId) {
          const maxWeight = k.max_weight ?? 100;
          const clampedWeight = Math.max(0, Math.min(newWeight, maxWeight));
          return { ...k, weight: clampedWeight };
        }
        return k;
      })
    );
  };

  const handleSave = async () => {
    try {
      const updatedKpis = kpisData.map((kpiData) => ({
        id: kpiData.id,
        weight: kpiData.weight != null ? kpiData.weight.toString() : "0",
      }));

      const payload = {
        id: employee.id,
        kpis: updatedKpis,
      };

      const res = await dispatch(updateKPIEmployees(payload) as any);

      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success("Cập nhật KPI thành công!");
      }
      dispatch(listEmployeeById(employee.id as any) as any);
    } catch (error) {
      console.error("Error updating KPIs:", error);
      toast.error("Có lỗi xảy ra khi cập nhật KPI");
    }
  };

  const handleBalance = async () => {
    try {
      const res = await dispatch(updateKPIBalance(employee.id) as any);
      if (res.payload.status === 200 || res.payload.status === 201) {
        dispatch(listEmployeeById(employee.id as any) as any);
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    setKpisData(JSON.parse(JSON.stringify(backupKpisData)));
  };

  const totalWeight = kpisData.reduce((sum, k) => sum + (k.weight ?? 0), 0);
  const totalMaxWeight = kpisData.reduce((sum, k) => sum + (k.max_weight ?? 0), 0);

  return (
    <div className="space-y-3 sm:space-y-4 mt-0">
      {/* Thông tin tổng quan */}
      <div className="flex items-center gap-4 text-white/80 text-sm">
        <span>
          Tổng trọng số:{" "}
          <strong
            className={
              Math.abs(totalWeight - totalMaxWeight) < 0.1
                ? "text-green-400"
                : "text-yellow-400"
            }
          >
            {totalWeight.toFixed(2)}/100
          </strong>
        </span>
        {Math.abs(totalWeight - totalMaxWeight) >= 0.1 && (
          <span className="text-yellow-400 text-xs">
            (Tổng trọng số nên bằng 100)
          </span>
        )}
      </div>

      {/* Layout ngang: Biểu đồ và Chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Biểu đồ KPI */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-sm sm:text-lg">
              Biểu đồ KPI (% Hoàn thành)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            {kpisData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
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
                      if (item.score == null || item.max_score == null) {
                        return ["Chưa có dữ liệu điểm số", name];
                      }
                      return [
                        `${value.toFixed(2)}% (${item.score}/${item.max_score})`,
                        name,
                      ];
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#fff", fontSize: "12px" }} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-white/60 text-center py-8 text-xs sm:text-base">
                Chưa có dữ liệu KPI
              </p>
            )}
          </CardContent>
        </Card>

        {/* Chi tiết KPI */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader className="p-3 sm:p-6">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-white text-sm sm:text-lg">
                Chi tiết KPI
              </CardTitle>
              {/* Nút điều khiển */}
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
                <div className="flex gap-2 mt-4 items-center">
                  <RotateCcw
                    className="text-white hover:text-purple-400 cursor-pointer"
                    onClick={handleBalance}
                  />
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {kpisData.length > 0 ? (
                kpisData.map((kpi, index) => (
                  <div
                    key={index}
                    className="space-y-3 p-4 bg-white/5 rounded-lg"
                  >
                    <div className="text-white font-medium text-sm sm:text-base">
                      {kpi.kpi}
                    </div>

                    {/* Score Display */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-white/80 text-xs sm:text-sm">
                        <span>Điểm số (Score)</span>
                        <span>
                          {kpi.score != null && kpi.max_score != null ? (
                            <>
                              {kpi.score}/{kpi.max_score} (
                              {kpi.scorePercentage.toFixed(2)}%)
                            </>
                          ) : (
                            <span className="text-white/50 italic">
                              Chưa có dữ liệu điểm số
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Weight Input & Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-white/80 text-xs sm:text-sm">
                        <span>Trọng số (Weight)</span>
                        <div className="flex items-center gap-2">
                          {kpi.weight != null && kpi.max_weight != null ? (
                            <>
                              {isEditing ? (
                                <input
                                  type="number"
                                  min={0}
                                  max={kpi.max_weight}
                                  step={0.01}
                                  value={kpi.weight.toFixed(2)}
                                  onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    handleWeightChange(kpi.id, value);
                                  }}
                                  className="w-20 px-2 py-1 bg-white/10 border border-purple-500/30 rounded text-white text-center focus:outline-none focus:border-purple-500"
                                  disabled={!isEditing}
                                />
                              ) : (
                                <span>{kpi.weight.toFixed(2)}</span>
                              )}
                              <span>/{kpi.max_weight}</span>
                            </>
                          ) : (
                            <span className="text-white/50 italic">
                              Chưa có dữ liệu trọng số
                            </span>
                          )}
                        </div>
                      </div>
                      {kpi.weight != null && kpi.max_weight != null && (
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
                      )}
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
      </div>
    </div>
  );
};

export default EmployeeKpis;