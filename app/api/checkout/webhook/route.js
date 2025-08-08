// app/api/checkout/webhook/route.js
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// HMAC(SHA256) of the raw body using your orders webhook secret
function verifyWaveSignature(raw, signature, secret) {
  if (!signature || !secret) return false
  const digest = crypto.createHmac('sha256', secret).update(raw).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
  } catch {
    return false
  }
}

export async function POST(req) {
  try {
    // Read raw body first (important for signature verification)
    const raw = await req.text()
    const signature =
      req.headers.get('wave-signature') ||
      req.headers.get('x-wave-signature')
    const secret = process.env.WAVE_WEBHOOK_SECRET_ORDERS

    if (!verifyWaveSignature(raw, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(raw)

    if (event.type !== 'checkout.session.completed') {
      return NextResponse.json({ ok: true })
    }

    const s = event.data || {}
    const orderId = s.client_reference
    if (!orderId) {
      return NextResponse.json({ error: 'Missing client_reference' }, { status: 400 })
    }

    // Idempotent-ish: only update if the row is still "processing"
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: 'succeeded', // ✅ allowed by your CHECK
        paid_at: new Date().toISOString(),
        wave_tx_id: s.transaction_id ?? null,
      })
      .eq('id', orderId)
      .in('payment_status', ['processing'])

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
