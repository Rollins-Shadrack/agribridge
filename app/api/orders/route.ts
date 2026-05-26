// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db.js";

export async function GET() {
  try {
    const result = await db.query(`
      SELECT *
      FROM orders
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { id, data } = body;

    if (!id || !data) {
      return NextResponse.json({ error: "id and data are required" }, { status: 400 });
    }

    // build dynamic query safely
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");

    const result = await db.query(
      `
      UPDATE orders
      SET ${setClause},
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [id, ...values],
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Order id required" }, { status: 400 });
    }

    const result = await db.query(
      `
      DELETE FROM orders
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    return NextResponse.json({
      success: true,
      deleted: result.rows[0],
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
