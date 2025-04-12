// Define chart colors
export const CHART_COLORS = {
  revenue: {
    stroke: '#4f46e5', // Indigo
    fill: '#c7d2fe'
  },
  expense: {
    stroke: '#e11d48', // Rose
    fill: '#fecdd3'
  },
  ratio: {
    stroke: '#8b5cf6', // Purple
  },
  categoryColors: [
    '#0891b2', // Cyan
    '#d946ef', // Fuchsia
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#f43f5e', // Rose
    '#6366f1', // Indigo
  ]
};

// Format numbers to Thai Baht format
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('th-TH').format(Math.round(value));
};

// Format percentage
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('th-TH', { 
    style: 'percent', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 1 
  }).format(value);
};