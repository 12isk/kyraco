// app/api/donations/route.js
import { NextResponse } from 'next/server'
import { createClient }   from '@supabase/supabase-js'
import { createWaveSession } from '@/lib/waveApi'
import { supabase } from '@/lib/supabase'


export async function POST(req) {
  const { nom, telephone, profession, montant, email } = await req.json()

  // 1) insert pending donation
  const { data, error } = await supabase
    .from('donations')
    .insert([{ nom, telephone, profession, montant, email }])
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 2) create Wave checkout session
  let wave
  try {
    wave = await createCheckoutSession({
      amount: montant,
      phone: telephone,
      metadata: { donationId: data.id }
    })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }

  // 3) save session ID to Supabase
  await supabase
    .from('donations')
    .update({ wave_session_id: wave.id })
    .eq('id', data.id)

  // 4) return Wave URL
  return NextResponse.json({ url: wave.url })
}
