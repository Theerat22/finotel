import React from 'react';
import { CombinedDataItem } from '../types';

interface RevenueManagementTableProps {
  data: CombinedDataItem[];
  averageForecastOccupancy: number;
  totalYearlyRevenue: number;
  targetYearlyRevenue: number;
  averageRevPERPercentage: number;
}

const RevenueManagementTable: React.FC<RevenueManagementTableProps> = ({ 
  data, 
  averageForecastOccupancy, 
  totalYearlyRevenue, 
  targetYearlyRevenue,
  averageRevPERPercentage
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">รายงานการจัดการรายได้และ RevPER</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-2 border">เดือน</th>
              <th className="p-2 border">อัตราการเข้าพัก</th>
              <th className="p-2 border">ราคาเฉลี่ย</th>
              <th className="p-2 border">รายได้ที่คาดการณ์</th>
              <th className="p-2 border">รายได้สูงสุดที่เป็นไปได้</th>
              <th className="p-2 border">RevPER</th>
              <th className="p-2 border">เป้าหมาย</th>
              <th className="p-2 border">กลยุทธ์</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              let strategy = "";
              
              if (item.revPERPercentage && item.revPERPercentage > 70) {
                strategy = "เพิ่มราคาห้องพัก (high RevPER)";
              } else if (item.revPERPercentage && item.revPERPercentage < 50) {
                strategy = "เพิ่มการตลาดและโปรโมชั่น";
              } else {
                strategy = "รักษากลยุทธ์ปัจจุบัน";
              }
              
              return (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-2 border font-medium">{item.month}</td>
                  <td className="p-2 border">{item.forecastOccupancy}%</td>
                  <td className="p-2 border">{item.dynamicPrice.toLocaleString()} บาท</td>
                  <td className="p-2 border">{item.estimatedRevenue.toLocaleString()} บาท</td>
                  <td className="p-2 border">{item.potentialRevenue?.toLocaleString()} บาท</td>
                  <td className="p-2 border">{item.revPERPercentage}%</td>
                  <td className="p-2 border">{item.target_revenue?.toLocaleString()} บาท</td>
                  <td className="p-2 border">{strategy}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-blue-100 font-bold">
              <td className="p-2 border">รวมทั้งปี</td>
              <td className="p-2 border">{averageForecastOccupancy}%</td>
              <td className="p-2 border">-</td>
              <td className="p-2 border">{totalYearlyRevenue.toLocaleString()} บาท</td>
              <td className="p-2 border">{data.reduce((sum, item) => sum + (item.potentialRevenue || 0), 0).toLocaleString()} บาท</td>
              <td className="p-2 border">{averageRevPERPercentage}%</td>
              <td className="p-2 border">{targetYearlyRevenue.toLocaleString()} บาท</td>
              <td className="p-2 border">-</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default RevenueManagementTable;