import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://tatdataapi.io/api/v2/events?provinceId=219&limit=10', {
      method: 'GET',
      headers: {
        'x-api-key': process.env.TAT_DATA_API as string,
        'Accept-Language': 'th',
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    console.log('TAT API Response:', data);

    // ส่งข้อมูลกลับไปยัง client
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching events from TAT API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events data' },
      { status: 500 }
    );
  }
}