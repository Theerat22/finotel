import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

// กำหนด interface สำหรับข้อมูล event
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
  htmlLink?: string;
}

interface GoogleCalendarEvent {
  id?: string;
  summary?: string;
  description?: string;
  start?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  htmlLink?: string;
}

// กำหนด interface สำหรับ response
interface CalendarResponse {
  events: CalendarEvent[];
  count: number;
  timeZone?: string;
}

// กำหนด interface สำหรับ error response
interface ErrorResponse {
  error: string;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}

export async function GET(request: NextRequest): Promise<NextResponse<CalendarResponse | ErrorResponse>> {
  try {
    // ตรวจสอบว่ามี env variables ที่จำเป็นหรือไม่
    if (!process.env.GOOGLE_CALENDAR_ID) {
      console.error('Missing Google Calendar credentials', {
        // credentials: !!process.env.GOOGLE_CREDENTIALS,
        calendarId: !!process.env.GOOGLE_CALENDAR_ID
      });
      
      return NextResponse.json(
        { error: 'Server configuration error - missing credentials' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    // เปลี่ยนชื่อพารามิเตอร์ให้ตรงกับที่ส่งมาจาก frontend
    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');
    
    if (!start || !end) {
      return NextResponse.json(
        { error: 'Start and end dates are required' },
        { status: 400 }
      );
    }

    const calendarId = process.env.CD_CALENDAR_ID;
    const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
    const client_email = process.env.GOOGLE_CLIENT_EMAIL;
    const private_key_base64 = process.env.GOOGLE_SECRET_KEY
    if (!private_key_base64) {
      throw new Error("GOOGLE_SECRET_KEY_BASE64 environment variable is not set");
    }

    const private_key = Buffer.from(private_key_base64, 'base64').toString('ascii');

    // สร้าง JWT auth client
    const auth = new google.auth.JWT({
      email: client_email,
      key: private_key,
      scopes: [SCOPES]
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // ดึงข้อมูลกิจกรรมจาก Google Calendar
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: start,
      timeMax: end,
      singleEvents: true,
      orderBy: 'startTime',
    });

    // แปลงข้อมูลตาม interface ที่กำหนด
    const events: CalendarEvent[] = (response.data.items as GoogleCalendarEvent[])?.map(event => {
      // สร้าง start และ end objects ที่ถูกต้องตาม CalendarEvent interface
      const startObj: CalendarEvent['start'] = {
        dateTime: event.start?.dateTime || event.start?.date || new Date().toISOString(),
        timeZone: event.start?.timeZone || 'UTC'
      };
      
      const endObj: CalendarEvent['end'] = {
        dateTime: event.end?.dateTime || event.end?.date || new Date().toISOString(),
        timeZone: event.end?.timeZone || 'UTC'
      };
      
      return {
        id: event.id || '',
        summary: event.summary || '',
        description: event.description,
        start: startObj,
        end: endObj,
        location: event.location,
        htmlLink: event.htmlLink
      };
    }) || [];

    // เพิ่ม return statement ที่ขาดหายไป
    return NextResponse.json({
      events,
      count: events.length,
      timeZone: response.data.timeZone || undefined // Convert null to undefined
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching calendar events:', error);
    
    if (error.response) {
      console.error('Response error data:', JSON.stringify(error.response.data));
      console.error('Response error status:', error.response.status);
    }
    
    return NextResponse.json(
      {
        error: 'Failed to fetch calendar events',
        message: error.message || 'Unknown error',
        details: error.response?.data?.error || {},
      },
      { status: 500 }
    );
  }
}