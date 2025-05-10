import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { RowDataPacket } from "mysql2/promise";

interface ExpenseCategory {
  month: string;
  category: string;
  expense: number;
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
      SELECT c.name AS category, SUM(f.price) AS expense
      FROM financial f
      JOIN months m ON f.month_id = m.id
      JOIN category c ON f.category_id = c.id
      WHERE m.name = ? AND f.type = 'outcome'
      GROUP BY f.category_id
    `,
      [month]
    );

    const categoryExpenses: ExpenseCategory[] = rows.map((row) => ({
      month: month,
      category: row.category,
      expense: Number(row.expense),
    }));

    return NextResponse.json(categoryExpenses);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category expenses" },
      { status: 500 }
    );
  }
}
