"use client";
import React, { useEffect, useState } from "react";
import {
  DollarSign,
  Users,
  TrendingUp,
  // Calendar,
} from "lucide-react";
// import StartNav from "@/app/components/StartNav";
import LoadingScreen from "@/app/dashboard/pages/ExpenseAnalysist/components/LoadingScreen";
// import Image from "next/image";
import { format, parseISO, startOfMonth, endOfMonth,  isSameDay, addMonths, subMonths } from 'date-fns';
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

export default function RoomDetails() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
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

  // const days = eachDayOfInterval({
  //   start: startOfMonth(currentDate),
  //   end: endOfMonth(currentDate)
  // });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.start.dateTime);
      return isSameDay(eventDate, day);
    });
  };

  const openEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };


  const MonthlyCalendar = () => {
    // Get first day of the month and calculate grid
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Get all days in the month
    const daysInMonth = [];
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }
    
    // Calculate empty cells at the beginning (Sunday = 0, Monday = 1, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
        
        <div className="grid grid-cols-7">
          {/* Empty cells for days before the first day of month */}
          {Array.from({ length: firstDayWeekday }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24 border border-gray-100 bg-gray-50"></div>
          ))}
          
          {/* Days of the month */}
          {daysInMonth.map(day => {
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
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };
  

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* <StartNav /> */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50  flex-grow">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-lg mb-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              ข้อมูลเดือน 2222
            </h1>
            <p className="text-blue-100 text-sm text-center mt-1">
              อัพเดทล่าสุด: 11 พฤษภาคม 2025
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
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

          <div className=" lg:w-2/3">
            <MonthlyCalendar />
          </div>

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
      </div>

    </>
  );
}
