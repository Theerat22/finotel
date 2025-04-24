/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from 'react';
import liff from '@line/liff';
import { CiCircleCheck } from "react-icons/ci";
import { useUser } from '@/app/components/UserContext';
import axios from 'axios';

const Complete: React.FC = () => {
    const [status, setStatus] = useState<{
        loading: boolean;
        error?: string;
        success?: boolean;
      }>({ loading: false });

    const message = [[
        {
          "type": "bubble",
          "size": "nano",
          "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "มิถุนายน",
                "color": "#ffffff",
                "align": "start",
                "size": "md",
                "gravity": "center"
              },
              {
                "type": "text",
                "text": "70%",
                "margin": "none",
                "size": "xs",
                "align": "start"
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "filler"
                      }
                    ],
                    "width": "70%",
                    "backgroundColor": "#0D8186",
                    "height": "6px"
                  }
                ],
                "backgroundColor": "#9FD8E36E",
                "height": "6px",
                "margin": "sm"
              }
            ],
            "backgroundColor": "#27ACB2",
            "paddingTop": "19px",
            "paddingAll": "12px",
            "paddingBottom": "16px"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "RevPAR",
                    "color": "#8C8C8C",
                    "size": "xxs",
                    "wrap": true,
                    "align": "start"
                  },
                  {
                    "type": "text",
                    "text": "200",
                    "size": "xs",
                    "align": "end"
                  }
                ],
                "flex": 1
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "GOPPAR",
                    "color": "#8C8C8C",
                    "size": "xxs",
                    "wrap": true,
                    "align": "start"
                  },
                  {
                    "type": "text",
                    "text": "100",
                    "size": "xs",
                    "align": "end"
                  }
                ],
                "flex": 1
              },
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "เพิ่มเติม",
                  "uri": "http://linecorp.com/"
                },
                "margin": "xs"
              }
            ],
            "spacing": "md",
            "paddingAll": "12px"
          },
          "styles": {
            "footer": {
              "separator": false
            }
          }
        }
      ]];

    const { userData } = useUser();
    const userId = userData.userId;

    const sendMessage = async () => {
        if (!message) {
            setStatus({ loading: false, error: 'Message cannot be empty' });
            return;
        }
    
        try {
            setStatus({ loading: true });
            console.log('Sending message:', message);
            
            const response = await axios.post('/api/sendFlexMessage', {
            userId,
            message
            });
            
            console.log('Response:', response.data);
            setStatus({ loading: false, success: true });

            setTimeout(() => {
            setStatus({ loading: false });
            }, 3000);
        } catch (error) {
            console.error("Error:", error);
        };
    };


    useEffect(() => {
        const initializeLiff = async () => {
          try {
            await liff.init({ liffId: "2007306544-Oyvzorbv" });
            sendMessage();
            setTimeout(() => {
              liff.closeWindow();
            }, 1000);
          } catch (error) {
            console.error('LIFF initialization failed', error);
          }
        };
    
        initializeLiff();
      }, []);


  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow overflow-hidden p-10 items-center text-center flex flex-col">
        <CiCircleCheck size={100} className='text-green-600' />
        <h1 className='font-bold text-2xl text-blue-600 mt-4'>เริ่มต้นกับ Finotel เสร็จเรียบร้อย</h1>
        {status.error && (
        <div className="text-red-500 text-sm">{status.error}</div>
      )}
      
      {status.success && (
        <div className="text-green-500 text-sm"></div>
      )}
      </div>
    </div>
  );
};

export default Complete;
