import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 1. Tabs
    const tabs = await query<RowDataPacket[]>(
      'SELECT tab_id as id, label, icon, highlight FROM pricing_tabs WHERE is_active=1 ORDER BY sort_order'
    )

    // 2. Card-style plans with their features
    const plans = await query<RowDataPacket[]>(
      `SELECT p.id, p.tab_id, p.badge, p.name, p.description,
              p.price, p.period, p.is_featured, p.cta_label
       FROM pricing_plans p
       WHERE p.is_active = 1
       ORDER BY p.tab_id, p.sort_order`
    )

    const features = await query<RowDataPacket[]>(
      `SELECT plan_id, feature, is_included
       FROM pricing_features
       ORDER BY sort_order`
    )

    // 3. Domain rows
    const domains = await query<RowDataPacket[]>(
      `SELECT extension, badge, registration, renewal,
              includes_text, is_featured, cta_label
       FROM pricing_domains
       WHERE is_active = 1
       ORDER BY sort_order`
    )

    // 4. Bundles
    const bundles = await query<RowDataPacket[]>(
      `SELECT id, icon, name, tagline, price, period,
              saving, best_for, color, is_featured, cta_label
       FROM pricing_bundles
       WHERE is_active = 1
       ORDER BY sort_order`
    )

    const bundleFeatures = await query<RowDataPacket[]>(
      'SELECT bundle_id, feature FROM bundle_features ORDER BY sort_order'
    )

    // 5. Site content
    const content = await query<RowDataPacket[]>(
      "SELECT `key`, value FROM site_content WHERE `key` = 'pricing_vat_note'"
    )

    // ── Assemble ──────────────────────────────────────────────
    const featuresByPlan: Record<number, { text: string; included: boolean }[]> = {}
    for (const f of features) {
      if (!featuresByPlan[f.plan_id]) featuresByPlan[f.plan_id] = []
      featuresByPlan[f.plan_id].push({ text: f.feature, included: !!f.is_included })
    }

    const featuresByBundle: Record<number, string[]> = {}
    for (const f of bundleFeatures) {
      if (!featuresByBundle[f.bundle_id]) featuresByBundle[f.bundle_id] = []
      featuresByBundle[f.bundle_id].push(f.feature)
    }

    // Group plans by tab
    const plansByTab: Record<string, typeof plans> = {}
    for (const p of plans) {
      if (!plansByTab[p.tab_id]) plansByTab[p.tab_id] = []
      plansByTab[p.tab_id].push({ ...p, features: featuresByPlan[p.id] || [] })
    }

    const vatNote = content[0]?.value || 'All prices exclude VAT.'

    return NextResponse.json({
      tabs,
      plans: plansByTab,
      domains,
      bundles: bundles.map(b => ({
        ...b,
        features: featuresByBundle[b.id] || [],
      })),
      vatNote,
    })
  } catch (err) {
    console.error('[pricing] DB error:', err)
    return NextResponse.json({ error: 'Failed to load pricing' }, { status: 500 })
  }
}
