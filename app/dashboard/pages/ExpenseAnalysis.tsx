import { useEffect, useState } from 'react';
import { Card } from '@/app/components/ui/Card';
import { PieChart, ComposedChart, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer, Area, TooltipProps } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, PercentCircle } from 'lucide-react';

// ประกาศ type ต่างๆ
type MonthlyData = {
  month: string;
  revenue: number;
  expense: number;
  expense_ratio: number;
  is_anomaly?: boolean;
};

type CategoryData = {
  month: string;
  category: string;
  expense: number;
};

type ForecastData = {
  month: string;
  actual: number;
  forecast: number;
  lower_bound: number;
  upper_bound: number;
};

type AnomalyReport = {
  period: string;
  expense_ratio: number;
  total_expense: number;
  total_revenue: number;
  top_expense_categories: string[];
  category_amounts: number[];
};

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    color: string;
  }[];
  label?: string;
};

export default function Dashboard() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  // const [anomalyData, setAnomalyData] = useState<MonthlyData[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [anomalyReports, setAnomalyReports] = useState<AnomalyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockMonthlyData: MonthlyData[] = [
        { month: "ม.ค.", revenue: 650000, expense: 410000, expense_ratio: 0.63 },
        { month: "ก.พ.", revenue: 450000, expense: 270000, expense_ratio: 0.60 },
        { month: "มี.ค.", revenue: 460000, expense: 230000, expense_ratio: 0.50 },
        { month: "เม.ย.", revenue: 620000, expense: 390000, expense_ratio: 0.63 },
        { month: "พ.ค.", revenue: 470000, expense: 240000, expense_ratio: 0.51 },
        { month: "มิ.ย.", revenue: 450000, expense: 220000, expense_ratio: 0.49 },
        { month: "ก.ค.", revenue: 430000, expense: 210000, expense_ratio: 0.49 },
        { month: "ส.ค.", revenue: 420000, expense: 220000, expense_ratio: 0.52 },
        { month: "ก.ย.", revenue: 450000, expense: 230000, expense_ratio: 0.51 },
        { month: "ต.ค.", revenue: 480000, expense: 235000, expense_ratio: 0.49 },
        { month: "พ.ย.", revenue: 500000, expense: 245000, expense_ratio: 0.49 },
        { month: "ธ.ค.", revenue: 620000, expense: 400000, expense_ratio: 0.65 }
    ];

    const mockCategoryData: CategoryData[] = [
      // มกราคม
        { month: "ม.ค.", category: "Staff", expense: 164000 },
        { month: "ม.ค.", category: "Utilities", expense: 82000 },
        { month: "ม.ค.", category: "Maintenance", expense: 41000 },
        { month: "ม.ค.", category: "Marketing", expense: 61500 },
        { month: "ม.ค.", category: "Food", expense: 41000 },
        { month: "ม.ค.", category: "Supplies", expense: 20500 },
        
        // เมษายน
        { month: "เม.ย.", category: "Staff", expense: 156000 },
        { month: "เม.ย.", category: "Utilities", expense: 78000 },
        { month: "เม.ย.", category: "Maintenance", expense: 39000 },
        { month: "เม.ย.", category: "Marketing", expense: 58500 },
        { month: "เม.ย.", category: "Food", expense: 39000 },
        { month: "เม.ย.", category: "Supplies", expense: 19500 },
        
        // ธันวาคม
        { month: "ธ.ค.", category: "Staff", expense: 160000 },
        { month: "ธ.ค.", category: "Utilities", expense: 80000 },
        { month: "ธ.ค.", category: "Maintenance", expense: 40000 },
        { month: "ธ.ค.", category: "Marketing", expense: 60000 },
        { month: "ธ.ค.", category: "Food", expense: 40000 },
        { month: "ธ.ค.", category: "Supplies", expense: 20000 }
    ];

    const mockForecastData: ForecastData[] = [
      { month: "ม.ค.", actual: 0.45, forecast: 0.46, lower_bound: 0.42, upper_bound: 0.50 },
      { month: "ก.พ.", actual: 0.48, forecast: 0.47, lower_bound: 0.43, upper_bound: 0.51 },
      { month: "มี.ค.", actual: 0.63, forecast: 0.48, lower_bound: 0.44, upper_bound: 0.52 },
      { month: "เม.ย.", actual: 0.54, forecast: 0.49, lower_bound: 0.45, upper_bound: 0.53 },
      { month: "พ.ค.", actual: 0.55, forecast: 0.50, lower_bound: 0.46, upper_bound: 0.54 },
      { month: "มิ.ย.", actual: 0.54, forecast: 0.51, lower_bound: 0.47, upper_bound: 0.55 },
      { month: "ก.ค.", actual: 0.63, forecast: 0.52, lower_bound: 0.48, upper_bound: 0.56 },
      { month: "ส.ค.", actual: 0.55, forecast: 0.51, lower_bound: 0.47, upper_bound: 0.55 },
      { month: "ก.ย.", actual: 0.55, forecast: 0.50, lower_bound: 0.46, upper_bound: 0.54 },
      { month: "ต.ค.", actual: 0.56, forecast: 0.49, lower_bound: 0.45, upper_bound: 0.53 },
      { month: "พ.ย.", actual: 0.47, forecast: 0.48, lower_bound: 0.44, upper_bound: 0.52 },
      { month: "ธ.ค.", actual: 0.47, forecast: 0.47, lower_bound: 0.43, upper_bound: 0.51 },
      { month: "ม.ค. 23", actual: 0, forecast: 0.46, lower_bound: 0.42, upper_bound: 0.50 },
      { month: "ก.พ. 23", actual: 0, forecast: 0.47, lower_bound: 0.43, upper_bound: 0.51 },
      { month: "มี.ค. 23", actual: 0, forecast: 0.48, lower_bound: 0.44, upper_bound: 0.52 }
    ];

    const mockAnomalyReports: AnomalyReport[] = [
      {
        period: "มีนาคม 2022",
        expense_ratio: 0.63,
        total_expense: 230000,
        total_revenue: 460000,
        top_expense_categories: ["Staff", "Utilities", "Maintenance/Food"],
        category_amounts: [1137500, 650000, 487500]
      },
      {
        period: "กรกฎาคม 2022",
        expense_ratio: 0.63,
        total_expense: 210000,
        total_revenue: 430000,
        top_expense_categories: ["Staff", "Utilities", "Maintenance/Food"],
        category_amounts: [1102500, 630000, 472500]
      }
    ];

    setMonthlyData(mockMonthlyData);
    setCategoryData(mockCategoryData);
    // setAnomalyData(mockMonthlyData.filter(item => item.is_anomaly));
    setForecastData(mockForecastData);
    setAnomalyReports(mockAnomalyReports);
    setIsLoading(false);
    // console.log(anomalyData)
  }, []);

  // ฟังก์ชั่นช่วยในการจัดรูปแบบตัวเลข
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  // ฟังก์ชั่นช่วยในการจัดรูปแบบเปอร์เซ็นต์
  const formatPercent = (num: number): string => {
    return `${(num * 100).toFixed(1)}%`;
  };

  // สร้างข้อมูลสรุปรวม
  const calculateSummaryMetrics = () => {
    if (monthlyData.length === 0) return { totalRevenue: 0, totalExpense: 0, avgRatio: 0 };
    
    const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpense = monthlyData.reduce((sum, item) => sum + item.expense, 0);
    const avgRatio = totalExpense / totalRevenue;
    
    return { totalRevenue, totalExpense, avgRatio };
  };

  const { totalRevenue, totalExpense, avgRatio } = calculateSummaryMetrics();

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

  // สีสำหรับแผนภูมิที่สวยงามขึ้น
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444'];
  
  // สีพื้นหลังและเส้นแผนภูมิที่สวยงาม
  const CHART_COLORS = {
    revenue: {
      fill: 'rgba(79, 70, 229, 0.2)',
      stroke: '#4F46E5'
    },
    expense: {
      fill: 'rgba(239, 68, 68, 0.2)',
      stroke: '#EF4444'
    },
    ratio: {
      stroke: '#10B981'
    },
    forecast: {
      area: 'rgba(147, 197, 253, 0.2)',
      line: '#3B82F6'
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="p-6 rounded-lg bg-white shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Custom tooltip สำหรับแผนภูมิ
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }} className="flex items-center space-x-2">
              <span className="w-3 h-3 inline-block rounded-full" style={{ backgroundColor: item.color }}></span>
              <span>{item.name}: {item.name === 'อัตราส่วนรายจ่าย' || item.name === 'พยากรณ์' || item.name === 'ค่าจริง' ?
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">รายงานการเงินรายปี 2022</h1>
          <p className="text-gray-500">ข้อมูลการวิเคราะห์รายได้และรายจ่ายประจำปี และตรวจจับความผิดปกติของการเงิน</p>
        </div>
        
        {/* สรุปตัวเลขสำคัญ */}
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
        
        {/* แผนภูมิหลัก */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* แผนภูมิรายได้และรายจ่ายรายเดือน */}
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
          
          {/* แผนภูมิวงกลมแสดงสัดส่วนรายจ่ายตามหมวดหมู่ */}
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
                          fill={COLORS[index % COLORS.length]} 
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))
                    }
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatNumber(Number(value)) + " บาท"} 
                    content={<CustomTooltip />} 
                  />
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
        </div>
        
        {/* การวิเคราะห์แนวโน้มและความผิดปกติ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          

          {/* Anomaly Reports Card - First Section */}
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
          
        </div>
        
        {/* ส่วนท้าย */}
      </div>
    </div>
  );
}