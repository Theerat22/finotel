import React from 'react';
import { ForecastDataItem, CombinedDataItem } from '../types';

interface SummaryCardsProps {
  averageActualOccupancy: number;
  averageForecastOccupancy: number;
  peakMonth: ForecastDataItem;
  lowMonth: ForecastDataItem;
  totalYearlyRevenue: number;
  targetYearlyRevenue: number;
  averageRevPERPercentage: number;
  highestRevPERMonth: CombinedDataItem;
  lowestRevPERMonth: CombinedDataItem;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  averageActualOccupancy,
  averageForecastOccupancy,
  peakMonth,
  lowMonth,
  totalYearlyRevenue,
  targetYearlyRevenue,
  averageRevPERPercentage,
  highestRevPERMonth,
  lowestRevPERMonth
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">ข้อมูล RevPAR</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 tooltip" data-tip="Revenue Per Expected Room">RevPAR เฉลี่ย:</span>
            <span className="text-lg font-bold text-purple-600">{averageRevPERPercentage}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">เดือนที่มี RevPAR สูงสุด:</span>
            <span className="text-lg font-bold text-green-600">
              {highestRevPERMonth.month} ({highestRevPERMonth.revPERPercentage}%)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">เดือนที่มี RevPAR ต่ำสุด:</span>
            <span className="text-lg font-bold text-red-600">
              {lowestRevPERMonth.month} ({lowestRevPERMonth.revPERPercentage}%)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ช่องว่างในการเพิ่มรายได้:</span>
            <span className="text-lg font-bold">
              {(100 - averageRevPERPercentage).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;