import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

const LINE_BOT_API = 'https://api.line.me/v2/bot';

export async function POST(request: NextRequest) {
  try {
    const { userId, month, revpar, goppar, occ } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { message: 'userId and message are required' },
        { status: 400 }
      );
    }

    // console.log('selectedMonth:', selectedMonth.month);

    const flexMessage = {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "สรุปการเงินโรงแรม",
              "weight": "bold",
              "color": "#1DB446",
              "size": "sm"
            },
            {
              "type": "text",
              "text": month,
              "weight": "bold",
              "size": "xxl",
              "margin": "md"
            },
            {
              "type": "text",
              "size": "xs",
              "color": "#aaaaaa",
              "wrap": true,
              "text": "Nan, Thailand"
            },
            {
              "type": "separator",
              "margin": "xxl"
            },
            {
              "type": "box",
              "layout": "vertical",
              "margin": "xxl",
              "spacing": "sm",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "text",
                      "text": "ทำนายอัตราการเข้าพัก",
                      "size": "xl",
                      "color": "#555555",
                      "flex": 0
                    },
                    {
                      "type": "text",
                      "text": occ,
                      "size": "xl",
                      "color": "#1DB446",
                      "align": "end"
                    }
                  ]
                },
                {
                  "type": "separator",
                  "margin": "xxl"
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "margin": "xxl",
                  "contents": [
                    {
                      "type": "text",
                      "text": "RevPAR",
                      "size": "sm",
                      "color": "#555555"
                    },
                    {
                      "type": "text",
                      "text": revpar,
                      "size": "sm",
                      "color": "#145CFA",
                      "align": "end"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "text",
                      "text": goppar,
                      "size": "sm",
                      "color": "#555555"
                    },
                    {
                      "type": "text",
                      "text": "867",
                      "size": "sm",
                      "color": "#145CFA",
                      "align": "end"
                    }
                  ]
                }
              ]
            },
            {
              "type": "separator",
              "margin": "xxl"
            },
            {
              "type": "box",
              "layout": "horizontal",
              "margin": "md",
              "contents": [
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "ดูเพิ่มเติม",
                    "uri": "http://linecorp.com/"
                  }
                }
              ]
            }
          ]
        },
        "styles": {
          "footer": {
            "separator": true
          }
        }
      };


    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
    };

    const body = {
      to: userId,
      messages: [
        {
          type: 'flex',
          altText: 'Send Flex message',
          contents: flexMessage
        }
      ]
    };

    const response = await axios.post(
      `${LINE_BOT_API}/message/push`,
      body,
      { headers }
    );

    return NextResponse.json({
      message: 'Send Flex message success',
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