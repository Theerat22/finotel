export interface HistoricalDataItem {
  month: string;
  monthIndex: number;
  actualBooking: number;
  occupancyRate: number;
}

export interface ForecastDataItem extends HistoricalDataItem {
  forecastBooking: number;
  forecastOccupancy: number;
  yhat_lower: number;
  yhat_upper: number;
}

export interface DailyDataItem {
  day: number;
  month: number;
  occupancyRate: number;
  bookings: number;
  dynamicPrice: number;
  is_holiday: boolean;
  holiday_name?: string;
  is_weekend: boolean;
  is_high_season: boolean;
}

export interface CombinedDataItem {
  month: string;
  actualBooking: number;
  forecastBooking: number;
  actualOccupancy: number;
  forecastOccupancy: number;
  dynamicPrice: number;
  estimatedRevenue: number;
  potentialRevenue: number;
  revPER: number;
  revPERPercentage: number;
  target_revenue?: number;
}

export interface GOPPARDataItem extends CombinedDataItem {
  operatingExpenses: number;
  grossOperatingProfit: number;
  goppar: number;
  gopparPercentage: number;
}

export interface SummaryStatistics {
  averageActualOccupancy: number;
  averageForecastOccupancy: number;
  peakMonth: ForecastDataItem;
  lowMonth: ForecastDataItem;
  totalYearlyRevenue: number;
  targetYearlyRevenue: number;
  averageRevPER: number;
  averageRevPERPercentage: number;
  highestRevPERMonth: CombinedDataItem;
  lowestRevPERMonth: CombinedDataItem;
}

export interface GOPPARStatistics extends SummaryStatistics {
  totalOperatingExpenses: number;
  totalGrossOperatingProfit: number;
  averageGOPPAR: number;
  averageGOPPARPercentage: number;
  highestGOPPARMonth: GOPPARDataItem;
  lowestGOPPARMonth: GOPPARDataItem;
  overallProfitMargin: number;
}