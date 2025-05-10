import { NextResponse, NextRequest } from "next/server";
import { mysqlPool } from "@/utils/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

interface Category {
  id: number;
  name: string;
}

// GET: ดึงข้อมูลหมวดหมู่จากตาราง category
export async function GET() {
  try {
    const [rows] = await mysqlPool.query<RowDataPacket[]>(
      `SELECT id, name FROM category`
    );

    const categories: Category[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [result] = await mysqlPool.query<ResultSetHeader>(
      `INSERT INTO category (name) VALUES (?)`,
      [name]
    );

    return NextResponse.json({ message: "Data inserted", id: result.insertId });
  } catch (error) {
    console.error("Insert error:", error);
    return NextResponse.json(
      { error: "Failed to insert data" },
      { status: 500 }
    );
  }
}
