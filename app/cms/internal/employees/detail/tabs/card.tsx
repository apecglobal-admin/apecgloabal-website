"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

interface EmployeeCardsProps {
  employee: any;
}

const EmployeeCards: React.FC<EmployeeCardsProps> = ({ employee }) => {
  return (
    <div className="space-y-3 sm:space-y-4 mt-0">
      {employee.cards && employee.cards.length > 0 ? (
        employee.cards.map((card: any) => (
          <Card key={card.id} className="bg-black/50 border-purple-500/30">
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1">
                  <CardTitle className="text-white flex items-center gap-2 flex-wrap">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    <span className="text-sm sm:text-lg">{card.name}</span>
                  </CardTitle>
                  <Badge
                    className={
                      card.isActive
                        ? "bg-green-600/20 text-green-400 border-green-500/30 mt-2 text-[10px] sm:text-xs"
                        : "bg-gray-600/20 text-gray-400 border-gray-500/30 mt-2 text-[10px] sm:text-xs"
                    }
                  >
                    {card.isActive ? "Đang hoạt động" : "Chưa kích hoạt"}
                  </Badge>
                </div>
                <img
                  src={card.src}
                  alt={card.name}
                  className="w-20 sm:w-32 h-auto rounded-lg"
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="text-white/80">
                    <span className="text-white/60 text-[10px] sm:text-sm">
                      Hạn mức tối đa:
                    </span>
                    <p className="text-base sm:text-lg font-semibold text-purple-400">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(card.max_credit)}
                    </p>
                  </div>
                  <div className="text-white/80">
                    <span className="text-white/60 text-[10px] sm:text-sm">
                      Số tiền khả dụng:
                    </span>
                    <p className="text-base sm:text-lg font-semibold text-green-400">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(card.available_money)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <div className="text-white/80">
                    <span className="text-white/60 text-[10px] sm:text-sm">
                      Ngày thanh toán:
                    </span>
                    <p className="text-base sm:text-lg font-semibold">
                      Ngày {card.pay_date} hàng tháng
                    </p>
                  </div>
                  <div className="text-white/80">
                    <span className="text-white/60 text-[10px] sm:text-sm">
                      Lãi suất:
                    </span>
                    <p className="text-base sm:text-lg font-semibold text-yellow-400">
                      {card.interest_rate}%/tháng
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 sm:pt-4">
                <h5 className="text-white font-semibold mb-2 sm:mb-3 text-xs sm:text-base">
                  Quyền lợi thẻ:
                </h5>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                  {card.benefits.map((benefit: any) => (
                    <div
                      key={benefit.id}
                      className="bg-black/30 p-2 sm:p-3 rounded-lg border border-purple-500/20"
                    >
                      <div className="flex gap-1.5 sm:gap-2">
                        <div className="text-purple-400 text-base sm:text-xl mt-0.5 shrink-0">
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
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-white/80 text-[10px] sm:text-sm"
                            dangerouslySetInnerHTML={{ __html: benefit.features }}
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
            <p className="text-white/60 text-center text-xs sm:text-base">
              Chưa có thẻ tín dụng nào
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeCards;
