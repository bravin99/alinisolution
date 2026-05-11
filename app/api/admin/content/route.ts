import { NextRequest, NextResponse } from 'next/server'
import { query, mutate } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'
import type { RowDataPacket } from 'mysql2'

export async function GET() {
  const user = getAdminFromCookie()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const content = await query<RowDataPacket[]>(
    'SELECT `key`, value, label FROM site_content ORDER BY id'
  )
  return NextResponse.json({ content })
}

export async function PUT(req: NextRequest) {
  const user = getAdminFromCookie()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { key, value } = await req.json()
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

  await mutate(
    'UPDATE site_content SET value = ? WHERE `key` = ?',
    [value, key]
  )
  return NextResponse.json({ success: true })
}
