// pages/api/send-message.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const LINE_BOT_API = 'https://api.line.me/v2/bot';

type ResponseData = {
  message: string;
  responseData?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, message } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({ message: 'userId and message are required' });
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

    return res.status(200).json({
      message: 'Send message success',
      responseData: response.data
    });
  } catch (error) {
    console.error('Error sending LINE message:', error);
    // return res.status(500).json({
    //   message: 'Error sending message',
    //   error: error.response?.data || error.message
    // });
  }
}