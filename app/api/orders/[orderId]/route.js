// File: app/api/orders/[orderId]/route.ts
import { NextResponse }    from 'next/server'
import { supabase }        from '@/lib/supabase'

export async function GET( request, { params } ) {
  const { orderId } = params

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Supabase fetch error:', error)
    const status = error.code === 'PGRST116' /* no rows */ ? 404 : 500
    return NextResponse.json({ error: error.message }, { status })
  }

  return NextResponse.json(data)
}
