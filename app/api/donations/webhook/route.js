// app/api/donations/webhook/route.js
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Gmail App Password transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
})

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
    const raw = await req.text()
    const signature =
      req.headers.get('wave-signature') ||
      req.headers.get('x-wave-signature')
    const secret = process.env.WAVE_WEBHOOK_SECRET_DONATIONS

    if (!verifyWaveSignature(raw, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(raw)
    if (event.type !== 'checkout.session.completed') {
      return NextResponse.json({ ok: true })
    }

    const sessionData = event.data || {}
    const donationId = sessionData?.client_reference
    if (!donationId) {
      return NextResponse.json({ error: 'Missing client_reference' }, { status: 400 })
    }

    // Mark donation completed (idempotent – if you also set status enum, only update when not completed)
    await supabase
      .from('donations')
      .update({ status: 'completed', updated_at: new Date() })
      .eq('id', donationId)

    // Fetch details and email if present
    const { data: donation, error: fetchError } = await supabase
      .from('donations')
      .select('nom, email, montant')
      .eq('id', donationId)
      .single()

    if (fetchError) {
      console.error('[donations/webhook] Fetch donation error:', fetchError)
    } else if (donation?.email) {
      const mailText = `
Bonjour ${donation.nom},

Merci pour votre don de ${donation.montant} FCFA !
Votre participation au concours automobiliste est confirmée.

Bonne Chance pour la présélection du méritant « Écomobiliste de la 1ere campagne » !
— L’équipe Kyraco
      `.trim()

      try {
        await transporter.sendMail({
          from: `"Kyraco" <${process.env.GMAIL_USER}>`,
          to: donation.email,
          subject: 'Merci pour votre don !',
          text: mailText,
        })
      } catch (mailErr) {
        console.error('[donations/webhook] Mail error:', mailErr)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[donations/webhook] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
