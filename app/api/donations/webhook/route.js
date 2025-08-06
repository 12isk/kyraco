// app/api/donations/webhook/route.js
import { NextResponse } from 'next/server'
import nodemailer         from 'nodemailer'
import { supabase } from '@/lib/supabase'


// configure Nodemailer with Gmail App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,      // your Gmail address
    pass: process.env.GMAIL_APP_PASS,  // a Gmail App Password
  },
})

export async function POST(req) {
  const event = await req.json()
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true })
  }

  const { id: waveSessionId, metadata } = event.data
  const donationId = metadata.donationId

  // 1) mark donation completed
  await supabase
    .from('donations')
    .update({ status: 'completed', updated_at: new Date() })
    .eq('id', donationId)

  // 2) get donation details
  const { data: d } = await supabase
    .from('donations')
    .select('nom, email, montant')
    .eq('id', donationId)
    .single()

  if (d?.email) {
    // 3) send confirmation email
    const text = `
Bonjour ${d.nom},

Merci pour votre don de ${d.montant} FCFA !  
Votre participation est confirmée et votre ticket est officiellement enregistré.

Bonne chance pour le tirage !
— L’équipe Kyraco
    `.trim()

    await transporter.sendMail({
      from: `"Kyraco" <${process.env.GMAIL_USER}>`,
      to:   d.email,
      subject: 'Merci pour votre don !',
      text,
    })
  }

  return NextResponse.json({ ok: true })
}
