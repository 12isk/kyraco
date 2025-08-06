// app/api/donations/route.js
import { NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/waveApi'
import { supabase } from '@/lib/supabase'

export async function POST(req) {
  try {
    const payload = await req.json()
    console.log('[donations/route] Incoming payload:', payload)

    const { nom, telephone, profession, montant, email } = payload

    // 1) insert pending donation
    console.log('[donations/route] Inserting donation into Supabase...')
    const { data, error: insertError } = await supabase
      .from('donations')
      .insert([{ nom, telephone, profession, montant, email }])
      .select()
      .single()

    if (insertError) {
      console.error('[donations/route] Supabase insert error:', insertError)
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }
    console.log(
      `[donations/route] Donation inserted (id=${data.id})`,
      data
    )

    // 2) create Wave checkout session
    console.log('[donations/route] Creating Wave checkout session...');
    const origin  = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL;

    let waveSession
    try {
      waveSession = await createCheckoutSession(
        Number(montant),         // amount as a number
        telephone,               // phone number string
        {
          clientRefence: data.id,               // note the helper’s typo: “clientRefence”
          successUrl: `${origin}/landing/success?session_id={CHECKOUT_SESSION_ID}`,
          errorUrl:  `${origin.env.NEXT_PUBLIC_APP_URL}/landing/cancel`,
        }
      );
      console.log(
        `[donations/route] Wave session created (id=${waveSession.id})`,
        waveSession
      )
    } catch (waveError) {
      console.error('[donations/route] Wave session error:', waveError)
      return NextResponse.json(
        { error: waveError.message || 'Wave checkout failed' },
        { status: 500 }
      )
    }

    // 3) save session ID to Supabase
    console.log(
      `[donations/route] Saving Wave session ID ${waveSession.id} to Supabase...`
    )
    const { error: updateError } = await supabase
      .from('donations')
      .update({ wave_session_id: waveSession.id })
      .eq('id', data.id)

    if (updateError) {
      console.error(
        '[donations/route] Supabase update error:',
        updateError
      )
      // Not blocking redirect; logging so you can fix later
    } else {
      console.log(
        `[donations/route] Supabase updated with wave_session_id=${waveSession.id}`
      )
    }

    // 4) return Wave URL
    console.log(
      `[donations/route] Redirecting user to Wave checkout at ${waveSession.url}`
    )
    return NextResponse.json({ url: waveSession.url })
  } catch (err) {
    console.error('[donations/route] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
