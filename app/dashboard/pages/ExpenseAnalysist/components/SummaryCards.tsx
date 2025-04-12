import React from 'react';
import { Card } from '@/app/components/ui/Card';
import { TrendingUp, TrendingDown, PercentCircle, ArrowUpRight, ArrowDownRight, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { formatNumber, formatPercent } from '../formatters';

interface SummaryMetrics {
  totalRevenue: number;
  totalExpense: number;
  avgRatio: number;
}

interface SummaryCardsProps {
  summaryMetrics: SummaryMetrics;
  period: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summaryMetrics, period }) => {
  const { totalRevenue, totalExpense, avgRatio } = summaryMetrics;

  // สร้างสถานะการแสดงผลที่น่าสนใจยิ่งขึ้น
  const expenseStatus = avgRatio > 0.7 ? 'high' : avgRatio > 0.6 ? 'medium' : 'good';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Revenue Card */}
      <Card className="p-6 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-0 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg mr-4">
            <TrendingUp className="text-white" size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">รายได้{period}</h2>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-blue-700">{formatNumber(totalRevenue)}</p>
              <p className="ml-1 text-blue-500 text-sm">บาท</p>
            </div>
            <div className="mt-2 flex items-center text-xs text-blue-500">
              <ArrowUpRight size={14} className="mr-1" />
              <span>เทียบจากเดือนที่แล้ว</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Expense Card */}
      <Card className="p-6 shadow-lg bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-0 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg shadow-lg mr-4">
            <TrendingDown className="text-white" size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">รายจ่าย{period}</h2>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-red-700">{formatNumber(totalExpense)}</p>
              <p className="ml-1 text-red-500 text-sm">บาท</p>
            </div>
            <div className="mt-2 flex items-center text-xs text-red-500">
              <ArrowDownRight size={14} className="mr-1" />
              <span>ควบคุมค่าใช้จ่าย</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Ratio Card */}
      <Card className={`p-6 shadow-lg bg-gradient-to-br rounded-xl border-0 transition-all duration-300 hover:shadow-xl overflow-hidden
        ${expenseStatus === 'high' ? 'from-orange-50 to-red-50' : 
          expenseStatus === 'medium' ? 'from-yellow-50 to-amber-50' : 
          'from-green-50 to-emerald-50'}`}
      >
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-lg shadow-lg mr-4 bg-gradient-to-br
            ${expenseStatus === 'high' ? 'from-orange-600 to-red-600' : 
              expenseStatus === 'medium' ? 'from-yellow-600 to-amber-600' : 
              'from-green-600 to-emerald-600'}`}
          >
            <PercentCircle className="text-white" size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-1
              ${expenseStatus === 'high' ? 'text-red-600' : 
                expenseStatus === 'medium' ? 'text-amber-600' : 
                'text-green-600'}"
            >อัตราส่วนรายจ่ายต่อรายได้</h2>
            <div className="flex items-baseline">
              <p className={`text-2xl font-bold
                ${expenseStatus === 'high' ? 'text-red-700' : 
                  expenseStatus === 'medium' ? 'text-amber-700' : 
                  'text-green-700'}`}
              >
                {formatPercent(avgRatio)}
              </p>
            </div>
            <div className="mt-2 flex items-center text-xs
              ${expenseStatus === 'high' ? 'text-red-500' : 
                expenseStatus === 'medium' ? 'text-amber-500' : 
                'text-green-500'}"
            >
              {expenseStatus === 'high' ? (
                <>
                  <AlertTriangle size={14} className="mr-1" />
                  <span>สูงกว่าเป้าหมาย</span>
                </>
              ) : expenseStatus === 'medium' ? (
                <>
                  <AlertCircle size={14} className="mr-1" />
                  <span>ใกล้เคียงเป้าหมาย</span>
                </>
              ) : (
                <>
                  <CheckCircle size={14} className="mr-1" />
                  <span>ดีกว่าเป้าหมาย</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SummaryCards;