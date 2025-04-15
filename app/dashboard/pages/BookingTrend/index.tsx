"use client";
import React, { useState } from 'react';
import Head from 'next/head';

import TabSelector from './components/TabSelector';
import SummaryCards from './components/SummaryCards';
import MonthlyTrendChart from './components/MonthlyTrendChart';
import WeeklyTrendChart from './components/WeeklyTrendChart';

import { 
  generateHistoricalData, 
  generateForecastData, 
  generateDailyData, 
  generateWeeklyData,
  generateRevenueData
} from './mockData';

import EventTabs from '@/app/events/page';

const BookingTrend: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'monthly' | 'weekly' | 'heatmap' | 'revenue' | 'promotion'>('monthly');
  
  // Generate data
  const historicalData = generateHistoricalData();
  const forecastData = generateForecastData(historicalData);
  const dailyData = generateDailyData();
  const weeklyData = generateWeeklyData();
  const revenueData = generateRevenueData(forecastData, dailyData);
  
  // Calculate financial statistics
  const totalYearlyRevenue = revenueData.reduce((sum, item) => sum + item.estimatedRevenue, 0);
  const targetYearlyRevenue = revenueData.reduce((sum, item) => sum + (item.target_revenue || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>แดชบอร์ดการจองโรงแรม</title>
        <meta name="description" content="แดชบอร์ดการพยากรณ์การจองและการจัดการรายได้ของโรงแรม" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">อัตราการเข้าพักของโรงแรม</h1>
        
        {/* Tab Buttons */}
        <TabSelector selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        
        {/* Summary Cards */}
        <SummaryCards 
          historicalData={historicalData}
          forecastData={forecastData}
          weeklyData={weeklyData}
          totalYearlyRevenue={totalYearlyRevenue}
          targetYearlyRevenue={targetYearlyRevenue}
        />

  
        
        {/* Monthly Data Tab */}
        {selectedTab === 'monthly' && (
          <div className="space-y-8 mt-8">
            <EventTabs />
            <MonthlyTrendChart data={revenueData} />
          </div>
        )}
        
        {/* Weekly Data Tab */}
        {selectedTab === 'weekly' && (
          <WeeklyTrendChart data={weeklyData} />
        )}


      </div>
    </div>
  );
};

export default BookingTrend;