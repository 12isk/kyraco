// app/api/checkout/route.js
import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/waveApi";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  // 1) parse JSON from the request
  const { orderId, amount, phoneNumber, customer } = await request.json();

  // 2) insert a "pending" order in Supabase
  const { error: insertErr } = await supabase
    .from("orders")
    .insert({
      id:               orderId,
      customer_name:    `${customer.firstName} ${customer.lastName}`,
      customer_email:   customer.email,
      customer_phone:   customer.phone,
      shipping_address: customer.address,
      city:             customer.city,
      items:            customer.items,  // array of { id,name,variant,price,quantity }
      total:            amount,
      payment_status:   "pending",
    });

  if (insertErr) {
    console.error("Supabase insert error:", insertErr);
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  try {
    // 3) create the Wave checkout session
    const origin   = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;
    const session  = await createCheckoutSession(amount, phoneNumber, {
      clientReference: orderId,                                 
      errorUrl:        `${origin}/checkout/error?order_id=${orderId}`,
      successUrl:      `${origin}/checkout/success?order_id=${orderId}`,
    });

    // 4) update the record with wave_payment_id
    const { error: updateErr } = await supabase
      .from("orders")
      .update({ wave_payment_id: session.id })
      .eq("id", orderId);

    if (updateErr) {
      console.error("Supabase update error:", updateErr);
      // you could still proceed—the user is already headed off to Wave—but log it
    }

    // 5) return the Wave session so the client can redirect
    return NextResponse.json(session);
  } catch (e) {
    console.error("Wave API error:", e);
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
