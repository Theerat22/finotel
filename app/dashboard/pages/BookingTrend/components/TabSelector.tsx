import React from 'react';

interface TabSelectorProps {
  selectedTab: 'monthly' | 'weekly' | 'heatmap' | 'revenue' | 'promotion';
  setSelectedTab: (tab: 'monthly' | 'weekly' | 'heatmap' | 'revenue' | 'promotion') => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="mb-6 flex flex-wrap justify-center gap-2">
      <button 
        className={`px-4 py-2 rounded-lg ${selectedTab === 'monthly' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-800'}`}
        onClick={() => setSelectedTab('monthly')}
      >
        รายเดือน
      </button>
      <button 
        className={`px-4 py-2 rounded-lg ${selectedTab === 'weekly' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-800'}`}
        onClick={() => setSelectedTab('weekly')}
      >
        รายสัปดาห์
      </button>
    </div>
  );
};

export default TabSelector;