// src/app/dashboard/page.tsx
import { useEffect, useState } from 'react';
import SummaryCards from './components/SummaryCards';
import MonthlyRevenueExpenseChart from './components/MonthlyRevenueExpenseChart';
import ExpenseCategoryPieChart from './components/ExpenseCategoryPieChart';
import AnomalyReports from './components/AnomalyReports';
import LoadingScreen from './components/LoadingScreen';
import { mockData } from './mockData';

// ประกาศ type ต่างๆ
export type MonthlyData = {
  month: string;
  revenue: number;
  expense: number;
  expense_ratio: number;
  is_anomaly?: boolean;
};

export type CategoryData = {
  month: string;
  category: string;
  expense: number;
};

export type AnomalyReport = {
  period: string;
  expense_ratio: number;
  total_expense: number;
  total_revenue: number;
  top_expense_categories: string[];
  category_amounts: number[];
};

export default function Dashboard() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [anomalyReports, setAnomalyReports] = useState<AnomalyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ในอนาคตอาจจะดึงข้อมูลจาก API จริงๆ
    const { mockMonthlyData, mockCategoryData, mockAnomalyReports } = mockData;
    
    setMonthlyData(mockMonthlyData);
    setCategoryData(mockCategoryData);
    setAnomalyReports(mockAnomalyReports);
    setIsLoading(false);
  }, []);

  // คำนวณข้อมูลสรุปรวม
  const calculateSummaryMetrics = () => {
    if (monthlyData.length === 0) return { totalRevenue: 0, totalExpense: 0, avgRatio: 0 };
    
    const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpense = monthlyData.reduce((sum, item) => sum + item.expense, 0);
    const avgRatio = totalExpense / totalRevenue;
    
    return { totalRevenue, totalExpense, avgRatio };
  };

  const summaryMetrics = calculateSummaryMetrics();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">รายงานการเงินรายปี 2022</h1>
          <p className="text-gray-500">ข้อมูลการวิเคราะห์รายได้และรายจ่ายประจำปี และตรวจจับความผิดปกติของการเงิน</p>
        </div>
        
        {/* สรุปตัวเลขสำคัญ */}
        <SummaryCards summaryMetrics={summaryMetrics} />
        
        {/* แผนภูมิหลัก */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MonthlyRevenueExpenseChart monthlyData={monthlyData} />
          <ExpenseCategoryPieChart categoryData={categoryData} />
        </div>
        
        {/* การวิเคราะห์แนวโน้มและความผิดปกติ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AnomalyReports anomalyReports={anomalyReports} />
        </div>
      </div>
    </div>
  );
}