

"use client";
import React, { use } from "react";
import {
  DollarSign,
  Users,
  // TrendingUp,
  // Calendar,
  // BarChart3,
  // TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Target
} from "lucide-react";
import StartNav from "@/app/components/StartNav";

interface WeekPromotion {
  weekNumber: number;
  occupancyRate: number;
  recommendation: string;
  recommendationType: "increase" | "decrease" | "maintain";
  priceChange: string;
  isPast: boolean;
  target: number;
  actual?: number;
}

interface Month {
  income: number;
  outcome: number;
  occupancyRate: number;
  event: string[];
  weeklyData: WeekPromotion[];
}

interface MonthData {
  [key: string]: Month;
}

// กำหนดข้อมูลตัวอย่าง
const monthData: MonthData = {
  January2025: { 
    income: 2000, 
    outcome: 0, 
    occupancyRate: 0, 
    event: ["Event 1", "Event 2", "Event 3"],
    weeklyData: [
      { weekNumber: 1, occupancyRate: 30, recommendation: "ลดราคาห้องพัก", recommendationType: "decrease", priceChange: "-15%", isPast: true, target: 40, actual: 38 },
      { weekNumber: 2, occupancyRate: 45, recommendation: "ลดราคาห้องพัก", recommendationType: "decrease", priceChange: "-10%", isPast: true, target: 50, actual: 45 },
      { weekNumber: 3, occupancyRate: 55, recommendation: "รักษาระดับราคา", recommendationType: "maintain", priceChange: "0%", isPast: false, target: 60 },
      { weekNumber: 4, occupancyRate: 60, recommendation: "รักษาระดับราคา", recommendationType: "maintain", priceChange: "0%", isPast: false, target: 70 }
    ]
  },
  February2025: { 
    income: 0, 
    outcome: 0, 
    occupancyRate: 0, 
    event: ["Event 1", "Event 2", "Event 3"],
    weeklyData: [
      { weekNumber: 1, occupancyRate: 45, recommendation: "ลดราคาห้องพัก", recommendationType: "decrease", priceChange: "-10%", isPast: true, target: 50, actual: 48 },
      { weekNumber: 2, occupancyRate: 55, recommendation: "รักษาระดับราคา", recommendationType: "maintain", priceChange: "0%", isPast: true, target: 60, actual: 55 },
      { weekNumber: 3, occupancyRate: 65, recommendation: "รักษาระดับราคา", recommendationType: "maintain", priceChange: "0%", isPast: false, target: 70 },
      { weekNumber: 4, occupancyRate: 70, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+5%", isPast: false, target: 75 }
    ]
  },
  March2025: { 
    income: 0, 
    outcome: 0, 
    occupancyRate: 0, 
    event: ["Event 1", "Event 2", "Event 3"],
    weeklyData: [
      { weekNumber: 1, occupancyRate: 60, recommendation: "รักษาระดับราคา", recommendationType: "maintain", priceChange: "0%", isPast: true, target: 65, actual: 62 },
      { weekNumber: 2, occupancyRate: 70, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+5%", isPast: true, target: 75, actual: 73 },
      { weekNumber: 3, occupancyRate: 75, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+10%", isPast: false, target: 80 },
      { weekNumber: 4, occupancyRate: 80, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+15%", isPast: false, target: 85 }
    ]
  },
  April2025: { 
    income: 0, 
    outcome: 0, 
    occupancyRate: 86, 
    event: ["Event 1", "Event 2", "Event 3"],
    weeklyData: [
      { weekNumber: 1, occupancyRate: 40, recommendation: "ลดราคาห้องพัก", recommendationType: "decrease", priceChange: "-10%", isPast: true, target: 40, actual: 42 },
      { weekNumber: 2, occupancyRate: 50, recommendation: "รักษาระดับราคา", recommendationType: "maintain", priceChange: "0%", isPast: true, target: 50, actual: 53 },
      { weekNumber: 3, occupancyRate: 80, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+15%", isPast: false, target: 85 },
      { weekNumber: 4, occupancyRate: 85, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+20%", isPast: false, target: 90 }
    ]
  },
  May2025: { 
    income: 0, 
    outcome: 0, 
    occupancyRate: 0, 
    event: ["Event 1", "Event 2", "Event 3"],
    weeklyData: [
      { weekNumber: 1, occupancyRate: 55, recommendation: "รักษาระดับราคา", recommendationType: "maintain", priceChange: "0%", isPast: true, target: 60, actual: 58 },
      { weekNumber: 2, occupancyRate: 65, recommendation: "รักษาระดับราคา", recommendationType: "maintain", priceChange: "0%", isPast: false, target: 70 },
      { weekNumber: 3, occupancyRate: 70, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+5%", isPast: false, target: 75 },
      { weekNumber: 4, occupancyRate: 75, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+10%", isPast: false, target: 80 }
    ]
  },
  June2025: { 
    income: 0, 
    outcome: 0, 
    occupancyRate: 0, 
    event: ["Event 1", "Event 2", "Event 3"],
    weeklyData: [
      { weekNumber: 1, occupancyRate: 60, recommendation: "รักษาระดับราคา", recommendationType: "maintain", priceChange: "0%", isPast: false, target: 65 },
      { weekNumber: 2, occupancyRate: 70, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+5%", isPast: false, target: 75 },
      { weekNumber: 3, occupancyRate: 75, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+10%", isPast: false, target: 80 },
      { weekNumber: 4, occupancyRate: 80, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+15%", isPast: false, target: 85 }
    ]
  },
  July2025: { 
    income: 0, 
    outcome: 0, 
    occupancyRate: 0, 
    event: ["Event 1", "Event 2", "Event 3"],
    weeklyData: [
      { weekNumber: 1, occupancyRate: 65, recommendation: "รักษาระดับราคา", recommendationType: "maintain", priceChange: "0%", isPast: false, target: 70 },
      { weekNumber: 2, occupancyRate: 75, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+10%", isPast: false, target: 80 },
      { weekNumber: 3, occupancyRate: 85, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+20%", isPast: false, target: 90 },
      { weekNumber: 4, occupancyRate: 90, recommendation: "เพิ่มราคาห้องพัก", recommendationType: "increase", priceChange: "+25%", isPast: false, target: 95 }
    ]
  },
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

// ฟังก์ชันสำหรับการแสดงสีตามประเภทคำแนะนำ
const getRecommendationColor = (type: string) => {
  switch (type) {
    case "increase":
      return "bg-green-100 text-green-600";
    case "decrease":
      return "bg-red-100 text-red-600";
    case "maintain":
      return "bg-blue-100 text-blue-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

// ฟังก์ชันสำหรับการแสดงไอคอนตามประเภทคำแนะนำ
const getRecommendationIcon = (type: string) => {
  switch (type) {
    case "increase":
      return <ArrowUp size={16} className="text-green-600" />;
    case "decrease":
      return <ArrowDown size={16} className="text-red-600" />;
    case "maintain":
      return <Minus size={16} className="text-blue-600" />;
    default:
      return null;
  }
};

export default function RoomDetails({ params }: PageProps) {
  const { slug } = use(params);
  // const [activeTab, setActiveTab] = useState("promotions"); // "promotions" หรือ "stats"
  
  const month = monthData[slug as keyof typeof monthData];

  const match = slug.match(/^([A-Za-z]+)(\d+)$/);

  const month_name = match ? match[1] : '';
  const year = match ? match[2] : '';

  if (!month) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-2xl text-white">Data Not Found</p>
      </div>
    );
  }

  return (
    <>
    <StartNav />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16 flex-grow">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header Section with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-lg mb-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold text-center">ข้อมูลเดือน {month_name} {year}</h1>
          <p className="text-blue-100 text-sm text-center mt-1">อัพเดทล่าสุด: 7 พฤษภาคม 2025</p>
          
        </div>

          <div className="mb-6">
            <div className="bg-white p-5 rounded-2xl shadow-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">คำแนะนำโปรโมชั่น</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50">
                  {month.weeklyData.map((week) => (
                    <div 
                      key={week.weekNumber} 
                      className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-gray-100"
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-white text-lg">สัปดาห์ที่ {week.weekNumber}</h4>
                          {week.isPast && (
                            <span className="text-xs bg-white bg-opacity-20 text-black px-3 py-1 rounded-full text-center backdrop-blur-sm">
                              ผ่านไปแล้ว
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mr-5 shadow-sm">
                            <Users className="text-blue-600" size={28} />
                          </div>
                          <div className="mt-4 sm:mt-0 text-center sm:text-left">
                            <p className="text-sm font-medium text-gray-500">อัตราการเข้าพัก</p>
                            <p className="text-3xl font-bold text-blue-600">{week.occupancyRate}%</p>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-xl mb-5">
                          <div className="flex items-center">
                            <div className={`px-3 py-1 rounded-full mr-3 ${getRecommendationColor(week.recommendationType)}`}>
                              {getRecommendationIcon(week.recommendationType)}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-800">{week.recommendation}</h5>
                              <p className={`text-sm font-semibold ${
                                week.recommendationType === "increase" ? "text-green-600" : 
                                week.recommendationType === "decrease" ? "text-red-600" : "text-blue-600"
                              }`}>
                                {week.priceChange}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress chart for past weeks */}
                        {week.isPast && week.actual !== undefined && (
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                <Target size={18} className="text-blue-600 mr-2" />
                                <span className="text-sm font-medium text-gray-700">ผลลัพธ์เทียบกับเป้าหมาย</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-700">
                                {week.actual}/{week.target}%
                              </span>
                            </div>
                            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-inner" 
                                style={{ width: `${(week.actual / week.target) * 100}%` }}  
                              ></div>
                            </div>
                            <div className="flex justify-end mt-2">
                              <span className={`text-xs font-medium ${
                                week.actual >= week.target ? "text-green-600" : "text-amber-600"
                              }`}>
                                {week.actual >= week.target ? 
                                  `บรรลุเป้าหมาย (+${week.actual - week.target}%)` : 
                                  `ต่ำกว่าเป้าหมาย (-${week.target - week.actual}%)`
                                }
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Target for future weeks */}
                        {!week.isPast && (
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                <Target size={18} className="text-blue-600 mr-2" />
                                <span className="text-sm font-medium text-gray-700">เป้าหมาย</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-700">
                                {week.target}%
                              </span>
                            </div>
                            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-inner" 
                                style={{ width: `${(week.occupancyRate / week.target) * 100}%` }}  
                              ></div>
                            </div>
                            <div className="flex justify-end mt-2">
                              <span className="text-xs font-medium text-blue-600">
                                ปัจจุบัน {week.occupancyRate}% (เป้าหมาย {week.target}%)
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
            
            {/* Promotion Guidelines */}
            <div className="bg-white p-5 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">หลักการปรับราคาตามอัตราการเข้าพัก</h3>
                <DollarSign className="text-indigo-500" size={18} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                  <div className="flex items-center mb-2">
                    <ArrowDown className="text-red-600 mr-2" size={16} />
                    <h4 className="font-semibold text-red-800">อัตราการเข้าพักต่ำ (0-49%)</h4>
                  </div>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• ลดราคาห้องพัก 10-20%</li>
                    <li>• เพิ่มแพ็คเกจพิเศษ (อาหารเช้าฟรี)</li>
                    <li>• ส่วนลดเมื่อเข้าพักหลายคืน</li>
                    <li>• เพิ่มการโฆษณาบนแพลตฟอร์มออนไลน์</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-2">
                    <Minus className="text-blue-600 mr-2" size={16} />
                    <h4 className="font-semibold text-blue-800">อัตราการเข้าพักปานกลาง (50-69%)</h4>
                  </div>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• รักษาระดับราคาปกติ</li>
                    <li>• เสนอส่วนลดเฉพาะช่วงวันธรรมดา</li>
                    <li>• เพิ่มค่าบริการในวันสุดสัปดาห์</li>
                    <li>• โปรโมชั่นอัพเกรดห้องพัก</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                  <div className="flex items-center mb-2">
                    <ArrowUp className="text-green-600 mr-2" size={16} />
                    <h4 className="font-semibold text-green-800">อัตราการเข้าพักสูง (70-100%)</h4>
                  </div>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• เพิ่มราคาห้องพัก 5-25%</li>
                    <li>• ตั้งขั้นต่ำของจำนวนคืนที่เข้าพัก</li>
                    <li>• เพิ่มค่ามัดจำห้องพัก</li>
                    <li>• ลดระยะเวลาการยกเลิกการจอง</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
    </>
        
  );
}