import React from 'react';
import { 
  Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart 
} from 'recharts';
import { CombinedDataItem } from '../types';

interface RevenueForecastChartProps {
  data: CombinedDataItem[];
}

const RevenueForecastChart: React.FC<RevenueForecastChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">การพยากรณ์รายได้รายเดือน (บาท)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value.toLocaleString()} บาท`, 'รายได้']} />
          <Legend />
          <Bar dataKey="estimatedRevenue" name="รายได้ที่คาดการณ์" fill="#8884d8" />
          <Line type="monotone" dataKey="target_revenue" name="เป้าหมายรายได้" stroke="#ff7300" />
          <Line type="monotone" dataKey="potentialRevenue" name="รายได้สูงสุดที่เป็นไปได้" stroke="#82ca9d" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueForecastChart;