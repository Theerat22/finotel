"use client";
import React, { use } from "react";
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  // AlertCircle,
  TrendingDown,
  BarChart3
  // Info,
  // ChevronRight
} from "lucide-react";
import StartNav from "@/app/components/StartNav";

interface Month {
  income: number;
  outcome: number;
  occupancyRate: number;
  event: string[];
}

interface MonthData {
  [key: string]: Month;
}

const monthData: MonthData = {
  January2025: { income: 2000, outcome: 0, occupancyRate: 0, event: ["Event 1", "Event 2", "Event 3"] },
  February2025: { income: 0, outcome: 0, occupancyRate: 0, event: ["Event 1", "Event 2", "Event 3"] },
  March2025: { income: 0, outcome: 0, occupancyRate: 0, event: ["Event 1", "Event 2", "Event 3"] },
  April2025: { income: 0, outcome: 0, occupancyRate: 86, event: ["Event 1", "Event 2", "Event 3"] }, // ยกตัวอย่างเพิ่มค่า
  May2025: { income: 0, outcome: 0, occupancyRate: 0, event: ["Event 1", "Event 2", "Event 3"] },
  June2025: { income: 0, outcome: 0, occupancyRate: 0, event: ["Event 1", "Event 2", "Event 3"] },
  July2025: { income: 0, outcome: 0, occupancyRate: 0, event: ["Event 1", "Event 2", "Event 3"] },
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function RoomDetails({ params }: PageProps) {
  const { slug } = use(params);
  // const [showMore, setShowMore] = useState(false);
  const month = monthData[slug as keyof typeof monthData];

  const match = slug.match(/^([A-Za-z]+)(\d+)$/);

  const month_name = match ? match[1] : '';
  const year = match ? match[2] : '';

  console.log(month);

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
          <p className="text-blue-100 text-sm text-center mt-1">อัพเดทล่าสุด: 11 พฤษภาคม 2025</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* KPI Cards - In a row on desktop, stacked on mobile */}
          <div className="bg-white p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-700">สถิติหลัก</h3>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">+4.2% จากเดือนก่อน</span>
            </div>
            
            <div className="space-y-4">
              {/* อัตราการเข้าพัก */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Users className="text-blue-600" size={18} />
                  </div>
                  <p className="text-gray-600">อัตราเข้าพัก</p>
                </div>
                <div className="flex items-center">
                  <p className="text-xl font-bold text-blue-600">{month.occupancyRate}%</p>
                  <TrendingUp className="text-green-500 ml-1" size={16} />
                </div>
              </div>
              <div className="h-px bg-gray-100"></div>
              
              {/* RevPAR */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <DollarSign className="text-green-600" size={18} />
                  </div>
                  <p className="text-gray-600">RevPAR</p>
                </div>
                <div className="flex items-center">
                  <p className="text-xl font-bold text-green-600">3,871</p>
                  <TrendingUp className="text-green-500 ml-1" size={16} />
                </div>
              </div>
              <div className="h-px bg-gray-100"></div>
              
              {/* GOPPAR */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <BarChart3 className="text-purple-600" size={18} />
                  </div>
                  <p className="text-gray-600">GOPPAR</p>
                </div>
                <div className="flex items-center">
                  <p className="text-xl font-bold text-purple-600">1,243</p>
                  <TrendingDown className="text-red-500 ml-1" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Events Card */}
          <div className="bg-white p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-700">วันหยุดและเทศกาล</h3>
              <Calendar className="text-red-500" size={18} />
            </div>
            <ul className="space-y-4">
            <li className="flex items-start bg-red-50 p-3 rounded-xl">
                <div className="flex-shrink-0 bg-red-100 p-2 rounded-lg mr-3">
                  <span className="text-red-600 font-bold">6</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">วันจักรี</h3>
                  <p className="text-gray-600 text-sm">6 เมษายน</p>
                </div>
              </li>
              <li className="flex items-start bg-red-50 p-3 rounded-xl">
                <div className="flex-shrink-0 bg-red-100 p-2 rounded-lg mr-3">
                  <span className="text-red-600 font-bold">13</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">สงกรานต์</h3>
                  <p className="text-gray-600 text-sm">13-15 เมษายน</p>
                </div>
              </li>
              <li className="flex items-start bg-blue-50 p-3 rounded-xl">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg mr-3">
                  <span className="text-blue-600 font-bold">13</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">น่าน นันทบุรี สุขสรีปีใหม่เมือง 2568</h3>
                  <p className="text-gray-600 text-sm">13-15 เมษายน</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Financial Stats - Wide card at the bottom */}
        {/* <div className="bg-white p-5 rounded-2xl shadow-lg mb-6">
          <h3 className="font-bold text-gray-700 mb-4">ภาพรวมทางการเงิน</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-3 rounded-xl text-center">
              <p className="text-sm text-gray-600">รายได้รวม</p>
              <p className="text-xl font-bold text-green-600">4.7M</p>
              <p className="text-xs text-green-500">+12% YoY</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl text-center">
              <p className="text-sm text-gray-600">ต้นทุนการดำเนินงาน</p>
              <p className="text-xl font-bold text-blue-600">1.8M</p>
              <p className="text-xs text-red-500">+3% YoY</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl text-center">
              <p className="text-sm text-gray-600">กำไรสุทธิ</p>
              <p className="text-xl font-bold text-purple-600">1.2M</p>
              <p className="text-xs text-green-500">+15% YoY</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-xl text-center">
              <p className="text-sm text-gray-600">อัตรากำไร</p>
              <p className="text-xl font-bold text-indigo-600">25.5%</p>
              <p className="text-xs text-green-500">+2.3% YoY</p>
            </div>
          </div>
        </div> */}

        {/* Footer with subtle branding */}
      </div>
    </div>
    </>
  );
}
