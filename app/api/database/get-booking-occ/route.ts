import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { RowDataPacket } from "mysql2/promise";

interface Occupancy {
  week1: number | null;
  week2: number | null;
  week3: number | null;
  week4: number | null;
}

const calculateAverageOccupancy = (occupancy: Occupancy): number => {
  const values = Object.values(occupancy).filter(
    (v): v is number => v !== null
  );
  const sum = values.reduce((acc, val) => acc + val, 0);
  return values.length > 0 ? sum / values.length : 0;
};

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

      const averageOccupancy = calculateAverageOccupancy(occupancy);

      return NextResponse.json({ averageOccupancy });
    }

    return NextResponse.json({ averageOccupancy: 0 });

  } catch (error) {
    console.error("Error fetching occupancy data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
