import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

export async function GET() {
  const [rows] = await db.query(
    "SELECT * FROM templates ORDER BY created_at DESC"
  );
  return NextResponse.json(rows);
}
