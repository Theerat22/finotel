import React from 'react';
import { Card } from '@/app/components/ui/Card';
import { DollarSign } from 'lucide-react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { MonthlyData } from '../index';
import { CHART_COLORS, formatNumber, formatPercent } from '../formatters';

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    color: string;
  }[];
  label?: string;
}

interface MonthlyRevenueExpenseChartProps {
  monthlyData: MonthlyData[];
}

const MonthlyRevenueExpenseChart: React.FC<MonthlyRevenueExpenseChartProps> = ({ monthlyData }) => {
  // Custom tooltip สำหรับแผนภูมิ
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }} className="flex items-center space-x-2">
              <span className="w-3 h-3 inline-block rounded-full" style={{ backgroundColor: item.color }}></span>
              <span>{item.name}: {item.name === 'อัตราส่วนรายจ่าย' ?
                formatPercent(item.value) :
                formatNumber(item.value) + ' บาท'}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 shadow-lg bg-white rounded-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <DollarSign className="mr-2 text-blue-500" size={20} />
        รายได้และรายจ่ายรายเดือน
      </h2>
      <div className="h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "#6B7280" }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              dy={10}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              tick={{ fill: "#6B7280" }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => value >= 1000000 ? `${value/1000000}M` : `${value/1000}K`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tick={{ fill: "#6B7280" }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => `${(value*100).toFixed(0)}%`}
              domain={[0, 1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ paddingTop: '10px' }}
            />
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.revenue.stroke} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={CHART_COLORS.revenue.stroke} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.expense.stroke} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={CHART_COLORS.expense.stroke} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area 
              yAxisId="left" 
              type="monotone" 
              dataKey="revenue" 
              name="รายได้" 
              fill="url(#revenueGradient)" 
              stroke={CHART_COLORS.revenue.stroke}
              strokeWidth={2}
            />
            <Area 
              yAxisId="left" 
              type="monotone" 
              dataKey="expense" 
              name="รายจ่าย" 
              fill="url(#expenseGradient)" 
              stroke={CHART_COLORS.expense.stroke}
              strokeWidth={2}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="expense_ratio" 
              name="อัตราส่วนรายจ่าย" 
              stroke={CHART_COLORS.ratio.stroke} 
              strokeWidth={3}
              dot={{ r: 6, fill: 'white', strokeWidth: 2 }}
              activeDot={{ r: 8, fill: CHART_COLORS.ratio.stroke, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MonthlyRevenueExpenseChart;