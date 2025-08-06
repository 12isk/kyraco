import { NextResponse } from "next/server";
import { searchCheckout } from "@/lib/waveApi";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("client_reference");
  if (!ref) {
    return NextResponse.json({ error: "client_reference is required" }, { status: 400 });
  }
  try {
    const results = await searchCheckout(ref);
    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
