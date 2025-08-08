// app/api/checkout/verify/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('orders')
    .select('payment_status')
    .eq('wave_session_id', sessionId)
    .single()

  if (error) {
    console.error('[checkout/verify] DB error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const complete = data?.payment_status === 'succeeded'
  return NextResponse.json({ complete })
}
