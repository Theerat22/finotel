import React from 'react';
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, ResponsiveContainer } from 'recharts';
import { CombinedDataItem } from '../types';

interface MonthlyTrendChartProps {
  data: CombinedDataItem[];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">อัตราการเข้าพักรายเดือน (%)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => [`${value}%`, 'อัตราการเข้าพัก']} />
          <Legend />
          <Bar dataKey="actualOccupancy" name="2024 (จริง)" fill="#8884d8" />
          <Bar dataKey="forecastOccupancy" name="2024 (คาดการณ์)" fill="#82ca9d" />
          <Line type="monotone" dataKey="forecastOccupancy" name="แนวโน้ม 2024 (คาดการณ์)" stroke="#ff7300" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;