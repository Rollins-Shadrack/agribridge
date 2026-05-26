import { NextResponse } from "next/server";
import { db } from "@/db.js";

export async function GET() {
  try {
    const result = await db.query(`
      SELECT *
      FROM transactions
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
