"use client";
import React, { use, useEffect, useState } from "react";
import { DollarSign, Users, ArrowUp, ArrowDown, Minus } from "lucide-react";
import StartNav from "@/app/components/StartNav";
import LoadingScreen from "@/app/dashboard/pages/ExpenseAnalysist/components/LoadingScreen";

interface Occupancy {
  week1: number | null;
  week2: number | null;
  week3: number | null;
  week4: number | null;
}

interface Event {
  id: number;
  name: string;
  introduction: string | null;
  start_date: string | null;
  end_date: string | null;
  latitude: number | null;
  longitude: number | null;
  thumbnail_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  province_id: number | null;
  province_name: string | null;
}

interface Month {
  month: string;
  occupancy: Occupancy;
  events: Event[];
}

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

  const match = slug.match(/^([A-Za-z]+)(\d+)$/);

  const [dataFetch, setData] = useState<Month | null>(null);
  const [loading, setLoading] = useState(true);
  const month_name = match ? match[1] : "";
  const year = match ? match[2] : "";

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const res = await fetch(`/api/database/get-promotion?month=${slug}`);
        const data = await res.json();

        setData(data);
      } catch (err) {
        console.error("Failed to fetch financial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [slug]);

  console.log(dataFetch);

  if (!slug) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-2xl text-white">Data Not Found</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StartNav />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16 flex-grow">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Header Section with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-lg mb-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              ข้อมูลเดือน {month_name} {year}
            </h1>
            <p className="text-blue-100 text-sm text-center mt-1">
              อัพเดทล่าสุด: 11 พฤษภาคม 2025
            </p>
          </div>

          <div className="mb-6">
            <div className="bg-white p-5 rounded-2xl shadow-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">คำแนะนำโปรโมชั่น</h3>
              </div>

              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {dataFetch &&
                  Object.entries(dataFetch).map(([key, value], index) => {
                    const weekNumber = index + 1;
                    const occupancyRate = value?.occupancy ?? 0;
                    const recommendation = value?.recommendation ?? "-";

                    let recommendationType = "maintain";
                    let priceChange = "";

                    if (occupancyRate < 50) {
                      recommendationType = "decrease";
                      priceChange = "ลดราคา";
                    } else if (occupancyRate >= 70) {
                      recommendationType = "increase";
                      priceChange = "เพิ่มราคา";
                    }

                    return (
                      <div
                        key={weekNumber}
                        className="rounded-xl overflow-hidden shadow-lg m-5 hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-100 flex flex-col h-full transform hover:-translate-y-1 hover:scale-102"
                      >
                        <div className="bg-blue-600 px-5 py-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-white text-lg">
                              สัปดาห์ที่ {weekNumber}
                            </h4>
                            <span className="text-xs font-medium px-2 py-1 bg-blue-500 text-white rounded-full">
                              {key}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex-grow flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-5">
                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center shadow-sm border border-blue-100">
                              <Users className="text-blue-600" size={24} />
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-500">
                                อัตราการเข้าพัก
                              </p>
                              <div className="flex items-center justify-end">
                                <p
                                  className={`text-3xl font-bold ${
                                    occupancyRate < 50
                                      ? "text-red-600"
                                      : occupancyRate >= 70
                                      ? "text-green-600"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {occupancyRate}%
                                </p>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`p-4 rounded-xl ${getRecommendationColor(
                              recommendationType
                            )
                              .split(" ")[0]
                              .replace("text", "bg")}`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`p-2 rounded-full mr-3 bg-white ${
                                  getRecommendationColor(
                                    recommendationType
                                  ).split(" ")[1]
                                }`}
                              >
                                {getRecommendationIcon(recommendationType)}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-800">
                                  {recommendation}
                                </h5>
                                <p
                                  className={`text-sm font-semibold ${
                                    recommendationType === "increase"
                                      ? "text-green-600"
                                      : recommendationType === "decrease"
                                      ? "text-red-600"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {priceChange}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Promotion Guidelines */}
            <div className="bg-white p-5 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">
                  หลักการปรับราคาตามอัตราการเข้าพัก
                </h3>
                <DollarSign className="text-indigo-500" size={18} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                  <div className="flex items-center mb-2">
                    <ArrowDown className="text-red-600 mr-2" size={16} />
                    <h4 className="font-semibold text-red-800">
                      อัตราการเข้าพักต่ำ (0-49%)
                    </h4>
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
                    <h4 className="font-semibold text-blue-800">
                      อัตราการเข้าพักปานกลาง (50-69%)
                    </h4>
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
                    <h4 className="font-semibold text-green-800">
                      อัตราการเข้าพักสูง (70-100%)
                    </h4>
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
