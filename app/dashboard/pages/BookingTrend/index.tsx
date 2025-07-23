"use client";
import React, { useState } from "react";
import Head from "next/head";

// import TabSelector from "./components/TabSelector";
// import SummaryCards from "./components/SummaryCards";
import MonthlyTrendChart from "./components/MonthlyTrendChart";
import WeeklyTrendChart from "./components/WeeklyTrendChart";

import {
  // DollarSign,
  // Users,
  TrendingUp,
  // Calendar as CalendarIcon,
  // X,
  // MapPin,
  // Star,
  Calendar
} from "lucide-react";

import {
  generateHistoricalData,
  generateForecastData,
  generateDailyData,
  generateWeeklyData,
  generateRevenueData,
} from "./mockData";

// import EventTabs from "@/app/events/page";

const BookingTrend: React.FC = () => {
  const [selectedTab, ] = useState<
    "monthly" | "weekly" | "heatmap" | "revenue" | "promotion"
  >("monthly");

  // Generate data
  const historicalData = generateHistoricalData();
  const forecastData = generateForecastData(historicalData);
  const dailyData = generateDailyData();
  const weeklyData = generateWeeklyData();
  const revenueData = generateRevenueData(forecastData, dailyData);

  // Calculate financial statistics
  // const totalYearlyRevenue = revenueData.reduce(
  //   (sum, item) => sum + item.estimatedRevenue,
  //   0
  // );
  // const targetYearlyRevenue = revenueData.reduce(
  //   (sum, item) => sum + (item.target_revenue || 0),
  //   0
  // );

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>แดชบอร์ดการจองโรงแรม</title>
        <meta
          name="description"
          content="แดชบอร์ดการพยากรณ์การจองและการจัดการรายได้ของโรงแรม"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-lg mb-6 text-white flex items-center justify-center">
          <h2 className="text-2xl font-semibold text-center">
            Occupancy Comparison
          </h2>
        </div>

        {/* Tab Buttons */}
        {/* <TabSelector selectedTab={selectedTab} setSelectedTab={setSelectedTab} /> */}

        {/* Summary Cards */}
        {/* <SummaryCards 
          historicalData={historicalData}
          forecastData={forecastData}
          weeklyData={weeklyData}
          totalYearlyRevenue={totalYearlyRevenue}
          targetYearlyRevenue={targetYearlyRevenue}
        /> */}

        {/* Monthly Data Tab */}
        {selectedTab === "monthly" && (
          <div className="space-y-8 mt-5">
            <MonthlyTrendChart data={revenueData} />
            {/* <EventTabs /> */}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-400">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                ปี 2024
                </h3>
                <p className="text-gray-600">ข้อมูลจริง</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">RevPAR</p>
                <p className="text-2xl font-bold text-orange-600">
                ฿2,473
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">อัตราเข้าพักเฉลี่ย</p>
                <p className="text-2xl font-bold text-orange-600">
                79.32%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-400">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  ปี 2024
                </h3>
                <p className="text-gray-600">ข้อมูลคาดการณ์</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">RevPAR</p>
                <p className="text-2xl font-bold text-blue-600">
                  ฿2536
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">อัตราเข้าพักเฉลี่ย</p>
                <p className="text-2xl font-bold text-blue-600">
                81.32%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Data Tab */}
        {selectedTab === "weekly" && <WeeklyTrendChart data={weeklyData} />}
      </div>
    </div>
  );
};

export default BookingTrend;
