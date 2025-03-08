"use client";
import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart 
} from 'recharts';
import Head from 'next/head';

interface HistoricalDataItem {
  month: string;
  monthIndex: number;
  actualBooking: number;
  occupancyRate: number;
}

interface ForecastDataItem extends HistoricalDataItem {
  forecastBooking: number;
  forecastOccupancy: number;
  yhat_lower: number;
  yhat_upper: number;
}

interface CombinedDataItem {
  month: string;
  actualBooking: number;
  forecastBooking: number;
  actualOccupancy: number;
  forecastOccupancy: number;
  dynamicPrice: number;
  estimatedRevenue: number;
  target_revenue?: number;
}

interface DailyDataItem {
  day: number;
  month: number;
  occupancyRate: number;
  bookings: number;
  dynamicPrice: number;
  is_holiday: boolean;
  holiday_name?: string;
  is_weekend: boolean;
  is_high_season: boolean;
}

interface WeeklyDataItem {
  dayOfWeek: string;
  bookings: number;
  occupancyRate: number;
}

interface PromotionPlanItem {
  month: string;
  occupancyRate: number;
  promotionType: string;
  discountPercentage: number;
  estimatedBookingIncrease: number;
}

// Generate data functions
const generateHistoricalData = (): HistoricalDataItem[] => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return months.map((month, index) => {
    // Higher bookings during Songkran (April) and winter months
    let baseBooking = 4.5;
    if (month === 'April') baseBooking = 6.2; // Songkran
    else if (['November', 'December', 'January'].includes(month)) baseBooking = 5.8; // High season
    else if (['July', 'August'].includes(month)) baseBooking = 3.2; // Low season
    
    const booking = baseBooking + Math.random() * 0.8;
    return {
      month,
      monthIndex: index,
      actualBooking: parseFloat(booking.toFixed(2)),
      occupancyRate: parseFloat((booking / 8 * 100).toFixed(2))
    };
  });
};

const generateForecastData = (historicalData: HistoricalDataItem[]): ForecastDataItem[] => {
  return historicalData.map(item => {
    // Forecast is similar to historical data but with some growth and variation
    const forecastGrowth = 1.05 + (Math.random() * 0.2);
    const forecastBooking = Math.min(8, item.actualBooking * forecastGrowth);
    
    return {
      ...item,
      forecastBooking: parseFloat(forecastBooking.toFixed(2)),
      forecastOccupancy: parseFloat((forecastBooking / 8 * 100).toFixed(2)),
      yhat_lower: parseFloat((forecastBooking * 0.9).toFixed(2)),
      yhat_upper: parseFloat((forecastBooking * 1.1).toFixed(2))
    };
  });
};

// Calculate dynamic price based on factors
const calculateDynamicPrice = (
  basePrice: number, 
  isHighSeason: boolean, 
  isWeekend: boolean, 
  isHoliday: boolean, 
  occupancyRate: number
): number => {
  let price = basePrice;
  
  // Adjust price based on season
  if (isHighSeason) {
    price *= 1.3; // Increase price by 30% during high season
  }
  
  // Adjust price based on weekend
  if (isWeekend) {
    price *= 1.15; // Increase price by 15% on weekends
  }
  
  // Adjust price based on holidays
  if (isHoliday) {
    price *= 1.4; // Increase price by 40% on holidays
  }
  
  // Adjust price based on booking rate (Demand-based pricing)
  if (occupancyRate > 80) {
    price *= 1.25; // Increase price by 25% when booking rate is very high
  } else if (occupancyRate > 60) {
    price *= 1.15; // Increase price by 15% when booking rate is high
  } else if (occupancyRate < 30) {
    price *= 0.85; // Decrease price by 15% when booking rate is low
  } else if (occupancyRate < 15) {
    price *= 0.75; // Decrease price by 25% when booking rate is very low
  }
  
  return Math.round(price);
};

// Generate daily data for heatmap
const generateDailyData = (): DailyDataItem[] => {
  const basePrice = 2500; // THB per room
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  const dailyData: DailyDataItem[] = [];
  
  // Thai holidays
  const thaiHolidays: Record<string, string> = {
    '1-1': 'New Year\'s Day',
    '4-13': 'Songkran',
    '4-14': 'Songkran',
    '4-15': 'Songkran',
    '5-1': 'Labor Day',
    '5-4': 'Coronation Day',
    '6-3': 'Queen\'s Birthday',
    '7-28': 'King\'s Birthday',
    '8-12': 'Mother\'s Day',
    '10-13': 'King Rama IX Memorial Day',
    '12-5': 'Father\'s Day',
    '12-10': 'Constitution Day',
    '12-31': 'New Year\'s Eve'
  };
  
  months.forEach(month => {
    let maxDays = 31;
    if ([4, 6, 9, 11].includes(month)) maxDays = 30;
    else if (month === 2) maxDays = 28;
    
    days.forEach(day => {
      if (day <= maxDays) {
        let baseOccupancy = 50;
        
        const dayOfWeek = (day % 7);
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const weekendEffect = isWeekend ? 15 : 0;
        
        // Check if it's a holiday
        const dateKey = `${month}-${day}`;
        const isHoliday = dateKey in thaiHolidays;
        const holidayName = thaiHolidays[dateKey];
        
        // Determine high season
        const isHighSeason = [12, 1, 2, 4].includes(month);
        
        // Seasonal effects
        let seasonalEffect = 0;
        if (month === 4 && day >= 13 && day <= 15) seasonalEffect = 40; // Songkran
        else if ([11, 12, 1].includes(month)) seasonalEffect = 20; // High season
        else if ([7, 8].includes(month)) seasonalEffect = -15; // Low season
        
        // Random variation
        const randomEffect = Math.random() * 10 - 5;
        
        // Calculate final occupancy rate
        let occupancyRate = baseOccupancy + weekendEffect + seasonalEffect + randomEffect;
        occupancyRate = Math.min(100, Math.max(0, occupancyRate));
        
        // Calculate bookings based on occupancy
        const bookings = (occupancyRate / 100 * 8);
        
        // Calculate dynamic price
        const dynamicPrice = calculateDynamicPrice(
          basePrice, 
          isHighSeason, 
          isWeekend, 
          isHoliday, 
          occupancyRate
        );
        
        dailyData.push({
          day,
          month,
          occupancyRate: parseFloat(occupancyRate.toFixed(2)),
          bookings: parseFloat(bookings.toFixed(2)),
          dynamicPrice,
          is_holiday: isHoliday,
          holiday_name: holidayName,
          is_weekend: isWeekend,
          is_high_season: isHighSeason
        });
      }
    });
  });
  
  return dailyData;
};

// Generate weekly data
const generateWeeklyData = (): WeeklyDataItem[] => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return daysOfWeek.map((day, index) => {
    // Weekend has higher occupancy
    let baseBooking = 4.5;
    if (day === 'Saturday') baseBooking = 6.8;
    else if (day === 'Friday' || day === 'Sunday') baseBooking = 6.2;
    
    const booking = baseBooking + Math.random() * 0.5;
    return {
      dayOfWeek: day,
      bookings: parseFloat(booking.toFixed(2)),
      occupancyRate: parseFloat((booking / 8 * 100).toFixed(2))
    };
  });
};

// Generate promotion plan data
const generatePromotionPlan = (forecastData: ForecastDataItem[]): PromotionPlanItem[] => {
  // Filter data for months with low booking rates
  const lowOccupancyMonths = forecastData.filter(item => item.forecastOccupancy < 40);
  const numMonths = lowOccupancyMonths.length;

  if (numMonths === 0) return [];

  // Create promotion plan
  const promotionTypes = ['Early Bird Discount', 'Stay 3 Pay 2', 'Free Breakfast', 'Free Airport Transfer'];
  const discountPercentages = [15, 33, 10, 5];
  const bookingIncreases = [20, 25, 15, 10];

  return lowOccupancyMonths.map((item, index) => {
    const typeIndex = index % 4;
    return {
      month: item.month,
      occupancyRate: item.forecastOccupancy,
      promotionType: promotionTypes[typeIndex],
      discountPercentage: discountPercentages[typeIndex],
      estimatedBookingIncrease: bookingIncreases[typeIndex]
    };
  });
};

// Generate revenue data
const generateRevenueData = (
  forecastData: ForecastDataItem[],
  dailyData: DailyDataItem[]
): CombinedDataItem[] => {
  const basePrice = 3000; // THB per room
  
  // Calculate monthly data
  const monthlyData = forecastData.map((item) => {
    // Get all daily data for this month
    const monthDailyData = dailyData.filter(d => d.month === item.monthIndex + 1);
    
    // Calculate average price for the month
    const avgPrice = monthDailyData.reduce((sum, d) => sum + d.dynamicPrice, 0) / monthDailyData.length;
    
    // Calculate estimated revenue
    const estimatedRevenue = item.forecastBooking * avgPrice * 30; // Approximate month length
    
    return {
      month: item.month,
      actualBooking: item.actualBooking,
      forecastBooking: item.forecastBooking,
      actualOccupancy: item.occupancyRate,
      forecastOccupancy: item.forecastOccupancy,
      dynamicPrice: Math.round(avgPrice),
      estimatedRevenue: Math.round(estimatedRevenue)
    };
  });
  
  // Calculate total yearly revenue
  const totalYearlyRevenue = monthlyData.reduce((sum, item) => sum + item.estimatedRevenue, 0);
  
  // Set target revenue (10% higher than projected)
  const targetYearlyRevenue = totalYearlyRevenue * 1.1;
  
  // Add revenue targets based on the proportion
  return monthlyData.map(item => {
    const revenueProportion = item.estimatedRevenue / totalYearlyRevenue;
    return {
      ...item,
      target_revenue: Math.round(revenueProportion * targetYearlyRevenue)
    };
  });
};

const HotelFinancialForecast: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'monthly' | 'weekly' | 'heatmap' | 'revenue' | 'promotion'>('monthly');
  
  // Generate data
  const historicalData = generateHistoricalData();
  const forecastData = generateForecastData(historicalData);
  const dailyData = generateDailyData();
  const weeklyData = generateWeeklyData();
  const promotionPlan = generatePromotionPlan(forecastData);
  const revenueData = generateRevenueData(forecastData, dailyData);
  
  // Calculate summary statistics
  const averageActualOccupancy = parseFloat((historicalData.reduce((sum, item) => sum + item.occupancyRate, 0) / historicalData.length).toFixed(2));
  const averageForecastOccupancy = parseFloat((forecastData.reduce((sum, item) => sum + item.forecastOccupancy, 0) / forecastData.length).toFixed(2));
  const peakMonth = forecastData.reduce((max, item) => item.forecastOccupancy > max.forecastOccupancy ? item : max, forecastData[0]);
  const lowMonth = forecastData.reduce((min, item) => item.forecastOccupancy < min.forecastOccupancy ? item : min, forecastData[0]);
  const peakDay = weeklyData.reduce((max, item) => item.occupancyRate > max.occupancyRate ? item : max, weeklyData[0]);
  
  // Calculate financial statistics
  const totalYearlyRevenue = revenueData.reduce((sum, item) => sum + item.estimatedRevenue, 0);
  const targetYearlyRevenue = revenueData.reduce((sum, item) => sum + (item.target_revenue || 0), 0);
  
  // Month names in Thai (abbreviated)
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>แดชบอร์ดการจองโรงแรม</title>
        <meta name="description" content="แดชบอร์ดการพยากรณ์การจองและการจัดการรายได้ของโรงแรม" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">แดชบอร์ดการจองโรงแรม</h1>
        
        {/* ปุ่มแท็บ */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          <button 
            className={`px-4 py-2 rounded-lg ${selectedTab === 'monthly' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedTab('monthly')}
          >
            ข้อมูลรายเดือน
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${selectedTab === 'weekly' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedTab('weekly')}
          >
            แนวโน้มรายสัปดาห์
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${selectedTab === 'heatmap' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedTab('heatmap')}
          >
            แผนภูมิความร้อนรายวัน
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${selectedTab === 'revenue' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedTab('revenue')}
          >
            แผนรายได้
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${selectedTab === 'promotion' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedTab('promotion')}
          >
            แผนโปรโมชั่น
          </button>
        </div>
        
        {/* การ์ดสรุป */}
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">สรุปการจอง</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">อัตราการเข้าพักเฉลี่ย (2022):</span>
                <span className="text-lg font-bold">{averageActualOccupancy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">อัตราการเข้าพักที่คาดการณ์ (2023):</span>
                <span className="text-lg font-bold text-blue-600">{averageForecastOccupancy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">เดือนที่สูงสุด:</span>
                <span className="text-lg font-bold text-green-600">{peakMonth.month} ({peakMonth.forecastOccupancy}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">เดือนที่ต่ำสุด:</span>
                <span className="text-lg font-bold text-red-600">{lowMonth.month} ({lowMonth.forecastOccupancy}%)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">ภาพรวมการเงิน</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">จำนวนห้องทั้งหมด:</span>
                <span className="text-lg font-bold">8 ห้อง</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ราคาพื้นฐาน:</span>
                <span className="text-lg font-bold">3,000 บาท</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">รายได้ที่คาดการณ์:</span>
                <span className="text-lg font-bold">{(totalYearlyRevenue/1000000).toFixed(2)} ล้านบาท</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">เป้าหมายรายได้:</span>
                <span className="text-lg font-bold text-blue-600">{(targetYearlyRevenue/1000000).toFixed(2)} ล้านบาท</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 md:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">คำแนะนำ</h2>
            <ul className="space-y-1 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>เพิ่มราคาห้องในช่วง {peakMonth.month} (ช่วงฤดูสูง)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>วางแผนโปรโมชั่นสำหรับเดือน {lowMonth.month} เพื่อเพิ่มอัตราการเข้าพัก</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>ตรวจสอบให้มีพนักงานเพียงพอในวัน {peakDay.dayOfWeek} (อัตราการเข้าพักสูงสุด)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>เตรียมพร้อมสำหรับเทศกาลสงกรานต์ (13-15 เมษายน)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>คาดการณ์การเพิ่มขึ้นของอัตราการเข้าพัก: {(averageForecastOccupancy - averageActualOccupancy).toFixed(2)}%</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* แท็บข้อมูลรายเดือน */}
        {selectedTab === 'monthly' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">การเปรียบเทียบการจองรายเดือน</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 8]} />
                  <Tooltip formatter={(value) => [`${value}`, 'ห้อง']} />
                  <Legend />
                  <Bar dataKey="actualBooking" name="2022 (จริง)" fill="#8884d8" />
                  <Bar dataKey="forecastBooking" name="2023 (คาดการณ์)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">อัตราการเข้าพักรายเดือน (%)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'อัตราการเข้าพัก']} />
                  <Legend />
                  <Bar dataKey="actualOccupancy" name="2022 (จริง)" fill="#8884d8" />
                  <Bar dataKey="forecastOccupancy" name="2023 (คาดการณ์)" fill="#82ca9d" />
                  <Line type="monotone" dataKey="forecastOccupancy" name="แนวโน้ม 2023" stroke="#ff7300" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* แท็บข้อมูลรายสัปดาห์ */}
        {selectedTab === 'weekly' && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 text-center">รูปแบบการเข้าพักรายสัปดาห์</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dayOfWeek" />
                <YAxis yAxisId="left" orientation="left" domain={[0, 8]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="bookings" name="จำนวนห้องที่จองเฉลี่ย" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="occupancyRate" name="อัตราการเข้าพัก (%)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-700 mb-2">กลยุทธ์วันหยุดสุดสัปดาห์</h3>
                <p className="text-gray-700">วันหยุดสุดสัปดาห์มีอัตราการเข้าพักสูงกว่าอย่างมีนัยสำคัญ ควรพิจารณาใช้นโยบายเข้าพักขั้นต่ำ 2 คืนในวันหยุดสุดสัปดาห์เพื่อเพิ่มรายได้ให้สูงสุด</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-700 mb-2">โปรโมชั่นวันธรรมดา</h3>
                <p className="text-gray-700">มุ่งเน้นกลุ่มนักเดินทางเพื่อธุรกิจด้วยแพ็คเกจพิเศษสำหรับวันธรรมดาและอัตราสำหรับบริษัท เพื่อเพิ่มอัตราการเข้าพักช่วงกลางสัปดาห์</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-700 mb-2">แผนจัดการพนักงาน</h3>
                <p className="text-gray-700">จัดตารางพนักงานให้มากขึ้นในวัน{peakDay.dayOfWeek} และลดจำนวนพนักงานในวันที่มีผู้เข้าพักน้อย เพื่อปรับต้นทุนการดำเนินงานให้เหมาะสม</p>
              </div>
            </div>
          </div>
        )}
        
        {/* แท็บแผนภูมิความร้อน */}
        {selectedTab === 'heatmap' && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 text-center">การพยากรณ์อัตราการเข้าพักรายวันสำหรับปี 2023</h2>
            
            {/* สัญลักษณ์สี */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="text-center">
                    <div className="w-6 h-4 bg-blue-100"></div>
                    <div className="text-xs">0-20%</div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-4 bg-blue-200"></div>
                    <div className="text-xs">20-40%</div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-4 bg-blue-300"></div>
                    <div className="text-xs">40-60%</div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-4 bg-blue-400"></div>
                    <div className="text-xs">60-80%</div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-4 bg-blue-600"></div>
                    <div className="text-xs">80-100%</div>
                  </div>
                </div>
                <div className="ml-2 text-sm">อัตราการเข้าพัก</div>
              </div>
            </div>
            
            {/* แผนภูมิความร้อนแบบตาราง */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-1 border text-center">วัน/เดือน</th>
                    {thaiMonths.map((month, i) => (
                      <th key={i} className="p-1 border text-center w-8">{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 31 }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    return (
                      <tr key={day}>
                        <td className="p-1 border text-center font-medium">{day}</td>
                        {Array.from({ length: 12 }).map((_, monthIndex) => {
                          const month = monthIndex + 1;
                          const data = dailyData.find(d => d.day === day && d.month === month);
                          if (!data) {
                            return <td key={month} className="p-1 border"></td>;
                          }
                          
                          let bgColorClass = "bg-blue-100";
                          if (data.occupancyRate >= 80) bgColorClass = "bg-blue-600";
                          else if (data.occupancyRate >= 60) bgColorClass = "bg-blue-400";
                          else if (data.occupancyRate >= 40) bgColorClass = "bg-blue-300";
                          else if (data.occupancyRate >= 20) bgColorClass = "bg-blue-200";
                          
                          let textColorClass = data.occupancyRate >= 60 ? "text-white" : "text-gray-800";
                          
                          // เพิ่มสัญลักษณ์สำหรับวันหยุด และวันหยุดสุดสัปดาห์
                          let symbol = '';
                          if (data.is_holiday) symbol += '🎉';
                          if (data.is_weekend) symbol += '🔵';
                          if (data.is_high_season) symbol += '⭐';
                          
                          return (
                            <td 
                              key={month} 
                              className={`p-1 border text-center ${bgColorClass} ${textColorClass}`}
                              title={`${data.occupancyRate.toFixed(1)}% | ${data.dynamicPrice} บาท${data.is_holiday ? ' | ' + data.holiday_name : ''}`}
                            >
                              {data.occupancyRate.toFixed(0)}{symbol}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg col-span-1 md:col-span-3">
                <h3 className="font-semibold text-blue-700 mb-2">คำอธิบายสัญลักษณ์</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">🎉</span>
                    <span className="text-gray-700">วันหยุดไทย</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">🔵</span>
                    <span className="text-gray-700">วันหยุดสุดสัปดาห์</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">⭐</span>
                    <span className="text-gray-700">ฤดูกาลท่องเที่ยวสูง</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* แท็บรายได้ */}
        {selectedTab === 'revenue' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">การพยากรณ์รายได้รายเดือน (บาท)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} บาท`, 'รายได้']} />
                  <Legend />
                  <Bar dataKey="estimatedRevenue" name="รายได้ที่คาดการณ์" fill="#8884d8" />
                  <Line type="monotone" dataKey="target_revenue" name="เป้าหมายรายได้" stroke="#ff7300" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">กลยุทธ์การกำหนดราคาแบบไดนามิก</h2>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="dynamicPrice" name="ราคาเฉลี่ย (บาท)" fill="#8884d8" />
                  <Line yAxisId="right" type="monotone" dataKey="forecastOccupancy" name="อัตราการเข้าพัก (%)" stroke="#ff7300" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">รายงานการจัดการรายได้</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="p-2 border">เดือน</th>
                      <th className="p-2 border">อัตราการเข้าพัก</th>
                      <th className="p-2 border">ราคาเฉลี่ย</th>
                      <th className="p-2 border">รายได้ที่คาดการณ์</th>
                      <th className="p-2 border">เป้าหมาย</th>
                      <th className="p-2 border">ช่องว่าง</th>
                      <th className="p-2 border">กลยุทธ์</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map((item, index) => {
                      const gap = (item.target_revenue || 0) - item.estimatedRevenue;
                      let strategy = "";
                      
                      if (gap > 0) {
                        if (item.forecastOccupancy < 50) {
                          strategy = "เพิ่มอัตราการเข้าพักด้วยโปรโมชั่น";
                        } else {
                          strategy = "เพิ่มราคาห้องพัก";
                        }
                      } else {
                        strategy = "รักษากลยุทธ์ปัจจุบัน";
                      }
                      
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-2 border font-medium">{item.month}</td>
                          <td className="p-2 border">{item.forecastOccupancy}%</td>
                          <td className="p-2 border">{item.dynamicPrice.toLocaleString()} บาท</td>
                          <td className="p-2 border">{item.estimatedRevenue.toLocaleString()} บาท</td>
                          <td className="p-2 border">{(item.target_revenue || 0).toLocaleString()} บาท</td>
                          <td className={`p-2 border ${gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {gap > 0 ? '-' : '+'}{Math.abs(gap).toLocaleString()} บาท
                          </td>
                          <td className="p-2 border text-sm">{strategy}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-100 font-bold">
                      <td className="p-2 border">รวม</td>
                      <td className="p-2 border">{averageForecastOccupancy}%</td>
                      <td className="p-2 border">-</td>
                      <td className="p-2 border">{totalYearlyRevenue.toLocaleString()} บาท</td>
                      <td className="p-2 border">{targetYearlyRevenue.toLocaleString()} บาท</td>
                      <td className="p-2 border">
                        {(targetYearlyRevenue - totalYearlyRevenue > 0 ? '-' : '+')}{Math.abs(targetYearlyRevenue - totalYearlyRevenue).toLocaleString()} บาท
                      </td>
                      <td className="p-2 border">-</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* แท็บโปรโมชั่น */}
        {selectedTab === 'promotion' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">แผนโปรโมชั่นสำหรับเดือนที่มีอัตราการเข้าพักต่ำ</h2>
              
              {promotionPlan.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="p-2 border">เดือน</th>
                        <th className="p-2 border">อัตราการเข้าพักปัจจุบัน</th>
                        <th className="p-2 border">ประเภทโปรโมชั่น</th>
                        <th className="p-2 border">ส่วนลด</th>
                        <th className="p-2 border">การเพิ่มขึ้นที่คาดหวัง</th>
                        <th className="p-2 border">อัตราการเข้าพักที่คาดการณ์</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promotionPlan.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-2 border font-medium">{item.month}</td>
                          <td className="p-2 border">{item.occupancyRate.toFixed(1)}%</td>
                          <td className="p-2 border">{item.promotionType}</td>
                          <td className="p-2 border">{item.discountPercentage}%</td>
                          <td className="p-2 border">+{item.estimatedBookingIncrease}%</td>
                          <td className="p-2 border font-bold text-blue-600">
                            {(item.occupancyRate + (item.occupancyRate * item.estimatedBookingIncrease / 100)).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  ไม่จำเป็นต้องมีแผนโปรโมชั่น - ทุกเดือนมีการคาดการณ์อัตราการเข้าพักที่เพียงพอแล้ว
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4">Marketing Channels</h2>
                <div className="space-y-4">
                  <div className="flex items-center p-3 border rounded-lg hover:bg-blue-50">
                    <div className="mr-3 text-blue-500 text-2xl">🌐</div>
                    <div>
                      <h3 className="font-medium">Online Travel Agencies (OTAs)</h3>
                      <p className="text-sm text-gray-600">Booking.com, Agoda, Expedia</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg hover:bg-blue-50">
                    <div className="mr-3 text-blue-500 text-2xl">📱</div>
                    <div>
                      <h3 className="font-medium">Social Media</h3>
                      <p className="text-sm text-gray-600">Facebook, Instagram, LINE</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg hover:bg-blue-50">
                    <div className="mr-3 text-blue-500 text-2xl">✉️</div>
                    <div>
                      <h3 className="font-medium">Email Marketing</h3>
                      <p className="text-sm text-gray-600">Past guests, Newsletter subscribers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg hover:bg-blue-50">
                    <div className="mr-3 text-blue-500 text-2xl">🤝</div>
                    <div>
                      <h3 className="font-medium">Partnerships</h3>
                      <p className="text-sm text-gray-600">Local attractions, Tour operators</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4">Promotion Ideas</h2>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg hover:bg-green-50">
                    <h3 className="font-medium text-green-700">Early Bird Discount</h3>
                    <p className="text-sm text-gray-600">15% off when booking at least 60 days in advance</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg hover:bg-green-50">
                    <h3 className="font-medium text-green-700">Stay 3 Pay 2</h3>
                    <p className="text-sm text-gray-600">Free night when booking 3 nights or more</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg hover:bg-green-50">
                    <h3 className="font-medium text-green-700">Package Deals</h3>
                    <p className="text-sm text-gray-600">Room + breakfast + airport transfer bundle</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg hover:bg-green-50">
                    <h3 className="font-medium text-green-700">Flash Sales</h3>
                    <p className="text-sm text-gray-600">Limited-time offers with significant discounts</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg hover:bg-green-50">
                    <h3 className="font-medium text-green-700">Loyalty Program</h3>
                    <p className="text-sm text-gray-600">Reward points and special perks for repeat guests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Hotel Booking Dashboard © 2023 | Data updated on: March 1, 2023</p>
        </footer>
      </div>
    </div>
  );
};

export default HotelFinancialForecast;
