import { MonthlyData, CategoryData, AnomalyReport } from './index';


const thaiMonths = [
  'January2025', 'February2025', 'March2025', 'April2025', 'May2025', 'June2025', 'July2025', 'August2025', 'September2025', 'October2025', 'November2025', 'December2025'
];

const expenseCategories = [
   'เงินเดือน', 'ค่าเช่า', 'วัตถุดิบ',
  'ค่าสาธารณูปโภค', 'อุปกรณ์', 'ภาษี', 'ประกัน', 'อื่นๆ'
];


const generateMonthlyData = (): MonthlyData[] => {
  const monthlyData: MonthlyData[] = [];
  
  thaiMonths.forEach((month, index) => {
    const baseRevenue = 500000 + Math.random() * 300000;
    const baseExpense = baseRevenue * (0.5 + Math.random() * 0.3);
    
    const isAnomalyMonth = index === 3 || index === 8; // เมษายนและกันยายน
    const anomalyFactor = isAnomalyMonth ? 1.4 : 1.0;
    
    const revenue = Math.round(baseRevenue);
    const expense = Math.round(baseExpense * anomalyFactor);
    const expense_ratio = expense / revenue;
    
    monthlyData.push({
      month,
      revenue,
      expense,
      expense_ratio,
      is_anomaly: isAnomalyMonth
    });
  });
  
  return monthlyData;
};

const generateCategoryData = (monthlyData: MonthlyData[]): CategoryData[] => {
  const categoryData: CategoryData[] = [];
  
  monthlyData.forEach(monthData => {
    const { month, expense } = monthData;
    
    
    let remainingExpense = expense;
    const categoryCount = expenseCategories.length;
    
    expenseCategories.forEach((category, index) => {
      if (index === categoryCount - 1) {
        categoryData.push({
          month,
          category,
          expense: remainingExpense
        });
        return;
      }
      
      const weight = Math.random();
      const categoryExpense = Math.round(remainingExpense * (weight / (categoryCount - index)));
      remainingExpense -= categoryExpense;
      
      categoryData.push({
        month,
        category,
        expense: categoryExpense
      });
    });
  });
  
  return categoryData;
};

const generateAnomalyReports = (monthlyData: MonthlyData[], categoryData: CategoryData[]): AnomalyReport[] => {
  const anomalyReports: AnomalyReport[] = [];
  
  monthlyData.forEach(monthData => {
    if (monthData.is_anomaly) {
      const { month, expense_ratio, expense, revenue } = monthData;
      
      const monthCategories = categoryData.filter(item => item.month === month);
      monthCategories.sort((a, b) => b.expense - a.expense);
      
      const top_expense_categories = monthCategories.slice(0, 3).map(item => item.category);
      const category_amounts = monthCategories.slice(0, 3).map(item => item.expense);
      
      anomalyReports.push({
        period: month,
        expense_ratio,
        total_expense: expense,
        total_revenue: revenue,
        top_expense_categories,
        category_amounts
      });
    }
  });
  
  return anomalyReports;
};


const mockMonthlyData = generateMonthlyData();
const mockCategoryData = generateCategoryData(mockMonthlyData);
const mockAnomalyReports = generateAnomalyReports(mockMonthlyData, mockCategoryData);

export const mockData = {
  mockMonthlyData,
  mockCategoryData,
  mockAnomalyReports
};