import { NextResponse } from "next/server";
import { retrieveCheckoutSession } from "@/lib/waveApi";

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const session = await retrieveCheckoutSession(id);
    return NextResponse.json(session);
  } catch (err) {
    const status = err.message.includes("404") ? 404 : 502;
    return NextResponse.json({ error: err.message }, { status });
  }
}
