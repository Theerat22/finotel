import { HistoricalDataItem, ForecastDataItem, DailyDataItem, CombinedDataItem } from './types';

// Generate historical data function
export const generateHistoricalData = (): HistoricalDataItem[] => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return months.map((month, index) => {
    // Higher bookings during Songkran (April) and winter months
    let baseBooking = 4.5;
    if (month === 'April') baseBooking = 6.2; // Songkran
    else if (['November', 'December', 'January'].includes(month)) baseBooking = 5.8; // High season
    else if (['July', 'August'].includes(month)) baseBooking = 3.2; // Low season
    
    const booking = baseBooking + Math.random() * 0.8;
    return {
      month,
      monthIndex: index,
      actualBooking: parseFloat(booking.toFixed(2)),
      occupancyRate: parseFloat((booking / 8 * 100).toFixed(2))
    };
  });
};

export const generateForecastData = (historicalData: HistoricalDataItem[]): ForecastDataItem[] => {
  return historicalData.map(item => {
    // Forecast is similar to historical data but with some growth and variation
    const forecastGrowth = 1.05 + (Math.random() * 0.2);
    const forecastBooking = Math.min(8, item.actualBooking * forecastGrowth);
    
    return {
      ...item,
      forecastBooking: parseFloat(forecastBooking.toFixed(2)),
      forecastOccupancy: parseFloat((forecastBooking / 8 * 100).toFixed(2)),
      yhat_lower: parseFloat((forecastBooking * 0.9).toFixed(2)),
      yhat_upper: parseFloat((forecastBooking * 1.1).toFixed(2))
    };
  });
};

// Calculate dynamic price based on factors
export const calculateDynamicPrice = (
  basePrice: number, 
  isHighSeason: boolean, 
  isWeekend: boolean, 
  isHoliday: boolean, 
  occupancyRate: number
): number => {
  let price = basePrice;
  
  // Adjust price based on season
  if (isHighSeason) {
    price *= 1.3; // Increase price by 30% during high season
  }
  
  // Adjust price based on weekend
  if (isWeekend) {
    price *= 1.15; // Increase price by 15% on weekends
  }
  
  // Adjust price based on holidays
  if (isHoliday) {
    price *= 1.4; // Increase price by 40% on holidays
  }
  
  // Adjust price based on booking rate (Demand-based pricing)
  if (occupancyRate > 80) {
    price *= 1.25; // Increase price by 25% when booking rate is very high
  } else if (occupancyRate > 60) {
    price *= 1.15; // Increase price by 15% when booking rate is high
  } else if (occupancyRate < 30) {
    price *= 0.85; // Decrease price by 15% when booking rate is low
  } else if (occupancyRate < 15) {
    price *= 0.75; // Decrease price by 25% when booking rate is very low
  }
  
  return Math.round(price);
};

// Generate daily data for heatmap
export const generateDailyData = (): DailyDataItem[] => {
  const basePrice = 2500; // THB per room
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  const dailyData: DailyDataItem[] = [];
  
  // Thai holidays
  const thaiHolidays: Record<string, string> = {
    '1-1': 'New Year\'s Day',
    '4-13': 'Songkran',
    '4-14': 'Songkran',
    '4-15': 'Songkran',
    '5-1': 'Labor Day',
    '5-4': 'Coronation Day',
    '6-3': 'Queen\'s Birthday',
    '7-28': 'King\'s Birthday',
    '8-12': 'Mother\'s Day',
    '10-13': 'King Rama IX Memorial Day',
    '12-5': 'Father\'s Day',
    '12-10': 'Constitution Day',
    '12-31': 'New Year\'s Eve'
  };
  
  months.forEach(month => {
    let maxDays = 31;
    if ([4, 6, 9, 11].includes(month)) maxDays = 30;
    else if (month === 2) maxDays = 28;
    
    days.forEach(day => {
      if (day <= maxDays) {
        const baseOccupancy = 50;
        
        const dayOfWeek = (day % 7);
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const weekendEffect = isWeekend ? 15 : 0;
        
        // Check if it's a holiday
        const dateKey = `${month}-${day}`;
        const isHoliday = dateKey in thaiHolidays;
        const holidayName = thaiHolidays[dateKey];
        
        // Determine high season
        const isHighSeason = [12, 1, 2, 4].includes(month);
        
        // Seasonal effects
        let seasonalEffect = 0;
        if (month === 4 && day >= 13 && day <= 15) seasonalEffect = 40; // Songkran
        else if ([11, 12, 1].includes(month)) seasonalEffect = 20; // High season
        else if ([7, 8].includes(month)) seasonalEffect = -15; // Low season
        
        // Random variation
        const randomEffect = Math.random() * 10 - 5;
        
        // Calculate final occupancy rate
        let occupancyRate = baseOccupancy + weekendEffect + seasonalEffect + randomEffect;
        occupancyRate = Math.min(100, Math.max(0, occupancyRate));
        
        // Calculate bookings based on occupancy
        const bookings = (occupancyRate / 100 * 8);
        
        // Calculate dynamic price
        const dynamicPrice = calculateDynamicPrice(
          basePrice, 
          isHighSeason, 
          isWeekend, 
          isHoliday, 
          occupancyRate
        );
        
        dailyData.push({
          day,
          month,
          occupancyRate: parseFloat(occupancyRate.toFixed(2)),
          bookings: parseFloat(bookings.toFixed(2)),
          dynamicPrice,
          is_holiday: isHoliday,
          holiday_name: holidayName,
          is_weekend: isWeekend,
          is_high_season: isHighSeason
        });
      }
    });
  });
  
  return dailyData;
};

// Generate revenue data with RevPER
export const generateRevenueData = (
  forecastData: ForecastDataItem[],
  dailyData: DailyDataItem[]
): CombinedDataItem[] => {
  
  // Calculate monthly data
  const monthlyData = forecastData.map((item) => {
    // Get all daily data for this month
    const monthDailyData = dailyData.filter(d => d.month === item.monthIndex + 1);
    
    // Calculate average price for the month
    const avgPrice = monthDailyData.reduce((sum, d) => sum + d.dynamicPrice, 0) / monthDailyData.length;
    
    // Calculate days in month (approximate)
    const daysInMonth = monthDailyData.length;
    
    // Calculate estimated revenue
    const estimatedRevenue = item.forecastBooking * avgPrice * daysInMonth;
    
    // Calculate potential revenue (if all rooms were booked at current price)
    const totalRooms = 8; // Total number of rooms
    const potentialRevenue = totalRooms * avgPrice * daysInMonth;
    
    // Calculate RevPER (Revenue Per Expected Room)
    const revPER = estimatedRevenue / potentialRevenue;
    
    return {
      month: item.month,
      actualBooking: item.actualBooking,
      forecastBooking: item.forecastBooking,
      actualOccupancy: item.occupancyRate,
      forecastOccupancy: item.forecastOccupancy,
      dynamicPrice: Math.round(avgPrice),
      estimatedRevenue: Math.round(estimatedRevenue),
      potentialRevenue: Math.round(potentialRevenue),
      revPER: parseFloat(revPER.toFixed(3)),
      revPERPercentage: parseFloat((revPER * 100).toFixed(1))
    };
  });
  
  // Calculate total yearly revenue
  const totalYearlyRevenue = monthlyData.reduce((sum, item) => sum + item.estimatedRevenue, 0);
  
  // Set target revenue (10% higher than projected)
  const targetYearlyRevenue = totalYearlyRevenue * 1.1;
  
  // Add revenue targets based on the proportion
  return monthlyData.map(item => {
    const revenueProportion = item.estimatedRevenue / totalYearlyRevenue;
    return {
      ...item,
      target_revenue: Math.round(revenueProportion * targetYearlyRevenue)
    };
  });
};

// Helper function to calculate summary statistics
export const calculateSummaryStatistics = (
  historicalData: HistoricalDataItem[],
  forecastData: ForecastDataItem[],
  revenueData: CombinedDataItem[]
) => {
  const averageActualOccupancy = parseFloat(
    (historicalData.reduce((sum, item) => sum + item.occupancyRate, 0) / historicalData.length).toFixed(2)
  );
  
  const averageForecastOccupancy = parseFloat(
    (forecastData.reduce((sum, item) => sum + item.forecastOccupancy, 0) / forecastData.length).toFixed(2)
  );
  
  const peakMonth = forecastData.reduce(
    (max, item) => item.forecastOccupancy > max.forecastOccupancy ? item : max, forecastData[0]
  );
  
  const lowMonth = forecastData.reduce(
    (min, item) => item.forecastOccupancy < min.forecastOccupancy ? item : min, forecastData[0]
  );
  
  // Calculate financial statistics
  const totalYearlyRevenue = revenueData.reduce((sum, item) => sum + item.estimatedRevenue, 0);
  const targetYearlyRevenue = revenueData.reduce((sum, item) => sum + (item.target_revenue || 0), 0);
  
  const averageRevPER = parseFloat(
    (revenueData.reduce((sum, item) => sum + (item.revPER || 0), 0) / revenueData.length).toFixed(3)
  );
  const averageRevPERPercentage = parseFloat((averageRevPER * 100).toFixed(1));
  
  // Find highest and lowest RevPER months
  const highestRevPERMonth = revenueData.reduce(
    (max, item) => (item.revPER || 0) > (max.revPER || 0) ? item : max, revenueData[0]
  );
  
  const lowestRevPERMonth = revenueData.reduce(
    (min, item) => (item.revPER || 0) < (min.revPER || 0) ? item : min, revenueData[0]
  );

  return {
    averageActualOccupancy,
    averageForecastOccupancy,
    peakMonth,
    lowMonth,
    totalYearlyRevenue,
    targetYearlyRevenue,
    averageRevPER,
    averageRevPERPercentage,
    highestRevPERMonth,
    lowestRevPERMonth
  };
};