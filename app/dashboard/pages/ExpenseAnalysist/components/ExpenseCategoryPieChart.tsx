import React from 'react';
import { Card } from '@/app/components/ui/Card';
import { PercentCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { CategoryData } from '../index';
import { CHART_COLORS, formatNumber } from '../formatters';

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    color: string;
  }[];
  label?: string;
}

interface ExpenseCategoryPieChartProps {
  categoryData: CategoryData[];
}

const ExpenseCategoryPieChart: React.FC<ExpenseCategoryPieChartProps> = ({ categoryData }) => {
  // ข้อมูลแยกตามหมวดหมู่ทั้งปี
  const categorySummary = () => {
    const categories = ['Staff', 'Utilities', 'Maintenance', 'Marketing', 'Food', 'Supplies'];
    const result = categories.map(category => {
      const categoryItems = categoryData.filter(item => item.category === category);
      const total = categoryItems.reduce((sum, item) => sum + item.expense, 0);
      return { name: category, value: total };
    });
    return result;
  };

  // Custom tooltip สำหรับแผนภูมิ
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }} className="flex items-center space-x-2">
              <span className="w-3 h-3 inline-block rounded-full" style={{ backgroundColor: item.color }}></span>
              <span>{item.name}: {formatNumber(item.value)} บาท</span>
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
        <PercentCircle className="mr-2 text-green-500" size={20} />
        สัดส่วนรายจ่ายตามหมวดหมู่
      </h2>
      <div className="h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categorySummary()}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius="70%"
              innerRadius="40%"
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              paddingAngle={2}
            >
              {
                categorySummary().map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CHART_COLORS.categoryColors[index % CHART_COLORS.categoryColors.length]} 
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))
              }
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={10}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ExpenseCategoryPieChart;