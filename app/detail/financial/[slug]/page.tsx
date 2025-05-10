"use client";
import React, { use, useEffect, useState } from "react";
import StartNav from "@/app/components/StartNav";
import SummaryCards from "@/app/dashboard/pages/ExpenseAnalysist/components/SummaryCards";
import ExpenseCategoryPieChart from "@/app/dashboard/pages/ExpenseAnalysist/components/ExpenseCategoryPieChart";
import LoadingScreen from "@/app/dashboard/pages/ExpenseAnalysist/components/LoadingScreen";

interface FinancialSummary {
  totalRevenue: number;
  totalExpense: number;
  avgRatio: number;
  ebitdar: number;
}

interface SummaryCardsProps {
  summaryMetrics: FinancialSummary;
  period: string;
}


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

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function RoomDetails({ params }: PageProps) {
  const { slug } = use(params);

  const match = slug.match(/^([A-Za-z]+)(\d+)$/);

  const month_name = match ? match[1] : "";
  const year = match ? match[2] : "";


  const [summaryData, setData] = useState<SummaryCardsProps[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const res = await fetch(`/api/database/get-financial?month=${slug}`);
        const data = await res.json();
        const formattedData: SummaryCardsProps = {
          summaryMetrics: {
            totalRevenue: data.totalRevenue,
            totalExpense: data.totalExpense,
            avgRatio: data.avgRatio,
            ebitdar: data.ebitdar,
          },
          period: slug,
        };

        console.log("Formatted data:", formattedData);

        setData([formattedData]);
      } catch (err) {
        console.error("Failed to fetch financial data:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoryData = async () => {
      try {
        const res = await fetch(`/api/database/get-financial-category?month=${slug}`);
        const data = await res.json();
        setCategoryData(data);
      } catch (err) {
        console.error("Failed to fetch financial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
    fetchCategoryData();
  }, [slug]);

  const [selectedMonth] = useState<string | "all">(slug);



  const firstSummaryData = summaryData[0];

  if (!firstSummaryData) {
    return <LoadingScreen />;
  }

  const { summaryMetrics, period } = firstSummaryData;

  if (loading) {
    return <LoadingScreen />;
  }
  console.log("Category data:", categoryData);


  return (
    <>
      <StartNav />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16">
        <div className="flex-grow p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-lg mb-6 text-white">
              <h1 className="text-2xl md:text-3xl font-bold text-center">
                ข้อมูลเดือน {month_name} {year}
              </h1>
              <p className="text-blue-100 text-sm text-center mt-1">
                อัพเดทล่าสุด: 11 พฤษภาคม 2025
              </p>
            </div>

            {/* SUMMARY */}
            <SummaryCards summaryMetrics={summaryMetrics} period={period} />


            {/* CATEGORY & ANOMALY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ExpenseCategoryPieChart
                categoryData={categoryData}
                period={selectedMonth}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
