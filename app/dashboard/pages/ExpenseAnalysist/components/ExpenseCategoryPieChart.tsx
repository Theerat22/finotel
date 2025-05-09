/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '@/app/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, TooltipProps } from 'recharts';
import { CategoryData } from '../index';
import { PieChartIcon } from 'lucide-react';
import { formatNumber } from '../formatters';

// Custom tooltip for PieChart
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    payload: {
      category: string;
      expense: number;
      fill: string;
    };
  }[];
}

interface ExpenseCategoryPieChartProps {
  categoryData: CategoryData[];
  period: string;
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#F97316', '#6366F1', '#14B8A6', '#64748B'
];

const ExpenseCategoryPieChart: React.FC<ExpenseCategoryPieChartProps> = ({ categoryData, period }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const match = period.match(/^([A-Za-z]+)(\d+)$/);

  const month_name = match ? match[1] : "";
  const year = match ? match[2] : "";

  const full_month = `${month_name} ${year}`;
  // Add window resize listener for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive dimensions
  const getPieRadius = () => {
    if (windowWidth <= 480) return { inner: 30, outer: 60 };
    if (windowWidth <= 768) return { inner: 35, outer: 70 };
    return { inner: 40, outer: 80 };
  };

  // Process data for pie chart
  const processData = useCallback(() => {
    if (!categoryData || categoryData.length === 0) return [];

    // Aggregate expenses by category
    const categoryMap = new Map<string, number>();
    
    categoryData.forEach(item => {
      const currentAmount = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, currentAmount + item.expense);
    });

    // Convert map to array for chart
    const chartData = Array.from(categoryMap.entries()).map(([category, expense], index) => ({
      category,
      expense,
      fill: COLORS[index % COLORS.length]
    }));

    // Sort by expense amount (highest first)
    return chartData.sort((a, b) => b.expense - a.expense);
  }, [categoryData]);

  const pieData = processData();
  const totalExpense = pieData.reduce((sum, item) => sum + item.expense, 0);

  // Dynamically limit displayed categories based on screen size
  const getVisibleData = () => {
    if (windowWidth <= 480) {
      // For very small screens, show only top 5 categories
      return pieData.slice(0, 5);
    } else if (windowWidth <= 768) {
      // For small screens, show top 7 categories
      return pieData.slice(0, 7);
    }
    // For larger screens, show all or top 10
    return pieData.slice(0, 10);
  };

  const visibleData = getVisibleData();
  const { inner: innerRadius, outer: outerRadius } = getPieRadius();

  // Custom tooltip implementation
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.expense / totalExpense) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-2 sm:p-4 border border-gray-200 shadow-md rounded-md text-sm sm:text-base">
          <p className="font-medium text-gray-900">{data.category}</p>
          <p className="text-gray-700">{formatNumber(data.expense)} บาท</p>
          <p className="text-gray-600">{percentage}% ของค่าใช้จ่ายทั้งหมด</p>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  // Custom legend renderer
  const renderCustomizedLegend = (props: any) => {
    const { payload } = props;
    
    if (!payload) return null;
    
    return (
      <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-2 sm:mt-4 px-1 sm:px-3">
        {payload.map((entry: any, index: number) => (
          <div 
            key={`legend-${index}`}
            className="flex items-center space-x-1 sm:space-x-2 px-1 sm:px-2 py-1 bg-gray-50 rounded-full text-xs sm:text-sm mb-1"
          >
            <div 
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
              style={{ background: entry.color }}
            />
            <span className="text-gray-700 truncate max-w-16 sm:max-w-full">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Calculate chart height based on screen size
  const getChartHeight = () => {
    if (windowWidth <= 480) return 180;
    if (windowWidth <= 768) return 220;
    return 250;
  };

  return (
    <Card className="p-3 sm:p-4 md:p-6 shadow-lg bg-white rounded-lg transition-all duration-300 hover:shadow-xl h-full flex flex-col">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-4 text-gray-800 flex flex-wrap items-center">
        <PieChartIcon className="mr-2 text-blue-500" size={windowWidth <= 640 ? 16 : 20} />
        <span className="mr-1">สัดส่วนค่าใช้จ่ายตามหมวดหมู่</span>
        <span className="text-blue-600 text-base sm:text-base md:text-lg">- {full_month}</span>
      </h2>
      
      {visibleData.length > 0 ? (
        <div className="flex-grow flex flex-col">
          <div className="flex-grow" style={{ minHeight: `${getChartHeight()}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <Pie
                  data={visibleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={outerRadius}
                  innerRadius={innerRadius}
                  dataKey="expense"
                  nameKey="category"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {visibleData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill} 
                      stroke="#fff"
                      strokeWidth={activeIndex === index ? 2 : 1}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  content={renderCustomizedLegend}
                  wrapperStyle={{ paddingTop: windowWidth <= 480 ? '5px' : '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-2 sm:mt-4 bg-blue-50 p-2 sm:p-3 rounded-lg text-center">
            <p className="font-medium text-gray-700 text-sm sm:text-base">ค่าใช้จ่ายทั้งหมด</p>
            <p className="text-lg sm:text-xl font-bold text-blue-600">{formatNumber(totalExpense)} บาท</p>
          </div>
          
          {pieData.length > visibleData.length && (
            <p className="text-xs text-gray-500 text-center mt-2">
              *แสดง {visibleData.length} หมวดหมู่ที่มีค่าใช้จ่ายสูงสุดจากทั้งหมด {pieData.length} หมวดหมู่
            </p>
          )}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-center">ไม่มีข้อมูลค่าใช้จ่ายในช่วงเวลานี้</p>
        </div>
      )}
    </Card>
  );
};

export default ExpenseCategoryPieChart;