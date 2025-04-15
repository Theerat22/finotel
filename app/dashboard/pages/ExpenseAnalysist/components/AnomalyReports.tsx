import React from 'react';
import { AlertTriangle, TrendingUp, ArrowUpCircle } from 'lucide-react';
import { AnomalyReport } from '../index';
import { formatNumber, formatPercent } from '../formatters';
import { Card } from '@/app/components/ui/Card';

interface AnomalyReportsProps {
  anomalyReports: AnomalyReport[];
  noDataMessage?: string;
}

const AnomalyReports: React.FC<AnomalyReportsProps> = ({ 
  anomalyReports,
  noDataMessage = 'ไม่พบความผิดปกติ' 
}) => {
  return (
    <Card className="p-6 shadow-lg bg-white rounded-lg transition-all duration-300 hover:shadow-xl overflow-hidden">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <AlertTriangle className="mr-2 text-red-600" size={20} />
        ช่วงเวลาที่มีรายจ่ายผิดปกติ
      </h2>
      
      {anomalyReports.length > 0 ? (
        <div className="overflow-y-auto max-h-96 pr-2 space-y-6">
          {anomalyReports.map((report, index) => (
            <div key={index} className="rounded-xl overflow-hidden bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 transition-all duration-300 hover:shadow-lg">
              <div className="p-4 bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center">
                <div className="p-2 bg-white bg-opacity-20 rounded-full mr-3">
                  <AlertTriangle className="text-black" size={18} />
                </div>
                <h3 className="font-bold">{report.period} - รายจ่ายผิดปกติ</h3>
              </div>
              
              <div className="p-5">
                {/* Key metrics grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-red-100 text-center">
                    <p className="text-gray-500 text-xs uppercase font-medium mb-1">อัตราส่วนรายจ่าย</p>
                    <p className="font-bold text-red-600 text-xl flex items-center justify-center">
                      <ArrowUpCircle className="text-red-500 mr-1" size={16} />
                      {formatPercent(report.expense_ratio)}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-red-100 text-center">
                    <p className="text-gray-500 text-xs uppercase font-medium mb-1">รายจ่ายรวม</p>
                    <p className="font-bold text-red-600 text-xl">{formatNumber(report.total_expense)}</p>
                  </div>
                </div>
                
                {/* Top categories */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">หมวดหมู่รายจ่ายหลัก</h4>
                  <div className="space-y-3">
                    {report.top_expense_categories.map((category, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-gray-700">{category}</span>
                        <span className="font-medium text-red-600">{formatNumber(report.category_amounts[idx])}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-110 bg-gray-50 rounded-lg border border-gray-100 sm:h-80">
          <div className="p-4 bg-blue-50 rounded-full mb-3">
            <TrendingUp className="text-blue-500" size={28} />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">การเงินปกติ</h3>
          <p className="text-gray-500 text-center max-w-xs">{noDataMessage}</p>
        </div>
      )}
    </Card>
  );
};

export default AnomalyReports;