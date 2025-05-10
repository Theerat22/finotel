import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { RowDataPacket } from "mysql2/promise";

interface FinancialRecord {
  id: number;
  type: "income" | "outcome";
  price: number;
  timestamp: string;
  month_id: number;
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

    const [rows] = await mysqlPool.query<RowDataPacket[]>(
      `
      SELECT f.*
      FROM financial f
      JOIN months m ON f.month_id = m.id
      WHERE m.name = ?
    `,
      [month]
    );

    const financialRows = rows as FinancialRecord[];

    let totalRevenue = 0;
    let totalExpense = 0;

    for (const record of financialRows) {
      if (record.type === "income") {
        totalRevenue += record.price;
      } else if (record.type === "outcome") {
        totalExpense += record.price;
      }
    }

    const avgRatio = totalRevenue === 0 ? 0 : totalExpense / totalRevenue;
    const ebitdar = totalRevenue - totalExpense;

    return NextResponse.json({
      totalRevenue,
      totalExpense,
      avgRatio,
      ebitdar,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
