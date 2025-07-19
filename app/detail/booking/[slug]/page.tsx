"use client";
import React, { use, useEffect, useState } from "react";
import {
  DollarSign,
  Users,
  TrendingUp,
  // Calendar,
} from "lucide-react";
import StartNav from "@/app/components/StartNav";
import LoadingScreen from "@/app/dashboard/pages/ExpenseAnalysist/components/LoadingScreen";
// import Image from "next/image";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval,  isSameDay, addMonths, subMonths } from 'date-fns';
import { th } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';


interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
}

// interface Occupancy {
//   week1: number | null;
//   week2: number | null;
//   week3: number | null;
//   week4: number | null;
// }

// interface Event {
//   id: number;
//   name: string;
//   introduction: string | null;
//   start_date: string | null;
//   end_date: string | null;
//   latitude: number | null;
//   longitude: number | null;
//   thumbnail_url: string | null;
//   created_at: string | null;
//   updated_at: string | null;
//   province_id: number | null;
//   province_name: string | null;
// }

// interface Month {
//   month: string;
//   occupancy: Occupancy;
//   events: Event[];
// }

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function RoomDetails({ params }: PageProps) {
  const { slug } = use(params);

  const match = slug.match(/^([A-Za-z]+)(\d+)$/);

  const month_name = match ? match[1] : "";
  const year = match ? match[2] : "";

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // กำหนดช่วงเวลาที่ต้องการดึงข้อมูล (เริ่มต้นและสิ้นสุดของเดือนปัจจุบัน)
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        
        const response = await fetch(`/api/calendar?startDate=${start.toISOString()}&endDate=${end.toISOString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data.events);
      } catch (err) {
        console.error('Error fetching events:', err);
        // setError("ไม่สามารถดึงข้อมูลกิจกรรมได้ โปรดลองอีกครั้งในภายหลัง");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // สร้างรายการวันทั้งหมดในเดือนปัจจุบัน
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  // กรองกิจกรรมที่กำลังจะมาถึง (นับจากวันนี้เป็นต้นไป และไม่เกิน 5 รายการ)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // const upcomingEvents = [...events]
  //   .filter(event => new Date(event.start.dateTime) >= today)
  //   .sort((a, b) => new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime())
  //   .slice(0, 5);

  // ดึงกิจกรรมของวันที่ระบุ
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.start.dateTime);
      return isSameDay(eventDate, day);
    });
  };

  // ฟังก์ชันเปิดรายละเอียดกิจกรรม
  const openEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  // ฟังก์ชันปิดรายละเอียดกิจกรรม
  // const closeEventDetails = () => {
  //   setSelectedEvent(null);
  // };

  const MonthlyCalendar = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* ส่วนหัวปฏิทิน */}
      <div className="bg-blue-900 text-white p-4 flex items-center justify-between">
        <button 
          onClick={prevMonth} 
          className="p-2 rounded-full hover:bg-blue-800 transition"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy', { locale: th })}
        </h2>
        
        <button 
          onClick={nextMonth} 
          className="p-2 rounded-full hover:bg-blue-800 transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* วันในสัปดาห์ */}
      <div className="grid grid-cols-7 bg-blue-50">
        {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (
          <div key={day} className="text-center py-2 font-semibold text-blue-800">
            {day}
          </div>
        ))}
      </div>
      
      {/* วันในเดือน */}
      <div className="grid grid-cols-7">
        {/* วันว่างก่อนวันแรกของเดือน */}
        {Array.from({ length: days[0].getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="h-24 border border-gray-100 bg-gray-50"></div>
        ))}
        
        {/* วันในเดือน */}
        {days.map(day => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, today);
          
          return (
            <div 
              key={day.toString()} 
              className={`h-24 border border-gray-100 p-1 overflow-hidden ${
                isToday ? 'bg-yellow-50 border-yellow-400' : ''
              }`}
            >
              <div className={`text-right mb-1 ${isToday ? 'text-yellow-600 font-bold' : 'text-gray-700'}`}>
                {format(day, 'd')}
              </div>
              
              <div className="overflow-y-auto h-16">
                {dayEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="text-xs p-1 mb-1 rounded bg-blue-100 text-blue-800 truncate cursor-pointer hover:bg-blue-200 transition"
                    title={event.summary}
                    onClick={() => openEventDetails(event)}
                  >
                    {event.summary}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // const [data, setData] = useState<Month | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [events, setEvents] = useState<Event[]>([]);

  // useEffect(() => {
  //   const fetchBookingData = async () => {
  //     try {
  //       const res = await fetch(`/api/database/get-booking?month=${slug}`);
  //       const data = await res.json();

  //       setData(data);
  //       setEvents(data.events);
  //     } catch (err) {
  //       console.error("Failed to fetch financial data:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBookingData();
  // }, [slug]);



  // const calculateAverageOccupancy = (occupancy: Occupancy): number => {
  //   const values = Object.values(occupancy).filter(
  //     (v): v is number => v !== null
  //   );
  //   const sum = values.reduce((acc, val) => acc + val, 0);
  //   return values.length > 0 ? sum / values.length : 0;
  // };
  const closeEventDetails = () => {
    setSelectedEvent(null);
  };
  



  if (!slug) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-2xl text-white">Data Not Found</p>
      </div>
    );
  }
  

  // console.log(data);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StartNav />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16 flex-grow">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-lg mb-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              ข้อมูลเดือน {month_name} {year}
            </h1>
            <p className="text-blue-100 text-sm text-center mt-1">
              อัพเดทล่าสุด: 11 พฤษภาคม 2025
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">สถิติหลัก</h3>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +4.2% จากเดือนก่อน
                </span>
              </div>

              <div className="space-y-4">
                {/* อัตราการเข้าพัก */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Users className="text-blue-600" size={18} />
                    </div>
                    <p className="text-gray-600">อัตราเข้าพัก</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-blue-600">
                      {/* {data
                        ? calculateAverageOccupancy(data.occupancy).toFixed(2) +
                          "%"
                        : "-"} */}
                        200%
                    </p>
                    <TrendingUp className="text-green-500 ml-1" size={16} />
                  </div>
                </div>
                <div className="h-px bg-gray-100"></div>

                {/* RevPAR */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <DollarSign className="text-green-600" size={18} />
                    </div>
                    <p className="text-gray-600">RevPAR</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-green-600">
                      {/* {data ? calculateAverageOccupancy(data.occupancy)/100 * 2000 : "-"} */}
                      200
                      </p>
                    <TrendingUp className="text-green-500 ml-1" size={16} />
                  </div>
                </div>
                <div className="h-px bg-gray-100"></div>

                {/* GOPPAR */}
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <BarChart3 className="text-purple-600" size={18} />
                    </div>
                    <p className="text-gray-600">GOPPAR</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-purple-600">1,243</p>
                    <TrendingDown className="text-red-500 ml-1" size={16} />
                  </div>
                </div> */}
              </div>
            </div>

            {/* Events Card */}
            {/* <div className="bg-white p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">วันหยุดและเทศกาล</h3>
                <Calendar className="text-red-500" size={18} />
              </div>

              <ul className="space-y-4">
                {events.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-start bg-red-50 p-3 rounded-xl"
                  >
                    <Image
                      src={event.thumbnail_url || ""}
                      alt={event.name}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover mr-3"
                    />

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {event.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {event.introduction}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {event.start_date &&
                          new Date(event.start_date).toLocaleString("th-TH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
             */}
             
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">ปฏิทินกิจกรรม</h1>
        
        {/* แก้ไขตรงนี้: ใช้ flex-col และ flex-col-reverse ในการเรียงลำดับบนอุปกรณ์ต่างๆ */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* แสดงกิจกรรมที่กำลังจะมาถึงอยู่ด้านบนเมื่อใช้บนมือถือ */}
          {/* <div className="lg:hidden w-full mb-6">
            <UpcomingEventsList />
          </div> */}
          
          {/* ปฏิทินแสดงกิจกรรมรายเดือน */}
          <div className="w-full lg:w-2/3">
            <MonthlyCalendar />
          </div>
          
          {/* กิจกรรมที่กำลังจะมาถึง (แสดงเฉพาะบนหน้าจอใหญ่) */}
          {/* <div className="hidden lg:block lg:w-1/3">
            <UpcomingEventsList />
          </div> */}
        </div>
      </div>

      {/* Modal แสดงรายละเอียดกิจกรรมด้วย backdrop blur */}
      {selectedEvent && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-blue-800 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg truncate">{selectedEvent.summary}</h3>
              <button 
                onClick={closeEventDetails}
                className="text-white hover:bg-blue-700 rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <CalendarIcon size={16} className="text-blue-600 mr-2" />
                  <div>
                    <div>{format(parseISO(selectedEvent.start.dateTime), 'EEEE d MMMM yyyy', { locale: th })}</div>
                    <div className="text-gray-600">
                      {format(parseISO(selectedEvent.start.dateTime), 'HH:mm')} - {format(parseISO(selectedEvent.end.dateTime), 'HH:mm')}
                    </div>
                  </div>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-start mb-2">
                    <span className="text-blue-600 mr-2">📍</span>
                    <div className="text-gray-700">{selectedEvent.location}</div>
                  </div>
                )}
              </div>
              
              {selectedEvent.description && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium mb-2 text-blue-800">รายละเอียด</h4>
                  <div className="text-gray-700 whitespace-pre-line">
                    {selectedEvent.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

    </>
  );
}
