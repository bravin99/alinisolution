import { NextRequest, NextResponse } from 'next/server'
import { query, mutate } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'
import type { RowDataPacket } from 'mysql2'

function requireAdmin(req: NextRequest) {
  const user = getAdminFromCookie()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return user
}

// GET /api/leads?status=new&page=1&limit=20
export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || ''
  const page   = Math.max(1, Number(searchParams.get('page')  || 1))
  const limit  = Math.min(50, Number(searchParams.get('limit') || 20))
  const offset = (page - 1) * limit

  const where = status ? 'WHERE status = ?' : ''
  const params = status ? [status, limit, offset] : [limit, offset]

  const leads = await query<RowDataPacket[]>(
    `SELECT id, name, email, company, service, message,
            status, created_at, updated_at
     FROM leads ${where}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    params
  )

  const [{ total }] = await query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM leads ${where}`,
    status ? [status] : []
  )

  return NextResponse.json({ leads, total: total as number, page, limit })
}

// PATCH /api/leads  { id, status, notes }
export async function PATCH(req: NextRequest) {
  const auth = requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { id, status, notes } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await mutate(
    'UPDATE leads SET status = COALESCE(?, status), notes = COALESCE(?, notes) WHERE id = ?',
    [status || null, notes ?? null, id]
  )

  return NextResponse.json({ success: true })
}
