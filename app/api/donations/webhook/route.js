// app/api/donations/webhook/route.js
import { NextResponse } from 'next/server'
import nodemailer         from 'nodemailer'
import { supabase } from '@/lib/supabase'

// configure Nodemailer with Gmail App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
})

export async function POST(req) {
  try {
    const event = await req.json()
    console.log('[donations/webhook] Received event:', event)

    if (event.type !== 'checkout.session.completed') {
      console.log('[donations/webhook] Ignoring event type:', event.type)
      return NextResponse.json({ ok: true })
    }

    const sessionData  = event.data || {}
    console.log('[donations/webhook] Session data:', sessionData)

    const donationId = sessionData?.client_reference;
    if (!donationId) {
      console.error('[donations/webhook] Missing client_reference')
      return NextResponse.json({ error: 'Missing client_reference' }, { status: 400 })
    }

    // 1) mark donation completed
    console.log('[donations/webhook] Marking donation completed:', donationId)
    await supabase
      .from('donations')
      .update({ status: 'completed', updated_at: new Date() })
      .eq('id', donationId)

    // 2) fetch donation details
    const { data: donation, error: fetchError } = await supabase
      .from('donations')
      .select('nom, email, montant')
      .eq('id', donationId)
      .single()

    if (fetchError) {
      console.error('[donations/webhook] Fetch donation error:', fetchError)
    } else if (donation?.email) {
      console.log('[donations/webhook] Sending confirmation email to:', donation.email)
      const mailText = `
Bonjour ${donation.nom},

Merci pour votre don de ${donation.montant} FCFA !
Votre participation est confirmée et votre ticket est officiellement enregistré.

Bonne chance pour le tirage !
— L’équipe Kyraco
      `.trim()

      await transporter.sendMail({
        from: `"Kyraco" <${process.env.GMAIL_USER}>`,
        to: donation.email,
        subject: 'Merci pour votre don !',
        text: mailText,
      })
      console.log('[donations/webhook] Confirmation email sent')
    } else {
      console.warn('[donations/webhook] No email address to send confirmation')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[donations/webhook] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
