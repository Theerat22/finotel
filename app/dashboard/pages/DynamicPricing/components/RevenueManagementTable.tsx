import React, { JSX, useState } from 'react';
import { CombinedDataItem } from '../types';
import { Calendar, TrendingUp, TrendingDown, AlertCircle, DollarSign, Target, Activity, BarChart, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  
  // Separate months by occupancy levels
  const highOccupancyMonths = data.filter(item => item.forecastOccupancy >= 70);
  const mediumOccupancyMonths = data.filter(item => item.forecastOccupancy >= 50 && item.forecastOccupancy < 70);
  const lowOccupancyMonths = data.filter(item => item.forecastOccupancy < 50);
  
  // Helper for color coding
  const getStatusColor = (percentage: number): { bg: string, text: string, border: string } => {
    if (percentage >= 90) return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400' };
    if (percentage >= 70) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' };
    if (percentage >= 50) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' };
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' };
  };
  
  // Helper to get revenue achievement percentage
  // const getRevenuePercentage = (estimated: number, target: number) => {
  //   return target ? Math.round((estimated / target) * 100) : 0;
  // };
  
  const renderPromotionCard = (
    title: string, 
    description: string, 
    type: 'high' | 'medium' | 'low', 
    months: CombinedDataItem[]
  ): JSX.Element => {
    const bgColor = type === 'high' ? 'bg-green-50' : type === 'medium' ? 'bg-amber-50' : 'bg-red-50';
    const borderColor = type === 'high' ? 'border-green-300' : type === 'medium' ? 'border-amber-300' : 'border-red-300';
    const textColor = type === 'high' ? 'text-green-700' : type === 'medium' ? 'text-amber-700' : 'text-red-700';
    
    return (
      <div className={`p-4 rounded-lg border ${borderColor} ${bgColor} shadow-sm hover:shadow-md transition-shadow`}>
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

  // Card view for monthly data
  const renderMonthCard = (item: CombinedDataItem) => {
    // Calculate revenue percentage against target
    // const revenuePercentage = getRevenuePercentage(item.estimatedRevenue, item.target_revenue || 0);
    const { bg, text, border } = getStatusColor(item.forecastOccupancy);
    const revPerPercentageColors = getStatusColor(item.revPERPercentage || 0);
    
    let strategy = "";
    if (item.revPERPercentage && item.revPERPercentage > 70) {
      strategy = "เพิ่มราคาห้องพัก (high RevPAR)";
    } else if (item.revPERPercentage && item.revPERPercentage < 50) {
      strategy = "เพิ่มการตลาดและโปรโมชั่น";
    } else {
      strategy = "ตั้งกลยุทธ์ปัจจุบัน";
    }
    
    return (
      <div className={`${bg} border ${border} rounded-lg shadow p-4`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className={`text-lg font-bold ${text}`}>{item.month}</h3>
          <div className={`px-2 py-1 rounded-full ${bg} ${text} text-xs font-medium border ${border}`}>
            {item.forecastOccupancy}% อัตราการเข้าพัก
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded p-2 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">ราคาเฉลี่ย</div>
            <div className="font-semibold flex items-center">
              <DollarSign size={16} className="text-blue-500 mr-1" />
              {item.dynamicPrice.toLocaleString()} บาท
            </div>
          </div>
          
          <div className="bg-white rounded p-2 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">RevPAR</div>
            <div className="font-semibold flex items-center">
              <Activity size={16} className="text-purple-500 mr-1" />
              {item.revPER} บาท
            </div>
          </div>
          
          <div className="bg-white rounded p-2 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">รายได้ที่คาดการณ์</div>
            <div className="font-semibold flex items-center">
              <BarChart size={16} className="text-green-500 mr-1" />
              {item.estimatedRevenue.toLocaleString()} บาท
            </div>
          </div>
          
          <div className="bg-white rounded p-2 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">เป้าหมาย</div>
            <div className="font-semibold flex items-center">
              <Target size={16} className="text-red-500 mr-1" />
              {item.target_revenue?.toLocaleString()} บาท
            </div>
          </div>
        </div>
        
        {/* <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>ความสำเร็จเป้าหมาย</span>
            <span className={revenuePercentage >= 90 ? 'text-green-600' : revenuePercentage >= 70 ? 'text-amber-600' : 'text-red-600'}>
              {revenuePercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${revenuePercentage >= 90 ? 'bg-green-500' : revenuePercentage >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(revenuePercentage, 100)}%` }}
            />
          </div>
        </div> */}
        
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
          <div className={`${revPerPercentageColors.bg} p-1 rounded-full`}>
            {(item.revPERPercentage || 0) > 70 ? (
              <ArrowUpCircle size={16} className="text-green-600" />
            ) : (
              <ArrowDownCircle size={16} className="text-red-600" />
            )}
          </div>
          <div className="text-sm font-medium">{strategy}</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border border-gray-200 ${
              viewMode === 'cards' 
                ? 'bg-blue-700 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            การ์ด
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border border-gray-200 ${
              viewMode === 'table' 
                ? 'bg-blue-700 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ตาราง
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="text-blue-800 text-sm mb-1">อัตราการเข้าพักเฉลี่ย</div>
          <div className="text-2xl font-bold text-blue-900">{averageForecastOccupancy}%</div>
          <div className="mt-2 text-xs text-blue-600">เฉลี่ยทั้งปี</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
          <div className="text-green-800 text-sm mb-1">รายได้ทั้งปี</div>
          <div className="text-2xl font-bold text-green-900">{totalYearlyRevenue.toLocaleString()} บาท</div>
          <div className="mt-2 text-xs text-green-600">ประมาณการณ์</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm">
          <div className="text-purple-800 text-sm mb-1">เป้าหมายรายได้</div>
          <div className="text-2xl font-bold text-purple-900">{targetYearlyRevenue.toLocaleString()} บาท</div>
          <div className="mt-2 text-xs text-purple-600">เป้าหมายประจำปี</div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="text-amber-800 text-sm mb-1">RevPAR เฉลี่ย</div>
          <div className="text-2xl font-bold text-amber-900">{averageRevPERPercentage} บาท</div>
          <div className="mt-2 text-xs text-amber-600">รายได้ต่อห้องพร้อมขาย</div>
        </div>
      </div>

      {/* Monthly Data View */}
      {viewMode === 'cards' && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">ข้อมูลรายเดือน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => renderMonthCard(item))}
          </div>
        </div>
      )}

      {/* Promotions Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">กลยุทธ์โปรโมชั่นตามช่วงการเข้าพัก</h2>
        
        {/* Tabs */}
        <div className="flex mb-4 border-b">
          <button 
            onClick={() => setActiveTab('high')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'high' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}
          >
            ช่วงคนเยอะ ({highOccupancyMonths.length} เดือน)
          </button>
          <button 
            onClick={() => setActiveTab('medium')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'medium' ? 'border-b-2 border-amber-500 text-amber-600' : 'text-gray-500'}`}
          >
            ช่วงปานกลาง ({mediumOccupancyMonths.length} เดือน)
          </button>
          <button 
            onClick={() => setActiveTab('low')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'low' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500'}`}
          >
            ช่วงคนน้อย ({lowOccupancyMonths.length} เดือน)
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

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">รายงานการจัดการราคาห้องพัก</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2 border text-blue-800">เดือน</th>
                  <th className="p-2 border text-blue-800">อัตราการเข้าพัก</th>
                  <th className="p-2 border text-blue-800">ราคาเฉลี่ย</th>
                  <th className="p-2 border text-blue-800">รายได้ที่คาดการณ์</th>
                  <th className="p-2 border text-blue-800">รายได้สูงสุดที่เป็นไปได้</th>
                  <th className="p-2 border text-blue-800">RevPAR</th>
                  <th className="p-2 border text-blue-800">เป้าหมาย</th>
                  {/* <th className="p-2 border text-blue-800">% บรรลุเป้า</th> */}
                  <th className="p-2 border text-blue-800">กลยุทธ์</th>
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
                  
                  // Calculate target achievement
                  // const targetAchievement = item.target_revenue ? Math.round((item.estimatedRevenue / item.target_revenue) * 100) : 0;
                  // let achievementColor = 'text-red-600';
                  // if (targetAchievement >= 90) achievementColor = 'text-green-600';
                  // else if (targetAchievement >= 70) achievementColor = 'text-amber-600';
                  
                  return (
                    <tr key={index} className={rowClass}>
                      <td className="p-2 border font-medium">{item.month}</td>
                      <td className="p-2 border">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            item.forecastOccupancy >= 70 ? 'bg-green-500' : 
                            item.forecastOccupancy >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}></div>
                          {item.forecastOccupancy}%
                        </div>
                      </td>
                      <td className="p-2 border">{item.dynamicPrice.toLocaleString()} บาท</td>
                      <td className="p-2 border font-medium">{item.estimatedRevenue.toLocaleString()} บาท</td>
                      <td className="p-2 border text-gray-600">{item.potentialRevenue?.toLocaleString()} บาท</td>
                      <td className="p-2 border">{item.revPER} บาท</td>
                      <td className="p-2 border">{item.target_revenue?.toLocaleString()} บาท</td>
                      {/* <td className={`p-2 border font-medium ${achievementColor}`}>
                        {targetAchievement}%
                      </td> */}
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
                  {/* <td className="p-2 border font-medium">
                    {Math.round((totalYearlyRevenue / targetYearlyRevenue) * 100)}%
                  </td> */}
                  <td className="p-2 border">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueManagementTable;