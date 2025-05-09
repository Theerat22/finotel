"use client";
import React, { use, useEffect, useState } from "react";
import {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

import StartNav from "@/app/components/StartNav";
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const markdownText = choices
    .map((choice) => choice.message.content)
    .join("\n\n\n");

  console.log(month);

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, []);

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
            {/* KPI Cards - In a row on desktop, stacked on mobile */}
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
                      {month.occupancyRate}%
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
                    <p className="text-xl font-bold text-green-600">3,871</p>
                    <TrendingUp className="text-green-500 ml-1" size={16} />
                  </div>
                </div>
                <div className="h-px bg-gray-100"></div>

                {/* GOPPAR */}
                <div className="flex items-center justify-between">
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
                </div>
              </div>
            </div>
            {/* CHATGPT Recommendations */}
            <div className="bg-white p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">คำแนะนำการจัดการ</h3>
                <AlertCircle className="text-amber-500" size={18} />
              </div>

              {isLoading && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <div className="animate-pulse flex flex-col justify-center text-center space-x-4">
                    <p className="font-medium text-amber-700">
                      กำลังโหลดข้อมูล
                    </p>
                  </div>
                </div>
              )}

              {markdownText && (
                <div className=" bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <ReactMarkdown
                    components={{
                      li: ({ children }) => (
                        <li className="flex items-start">
                          <ChevronRight
                            className="text-amber-500 mr-1 flex-shrink-0 mt-1"
                            size={14}
                          />
                          <span className="font-medium leading-relaxed text-amber-700">
                            {children}
                          </span>
                        </li>
                      ),
                      ul: ({ children }) => (
                        <ul className="space-y-6 text-base pl-2">{children}</ul>
                      ),
                    }}
                  >
                    {markdownText}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* Try prompt */}
            {/* <section className="bg-white">
              <div className="mx-auto flex flex-col justify-center items-center">
                <p className="mt-4 mb-4 font-bold">
                  Chat-GPT is thrilled to see you...
                </p>
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
              </div>
            </section> */}
          </div>
        </div>
      </div>
    </>
  );
}
