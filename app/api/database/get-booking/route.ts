import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { RowDataPacket } from "mysql2/promise";

interface Occupancy {
  week1: number | null;
  week2: number | null;
  week3: number | null;
  week4: number | null;
}

interface Event {
  id: number;
  name: string;
  introduction: string | null;
  start_date: string | null;
  end_date: string | null;
  latitude: number | null;
  longitude: number | null;
  thumbnail_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  province_id: number | null;
  province_name: string | null;
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
          week1: Number(row.week1),
          week2: Number(row.week2),
          week3: Number(row.week3),
          week4: Number(row.week4),
        };
      }
      

    // 2. Get events
    const [eventRows] = await mysqlPool.query<RowDataPacket[]>(
      `
      SELECT e.*
      FROM events e
      JOIN months m ON e.month_id = m.id
      WHERE m.name = ?
    `,
      [month]
    );

    const events: Event[] = eventRows.map((row) => ({
      id: row.id,
      name: row.name,
      introduction: row.introduction,
      start_date: row.start_date,
      end_date: row.end_date,
      latitude: row.latitude,
      longitude: row.longitude,
      thumbnail_url: row.thumbnail_url,
      created_at: row.created_at,
      updated_at: row.updated_at,
      province_id: row.province_id,
      province_name: row.province_name,
    }));

    // Final combined response
    const responseData = {
      month,
      occupancy,
      events
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
