import { MonthlyData, CategoryData, AnomalyReport } from './index';


const thaiMonths = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

// หมวดหมู่ค่าใช้จ่าย
const expenseCategories = [
  'การตลาด', 'เงินเดือน', 'ค่าเช่า', 'วัตถุดิบ', 'ขนส่ง',
  'ค่าสาธารณูปโภค', 'อุปกรณ์', 'ภาษี', 'ประกัน', 'อื่นๆ'
];

// สร้างข้อมูลรายเดือน
const generateMonthlyData = (): MonthlyData[] => {
  const monthlyData: MonthlyData[] = [];
  
  thaiMonths.forEach((month, index) => {
    // สร้างข้อมูลรายได้และค่าใช้จ่ายแบบสุ่ม
    const baseRevenue = 500000 + Math.random() * 300000;
    const baseExpense = baseRevenue * (0.5 + Math.random() * 0.3);
    
    // ทำให้บางเดือนมีความผิดปกติ (expense ratio สูงผิดปกติ)
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

// สร้างข้อมูลค่าใช้จ่ายตามหมวดหมู่
const generateCategoryData = (monthlyData: MonthlyData[]): CategoryData[] => {
  const categoryData: CategoryData[] = [];
  
  monthlyData.forEach(monthData => {
    const { month, expense } = monthData;
    
    // แบ่งค่าใช้จ่ายทั้งหมดเป็นหมวดหมู่ย่อย
    let remainingExpense = expense;
    const categoryCount = expenseCategories.length;
    
    expenseCategories.forEach((category, index) => {
      // หมวดหมู่สุดท้ายรับค่าใช้จ่ายที่เหลือทั้งหมด
      if (index === categoryCount - 1) {
        categoryData.push({
          month,
          category,
          expense: remainingExpense
        });
        return;
      }
      
      // สุ่มค่าใช้จ่ายสำหรับแต่ละหมวดหมู่
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

// สร้างรายงานความผิดปกติ
const generateAnomalyReports = (monthlyData: MonthlyData[], categoryData: CategoryData[]): AnomalyReport[] => {
  const anomalyReports: AnomalyReport[] = [];
  
  // ตรวจหาเดือนที่มีความผิดปกติ
  monthlyData.forEach(monthData => {
    if (monthData.is_anomaly) {
      const { month, expense_ratio, expense, revenue } = monthData;
      
      // หาหมวดหมู่ค่าใช้จ่ายที่สูงสุด 3 อันดับแรกสำหรับเดือนนี้
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

// สร้างข้อมูลทั้งหมด
const mockMonthlyData = generateMonthlyData();
const mockCategoryData = generateCategoryData(mockMonthlyData);
const mockAnomalyReports = generateAnomalyReports(mockMonthlyData, mockCategoryData);

export const mockData = {
  mockMonthlyData,
  mockCategoryData,
  mockAnomalyReports
};