// app/api/donations/verify/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req) {
  console.log('[donations/verify] Received verification request:', req.url)
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  console.log('[donations/verify] Looking up donation with session_id:', sessionId)

  const { data, error } = await supabase
    .from('donations')
    .select('status')
    .eq('wave_session_id', sessionId)
    .single()

  if (error) {
    console.error('[donations/verify] Supabase lookup error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const complete = data?.status === 'completed'
  console.log('[donations/verify] Donation status:', data?.status, '=> complete:', complete)
  return NextResponse.json({ complete })
}
