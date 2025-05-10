"use client";
import React, { use, useEffect, useState } from "react";
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  TrendingDown,
  BarChart3,
} from "lucide-react";
import StartNav from "@/app/components/StartNav";
import LoadingScreen from "@/app/dashboard/pages/ExpenseAnalysist/components/LoadingScreen";
import Image from "next/image";
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

export default function RoomDetails({ params }: PageProps) {
  const { slug } = use(params);

  const match = slug.match(/^([A-Za-z]+)(\d+)$/);

  const month_name = match ? match[1] : "";
  const year = match ? match[2] : "";

  const [data, setData] = useState<Month | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const res = await fetch(`/api/database/get-booking?month=${slug}`);
        const data = await res.json();

        setData(data);
        setEvents(data.events);
      } catch (err) {
        console.error("Failed to fetch financial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [slug]);

  const calculateAverageOccupancy = (occupancy: Occupancy): number => {
    const values = Object.values(occupancy).filter(
      (v): v is number => v !== null
    );
    const sum = values.reduce((acc, val) => acc + val, 0);
    return values.length > 0 ? sum / values.length : 0;
  };

  if (!slug) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-2xl text-white">Data Not Found</p>
      </div>
    );
  }

  console.log(data);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StartNav />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16 flex-grow">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-lg mb-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              ข้อมูลเดือน {month_name} {year}
            </h1>
            <p className="text-blue-100 text-sm text-center mt-1">
              อัพเดทล่าสุด: 11 พฤษภาคม 2025
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">สถิติหลัก</h3>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +4.2% จากเดือนก่อน
                </span>
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
                    <p className="text-xl font-bold text-blue-600">
                      {data
                        ? calculateAverageOccupancy(data.occupancy).toFixed(2) +
                          "%"
                        : "-"}
                    </p>
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
                {events.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-start bg-red-50 p-3 rounded-xl"
                  >
                    <Image
                      src={event.thumbnail_url || ""}
                      alt={event.name}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover mr-3"
                    />

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {event.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {event.introduction}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {event.start_date &&
                          new Date(event.start_date).toLocaleString("th-TH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
