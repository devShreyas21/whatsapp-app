import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* ---------------- CREATE TEMPLATE ---------------- */
export async function POST(req) {
  const { name, header, body, buttons } = await req.json();

  if (!name || !body) {
    return NextResponse.json(
      { error: "Name and body are required" },
      { status: 400 }
    );
  }

  const [result] = await db.query(
    "INSERT INTO templates (name, header, body, buttons) VALUES (?, ?, ?, ?)",
    [name, header || "", body, JSON.stringify(buttons || [])]
  );

  return NextResponse.json({
    success: true,
    templateId: result.insertId,
  });
}

/* ---------------- UPDATE TEMPLATE ---------------- */
export async function PUT(req) {
  const { id, name, header, body, buttons } = await req.json();

  if (!id || !name || !body) {
    return NextResponse.json(
      { error: "Template ID, name and body are required" },
      { status: 400 }
    );
  }

  await db.query(
    "UPDATE templates SET name = ?, header = ?, body = ?, buttons = ? WHERE id = ?",
    [name, header || "", body, JSON.stringify(buttons || []), id]
  );

  return NextResponse.json({ success: true });
}

/* ---------------- GET TEMPLATES ---------------- */
export async function GET() {
  const [rows] = await db.query(
    "SELECT * FROM templates ORDER BY created_at DESC"
  );
  return NextResponse.json(rows);
}

/* ---------------- DELETE TEMPLATES ---------------- */

export async function DELETE(req) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Template ID required" },
      { status: 400 }
    );
  }

  await db.query("DELETE FROM templates WHERE id = ?", [id]);

  return NextResponse.json({ success: true });
}
