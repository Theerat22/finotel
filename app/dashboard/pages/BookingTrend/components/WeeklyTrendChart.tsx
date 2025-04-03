import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { WeeklyDataItem } from '../types';

interface WeeklyTrendChartProps {
  data: WeeklyDataItem[];
}

const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">รูปแบบการเข้าพักรายสัปดาห์</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dayOfWeek" />
          <YAxis yAxisId="left" orientation="left" domain={[0, 8]} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="bookings" name="จำนวนห้องที่จองเฉลี่ย" fill="#8884d8" />
          <Bar yAxisId="right" dataKey="occupancyRate" name="อัตราการเข้าพัก (%)" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyTrendChart;