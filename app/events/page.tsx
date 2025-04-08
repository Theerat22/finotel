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
    provinceCode: string;
    provinceName: string;
    amphurName?: string;
    tambolName?: string;
    [key: string]: string | undefined;
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
    thumbnailUrl: '/api/placeholder/600/400', // Use placeholder as default for mock data
    tags: [],
    distance: null,
    createdAt: '2024-04-22T17:00:00.000Z',
    updatedAt: '2025-04-07T17:00:00.000Z'
  },
  {
    eventId: 33250,
    name: 'วานา นาวา วอเตอร์จังเกิ้ล - โตโยต้า วอร์เตอร์เจ็ต โปรทัวร์ ไทยแลนด์ 2025',
    introduction: 'ณ ชายทะเลอ่าวประจวบฯ อ.เมืองประจวบคีรีขันธ์',
    startDate: '2025-04-04T17:00:00.000Z',
    endDate: '2025-04-05T17:00:00.000Z',
    latitude: 11.820485106733294,
    longitude: 99.79408707164187,
    location: {
      provinceCode: '77',
      provinceName: 'ประจวบคีรีขันธ์',
      amphurName: 'เมืองประจวบคีรีขันธ์'
    },
    thumbnailUrl: '/api/placeholder/600/400', // Use placeholder as default for mock data
    tags: [],
    distance: null,
    createdAt: '2025-04-05T17:00:00.000Z',
    updatedAt: '2025-04-05T17:00:00.000Z'
  },
  {
    eventId: 33073,
    name: 'งาน Maha Songkran World Water Festival 2025',
    introduction: 'เทศกาลสงกรานต์สุดยิ่งใหญ่ในกรุงเทพมหานคร',
    startDate: '2025-04-10T17:00:00.000Z',
    endDate: '2025-04-14T17:00:00.000Z',
    latitude: 13.7558693,
    longitude: 100.4932804,
    location: {
      provinceCode: '10',
      provinceName: 'กรุงเทพมหานคร'
    },
    thumbnailUrl: '/api/placeholder/600/400', // Use placeholder as default for mock data
    tags: [],
    distance: null,
    createdAt: '2025-03-05T17:00:00.000Z',
    updatedAt: '2025-04-02T17:00:00.000Z'
  }
];

export default function EventTabs() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // ใช้ AbortController เพื่อกำหนดเวลาหมดเวลาในการเรียก API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 วินาทีก่อนยกเลิก
        
        // เปลี่ยน URL เป็น localhost/api/fetchEvents
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
      } catch (err) {
        console.error('Error fetching events:', err);
        // ใช้ข้อมูลจำลองเมื่อ API ไม่สามารถเรียกได้
        setEvents(mockEvents);
        setError('ไม่สามารถเชื่อมต่อกับ API ได้ กำลังแสดงข้อมูลตัวอย่าง');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Reset image error state when tab changes
  useEffect(() => {
    setImageError(false);
  }, [activeTab]);

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  // Truncate text if it's too long
  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Get location display text
  const getLocationText = (location: Event['location']) => {
    if (!location) return 'ไม่ระบุสถานที่';
    
    const locationParts = [];
    if (location.tambolName) locationParts.push(location.tambolName);
    if (location.amphurName) locationParts.push(location.amphurName);
    if (location.provinceName) locationParts.push(location.provinceName);
    
    return locationParts.length > 0 ? locationParts.join(', ') : 'ไม่ระบุสถานที่';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
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
      
      {/* Tabs Header */}
      <div className="bg-blue-900 text-white">
        <div className="flex overflow-x-auto scrollbar-hide">
          {events.map((event, index) => (
            <button
              key={event.eventId}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-4 font-medium text-sm flex-shrink-0 transition-all duration-200 border-b-2 ${
                activeTab === index 
                  ? 'border-blue-400 bg-blue-800'
                  : 'border-transparent hover:bg-blue-800/50'
              }`}
            >
              {truncateText(event.name, 20)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {events.length > 0 && (
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image with error handling */}
            <div className="rounded-lg overflow-hidden h-64 md:h-full relative">
              {imageError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-500">รูปภาพไม่สามารถแสดงได้</span>
                </div>
              ) : (
                <Image 
                  src={events[activeTab]?.thumbnailUrl || "/api/placeholder/600/400"} 
                  alt={events[activeTab]?.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            {/* Event Details */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                {events[activeTab]?.name}
              </h2>
              
              <div className="mb-4 text-blue-800">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {formatDate(events[activeTab]?.startDate)} - {formatDate(events[activeTab]?.endDate)}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {getLocationText(events[activeTab]?.location)}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 flex-grow mb-6">
                {events[activeTab]?.introduction || 'ไม่มีคำอธิบายเพิ่มเติม'}
              </p>
              
              <button className="self-start px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md">
                ดูรายละเอียดเพิ่มเติม
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}