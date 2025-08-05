import { supabase } from '@/lib/supabase'
import { createCheckoutSession } from '@/lib/waveApi'
// // app/api/checkout/route.js
// import { NextResponse } from 'next/server'
// import { supabase } from '@/lib/supabase'
// import { createWaveSession } from '@/lib/wave' 

// export async function POST(request) {
//   const { customer, amount, phoneNumber } = await request.json()

//   // 1️⃣ Insert a new order row (status defaults to 'processing')
//   const shipping_address = customer.suite
//     ? `${customer.address}, ${customer.suite}`
//     : customer.address

//   const { data: draft, error: draftError } = await supabase
//     .from('orders')
//     .insert([{
//       customer_name:    `${customer.firstName} ${customer.lastName}`,
//       customer_email:    customer.email,
//       customer_phone:    customer.phone,
//       shipping_address,
//       city:              customer.city,
//       total:             amount,
//       // omit payment_status → DB default 'processing'
//     }])
//     .select('id')
//     .single()

//   if (draftError) {
//     console.error('Draft insert error:', draftError)
//     return NextResponse.json({ error: draftError.message }, { status: 500 })
//   }

//   const orderId = draft.id

//   // 2️⃣ Kick off Wave, embedding orderId in metadata
//   const { launchUrl, error: waveError } = await createWaveSession({
//     amount,
//     phoneNumber,
//     metadata: { orderId }
//   })

//   if (waveError) {
//     console.error('Wave session error:', waveError)
//     return NextResponse.json({ error: waveError }, { status: 500 })
//   }

//   // 3️⃣ Send back both the Wave URL and the new orderId
//   return NextResponse.json({
//     wave_launch_url: launchUrl,
//     orderId
//   })
// }

import { NextResponse } from 'next/server'

// export async function POST(request) {
//   const { customer, amount, phoneNumber } = await request.json()

//   // Build shipping address
//   const shipping_address = customer.suite
//     ? `${customer.address}, ${customer.suite}`
//     : customer.address

//   // 1️⃣ Create draft order (status defaults to 'processing')
//   const { data: draft, error: draftError } = await supabase
//     .from('orders')
//     .insert([{
//       customer_name:   `${customer.firstName} ${customer.lastName}`,
//       customer_email:   customer.email,
//       customer_phone:   customer.phone,
//       shipping_address,
//       city:             customer.city,
//       total:            amount
//       // payment_status defaults to 'processing'
//     }])
//     .select('id')
//     .single()

//   if (draftError) {
//     console.error('Draft insert error:', draftError)
//     return NextResponse.json({ error: draftError.message }, { status: 500 })
//   }
//   const orderId = draft.id

//   // 2️⃣ Prepare Wave checkout with callback URLs
//   const host       = process.env.NEXT_PUBLIC_BASE_URL
//   const successUrl = `${host}/checkout/success?order_id=${orderId}`
//   const cancelUrl  = `${host}/checkout/cancel?order_id=${orderId}`

//   const { launchUrl, error: waveError } = await createCheckoutSession({
//     amount,
//     phoneNumber,
//     metadata:       { orderId },
//     callback_urls: { success: successUrl, cancel: cancelUrl }
//   })

//   if (waveError) {
//     console.error('Wave session error:', waveError)
//     return NextResponse.json({ error: waveError }, { status: 500 })
//   }

//   // 3️⃣ Return Wave URL and orderId
//   return NextResponse.json({ wave_launch_url: launchUrl, orderId })
// }

export async function POST(request) {
  const { customer, amount, phoneNumber, items } = await request.json()

  // build shipping_address...
  const shipping_address = customer.suite
    ? `${customer.address}, ${customer.suite}`
    : customer.address

  // 1️⃣ draft the order, now including items
  const { data: draft, error: draftError } = await supabase
    .from('orders')
    .insert([{
      customer_name:    `${customer.firstName} ${customer.lastName}`,
      customer_email:   customer.email,
      customer_phone:   customer.phone,
      shipping_address,
      city:             customer.city,
      items,            // ← here!
      total:            amount,
      payment_status:   'pending',
    }])
    .select('id')
    .single()

  if (draftError) {
    console.error('Draft insert error:', draftError)
    return NextResponse.json({ error: draftError.message }, { status: 500 })
  }

  const orderId = draft.id

  // 2️⃣ create the Wave session...
  const origin  = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL
  const session = await createCheckoutSession(amount, phoneNumber, {
    clientReference: orderId,
    errorUrl:        `${origin}/checkout/error?order_id=${orderId}`,
    successUrl:      `${origin}/checkout/success?order_id=${orderId}`,
  })

  // 3️⃣ update wave_payment_id, return session
  await supabase
    .from('orders')
    .update({ wave_payment_id: session.id })
    .eq('id', orderId)

  return NextResponse.json(session)
}
