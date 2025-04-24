import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

const LINE_BOT_API = 'https://api.line.me/v2/bot';

export async function POST(request: NextRequest) {
  try {
    const { userId, message } = await request.json();
    
    if (!userId || !message) {
      return NextResponse.json(
        { message: 'userId and message are required' },
        { status: 400 }
      );
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
    };

    const body = {
      to: userId,
      messages: [
        {
          type: 'text',
          text: message
        }
      ]
    };

    const response = await axios.post(
      `${LINE_BOT_API}/message/push`,
      body,
      { headers }
    );

    return NextResponse.json({
      message: 'Send message success',
      responseData: response.data
    });
    
  } catch (error: unknown) {
    console.error('Error sending LINE message:', error);
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return NextResponse.json(
        { 
          message: 'Error sending message',
          error: axiosError.response?.data ? JSON.stringify(axiosError.response.data) : axiosError.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Error sending message',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}