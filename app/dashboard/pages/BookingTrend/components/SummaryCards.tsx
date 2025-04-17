import React from 'react';
import { HistoricalDataItem, ForecastDataItem, WeeklyDataItem } from '../types';

interface SummaryCardsProps {
  historicalData: HistoricalDataItem[]; // Changed from ForecastDataItem[] to HistoricalDataItem[]
  forecastData: ForecastDataItem[];
  weeklyData: WeeklyDataItem[];
  totalYearlyRevenue: number;
  targetYearlyRevenue: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  historicalData,
  forecastData,
  weeklyData,
  totalYearlyRevenue,
  targetYearlyRevenue
}) => {
  // Calculate summary statistics
  const averageActualOccupancy = parseFloat(
    (historicalData.reduce((sum, item) => sum + item.occupancyRate, 0) / historicalData.length).toFixed(2)
  );
  const averageForecastOccupancy = parseFloat(
    (forecastData.reduce((sum, item) => sum + item.forecastOccupancy, 0) / forecastData.length).toFixed(2)
  );
  const peakMonth = forecastData.reduce(
    (max, item) => (item.forecastOccupancy > max.forecastOccupancy ? item : max),
    forecastData[0]
  );
  const lowMonth = forecastData.reduce(
    (min, item) => (item.forecastOccupancy < min.forecastOccupancy ? item : min),
    forecastData[0]
  );
  const peakDay = weeklyData.reduce(
    (max, item) => (item.occupancyRate > max.occupancyRate ? item : max),
    weeklyData[0]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">สรุปการจอง</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">อัตราการเข้าพักเฉลี่ย (2022):</span>
            <span className="text-lg font-bold text-blue-600">{averageActualOccupancy}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">อัตราการเข้าพักที่คาดการณ์ (2023):</span>
            <span className="text-lg font-bold text-blue-600">{averageForecastOccupancy}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">เดือนที่สูงสุด:</span>
            <span className="text-lg font-bold text-green-600">
              {peakMonth.month} ({peakMonth.forecastOccupancy}%)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">เดือนที่ต่ำสุด:</span>
            <span className="text-lg font-bold text-red-600">
              {lowMonth.month} ({lowMonth.forecastOccupancy}%)
            </span>
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
            <span className="text-lg font-bold">2,500 บาท</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">รายได้ที่คาดการณ์:</span>
            <span className="text-lg font-bold">{(totalYearlyRevenue/1000000).toFixed(2)} ล้านบาท</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">เป้าหมายรายได้:</span>
            <span className="text-lg font-bold text-blue-600">
              {(targetYearlyRevenue/1000000).toFixed(2)} ล้านบาท
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:col-span-2 lg:col-span-1">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">คำแนะนำ</h2>
        <ul className="space-y-1 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>เตรียมพร้อมห้องพักในช่วง {peakMonth.month} (ช่วง High Season)</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>วางแผนโปรโมชั่นสำหรับเดือน {lowMonth.month} เพื่อเพิ่มอัตราการเข้าพัก</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>ตรวจสอบให้มีพนักงานเพียงพอในวัน {peakDay.dayOfWeek} (อัตราการเข้าพักสูงสุด)</span>
          </li>
          {/* <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>เตรียมพร้อมสำหรับเทศกาลสงกรานต์ (13-15 เมษายน)</span>
          </li> */}
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>
              คาดการณ์การเพิ่มขึ้นของอัตราการเข้าพัก: {(averageForecastOccupancy - averageActualOccupancy).toFixed(2)}%
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SummaryCards;