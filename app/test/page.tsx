"use client";
import React, { useState } from "react";
import {
  DollarSign,
  Users,
  TrendingUp,
  // Calendar as CalendarIcon,,
  // Calendar,
  X,
  // MapPin,
  Star,
} from "lucide-react";
import LoadingScreen from "@/app/dashboard/pages/ExpenseAnalysist/components/LoadingScreen";
import {
  format,
  // startOfMonth,
  endOfMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { th } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DayData {
  date: Date;
  occupancyRate: number; // 0-100
  events: string[];
  suggestedPrice: number;
  actualBookings: number;
  maxCapacity: number;
  revenue: number;
}

// จำลองข้อมูลสำหรับแต่ละวัน
const generateMockData = (currentDate: Date): DayData[] => {
  // const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const data: DayData[] = [];
  
  const daysInMonth = end.getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    
    // สร้างข้อมูลจำลองตาม pattern ต่างๆ
    let baseOccupancy = 60;
    const events: string[] = [];
    let priceMultiplier = 1;
    
    // วันหยุดเสาร์-อาทิตย์ มีอัตราการเข้าพักสูงกว่า
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseOccupancy += 20;
      priceMultiplier = 1.3;
    }
    
    // เพิ่ม events พิเศษในบางวัน
    if (day === 14) {
      events.push("วันวาเลนไทน์");
      baseOccupancy += 25;
      priceMultiplier = 1.5;
    } else if (day === 8) {
      events.push("วันสตรีสากล");
      baseOccupancy += 15;
      priceMultiplier = 1.2;
    } else if (day >= 13 && day <= 15) {
      events.push("สงกรานต์");
      baseOccupancy += 30;
      priceMultiplier = 1.8;
    } else if (dayOfWeek === 5) {
      events.push("Happy Friday");
      baseOccupancy += 10;
      priceMultiplier = 1.1;
    }
    
    // เพิ่มความแปรปรวนแบบสุ่ม
    const randomVariation = Math.random() * 30 - 15; // -15 ถึง +15
    const occupancyRate = Math.max(0, Math.min(100, baseOccupancy + randomVariation));
    
    const maxCapacity = 50;
    const actualBookings = Math.round((occupancyRate / 100) * maxCapacity);
    const basePrice = 2000;
    const suggestedPrice = Math.round(basePrice * priceMultiplier);
    const revenue = actualBookings * suggestedPrice;
    
    data.push({
      date,
      occupancyRate,
      events,
      suggestedPrice,
      actualBookings,
      maxCapacity,
      revenue
    });
  }
  
  return data;
};

export default function RoomDetails() {
  const [loading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  
  const mockData = generateMockData(currentDate);
  
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDayData = (day: Date): DayData | undefined => {
    return mockData.find(data => isSameDay(data.date, day));
  };

  const getOccupancyColor = (occupancyRate: number): string => {
    if (occupancyRate >= 80) return "bg-green-100 border-green-300 text-green-800";
    if (occupancyRate >= 60) return "bg-yellow-100 border-yellow-300 text-yellow-800";
    if (occupancyRate >= 40) return "bg-orange-100 border-orange-300 text-orange-800";
    return "bg-red-100 border-red-300 text-red-800";
  };

  const openDayDetails = (dayData: DayData) => {
    setSelectedDay(dayData);
  };

  const MonthlyCalendar = () => {
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const daysInMonth = [];
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      daysInMonth.push(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      );
    }

    const firstDayWeekday = firstDayOfMonth.getDay();

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* วันในสัปดาห์ */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {["อา.", "จ.", "อ.", "พ.", "พฤ.","ศ.", "ส."].map((day) => (
            <div
              key={day}
              className="text-center py-3 font-semibold text-gray-700 text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {/* Empty cells for days before the first day of month */}
          {Array.from({ length: firstDayWeekday }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="h-28 border border-gray-100 bg-gray-50"
            ></div>
          ))}

          {/* Days of the month */}
          {daysInMonth.map((day) => {
            const dayData = getDayData(day);
            const isToday = isSameDay(day, today);
            const occupancyColor = dayData ? getOccupancyColor(dayData.occupancyRate) : "";
            
            return (
              <div
                key={day.toString()}
                className={`h-28 border border-gray-100 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isToday ? "ring-2 ring-blue-400" : ""
                } ${occupancyColor}`}
                onClick={() => dayData && openDayDetails(dayData)}
              >
                <div className={`text-right mb-1 font-medium ${
                  isToday ? "text-blue-600 font-bold" : ""
                }`}>
                  {format(day, "d")}
                </div>
                
                {dayData && (
                  <div className="space-y-1">
                    {/* <div className="text-xs font-semibold">
                      {dayData.occupancyRate.toFixed(0)}%
                    </div> */}
                    {/* <div className="text-xs">
                      ฿{dayData.suggestedPrice.toLocaleString()}
                    </div> */}
                    {/* {dayData.events.length > 0 && (
                      <div className="text-xs truncate">
                        🎉 {dayData.events[0]}
                      </div>
                    )} */}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const closeDayDetails = () => {
    setSelectedDay(null);
  };

  // คำนวณสถิติรวมของเดือน
  const monthlyStats = {
    avgOccupancy: mockData.reduce((sum, day) => sum + day.occupancyRate, 0) / mockData.length,
    totalRevenue: mockData.reduce((sum, day) => sum + day.revenue, 0),
    totalBookings: mockData.reduce((sum, day) => sum + day.actualBookings, 0),
    avgPrice: mockData.reduce((sum, day) => sum + day.suggestedPrice, 0) / mockData.length,
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex-grow">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-lg mb-6 text-white flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-blue-800 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-2xl font-semibold">
              {format(currentDate, "MMMM yyyy", { locale: th })}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-blue-800 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* สถิติรายเดือน */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">อัตราเข้าพักเฉลี่ย</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {monthlyStats.avgOccupancy.toFixed(1)}%
                  </p>
                </div>
                <Users className="text-blue-600" size={24} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">RevPAR</p>
                  <p className="text-2xl font-bold text-green-600">
                    {/* ฿{(monthlyStats.totalRevenue / 1000000).toFixed(1)}M */}
                    ฿ 2,500
                  </p>
                </div>
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          {/* Legend */}
          {/* <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">ความหมายของสี</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-sm text-gray-600">อัตราเข้าพัก 80%+ (สูง)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span className="text-sm text-gray-600">อัตราเข้าพัก 60-79% (ปานกลาง)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                <span className="text-sm text-gray-600">อัตราเข้าพัก 40-59% (ต่ำ)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-sm text-gray-600">อัตราเข้าพัก 40% (ต่ำมาก)</span>
              </div>
            </div>
          </div> */}

          <div className="">
            <MonthlyCalendar />
          </div>

          {/* Day Details Modal */}
          {selectedDay && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">
                    {format(selectedDay.date, "d MMMM yyyy", { locale: th })}
                  </h3>
                  <button
                    onClick={closeDayDetails}
                    className="text-white hover:bg-blue-700 rounded-full p-1 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* อัตราการเข้าพัก */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="text-blue-600" size={20} />
                        <span className="font-medium text-gray-700">อัตราการเข้าพัก</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedDay.occupancyRate >= 80 ? 'bg-green-100 text-green-800' :
                        selectedDay.occupancyRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        selectedDay.occupancyRate >= 40 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedDay.occupancyRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedDay.actualBookings} / {selectedDay.maxCapacity} ห้อง
                    </div>
                  </div>

                  {/* ราคาแนะนำ */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="text-green-600" size={20} />
                        <span className="font-medium text-gray-700">ราคาแนะนำ</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">
                        ฿{selectedDay.suggestedPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      รายได้คาดการณ์: ฿{selectedDay.revenue.toLocaleString()}
                    </div>
                  </div>

                  {/* Events */}
                  {selectedDay.events.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="text-red-500" size={20} />
                        <span className="font-medium text-gray-700">กิจกรรม/เทศกาล</span>
                      </div>
                      <div className="space-y-1">
                        {selectedDay.events.map((event, index) => (
                          <div key={index} className="text-sm text-red-700 bg-red-100 px-2 py-1 rounded">
                            🎉 {event}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* คำแนะนำเพิ่มเติม */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="text-blue-600" size={20} />
                      <span className="font-medium text-gray-700">คำแนะนำ</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      {selectedDay.occupancyRate >= 80 
                        ? "🟢 อัตราเข้าพักสูง แนะนำให้เพิ่มราคาเพื่อเพิ่มรายได้"
                        : selectedDay.occupancyRate >= 60
                        ? "🟡 อัตราเข้าพักปานกลาง ราคาเหมาะสม"
                        : selectedDay.occupancyRate >= 40
                        ? "🟠 อัตราเข้าพักต่ำ ควรพิจารณาลดราคาหรือทำโปรโมชั่น"
                        : "🔴 อัตราเข้าพักต่ำมาก แนะนำลดราคาหรือจัดโปรโมชั่นพิเศษ"
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}