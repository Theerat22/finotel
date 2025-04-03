import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { AnomalyReport } from '../index';
import { formatNumber, formatPercent } from '../formatters';

interface AnomalyReportsProps {
  anomalyReports: AnomalyReport[];
}

const AnomalyReports: React.FC<AnomalyReportsProps> = ({ anomalyReports }) => {
  return (
    <div className="mb-8">
      <div className="p-6 shadow-lg bg-white rounded-lg transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <AlertTriangle className="mr-4 text-red-600" size={20} />
          ช่วงเวลาที่มีรายจ่ายผิดปกติ
        </h2>
        
        {anomalyReports.length > 0 ? (
          <div className="overflow-y-auto pr-2">
            {anomalyReports.map((report, index) => (
              <div key={index} className="mb-8 rounded-xl shadow-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white overflow-hidden">
                <div className="p-6 md:p-8">
                  {/* Header section with period title */}
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-amber-100 rounded-full mr-4 flex-shrink-0 shadow-sm">
                      <AlertTriangle className="text-amber-600" size={22} />
                    </div>
                    <h3 className="font-bold text-amber-800 text-xl">{report.period}</h3>
                  </div>
                  
                  {/* Key metrics cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 transition-all hover:shadow-md">
                      <p className="text-gray-500 text-sm font-medium mb-1">อัตราส่วนรายจ่ายต่อรายได้</p>
                      <p className="font-bold text-amber-600 text-2xl">{formatPercent(report.expense_ratio)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 transition-all hover:shadow-md">
                      <p className="text-gray-500 text-sm font-medium mb-1">รายจ่ายรวม</p>
                      <p className="font-bold text-red-600 text-2xl">{formatNumber(report.total_expense)} บาท</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-80 md:h-96 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">ไม่พบความผิดปกติ</h3>
              <p className="text-gray-500">รายจ่ายทั้งหมดอยู่ในเกณฑ์ปกติ</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyReports;