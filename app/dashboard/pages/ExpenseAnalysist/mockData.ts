import { MonthlyData, CategoryData, AnomalyReport } from './index';

export const mockData = {
  mockMonthlyData: [
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
  ] as MonthlyData[],

  mockCategoryData: [
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
  ] as CategoryData[],

  mockAnomalyReports: [
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
  ] as AnomalyReport[]
};