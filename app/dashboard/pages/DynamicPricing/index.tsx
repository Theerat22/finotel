"use client";
import React from 'react';
import Head from 'next/head';
import SummaryCards from './components/SummaryCards';
import DynamicPricingChart from './components/DynamicPricingChart';
import RevenueForecastChart from './components/RevenueForecastChart';
import RevenueManagementTable from './components/RevenueManagementTable';
import { 
  generateHistoricalData, 
  generateForecastData, 
  generateDailyData, 
  generateRevenueData,
  calculateSummaryStatistics
} from './mockData';

const DynamicPricing: React.FC = () => {
  // Generate all the required data
  const historicalData = generateHistoricalData();
  const forecastData = generateForecastData(historicalData);
  const dailyData = generateDailyData();
  const revenueData = generateRevenueData(forecastData, dailyData);
  
  // Calculate summary statistics
  const stats = calculateSummaryStatistics(historicalData, forecastData, revenueData);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>แดชบอร์ดการจองโรงแรม</title>
        <meta name="description" content="แดชบอร์ดการพยากรณ์การจองและการจัดการรายได้ของโรงแรม" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">Dynamic Pricing & RevPAR</h1>
        
        {/* Summary Cards Component */}
        <SummaryCards 
          averageActualOccupancy={stats.averageActualOccupancy}
          averageForecastOccupancy={stats.averageForecastOccupancy}
          peakMonth={stats.peakMonth}
          lowMonth={stats.lowMonth}
          totalYearlyRevenue={stats.totalYearlyRevenue}
          targetYearlyRevenue={stats.targetYearlyRevenue}
          averageRevPERPercentage={stats.averageRevPERPercentage}
          highestRevPERMonth={stats.highestRevPERMonth}
          lowestRevPERMonth={stats.lowestRevPERMonth}
        />
        
        <div className="space-y-8">
          {/* Dynamic Pricing Chart Component */}
          <DynamicPricingChart data={revenueData} />
          
          {/* Revenue Forecast Chart Component */}
          <RevenueForecastChart data={revenueData} />
          
          {/* Revenue Management Table Component */}
          <RevenueManagementTable 
            data={revenueData} 
            totalYearlyRevenue={stats.totalYearlyRevenue}
            targetYearlyRevenue={stats.targetYearlyRevenue}
            averageForecastOccupancy={stats.averageForecastOccupancy}
            averageRevPERPercentage={stats.averageRevPERPercentage}
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicPricing;