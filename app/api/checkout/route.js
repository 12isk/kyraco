// app/api/checkout/route.js
import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/waveApi";

export async function POST(request) {
  const { amount, phoneNumber } = await request.json();
  try {
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;
    const session = await createCheckoutSession(amount, phoneNumber, {
      errorUrl:   `${origin}/checkout/error`,
      successUrl: `${origin}/checkout/success`,
    });
    return NextResponse.json(session);
  } catch (e) {
    console.error("Wave error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
