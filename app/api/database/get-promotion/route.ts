import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { RowDataPacket } from "mysql2/promise";

interface Occupancy {
  week1: number | null;
  week2: number | null;
  week3: number | null;
  week4: number | null;
}

// ฟังก์ชันสำหรับประเมินคำแนะนำตามอัตราการเข้าพัก
function getRecommendation(rate: number | null): string {
  if (rate === null) return "ไม่สามารถประเมินได้";
  if (rate < 50) return "ลดราคา 10-20%";
  if (rate < 70) return "คงราคาเดิม หรือเพิ่มเล็กน้อย (0-5%)";
  return "เพิ่มราคา 5-25%";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json(
        { error: "Missing required query parameter: month" },
        { status: 400 }
      );
    }

    // 1. Get occupancy data
    const [occupancyRows] = await mysqlPool.query<RowDataPacket[]>(
      `
      SELECT 
        MAX(CASE WHEN week_number = 1 THEN occupancy_rate END) AS week1,
        MAX(CASE WHEN week_number = 2 THEN occupancy_rate END) AS week2,
        MAX(CASE WHEN week_number = 3 THEN occupancy_rate END) AS week3,
        MAX(CASE WHEN week_number = 4 THEN occupancy_rate END) AS week4
      FROM occupancy o
      JOIN months m ON o.month_id = m.id
      WHERE m.name = ?
      GROUP BY m.name
    `,
      [month]
    );

    let occupancy: Occupancy = {
      week1: null,
      week2: null,
      week3: null,
      week4: null,
    };

    if (occupancyRows.length > 0) {
      const row = occupancyRows[0] as RowDataPacket;
      occupancy = {
        week1: row.week1 !== null ? Number(row.week1) : null,
        week2: row.week2 !== null ? Number(row.week2) : null,
        week3: row.week3 !== null ? Number(row.week3) : null,
        week4: row.week4 !== null ? Number(row.week4) : null,
      };
    }

    const responseData = {
        week1: {
          occupancy: occupancy.week1,
          recommendation: getRecommendation(occupancy.week1),
        },
        week2: {
          occupancy: occupancy.week2,
          recommendation: getRecommendation(occupancy.week2),
        },
        week3: {
          occupancy: occupancy.week3,
          recommendation: getRecommendation(occupancy.week3),
        },
        week4: {
          occupancy: occupancy.week4,
          recommendation: getRecommendation(occupancy.week4),
        },
      };
      

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching combined data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
