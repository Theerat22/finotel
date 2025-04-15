"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Event {
  eventId: number;
  name: string;
  introduction: string | null;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  location: {
    province?: {
      name: string;
      provinceId: number;
    };
    provinceCode?: string;
    provinceName?: string;
    amphurName?: string;
    tambolName?: string;
  };
  thumbnailUrl: string;
  tags: [];
  distance: number | null;
  createdAt: string;
  updatedAt: string;
}

interface EventsResponse {
  data: Event[];
  pagination: {
    pageNumber: number;
    pageSize: number;
    total: number;
  };
  query: {
    limit: number;
    provinceId: string;
    page: number;
  };
}

// Thai month names
const thaiMonths = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

// Thai holidays (example data) - using string keys for type safety
const thaiHolidays: Record<string, { date: string; name: string }[]> = {
  '0': [{ date: '1', name: 'วันขึ้นปีใหม่' }],
  '1': [{ date: '14', name: 'วันวาเลนไทน์' }],
  '3': [
    { date: '6', name: 'วันจักรี' },
    { date: '13-15', name: 'เทศกาลสงกรานต์' }
  ],
  '4': [{ date: '1', name: 'วันแรงงานแห่งชาติ' }, { date: '5', name: 'วันฉัตรมงคล' }],
  '5': [{ date: '3', name: 'วันวิสาขบูชา' }],
  '7': [{ date: '12', name: 'วันแม่แห่งชาติ' }],
  '9': [{ date: '13', name: 'วันคล้ายวันสวรรคต ร.9' }, { date: '23', name: 'วันปิยมหาราช' }],
  '11': [{ date: '5', name: 'วันพ่อแห่งชาติ' }, { date: '10', name: 'วันรัฐธรรมนูญ' }, { date: '31', name: 'วันสิ้นปี' }]
};

// Mock data for fallback if API fails
const mockEvents: Event[] = [
  {
    eventId: 29466,
    name: 'งานประเพณีสงกรานต์ จังหวัดแพร่ ประจำปี 2567',
    introduction: '1.งานสืบสานประเพณีถ้ำผานางคอยประจำปี 2567 ณ ถ้ำผานางคอย อ.ร้องกวาง จ.แพร่ วันที่ 11-13 เมษายน 2567\r\n2.งาน "สงกรานต์ สีสัน มหัศจรรย์ 1,000 ปี" Amazing Jungle Tribes ณ เทศบาลตำบลวังชิ้น อ.วังชิ้น จ.แพร่ วันที่ 13 เม.ย. 2567',
    startDate: '2024-04-10T17:00:00.000Z',
    endDate: '2024-04-16T17:00:00.000Z',
    latitude: 18.1448849,
    longitude: 100.1409899,
    location: {
      provinceCode: '54',
      provinceName: 'แพร่',
      amphurName: 'เมืองแพร่'
    },
    thumbnailUrl: '/api/placeholder/600/400',
    tags: [],
    distance: null,
    createdAt: '2024-04-22T17:00:00.000Z',
    updatedAt: '2025-04-07T17:00:00.000Z'
  },
  {
    eventId: 29467,
    name: 'เทศกาลดนตรีในสวน สวนหลวง ร.9',
    introduction: 'เทศกาลดนตรีในสวนประจำปี จัดขึ้นที่สวนหลวง ร.9 กรุงเทพมหานคร',
    startDate: '2024-05-15T17:00:00.000Z',
    endDate: '2024-05-17T17:00:00.000Z',
    latitude: 13.68936,
    longitude: 100.6455,
    location: {
      provinceCode: '10',
      provinceName: 'กรุงเทพมหานคร',
      amphurName: 'ประเวศ'
    },
    thumbnailUrl: '/api/placeholder/600/400',
    tags: [],
    distance: null,
    createdAt: '2024-05-01T17:00:00.000Z',
    updatedAt: '2025-04-07T17:00:00.000Z'
  },
  {
    eventId: 29468,
    name: 'งานลอยกระทง จังหวัดเชียงใหม่',
    introduction: 'ประเพณีลอยกระทงเชียงใหม่ประจำปี มีการประกวดขบวนแห่ ประกวดนางนพมาศ และการปล่อยโคมลอย',
    startDate: '2024-11-10T17:00:00.000Z',
    endDate: '2024-11-12T17:00:00.000Z',
    latitude: 18.788,
    longitude: 98.9853,
    location: {
      provinceCode: '50',
      provinceName: 'เชียงใหม่',
      amphurName: 'เมืองเชียงใหม่'
    },
    thumbnailUrl: '/api/placeholder/600/400',
    tags: [],
    distance: null,
    createdAt: '2024-10-20T17:00:00.000Z',
    updatedAt: '2025-04-07T17:00:00.000Z'
  },
];

export default function EventCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch('/api/fetchEvents', {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        
        const data: EventsResponse = await response.json();
        console.log('API Response:', data);
        setEvents(data.data);
        
        // Set first event as selected if available
        if (data.data.length > 0) {
          setSelectedEvent(data.data[0]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        // Use mock data when API fails
        setEvents(mockEvents);
        setSelectedEvent(mockEvents[0]);
        setError('ไม่สามารถเชื่อมต่อกับ API ได้ กำลังแสดงข้อมูลตัวอย่าง');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Reset image error state when selected event changes
  useEffect(() => {
    setImageError(false);
  }, [selectedEvent]);

  // Function to group events by month
  const getEventsByMonth = () => {
    const eventsByMonth: { [key: number]: Event[] } = {};
    
    events.forEach(event => {
      const startDate = new Date(event.startDate);
      const month = startDate.getMonth();
      
      if (!eventsByMonth[month]) {
        eventsByMonth[month] = [];
      }
      
      eventsByMonth[month].push(event);
    });
    
    return eventsByMonth;
  };

  // Get events for the selected month
  const getEventsForSelectedMonth = () => {
    return events.filter(event => {
      const startDate = new Date(event.startDate);
      return startDate.getMonth() === selectedMonth;
    });
  };

  // Format compact date (just day and month)
  const formatCompactDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${thaiMonths[date.getMonth()]}`;
  };

  // Get location display text
  const getLocationText = (location: Event['location']) => {
    if (!location) return 'ไม่ระบุสถานที่';
    
    // Handle new API structure where province is an object with name property
    if (location.province && location.province.name) {
      return location.province.name;
    }
    
    // Handle original structure for backward compatibility
    if (location.provinceName) {
      return location.provinceName;
    }
    
    return 'ไม่ระบุสถานที่';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const eventsByMonth = getEventsByMonth();
  const currentMonthEvents = getEventsForSelectedMonth();
  const selectedMonthString = String(selectedMonth);
  const hasHolidays = thaiHolidays.hasOwnProperty(selectedMonthString);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">ปฏิทินกิจกรรมประจำปี</h1>
      
      {/* Notification if using mock data */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Month Selector */}
      <div className="flex justify-center mb-8 overflow-x-auto scrollbar-hide mb-6">
        <div className="bg-white rounded-xl shadow-md p-2 flex space-x-1">
          {thaiMonths.map((month, index) => (
            <button
              key={index}
              onClick={() => setSelectedMonth(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedMonth === index 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-blue-100 text-gray-600'
              } ${eventsByMonth[index]?.length ? 'border-b-2 border-blue-400' : ''}`}
            >
              {month}
              {eventsByMonth[index]?.length ? 
                <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                  {eventsByMonth[index].length}
                </span> : null
              }
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Selected Event Details */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
          {selectedEvent ? (
            <div className="flex flex-col">
              <div className="h-64 md:h-80 relative">
                {imageError ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-500">รูปภาพไม่สามารถแสดงได้</span>
                  </div>
                ) : (
                  <Image 
                    src={selectedEvent.thumbnailUrl || "/api/placeholder/600/400"} 
                    alt={selectedEvent.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={() => setImageError(true)}
                  />
                )}
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {formatCompactDate(selectedEvent.startDate)} - {formatCompactDate(selectedEvent.endDate)}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedEvent.name}</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-blue-800 mb-4">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{getLocationText(selectedEvent.location)}</span>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">รายละเอียด</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedEvent.introduction || 'ไม่มีคำอธิบายเพิ่มเติม'}
                  </p>
                </div>
                
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md">
                  ดูรายละเอียดเพิ่มเติม
                </button>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-500">
              ไม่มีกิจกรรมในเดือนที่เลือก
            </div>
          )}
        </div>
        
        {/* Right Section - Monthly Calendar */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-xl font-bold">{thaiMonths[selectedMonth]} 2567</h2>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">กิจกรรมในเดือนนี้</h3>
            
            <div className="space-y-3 mb-6">
              {currentMonthEvents.length > 0 ? (
                currentMonthEvents.map(event => (
                  <div 
                    key={event.eventId}
                    onClick={() => setSelectedEvent(event)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedEvent?.eventId === event.eventId 
                        ? 'bg-blue-100 border-l-4 border-blue-600' 
                        : 'bg-gray-50 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center text-sm text-blue-600 font-medium mb-1">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {formatCompactDate(event.startDate)} - {formatCompactDate(event.endDate)}
                    </div>
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{getLocationText(event.location)}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                  ไม่มีกิจกรรมในเดือนนี้
                </div>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">วันสำคัญ</h3>
              
              <div className="space-y-2">
                {hasHolidays ? (
                  thaiHolidays[selectedMonthString].map((holiday, index) => (
                    <div key={index} className="flex items-center p-2 bg-red-50 text-red-700 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">{holiday.name}</div>
                        <div className="text-sm">{holiday.date} {thaiMonths[selectedMonth]}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                    ไม่มีวันสำคัญในเดือนนี้
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}