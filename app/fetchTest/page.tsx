// "use client";
// import React, { use, useEffect, useState } from "react";
// import StartNav from "@/app/components/StartNav";
// import SummaryCards from "@/app/dashboard/pages/ExpenseAnalysist/components/SummaryCards";
// import MonthlyRevenueExpenseChart from "@/app/dashboard/pages/ExpenseAnalysist/components/MonthlyRevenueExpenseChart";
// import ExpenseCategoryPieChart from "@/app/dashboard/pages/ExpenseAnalysist/components/ExpenseCategoryPieChart";
// import AnomalyReports from "@/app/dashboard/pages/ExpenseAnalysist/components/AnomalyReports";
// import LoadingScreen from "@/app/dashboard/pages/ExpenseAnalysist/components/LoadingScreen";
// import { mockData } from "@/app/dashboard/pages/ExpenseAnalysist/mockData";

// interface Month {
//   income: number;
//   outcome: number;
//   occupancyRate: number;
//   event: string[];
// }

// interface FinancialRecord {
//   id: number;
//   type: "income" | "outcome";
//   price: number;
//   timestamp: string;
//   month_id: number;
// }

// interface MonthData {
//   [key: string]: Month;
// }

// export type MonthlyData = {
//   month: string;
//   revenue: number;
//   expense: number;
//   expense_ratio: number;
//   is_anomaly?: boolean;
// };

// export type CategoryData = {
//   month: string;
//   category: string;
//   expense: number;
// };

// export type AnomalyReport = {
//   period: string;
//   expense_ratio: number;
//   total_expense: number;
//   total_revenue: number;
//   top_expense_categories: string[];
//   category_amounts: number[];
// };

// const monthData: MonthData = {
//   January2025: {
//     income: 2000,
//     outcome: 0,
//     occupancyRate: 0,
//     event: ["Event 1", "Event 2", "Event 3"],
//   },
//   February2025: {
//     income: 0,
//     outcome: 0,
//     occupancyRate: 0,
//     event: ["Event 1", "Event 2", "Event 3"],
//   },
//   March2025: {
//     income: 0,
//     outcome: 0,
//     occupancyRate: 0,
//     event: ["Event 1", "Event 2", "Event 3"],
//   },
//   April2025: {
//     income: 0,
//     outcome: 0,
//     occupancyRate: 86,
//     event: ["Event 1", "Event 2", "Event 3"],
//   }, // ยกตัวอย่างเพิ่มค่า
//   May2025: {
//     income: 0,
//     outcome: 0,
//     occupancyRate: 0,
//     event: ["Event 1", "Event 2", "Event 3"],
//   },
//   June2025: {
//     income: 0,
//     outcome: 0,
//     occupancyRate: 0,
//     event: ["Event 1", "Event 2", "Event 3"],
//   },
//   July2025: {
//     income: 0,
//     outcome: 0,
//     occupancyRate: 0,
//     event: ["Event 1", "Event 2", "Event 3"],
//   },
// };

// type PageProps = {
//   params: Promise<{ slug: string }>;
// };

// export default function RoomDetails({ params }: PageProps) {
//   const { slug } = use(params);
//   // const [showMore, setShowMore] = useState(false);
//   const month = monthData[slug as keyof typeof monthData];

//   const match = slug.match(/^([A-Za-z]+)(\d+)$/);

//   const month_name = match ? match[1] : "";
//   const year = match ? match[2] : "";

//   console.log(month);

//   const [data, setData] = useState<FinancialRecord[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFinancialData = async () => {
//       try {
//         const res = await fetch(`/api/database/get-financial?month=${slug}`);
//         const json = await res.json();
//         setData(json);
//       } catch (err) {
//         console.error("Failed to fetch financial data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFinancialData();
//   }, [slug]);

//   const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
//   const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
//   const [anomalyReports, setAnomalyReports] = useState<AnomalyReport[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedMonth] = useState<string | "all">(slug);

//   useEffect(() => {
//     const { mockMonthlyData, mockCategoryData, mockAnomalyReports } = mockData;

//     setMonthlyData(mockMonthlyData);
//     setCategoryData(mockCategoryData);
//     setAnomalyReports(mockAnomalyReports);
//     setIsLoading(false);
//   }, []);

//   // Filter data based on selected month
//   const filteredMonthlyData =
//     selectedMonth === "all"
//       ? monthlyData
//       : monthlyData.filter((item) => item.month === selectedMonth);

//   const filteredCategoryData =
//     selectedMonth === "all"
//       ? categoryData
//       : categoryData.filter((item) => item.month === selectedMonth);

//   const filteredAnomalyReports =
//     selectedMonth === "all"
//       ? anomalyReports
//       : anomalyReports.filter((report) =>
//           report.period.includes(selectedMonth)
//         );

//   const calculateSummaryMetrics = () => {
//     const data = selectedMonth === "all" ? monthlyData : filteredMonthlyData;

//     if (data.length === 0)
//       return { totalRevenue: 0, totalExpense: 0, avgRatio: 0, ebitdar: 0 };

//     const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
//     const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
//     const avgRatio = totalExpense / totalRevenue;

//     const approximateITDAR = totalExpense * 0.15;
//     const ebitdar = totalRevenue - totalExpense + approximateITDAR;

//     return { totalRevenue, totalExpense, avgRatio, ebitdar };
//   };

//   const summaryMetrics = calculateSummaryMetrics();

//   if (isLoading) {
//     return <LoadingScreen />;
//   }

//   // Get all available months for the selector
//   // const availableMonths = Array.from(
//   //   new Set(monthlyData.map((item) => item.month))
//   // );

//   if (!month) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center text-center">
//         <p className="text-2xl text-white">Data Not Found</p>
//       </div>
//     );
//   }

//   if (loading) return <p>Loading...</p>;

//   return (
//     <>
//       <StartNav />

//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16 flex-grow p-4 md:p-8">
//         <div className="max-w-7xl mx-auto">
//           {/* <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
//             รายงานการเงิน{selectedMonth !== 'all' ? ` ${selectedMonth}` : ' รายปี'} 2024
//           </h1>
//           <MonthSelector 
//             months={availableMonths} 
//             selectedMonth={selectedMonth} 
//             onChange={setSelectedMonth} 
//           />
//         </div> */}
//           <div>
//             <h2>รายรับเดือน May2025</h2>
//             <ul>
//               {data.map((item) => (
//                 <li key={item.id}>
//                   💰 {item.price} บาท -{" "}
//                   {new Date(item.timestamp).toLocaleDateString()}
//                 </li>
//               ))}
//             </ul>
//           </div>


//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-lg mb-6 text-white">
//             <h1 className="text-2xl md:text-3xl font-bold text-center">
//               ข้อมูลเดือน {month_name} {year}
//             </h1>
//             <p className="text-blue-100 text-sm text-center mt-1">
//               อัพเดทล่าสุด: 11 พฤษภาคม 2025
//             </p>
//             {/* <MonthSelector
//               months={availableMonths}
//               selectedMonth={selectedMonth}
//               onChange={setSelectedMonth}
//             /> */}
//           </div>

//           {/* SUMMARY */}
//           <SummaryCards
//             summaryMetrics={summaryMetrics}
//             period={selectedMonth === "all" ? "รวมทั้งปี" : selectedMonth}
//           />

//           {/* CHART - Only show when 'all' is selected */}
//           {selectedMonth === "all" && (
//             <div className="mb-6">
//               <MonthlyRevenueExpenseChart
//                 monthlyData={monthlyData}
//                 highlightMonth={undefined}
//               />
//             </div>
//           )}

//           {/* CATEGORY & ANOMALY */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//             <ExpenseCategoryPieChart
//               categoryData={filteredCategoryData}
//               period={selectedMonth === "all" ? "ทั้งปี" : selectedMonth}
//             />
//             <AnomalyReports
//               anomalyReports={filteredAnomalyReports}
//               noDataMessage={
//                 selectedMonth !== "all"
//                   ? `ไม่พบความผิดปกติในเดือน ${selectedMonth}`
//                   : "ไม่พบความผิดปกติ"
//               }
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
