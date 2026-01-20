import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { twilioClient } from "@/lib/twilio";

export async function POST(req) {
  try {
    const { templateId, phone, variables } = await req.json();

    if (!templateId || !phone) {
      return NextResponse.json(
        { error: "templateId and phone are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch template
    const [[template]] = await db.query(
      "SELECT * FROM templates WHERE id = ?",
      [templateId]
    );

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Replace variables
    let message = template.body;
    if (variables) {
      Object.keys(variables).forEach(key => {
        message = message.replaceAll(
          `{{${key}}}`,
          variables[key]
        );
      });
    }

    // 3️⃣ Send WhatsApp message
    const response = await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${phone}`,
      body: message,
    });

    // 4️⃣ Save message log
    await db.query(
      `INSERT INTO message_logs
       (template_id, phone, payload, status, twilio_sid)
       VALUES (?, ?, ?, ?, ?)`,
      [
        templateId,
        phone,
        JSON.stringify(variables || {}),
        "SENT",
        response.sid,
      ]
    );

    return NextResponse.json({
      success: true,
      sid: response.sid,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
