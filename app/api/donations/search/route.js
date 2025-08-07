// app/api/donations/search/route.js
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/donations/search?id=123
 * @param {*} req 
 * @returns 
 */
export async function GET(req) {
  console.log('[donations/search] URL:', req.url)
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    console.error('[donations/search] Missing `id` query param')
    return NextResponse.json(
      { error: 'Missing `id` query parameter' },
      { status: 400 }
    )
  }

  console.log('[donations/search] Looking up donation id=', id)
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[donations/search] Supabase error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  if (!data) {
    console.warn('[donations/search] No donation found with id=', id)
    return NextResponse.json(
      { error: `Donation ${id} not found` },
      { status: 404 }
    )
  }

  console.log('[donations/search] Found donation:', data)
  return NextResponse.json({ donation: data })
}
