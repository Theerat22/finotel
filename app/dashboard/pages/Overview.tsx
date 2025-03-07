import React, { useState, useEffect } from "react";
import { IoTrendingUp, IoWallet, IoCalendar } from "react-icons/io5";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard: React.FC = () => {
  const [revenue, setRevenue] = useState(10000); // Mockup revenue data
  const [expenses, setExpenses] = useState(4000); // Mockup expenses data
  const [profit, setProfit] = useState(6000); // Mockup profit data
  const [priceTrend, setPriceTrend] = useState<string>("up");

  // Data for price trends (for demo purposes)
  const bookData = [
    { date: "Jan", book: 120 },
    { date: "Feb", book: 130 },
    { date: "Mar", book: 125 },
    { date: "Apr", book: 140 },
    { date: "May", book: 135 },
    { date: "Jun", book: 150 },
  ];

  useEffect(() => {
    // Simulate setting up revenue, expenses, and profit
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Hotel Financial Dashboard</h1>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div className="bg-green-100 p-3 rounded-lg mr-4">
            <IoWallet className="text-green-600 text-3xl" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-700">Revenue</h2>
            <p className="text-3xl font-bold text-black">{`$${revenue}`}</p>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div className="bg-red-100 p-3 rounded-lg mr-4">
            <IoWallet className="text-red-600 text-3xl" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-700">Expenses</h2>
            <p className="text-3xl font-bold text-black">{`$${expenses}`}</p>
          </div>
        </div>

        {/* Profit */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <IoTrendingUp className="text-blue-600 text-3xl" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-700">Profit</h2>
            <p className="text-3xl font-bold text-black">{`$${profit}`}</p>
          </div>
        </div>
      </div>

      {/* Room Price Analysis (Line Chart) */}
      <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Booking Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bookData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="book" stroke="#4a90e2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
