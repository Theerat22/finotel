import { NextRequest, NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

type FinanceItem = {
  id: string;
  name: number;
  amount: number;
};

type FinanceData = {
  month: string;
  year: string;
  income: FinanceItem[];
  expenses: FinanceItem[];
};

export async function POST(req: NextRequest) {
  try {
    const body: FinanceData = await req.json();
    const { month, year, income, expenses } = body;

    const monthName = `${month}${year}`;

    // ใช้ RowDataPacket[] สำหรับผลลัพธ์ของ query
    const [monthRows] = await mysqlPool.query<RowDataPacket[]>(
      `SELECT id FROM months WHERE name = ?`,
      [monthName]
    );

    if (monthRows.length === 0) {
      return NextResponse.json({ error: "Month not found" }, { status: 400 });
    }

    const monthId = monthRows[0].id;

    const values: [number, string, number, Date, number][] = [];

    // Income
    for (const item of income) {
      values.push([monthId, "income", item.amount, new Date(), item.name]);
    }

    // Outcome
    for (const item of expenses) {
      values.push([monthId, "outcome", item.amount, new Date(), item.name]);
    }

    await mysqlPool.query<ResultSetHeader>(
      `INSERT INTO financial (month_id, type, price, timestamp, category_id) VALUES ?`,
      [values]
    );

    return NextResponse.json({ message: "Financial data inserted" });
  } catch (error) {
    console.error("Insert error:", error);
    return NextResponse.json({ error: "Failed to insert data" }, { status: 500 });
  }
}
