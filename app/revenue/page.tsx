"use client";
import React, { useState, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import Papa from "papaparse";

interface Step1Props {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

interface OccupancyEntry {
  date: string;
  occupancy: number;
}

interface MonthlyOccupancy {
  month: string;
  year: string;
  average: number;
  entries: OccupancyEntry[];
}

interface OccupancySummary {
  months: MonthlyOccupancy[];
  overallAverage: number;
}

const monthNames = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const percentFormatter = new Intl.NumberFormat("th-TH", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const HotelOccupancyUpload: React.FC<Step1Props> = ({ setActivePage }) => {
  const [occupancySummary, setOccupancySummary] = useState<OccupancySummary>({
    months: [],
    overallAverage: 0,
  });
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          try {
            type CsvRow = { [key: string]: unknown };

            const csvData = results.data as CsvRow[];

            // ดึงชื่อคอลัมน์ทั้งหมด
            const headers = Object.keys(csvData[0]);
            if (headers.length < 2) {
              setFormError("ไฟล์ต้องมีอย่างน้อย 2 คอลัมน์");
              setIsLoading(false);
              return;
            }

            const dateKey = headers[0];
            const occupancyKey = headers[1];

            const validRows = csvData.filter((row) => {
              const date = row[dateKey];
              const occupancy = row[occupancyKey];

              return (
                typeof date === "string" &&
                (typeof occupancy === "number" ||
                  (typeof occupancy === "string" &&
                    !isNaN(parseFloat(occupancy))))
              );
            });

            if (validRows.length > 0) {
              const entries: OccupancyEntry[] = validRows.map((row) => {
                const dateStr =
                  typeof row[dateKey] === "string"
                    ? row[dateKey]
                    : String(row[dateKey]);

                const occupancyRaw = row[occupancyKey];
                const occupancyValue =
                  typeof occupancyRaw === "number"
                    ? occupancyRaw
                    : parseFloat(String(occupancyRaw));

                const normalizedOccupancy = Math.min(
                  Math.max(occupancyValue, 0),
                  1
                );

                return {
                  date: dateStr,
                  occupancy: normalizedOccupancy,
                };
              });

              // Group entries by month and year
              const monthlyData = new Map<string, OccupancyEntry[]>();
              entries.forEach((entry) => {
                const date = new Date(entry.date);
                if (!isNaN(date.getTime())) {
                  const year = date.getFullYear();
                  const month = date.getMonth();
                  const key = `${year}-${month}`;
                  if (!monthlyData.has(key)) {
                    monthlyData.set(key, []);
                  }
                  monthlyData.get(key)?.push(entry);
                }
              });

              const months: MonthlyOccupancy[] = [];
              let totalOccupancy = 0;
              let totalEntries = 0;

              monthlyData.forEach((entries, key) => {
                const [year, month] = key.split("-").map(Number);
                const averageOccupancy =
                  entries.reduce((sum, entry) => sum + entry.occupancy, 0) /
                  entries.length;

                months.push({
                  month: monthNames[month],
                  year: year.toString(),
                  average: averageOccupancy,
                  entries: entries.sort((a, b) => a.date.localeCompare(b.date)),
                });

                totalOccupancy += averageOccupancy * entries.length;
                totalEntries += entries.length;
              });

              months.sort((a, b) => {
                const yearDiff = parseInt(a.year) - parseInt(b.year);
                if (yearDiff !== 0) return yearDiff;

                const monthIndexA = monthNames.indexOf(a.month);
                const monthIndexB = monthNames.indexOf(b.month);
                return monthIndexA - monthIndexB;
              });

              const overallAverage =
                totalEntries > 0 ? totalOccupancy / totalEntries : 0;

              setOccupancySummary({
                months,
                overallAverage,
              });

              setFormError("");
            } else {
              setFormError(
                "ไม่พบข้อมูลที่ถูกต้องในไฟล์ CSV โปรดตรวจสอบรูปแบบไฟล์"
              );
            }
          } catch (error) {
            console.error("Error processing CSV:", error);
            setFormError("เกิดข้อผิดพลาดในการอ่านไฟล์ CSV");
          }
        }
        setIsLoading(false);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setFormError("เกิดข้อผิดพลาดในการอ่านไฟล์ CSV");
        setIsLoading(false);
      },
    });

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Submit form
    console.log("Submitting occupancy data:", occupancySummary);
    setActivePage("booking");
  };

  const handleCsvTemplateDownload = () => {
    const headers = "date,occupancy\n";

    // Generate example rows for current month
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    const rows = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      return `${dateStr},${Math.random().toFixed(2)}`;
    }).join("\n");

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "hotel_occupancy_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate color based on occupancy percentage
  //   const getOccupancyColor = (occupancy: number): string => {
  //     if (occupancy >= 0.8) return 'bg-green-500';
  //     if (occupancy >= 0.6) return 'bg-blue-500';
  //     if (occupancy >= 0.4) return 'bg-yellow-500';
  //     if (occupancy >= 0.2) return 'bg-orange-500';
  //     return 'bg-red-500';
  //   };

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-8 bg-gray-50">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden bg-blue-600 flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-xl font-bold text-white mb-2">
              อัตราการเข้าพักโรงแรม
            </h1>
            <p className="text-blue-100 mb-3 text-sm">
              อัปโหลดข้อมูลอัตราการเข้าพักจากไฟล์ CSV
            </p>
            <div className="mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white opacity-80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/3 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* CSV Upload Section */}
                <div className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300">
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    นำเข้าข้อมูลจากไฟล์ CSV
                  </h3>
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="csvFile"
                          name="csvFile"
                          accept=".csv"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCsvTemplateDownload}
                        className="flex items-center space-x-1 text-xs px-3 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                      >
                        <FaDownload className="h-3 w-3" />
                        <span>ดาวน์โหลดเทมเพลต</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      รองรับไฟล์ CSV ที่มีคอลัมน์ date (YYYY-MM-DD), occupancy
                      (0-1)
                    </p>
                    {fileName && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">
                          ไฟล์ที่อัปโหลด:
                        </span>
                        <span>{fileName}</span>
                      </div>
                    )}
                    {isLoading && (
                      <div className="text-blue-600 text-sm">
                        กำลังประมวลผลข้อมูล...
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {formError && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                    {formError}
                  </div>
                )}

                {/* Summary Section */}
                {occupancySummary.months.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      สรุปอัตราการเข้าพักรายเดือน
                    </h3>

                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-md font-medium text-gray-700">
                          อัตราการเข้าพักเฉลี่ยทั้งหมด
                        </h3>
                        <span className="text-lg font-bold text-blue-600">
                          {percentFormatter.format(
                            occupancySummary.overallAverage
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {occupancySummary.months.map((monthData) => (
                        <div
                          key={`${monthData.year}-${monthData.month}`}
                          className="border border-gray-200 rounded-md overflow-hidden"
                        >
                          <div className="bg-gray-100 p-3 flex justify-between items-center">
                            <h4 className="font-medium text-gray-700">
                              {monthData.month} {parseInt(monthData.year) + 543}
                            </h4>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 mr-3">
                                อัตราเฉลี่ย:
                              </span>
                              <span className="font-bold text-blue-600">
                                {percentFormatter.format(monthData.average)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActivePage("home")}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  >
                    <FaArrowLeft className="mr-2 h-4 w-4" />
                    ย้อนกลับ
                  </button>

                  <button
                    type="submit"
                    disabled={occupancySummary.months.length === 0}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white 
                      ${
                        occupancySummary.months.length > 0
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-300 cursor-not-allowed"
                      }`}
                  >
                    ถัดไป
                    <FaArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:block md:w-1/3 bg-blue-600 p-6 text-white">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold mb-4">
                  อัตราการเข้าพักโรงแรม
                </h2>
                <div className="mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 text-white opacity-80 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-blue-100 mb-8">
                  อัปโหลดข้อมูลอัตราการเข้าพักของโรงแรมของคุณเพื่อวิเคราะห์และคาดการณ์แนวโน้มในอนาคต
                </p>
                <div className="space-y-3 text-left text-sm w-full">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-400 flex items-center justify-center text-xs font-bold mr-2">
                      1
                    </div>
                    <p>อัปโหลดไฟล์ CSV ที่มีข้อมูลอัตราการเข้าพักรายวัน</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-400 flex items-center justify-center text-xs font-bold mr-2">
                      2
                    </div>
                    <p>ตรวจสอบและยืนยันข้อมูลสรุปรายเดือน</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-300 flex items-center justify-center text-xs font-bold mr-2">
                      3
                    </div>
                    <p>ตั้งค่าการจองห้องพักและราคา</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-300 flex items-center justify-center text-xs font-bold mr-2">
                      4
                    </div>
                    <p>ดูผลการวิเคราะห์และคำแนะนำ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelOccupancyUpload;
