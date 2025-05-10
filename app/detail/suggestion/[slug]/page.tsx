"use client";
import React, { use, useEffect, useState } from "react";
import { AlertCircle, ChevronRight } from "lucide-react";
import StartNav from "@/app/components/StartNav";
import ReactMarkdown from "react-markdown";

export type CategoryData = {
  month: string;
  category: string;
  expense: number;
};

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

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function RoomDetails({ params }: PageProps) {
  const { slug } = use(params);
  // const month = monthData[slug as keyof typeof monthData];

  const match = slug.match(/^([A-Za-z]+)(\d+)$/);

  const month_name = match ? match[1] : "";
  const year = match ? match[2] : "";
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expenseList, setExpenseList] = useState<string>("");
  const [incomeList, setIncomeList] = useState<string>("");

  const markdownText = choices
    .map((choice) => choice.message.content)
    .join("\n\n\n");

  const generateExpenseList = (categoryData: CategoryData[]): string => {
    let expenseList = "";

    // Loop through the fetched category data and create the formatted output
    categoryData.forEach((item) => {
      const { category, expense } = item;

      expenseList += `- ${category} ${expense} บาท\n`;
    });

    return expenseList;
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(
          `/api/database/get-financial-category?month=${slug}`
        );
        const data = await res.json();
        const expenseList = generateExpenseList(data);
        setExpenseList(expenseList);
        console.log(expenseList);
      } catch (err) {
        console.error("Failed to fetch financial data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchCategoryIncomeData = async () => {
      try {
        const res = await fetch(`/api/database/get-income?month=${slug}`);
        const data = await res.json();
        const incomeList = generateExpenseList(data);
        setIncomeList(incomeList);
      } catch (err) {
        console.error("Failed to fetch financial data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
    fetchCategoryIncomeData();

    const prompt = `You are a hotel financial manager. Here is some of the information you need:
-This month’s income:
${incomeList}

-This month’s outcome:
${expenseList}

Your task:
-Suggest how to reduce and adjust the spending in each of these categories: water, electricity, food and supplies, and staff
-For each category, give a specific number of how much it should be reduced to, and then follow with a short reason based on the decrease in occupancy rate
-Write in Thai, and format the answer in Markdown bullet points
-Do not include any introduction or explanation, just go straight to the list
-The format should be like this:
  -ลดค่าน้ำจาก 8,000 บาท เหลือ 5,500 บาท เพราะอัตราการเข้าพักลดลง ทำให้การใช้น้ำน้อยลง
  -ลดค่าไฟฟ้าจาก ... เหลือ ... เพราะอัตราการเข้าพักลดลง ทำให้การใช้ไฟลดลง...
Make sure all categories are covered and keep each point on a single line.`;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
          }),
        });

        const result: ChatGptResponse = await response.json();
        setChoices(result.choices);
        console.log(result);
      } catch (error) {
        console.error("Error fetching from API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, expenseList, incomeList]);

  if (!slug) {
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
