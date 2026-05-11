// app/api/admin/pricing/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { mutate, query } from '@/lib/db'
import { getAdminFromCookie } from '@/lib/auth'
import type { RowDataPacket } from 'mysql2'

function auth() {
  const user = getAdminFromCookie()
  if (!user) return null
  return user
}

export async function PUT(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const plan = await req.json()

  if (!plan.id) return NextResponse.json({ error: 'Missing plan id' }, { status: 400 })

  // Update plan core fields
  await mutate(
    `UPDATE pricing_plans SET
       badge=?, name=?, description=?, price=?, period=?,
       is_featured=?, cta_label=?
     WHERE id=?`,
    [plan.badge, plan.name, plan.description, plan.price, plan.period,
     plan.is_featured ? 1 : 0, plan.cta_label || 'Get Started', plan.id]
  )

  // Replace features
  if (Array.isArray(plan.features)) {
    await mutate('DELETE FROM pricing_features WHERE plan_id = ?', [plan.id])
    for (let i = 0; i < plan.features.length; i++) {
      const f = plan.features[i]
      await mutate(
        'INSERT INTO pricing_features (plan_id, feature, is_included, sort_order) VALUES (?,?,?,?)',
        [plan.id, f.text, f.included ? 1 : 0, i]
      )
    }
  }

  return NextResponse.json({ success: true })
}
