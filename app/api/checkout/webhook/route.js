// app/api/checkout/webhook/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    // If verifying signatures, do: const raw = await req.text(); then JSON.parse(raw)
    const event = await req.json()

    if (event.type !== 'checkout.session.completed') {
      return NextResponse.json({ ok: true })
    }

    const s = event.data || {}
    const orderId = s.client_reference
    if (!orderId) {
      return NextResponse.json({ error: 'Missing client_reference' }, { status: 400 })
    }

    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: 'succeeded',                  // ✅ allowed
        paid_at: new Date().toISOString(),
        wave_tx_id: s.transaction_id ?? null,
      })
      .eq('id', orderId)
      .in('payment_status', ['processing'])          // idempotent-ish guard

    if (error) {
      console.error('[checkout/webhook] DB error', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[checkout/webhook] Unexpected', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
