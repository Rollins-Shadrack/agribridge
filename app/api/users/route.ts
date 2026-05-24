import { db } from "@/db.js"

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');

  const result = await db.query(
    `SELECT id, email, name, image, role, is_onboarded
     FROM "user"
     WHERE id = $1`,
    [id]
  );

  return Response.json(result.rows[0] ?? null);
}

export async function POST(req: Request) {
  const { userId, role } = await req.json();

  if (!userId || !role) {
    return Response.json({ error: "Missing data" }, { status: 400 });
  }

  await db.query(
    `UPDATE "user"
     SET role = $1,
         is_onboarded = true,
         "updatedAt" = NOW()
     WHERE id = $2`,
    [role, userId]
  );

  return Response.json({ success: true });
}