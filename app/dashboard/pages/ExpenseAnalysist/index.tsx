import { useEffect, useState } from 'react';
import SummaryCards from './components/SummaryCards';
import MonthlyRevenueExpenseChart from './components/MonthlyRevenueExpenseChart';
import ExpenseCategoryPieChart from './components/ExpenseCategoryPieChart';
import AnomalyReports from './components/AnomalyReports';
import LoadingScreen from './components/LoadingScreen';
import MonthSelector from './components/MonthSelector';
import { mockData } from './mockData';

// Types
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
  const [selectedMonth, setSelectedMonth] = useState<string | 'all'>('all');

  useEffect(() => {
    const { mockMonthlyData, mockCategoryData, mockAnomalyReports } = mockData;
    
    setMonthlyData(mockMonthlyData);
    setCategoryData(mockCategoryData);
    setAnomalyReports(mockAnomalyReports);
    setIsLoading(false);
  }, []);

  // Filter data based on selected month
  const filteredMonthlyData = selectedMonth === 'all' 
    ? monthlyData 
    : monthlyData.filter(item => item.month === selectedMonth);

  const filteredCategoryData = selectedMonth === 'all'
    ? categoryData
    : categoryData.filter(item => item.month === selectedMonth);

  const filteredAnomalyReports = selectedMonth === 'all'
    ? anomalyReports
    : anomalyReports.filter(report => report.period.includes(selectedMonth));

    const calculateSummaryMetrics = () => {
      const data = selectedMonth === 'all' ? monthlyData : filteredMonthlyData;
      
      if (data.length === 0) return { totalRevenue: 0, totalExpense: 0, avgRatio: 0, ebitdar: 0 };
      
      const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
      const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
      const avgRatio = totalExpense / totalRevenue;

      const approximateITDAR = totalExpense * 0.15;
      const ebitdar = totalRevenue - totalExpense + approximateITDAR;
      
      return { totalRevenue, totalExpense, avgRatio, ebitdar };
    };

  const summaryMetrics = calculateSummaryMetrics();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Get all available months for the selector
  const availableMonths = Array.from(new Set(monthlyData.map(item => item.month)));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            รายงานการเงิน{selectedMonth !== 'all' ? ` ${selectedMonth}` : ' รายปี'} 2024
          </h1>
          <MonthSelector 
            months={availableMonths} 
            selectedMonth={selectedMonth} 
            onChange={setSelectedMonth} 
          />
        </div>
        
        {/* SUMMARY */}
        <SummaryCards 
          summaryMetrics={summaryMetrics}
          period={selectedMonth === 'all' ? 'รวมทั้งปี' : selectedMonth} 
        />
        
        {/* CHART - Only show when 'all' is selected */}
        {selectedMonth === 'all' && (
          <div className="mb-6">
            <MonthlyRevenueExpenseChart 
              monthlyData={monthlyData} 
              highlightMonth={undefined}
            />
          </div>
        )}
        
        {/* CATEGORY & ANOMALY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ExpenseCategoryPieChart 
            categoryData={filteredCategoryData} 
            period={selectedMonth === 'all' ? 'ทั้งปี' : selectedMonth}
          />
          <AnomalyReports 
            anomalyReports={filteredAnomalyReports} 
            noDataMessage={selectedMonth !== 'all' ? `ไม่พบความผิดปกติในเดือน ${selectedMonth}` : 'ไม่พบความผิดปกติ'}
          />
        </div>
      </div>
    </div>
  );
}