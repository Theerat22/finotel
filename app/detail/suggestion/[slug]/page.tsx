"use client";
import React, { use, useState } from "react";
import { AlertCircle, Info, ChevronRight } from "lucide-react";
import StartNav from "@/app/components/StartNav";
import PromptForm from "@/app/components/PromptForm";
import ReactMarkdown from "react-markdown";

interface Month {
  income: number;
  outcome: number;
  occupancyRate: number;
  event: string[];
}

interface MonthData {
  [key: string]: Month;
}

interface Message {
  content: string;
  role?: string;
}

interface Choice {
  index: number;
  message: Message;
  finish_reason?: string;
}

interface ChatGptResponse {
  choices: Choice[];
  created?: number;
  id?: string;
  model?: string;
}

const monthData: MonthData = {
  January2025: {
    income: 2000,
    outcome: 0,
    occupancyRate: 0,
    event: ["Event 1", "Event 2", "Event 3"],
  },
  February2025: {
    income: 0,
    outcome: 0,
    occupancyRate: 0,
    event: ["Event 1", "Event 2", "Event 3"],
  },
  March2025: {
    income: 0,
    outcome: 0,
    occupancyRate: 0,
    event: ["Event 1", "Event 2", "Event 3"],
  },
  April2025: {
    income: 0,
    outcome: 0,
    occupancyRate: 86,
    event: ["Event 1", "Event 2", "Event 3"],
  }, // ยกตัวอย่างเพิ่มค่า
  May2025: {
    income: 0,
    outcome: 0,
    occupancyRate: 0,
    event: ["Event 1", "Event 2", "Event 3"],
  },
  June2025: {
    income: 0,
    outcome: 0,
    occupancyRate: 0,
    event: ["Event 1", "Event 2", "Event 3"],
  },
  July2025: {
    income: 0,
    outcome: 0,
    occupancyRate: 0,
    event: ["Event 1", "Event 2", "Event 3"],
  },
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function RoomDetails({ params }: PageProps) {
  const { slug } = use(params);
  const month = monthData[slug as keyof typeof monthData];

  const match = slug.match(/^([A-Za-z]+)(\d+)$/);

  const month_name = match ? match[1] : "";
  const year = match ? match[2] : "";
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const markdownText = choices
    .map((choice) => choice.message.content)
    .join("\n\n\n");

  console.log(month);

  if (!month) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-2xl text-white">Data Not Found</p>
      </div>
    );
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
            {/* CHATGPT Recommendations */}
            <div className="bg-white p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">คำแนะนำการจัดการ</h3>
                <AlertCircle className="text-amber-500" size={18} />
              </div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <div className="flex items-center mb-2">
                  <Info className="text-amber-600 mr-2" size={16} />
                  <h3 className="font-semibold text-amber-800">
                    ช่วงที่มีลูกค้าลดลงกว่าปกติ
                  </h3>
                </div>
                <ul className="text-amber-700 space-y-6 text-base pl-2">
                  <li className="flex items-start">
                    <ChevronRight
                      className="text-amber-500 mr-1 flex-shrink-0 mt-1"
                      size={14}
                    />
                    <span className="font-medium leading-relaxed">
                      ลดค่าน้ำจาก 8,000 บาท เหลือ 5,500 บาท
                      เพราะจำนวนนักท่องเท่าลดลง การใช้น้ำในห้องพักและบริการต่างๆ
                      ก็จะลดลงตาม
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight
                      className="text-amber-500 mr-1 flex-shrink-0 mt-1"
                      size={14}
                    />
                    <span className="font-medium leading-relaxed">
                      ลดค่าไฟฟ้าจาก 25,000 บาท เหลือ 17,000 บาท
                      เพราะสามารถปิดระบบแสงสว่างและแอร์ในห้องที่ไม่มีผู้เข้าพักได้
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight
                      className="text-amber-500 mr-1 flex-shrink-0 mt-1"
                      size={14}
                    />
                    <span className="font-medium leading-relaxed">
                      ลดค่าอาหารและของใช้จาก 30,000 บาท เหลือ 18,000 บาท
                      เพราะจำนวนลูกค้าลดลง
                      จึงไม่จำเป็นต้องสต็อกของในปริมาณเท่าเดิม
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight
                      className="text-amber-500 mr-1 flex-shrink-0 mt-1"
                      size={14}
                    />
                    <span className="font-medium leading-relaxed">
                      โดยปรับเวลาทำงานให้เหมาะสมกับภาระงานที่น้อยลง เช่น
                      ใช้ระบบกะหมุนเวียนหรือจ้างรายวันเฉพาะวันหยุดสุดสัปดาห์
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Try prompt */}
            <main className="min-h-screen bg-white">
              <div className="mx-auto">
                <p>Chat-GPT is thrilled to see you...</p>
                <PromptForm
                  isLoading={isLoading}
                  onSubmit={async () => {
                    setIsLoading(true);

                    try {
                      const response = await fetch("/api/chat", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          // prompt,
                        }),
                      });

                      const result: ChatGptResponse = await response.json();
                      setChoices(result.choices);
                    } catch (error) {
                      console.error("Error fetching from API:", error);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                />

                {/* <div className="prose prose-sm max-w-none space-y-4 text-black">
                  <ReactMarkdown>{markdownText}</ReactMarkdown>
                </div> */}
                
                <div className="prose prose-sm sm:prose-base max-w-none text-black">
                  <ReactMarkdown
                    components={{
                      li: ({ children }) => (
                        <li className="mb-3">{children}</li>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6">{children}</ul>
                      ),
                    }}
                  >
                    {markdownText}
                  </ReactMarkdown>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
