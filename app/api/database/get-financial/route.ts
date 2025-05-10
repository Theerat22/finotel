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

export async function GET() {
  try {
    const [rows] = await mysqlPool.query<RowDataPacket[]>(`
      SELECT f.*
      FROM financial f
      JOIN months m ON f.month_id = m.id
      WHERE m.name = 'May2025' AND f.type = 'income';
    `);

    // Assert to FinancialRecord[]
    const financialRows = rows as FinancialRecord[];

    return NextResponse.json(financialRows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
