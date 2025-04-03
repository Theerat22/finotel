export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('th-TH').format(num);
  };
  
  // Percent Formatter
  export const formatPercent = (num: number): string => {
    return `${(num * 100).toFixed(1)}%`;
  };
  
  // Chart Colors
  export const CHART_COLORS = {
    revenue: {
      fill: 'rgba(79, 70, 229, 0.2)',
      stroke: '#4F46E5'
    },
    expense: {
      fill: 'rgba(239, 68, 68, 0.2)',
      stroke: '#EF4444'
    },
    ratio: {
      stroke: '#10B981'
    },
    // Category Colors
    categoryColors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444']
  };