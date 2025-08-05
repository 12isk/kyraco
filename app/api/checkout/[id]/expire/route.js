import { NextResponse } from "next/server";
import { expireCheckoutSession } from "@/lib/waveApi";

export async function POST(request, { params }) {
  const { id } = params;
  try {
    await expireCheckoutSession(id);
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    // 409 if already expired/completed, 404 if not found, etc.
    const status = err.message.includes("404") ? 404 : err.message.includes("409") ? 409 : 502;
    return NextResponse.json({ error: err.message }, { status });
  }
}
