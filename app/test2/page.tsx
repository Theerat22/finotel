"use client";
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { TrendingUp, Calendar, DollarSign, Users, ArrowUpRight } from 'lucide-react';

const TwinotelSimulation = () => {
  const [selectedView, setSelectedView] = useState('monthly');
  
  // Sample data for simulation
  const monthlyData = [
    { month: 'Jan', caseA: 2100, caseB: 2400, occupancyA: 75, occupancyB: 82 },
    { month: 'Feb', caseA: 1950, caseB: 2200, occupancyA: 68, occupancyB: 75 },
    { month: 'Mar', caseA: 2200, caseB: 2650, occupancyA: 72, occupancyB: 85 },
    { month: 'Apr', caseB: 2800, caseA: 2300, occupancyA: 80, occupancyB: 88 },
    { month: 'May', caseA: 2150, caseB: 2550, occupancyA: 71, occupancyB: 80 },
    { month: 'Jun', caseA: 1900, caseB: 2350, occupancyA: 65, occupancyB: 78 },
    { month: 'Jul', caseA: 2400, caseB: 2900, occupancyA: 85, occupancyB: 92 },
    { month: 'Aug', caseA: 2000, caseB: 2450, occupancyA: 70, occupancyB: 82 },
    { month: 'Sep', caseA: 2250, caseB: 2700, occupancyA: 78, occupancyB: 86 },
    { month: 'Oct', caseA: 2350, caseB: 2750, occupancyA: 82, occupancyB: 88 },
    { month: 'Nov', caseA: 2100, caseB: 2500, occupancyA: 73, occupancyB: 81 },
    { month: 'Dec', caseA: 2800, caseB: 3200, occupancyA: 95, occupancyB: 98 }
  ];

  const yearlyStats = {
    caseA: {
      totalRevenue: 26500,
      avgOccupancy: 76.2,
      avgRevPar: 2208,
      growth: 0
    },
    caseB: {
      totalRevenue: 31550,
      avgOccupancy: 84.6,
      avgRevPar: 2629,
      growth: 19.1
    }
  };

  interface TooltipEntry {
    color: string;
    name: string;
    value: number;
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipEntry[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-gray-800 font-semibold">{`เดือน: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ฿${entry.value?.toLocaleString()} บาท`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        {/* <div className="bg-blue-600 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Twinotel Simulation</h1>
          <p className="text-blue-100">แดชบอร์ดเปรียบเทียบสถานการณ์จำลอง - การตั้งราคาห้องพักแบบต่างๆ</p>
        </div> */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-lg mb-6 text-white flex items-center justify-center">
          <h2 className="text-2xl font-semibold text-center">
          Twinotel Simulation
          </h2>
        </div>


        {/* Revenue Comparison Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">เปรียบเทียบรายได้รายเดือน</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedView('monthly')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === 'monthly' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                รายเดือน
              </button>
              <button
                onClick={() => setSelectedView('occupancy')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === 'occupancy' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                อัตราเข้าพัก
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {selectedView === 'monthly' ? (
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                    tickFormatter={(value) => `฿${value}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="rect"
                  />
                  <Bar 
                    dataKey="caseA" 
                    name="Case A (Fixed Price)"
                    fill="#f97316" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                  <Bar 
                    dataKey="caseB" 
                    name="Case B (AI Prediction)"
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              ) : (
                <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    labelFormatter={(label) => `เดือน: ${label}`}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="occupancyA" 
                    name="Case A (Fixed Price)"
                    stroke="#f97316" 
                    strokeWidth={3}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="occupancyB" 
                    name="Case B (AI Prediction)"
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

         {/* Scenario Cards */}
         <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-400">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Case A: Fixed Price</h3>
                <p className="text-gray-600">การตั้งราคาห้องพักแบบคงที่</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">รายได้รวม/ปี</p>
                <p className="text-2xl font-bold text-orange-600">฿{yearlyStats.caseA.totalRevenue.toLocaleString()}K</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">อัตราเข้าพักเฉลี่ย</p>
                <p className="text-2xl font-bold text-orange-600">{yearlyStats.caseA.avgOccupancy}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-400">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Case B: AI Prediction</h3>
                <p className="text-gray-600">การตั้งราคาตามการทำนายของ AI</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">รายได้รวม/ปี</p>
                <p className="text-2xl font-bold text-blue-600">฿{yearlyStats.caseB.totalRevenue.toLocaleString()}K</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">อัตราเข้าพักเฉลี่ย</p>
                <p className="text-2xl font-bold text-blue-600">{yearlyStats.caseB.avgOccupancy}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <span className="text-gray-600 text-sm">ผลต่างรายได้</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ฿{(yearlyStats.caseB.totalRevenue - yearlyStats.caseA.totalRevenue).toLocaleString()}K
            </p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">+{yearlyStats.caseB.growth}%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-gray-600 text-sm">ผลต่างอัตราเข้าพัก</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              +{(yearlyStats.caseB.avgOccupancy - yearlyStats.caseA.avgOccupancy).toFixed(1)}%
            </p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-600">ดีขึ้น</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <span className="text-gray-600 text-sm">RevPAR Case A</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">฿{yearlyStats.caseA.avgRevPar}</p>
            <span className="text-sm text-gray-500">ต่อห้อง/เดือน</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              <span className="text-gray-600 text-sm">RevPAR Case B</span>
            </div>
            <p className="text-2xl font-bold text-indigo-600">฿{yearlyStats.caseB.avgRevPar}</p>
            <span className="text-sm text-gray-500">ต่อห้อง/เดือน</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">สรุปผลการเปรียบเทียบ</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-orange-600">Case A: Fixed Price Strategy</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• รายได้รวมต่อปี: ฿26.5M</li>
                <li>• อัตราเข้าพักเฉลี่ย: 76.2%</li>
                <li>• เหมาะสำหรับการบริหารแบบเสถียร</li>
                <li>• ความเสี่ยงต่ำ แต่ผลตอบแทนจำกัด</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">Case B: AI-Driven Pricing</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• รายได้รวมต่อปี: ฿31.6M (+19.1%)</li>
                <li>• อัตราเข้าพักเฉลี่ย: 84.6%</li>
                <li>• เพิ่มประสิทธิภาพการตั้งราคา</li>
                <li>• ปรับราคาตามความต้องการตลาด</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">
              💡 คำแนะนำ: การใช้ AI-Driven Pricing (Case B) สามารถเพิ่มรายได้ได้มากถึง ฿5.05M ต่อปี 
              และยังช่วยเพิ่มอัตราการเข้าพักอีก 8.4% อีกด้วย
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwinotelSimulation;