import { NextRequest, NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { ResultSetHeader } from "mysql2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, detail } = body;

    // ตรวจสอบว่าข้อมูลมาครบ
    if (!name || !detail) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [result] = await mysqlPool.query<ResultSetHeader>(
      "INSERT INTO attractions (name, detail, coverimage, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
      [name, detail, 'sffd', 133, 133]
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
