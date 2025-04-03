import React from 'react';
import { 
  Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart 
} from 'recharts';
import { CombinedDataItem } from '../types';

interface DynamicPricingChartProps {
  data: CombinedDataItem[];
}

const DynamicPricingChart: React.FC<DynamicPricingChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">กลยุทธ์การกำหนดราคาแบบไดนามิก</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="dynamicPrice" name="ราคาเฉลี่ย (บาท)" fill="#8884d8" />
          <Line yAxisId="right" type="monotone" dataKey="forecastOccupancy" name="อัตราการเข้าพัก (%)" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicPricingChart;