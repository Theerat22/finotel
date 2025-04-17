import React, { JSX, useState } from 'react';
import { CombinedDataItem } from '../types';
import { Calendar, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface RevenueManagementTableProps {
  data: CombinedDataItem[];
  averageForecastOccupancy: number;
  totalYearlyRevenue: number;
  targetYearlyRevenue: number;
  averageRevPERPercentage: number;
  averageGOPPARPercentage: number;
}

const RevenueManagementTable: React.FC<RevenueManagementTableProps> = ({ 
  data, 
  averageForecastOccupancy, 
  totalYearlyRevenue, 
  targetYearlyRevenue,
  averageRevPERPercentage
}) => {
  const [activeTab, setActiveTab] = useState('high');
  
  // Separate months by occupancy levels
  const highOccupancyMonths = data.filter(item => item.forecastOccupancy >= 70);
  const mediumOccupancyMonths = data.filter(item => item.forecastOccupancy >= 50 && item.forecastOccupancy < 70);
  const lowOccupancyMonths = data.filter(item => item.forecastOccupancy < 50);
  
  const renderPromotionCard = (
    title: string, 
    description: string, 
    type: 'high' | 'medium' | 'low', 
    months: CombinedDataItem[]
  ): JSX.Element => {
    const bgColor = type === 'high' ? 'bg-green-50' : type === 'medium' ? 'bg-amber-50' : 'bg-red-50';
    const borderColor = type === 'high' ? 'border-green-300' : type === 'medium' ? 'border-amber-300' : 'border-red-700';
    const textColor = type === 'high' ? 'text-green-700' : type === 'medium' ? 'text-amber-700' : 'text-red-700';
    
    return (
      <div className={`p-4 rounded-lg border ${borderColor} ${bgColor} shadow-sm`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
          {type === 'high' ? (
            <TrendingUp className="text-green-600" size={20} />
          ) : type === 'medium' ? (
            <AlertCircle className="text-amber-600" size={20} />
          ) : (
            <TrendingDown className="text-red-600" size={20} />
          )}
        </div>
        
        <p className="text-gray-700 mb-4">{description}</p>
        
        <div className="mb-3">
          <h4 className="font-medium text-sm text-gray-700 mb-1">เดือนที่แนะนำ:</h4>
          <div className="flex flex-wrap gap-1">
            {months.map((item, idx) => (
              <span key={idx} className={`${textColor} bg-white px-2 py-1 text-xs rounded-full border ${borderColor} inline-flex items-center gap-1`}>
                <Calendar size={12} />
                {item.month}
              </span>
            ))}
          </div>
        </div>

      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Promotions Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">กลยุทธ์โปรโมชั่นตามช่วงการเข้าพัก</h2>
        
        {/* Tabs */}
        <div className="flex mb-4 border-b">
          <button 
            onClick={() => setActiveTab('high')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'high' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}
          >
            ช่วงคนเยอะ
          </button>
          <button 
            onClick={() => setActiveTab('medium')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'medium' ? 'border-b-2 border-amber-500 text-amber-600' : 'text-gray-500'}`}
          >
            ช่วงปานกลาง
          </button>
          <button 
            onClick={() => setActiveTab('low')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'low' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500'}`}
          >
            ช่วงคนน้อย
          </button>
        </div>
        
        {/* Promotion Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === 'high' && (
            <>
              {renderPromotionCard(
                "เพิ่มราคาห้องพัก",
                "เพิ่มราคาห้องพักขึ้น 15-20% จากราคาปกติในช่วงที่มีอัตราการเข้าพักสูง",
                "high",
                highOccupancyMonths
              )}
              
              {renderPromotionCard(
                "แพ็กเกจราคาพิเศษสำหรับการเข้าพักหลายคืน",
                "เสนอราคาพิเศษสำหรับการเข้าพักตั้งแต่ 3 คืนขึ้นไป แต่ในอัตราที่สูงกว่าช่วงปกติ",
                "high",
                highOccupancyMonths
              )}
              
              {renderPromotionCard(
                "จำกัดการจองขั้นต่ำ",
                "กำหนดการจองขั้นต่ำ 2-3 คืนในช่วงที่มีความต้องการสูง",
                "high",
                highOccupancyMonths
              )}
            </>
          )}
          
          {activeTab === 'medium' && (
            <>
              {renderPromotionCard(
                "ราคาปกติพร้อมสิทธิพิเศษ",
                "รักษาระดับราคาปกติ แต่เพิ่มสิทธิพิเศษ เช่น อาหารเช้าฟรี",
                "medium",
                mediumOccupancyMonths
              )}
              
              {renderPromotionCard(
                "โปรโมชั่นจองล่วงหน้า",
                "ส่วนลด 5-10% สำหรับการจองล่วงหน้าอย่างน้อย 30 วัน",
                "medium",
                mediumOccupancyMonths
              )}
              
              {renderPromotionCard(
                "แพ็กเกจครอบครัว",
                "แพ็กเกจสำหรับครอบครัวที่รวมกิจกรรมสำหรับเด็กและอาหารเช้า",
                "medium",
                mediumOccupancyMonths
              )}
            </>
          )}
          
          {activeTab === 'low' && (
            <>
              {renderPromotionCard(
                "ส่วนลด low season",
                "มอบส่วนลด 20-30% จากราคาปกติในช่วงที่มีอัตราการเข้าพักต่ำ",
                "low",
                lowOccupancyMonths
              )}
              
              {renderPromotionCard(
                "แพ็กเกจพิเศษรวมอาหาร",
                "แพ็กเกจเข้าพักรวมอาหารทุกมื้อในราคาพิเศษ",
                "low",
                lowOccupancyMonths
              )}
              
              {renderPromotionCard(
                "โปรโมชั่นระยะสั้น Flash Sale",
                "จัดโปรโมชั่นลดราคาแบบฉับพลัน 24-48 ชั่วโมงเพื่อกระตุ้นการจอง",
                "low",
                lowOccupancyMonths
              )}
            </>
          )}
        </div>
      </div>

      {/* Original Revenue Management Table */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">รายงานการจัดการราคาห้องพัก</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-2 border">เดือน</th>
                <th className="p-2 border">อัตราการเข้าพัก</th>
                <th className="p-2 border">ราคาเฉลี่ย</th>
                <th className="p-2 border">รายได้ที่คาดการณ์</th>
                <th className="p-2 border">รายได้สูงสุดที่เป็นไปได้</th>
                <th className="p-2 border">RevPAR</th>
                <th className="p-2 border">เป้าหมาย</th>
                <th className="p-2 border">กลยุทธ์</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                let strategy = "";
                let rowClass = "";
                
                if (item.forecastOccupancy >= 70) {
                  rowClass = "bg-green-50";
                } else if (item.forecastOccupancy < 50) {
                  rowClass = "bg-red-50";
                } else {
                  rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                }
                
                if (item.revPERPercentage && item.revPERPercentage > 70) {
                  strategy = "เพิ่มราคาห้องพัก (high RevPAR)";
                } else if (item.revPERPercentage && item.revPERPercentage < 50) {
                  strategy = "เพิ่มการตลาดและโปรโมชั่น";
                } else {
                  strategy = "ตั้งกลยุทธ์ปัจจุบัน";
                }
                
                return (
                  <tr key={index} className={rowClass}>
                    <td className="p-2 border font-medium">{item.month}</td>
                    <td className="p-2 border">{item.forecastOccupancy}%</td>
                    <td className="p-2 border">{item.dynamicPrice.toLocaleString()} บาท</td>
                    <td className="p-2 border">{item.estimatedRevenue.toLocaleString()} บาท</td>
                    <td className="p-2 border">{item.potentialRevenue?.toLocaleString()} บาท</td>
                    <td className="p-2 border">{item.revPER} บาท</td>
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
                <td className="p-2 border">{averageRevPERPercentage} บาท</td>
                <td className="p-2 border">{targetYearlyRevenue.toLocaleString()} บาท</td>
                <td className="p-2 border">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueManagementTable;