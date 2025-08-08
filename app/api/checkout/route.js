// app/api/checkout/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'       // service role
import { createCheckoutSession } from '@/lib/waveApi'     // your helper

export async function POST(req) {
  try {
    const { customer, amount, phoneNumber, items } = await req.json()

    const shipping_address = customer.suite
      ? `${customer.address}, ${customer.suite}`
      : customer.address

    // 1) create order (processing)
    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert([{
        customer_name:  `${customer.firstName} ${customer.lastName}`.trim(),
        customer_email:  customer.email || null,
        customer_phone:  customer.phone,
        shipping_address,
        city:            customer.city,
        items,                           // jsonb
        total:           amount,
        payment_status: 'processing',    // ✅ matches constraint
      }])
      .select('id')
      .single()

    if (insertError) {
      console.error('[checkout] insert error', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    const orderId = order.id
    const origin  = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL

    // 2) wave session (IMPORTANT: correct key name)
    const session = await createCheckoutSession(amount, phoneNumber, {
      clientReference: orderId,                                 // ✅ correct spelling
      successUrl: `${origin}/checkout/success?order_id=${orderId}`,
      errorUrl:   `${origin}/checkout/error?order_id=${orderId}`,
    })

    // 3) save session id
    await supabase
      .from('orders')
      .update({ wave_session_id: session.id })
      .eq('id', orderId)

    // 4) return both
    return NextResponse.json({
      wave_launch_url: session.wave_launch_url || session.wave_launch_url || session.wave_launch_url, // depends on your helper
      orderId,
      session_id: session.id
    })
  } catch (err) {
    console.error('[checkout] unexpected', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
