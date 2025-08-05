import { supabase } from "@/lib/supabase";
export async function GET(request, { params }) {
  const { orderId } = params;
  console.log("🛎️ GET /api/orders/", orderId);

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  console.log("🔍 Supabase returned:", { data, error });

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json(data);
}
