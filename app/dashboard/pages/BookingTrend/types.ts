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
  
  export interface CombinedDataItem {
    month: string;
    actualBooking: number;
    forecastBooking: number;
    actualOccupancy: number;
    forecastOccupancy: number;
    dynamicPrice: number;
    estimatedRevenue: number;
    target_revenue?: number;
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
  
  export interface WeeklyDataItem {
    dayOfWeek: string;
    bookings: number;
    occupancyRate: number;
  }