"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { useDispatch } from "react-redux";
import { listEmployee, listEmployeeById, updateStatusCareer } from "@/src/features/employee/employeeApi";
import { toast } from "sonner";

interface EmployeeCareerRequestsProps {
  employee: any;
}

const EmployeeCareerRequests: React.FC<EmployeeCareerRequestsProps> = ({
  employee,
}) => {
  const dispatch = useDispatch();
  const handleRequestDecision = async (id: number, status: boolean) => {
    try {
      const res = await dispatch(
        updateStatusCareer({ id, status } as any) as any
      );
      if (res.payload.status == 200 || res.payload.status == 201) {
        await dispatch(listEmployeeById(localStorage.getItem("cmsToken")as any) as any)
        toast(res.payload.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 mt-0">
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-lg">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
            Yêu cầu cá nhân
          </CardTitle>
        </CardHeader>

        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="space-y-2 sm:space-y-3">
            {employee.personal_requests?.length > 0 ? (
              [...employee.personal_requests]
                .sort(
                  (a, b) =>
                    new Date(b.date_request).getTime() -
                    new Date(a.date_request).getTime()
                )
                .map((request: any) => (
                  <div
                    key={request.id}
                    className="bg-black/30 p-3 sm:p-4 rounded-lg border border-purple-500/20"
                  >
                    {/* --- Tiêu đề + trạng thái --- */}
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h4 className="text-white font-semibold text-xs sm:text-base flex-1">
                        {request.title}
                      </h4>

                      <Badge
                        className={
                          request.status_requests.id === 1
                            ? "bg-blue-600/20 text-blue-400 border-blue-500/30 text-[10px] sm:text-xs shrink-0"
                            : request.status_requests.id === 2
                            ? "bg-green-600/20 text-green-400 border-green-500/30 text-[10px] sm:text-xs shrink-0"
                            : request.status_requests.id === 3
                            ? "bg-red-600/20 text-red-400 border-red-500/30 text-[10px] sm:text-xs shrink-0"
                            : "bg-yellow-600/20 text-yellow-400 border-yellow-500/30 text-[10px] sm:text-xs shrink-0"
                        }
                      >
                        {request.status_requests.name}
                      </Badge>
                    </div>

                    {/* --- Mô tả --- */}
                    <p className="text-white/60 text-xs sm:text-sm mb-2">
                      {request.description}
                    </p>

                    {/* --- Thông tin chi tiết --- */}
                    <div className="flex gap-1.5 sm:gap-2 text-[10px] sm:text-xs flex-wrap mb-2">
                      <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                        {request.type_requests.name}
                      </Badge>
                      <span className="text-white/50">
                        {new Date(request.date_request).toLocaleDateString(
                          "vi-VN"
                        )}
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

                    {/* --- Kết quả nếu có --- */}
                    {request.results && (
                      <div className="mt-2 p-2 bg-green-600/10 rounded border border-green-500/20">
                        <p className="text-green-400 text-[10px] sm:text-sm">
                          Kết quả: {request.results}
                        </p>
                      </div>
                    )}

                    {/* --- Nút duyệt / từ chối --- */}
                    {(request.status_requests.id === 1 ||
                      request.status_requests.id === 4) && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() =>
                            handleRequestDecision(request.id, true)
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() =>
                            handleRequestDecision(request.id, false)
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-white/60 text-center py-4 text-xs sm:text-base">
                Chưa có yêu cầu nào
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeCareerRequests;
