import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import type { NextRequest } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_req: NextRequest, { params }: Params) {
  const id = params.id;

  try {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM attractions WHERE id = ?",
      [id]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
