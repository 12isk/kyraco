// app/api/donations/verify/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'


export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  const { data, error } = await supabase
    .from('donations')
    .select('status')
    .eq('wave_session_id', sessionId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ complete: data.status === 'completed' })
}
