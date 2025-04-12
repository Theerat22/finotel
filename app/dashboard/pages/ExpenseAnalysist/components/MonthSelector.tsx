import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface MonthSelectorProps {
  months: string[];
  selectedMonth: string | 'all';
  onChange: (month: string | 'all') => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ months, selectedMonth, onChange }) => {
  return (
    <div className="relative inline-block">
      <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all duration-200 overflow-hidden">
        <div className="flex items-center justify-center bg-blue-50 p-3 border-r border-gray-200">
          <Calendar className="text-blue-600" size={18} />
        </div>
        
        <select
          className="appearance-none bg-transparent text-gray-700 py-2 pl-3 pr-10 focus:outline-none font-medium"
          value={selectedMonth}
          onChange={(e) => onChange(e.target.value as string | 'all')}
          aria-label="เลือกเดือน"
        >
          <option value="all">ทั้งปี</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default MonthSelector;