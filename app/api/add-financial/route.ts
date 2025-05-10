import { NextRequest, NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { ResultSetHeader } from "mysql2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { averagePrice } = body;
    const adr = parseFloat(Number(averagePrice).toFixed(2));

    if (isNaN(adr)) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const [result] = await mysqlPool.query<ResultSetHeader>(
      "INSERT INTO general (name, owner, latitude, longitude, adr) VALUES (?, ?, ?, ?, ?)",
      ["CD ลิงกังกู", "พวกเรา รักCEDT", 13.735631194823451, 100.53140989416192, adr]
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


