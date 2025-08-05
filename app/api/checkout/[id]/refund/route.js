import { NextResponse } from "next/server";
import { refundCheckoutSession } from "@/lib/waveApi";

export async function POST(request, { params }) {
  const { id } = params;
  try {
    await refundCheckoutSession(id);
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
