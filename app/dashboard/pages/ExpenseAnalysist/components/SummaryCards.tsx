import React from 'react';
import { Card } from '@/app/components/ui/Card';
import { TrendingUp, TrendingDown, PercentCircle } from 'lucide-react';
import { formatNumber, formatPercent } from '../formatters';

interface SummaryMetrics {
  totalRevenue: number;
  totalExpense: number;
  avgRatio: number;
}

interface SummaryCardsProps {
  summaryMetrics: SummaryMetrics;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summaryMetrics }) => {
  const { totalRevenue, totalExpense, avgRatio } = summaryMetrics;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-6 shadow-lg bg-white border-l-4 border-blue-500 rounded-lg">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <TrendingUp className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">รายได้รวมทั้งปี</h2>
            <p className="text-2xl font-bold text-blue-600">{formatNumber(totalRevenue)} บาท</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 shadow-lg bg-white border-l-4 border-red-500 rounded-lg">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 mr-4">
            <TrendingDown className="text-red-600" size={24} />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">รายจ่ายรวมทั้งปี</h2>
            <p className="text-2xl font-bold text-red-600">{formatNumber(totalExpense)} บาท</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 shadow-lg bg-white border-l-4 border-purple-500 rounded-lg">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <PercentCircle className="text-purple-600" size={24} />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">อัตราส่วนรายจ่ายเฉลี่ย</h2>
            <p className="text-2xl font-bold text-purple-600">{formatPercent(avgRatio)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SummaryCards;