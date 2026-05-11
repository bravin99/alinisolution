'use client'

import { useEffect, useState } from 'react'
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

export default function PricingAdminPage() {
  const [data,    setData]    = useState<any>(null)
  const [active,  setActive]  = useState('hosting')
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')

  useEffect(() => {
    fetch('/api/pricing').then(r => r.json()).then(setData)
  }, [])

  async function savePlan(plan: any) {
    setSaving(true); setMsg('')
    try {
      const res = await fetch('/api/admin/pricing', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(plan),
      })
      if (res.ok) setMsg('✓ Saved')
      else setMsg('✗ Save failed')
    } finally { setSaving(false) }
  }

  if (!data) return (
    <div className="max-w-4xl mx-auto">
      <div className="text-[#555] text-sm mt-10 text-center">Loading pricing data…</div>
    </div>
  )

  const tabs = data.tabs || []
  const plans = (data.plans?.[active] || []) as any[]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Pricing Editor</h1>
          <p className="text-sm text-[#7a7570] mt-0.5">Edit plans, prices and features. Changes go live immediately.</p>
        </div>
        {msg && <span className={`text-xs px-3 py-1 rounded-sm ${msg.startsWith('✓') ? 'text-[#6dbf9d] bg-[#006B3F]/10' : 'text-[#e87070] bg-[#C8102E]/10'}`}>{msg}</span>}
      </div>

      {/* Tab selector */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {tabs.map((t: any) => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
              active === t.id
                ? 'bg-[#C8102E] border-[#C8102E] text-white'
                : 'bg-[#141414] border-[#2a2a2a] text-[#7a7570] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Domain table (read-only notice) */}
      {active === 'domains' && (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm p-6">
          <p className="text-white font-semibold mb-2">Domain Pricing</p>
          <p className="text-sm text-[#7a7570]">Domain rows are managed directly in the database (<code className="text-[#E8601C]">pricing_domains</code> table) or via the MySQL editor in CyberPanel. Inline editing coming soon.</p>
          <div className="mt-4 space-y-2">
            {(data.domains || []).map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-4 px-3 py-2 bg-[#1a1a1a] rounded-sm text-sm">
                <span className="font-mono text-white w-36 flex-shrink-0">{d.extension}</span>
                <span className="text-[#E8601C] w-28">{d.registration}</span>
                <span className="text-[#7a7570]">{d.includes_text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bundle editor (read-only notice) */}
      {active === 'bundle' && (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm p-6">
          <p className="text-white font-semibold mb-2">Bundle Pricing</p>
          <p className="text-sm text-[#7a7570]">Bundles are managed in the <code className="text-[#E8601C]">pricing_bundles</code> and <code className="text-[#E8601C]">bundle_features</code> tables in MySQL.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {(data.bundles || []).map((b: any) => (
              <div key={b.id} className="bg-[#1a1a1a] rounded-sm p-4 border border-[#2a2a2a]">
                <p className="text-white font-semibold">{b.icon} {b.name}</p>
                <p className="text-[#E8601C] font-bold mt-1">KES {b.price}{b.period}</p>
                <p className="text-xs text-[#7a7570] mt-1">{b.saving}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan cards editor */}
      {active !== 'domains' && active !== 'bundle' && plans.length > 0 && (
        <div className="space-y-4">
          {plans.map((plan: any, pi: number) => (
            <PlanEditor key={plan.id ?? pi} plan={plan} onSave={savePlan} saving={saving} />
          ))}
        </div>
      )}
    </div>
  )
}

function PlanEditor({ plan, onSave, saving }: { plan: any; onSave: (p: any) => void; saving: boolean }) {
  const [p, setP]     = useState(plan)
  const [open, setOpen] = useState(false)

  function setField(k: string, v: string) { setP((prev: any) => ({ ...prev, [k]: v })) }

  function setFeature(i: number, field: string, val: string | boolean) {
    setP((prev: any) => {
      const feats = [...(prev.features || [])]
      feats[i] = { ...feats[i], [field]: val }
      return { ...prev, features: feats }
    })
  }

  function addFeature() {
    setP((prev: any) => ({ ...prev, features: [...(prev.features || []), { text: '', included: true }] }))
  }

  function removeFeature(i: number) {
    setP((prev: any) => ({ ...prev, features: prev.features.filter((_: any, idx: number) => idx !== i) }))
  }

  return (
    <div className={`bg-[#141414] border rounded-sm overflow-hidden ${p.is_featured ? 'border-[#C8102E]/40' : 'border-[#2a2a2a]'}`}>
      <div className="flex items-center gap-3 px-5 py-4 cursor-pointer" onClick={() => setOpen(!open)}>
        {p.is_featured && <span className="text-[10px] bg-[#C8102E]/20 text-[#e87070] border border-[#C8102E]/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Featured</span>}
        <p className="font-semibold text-white flex-1">{p.name}</p>
        <p className="text-[#E8601C] font-bold text-sm">KES {p.price}{p.period}</p>
        {open ? <ChevronUp className="w-4 h-4 text-[#555]" /> : <ChevronDown className="w-4 h-4 text-[#555]" />}
      </div>

      {open && (
        <div className="border-t border-[#2a2a2a] p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7a7570] mb-1">Badge</label>
              <input value={p.badge || ''} onChange={e => setField('badge', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-[#C8102E]" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7a7570] mb-1">Name</label>
              <input value={p.name || ''} onChange={e => setField('name', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-[#C8102E]" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7a7570] mb-1">Price</label>
              <input value={p.price || ''} onChange={e => setField('price', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                placeholder="3,500 or Custom" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7a7570] mb-1">Period</label>
              <input value={p.period || ''} onChange={e => setField('period', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-[#C8102E]"
                placeholder="/mo" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#7a7570] mb-1">Description</label>
            <textarea value={p.description || ''} onChange={e => setField('description', e.target.value)} rows={2}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-[#C8102E] resize-none" />
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase tracking-widest text-[#7a7570]">Features</label>
              <button onClick={addFeature} className="flex items-center gap-1 text-[11px] text-[#006B3F] hover:text-[#6dbf9d]">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-1.5">
              {(p.features || []).map((f: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="checkbox" checked={f.included} onChange={e => setFeature(i, 'included', e.target.checked)}
                    className="accent-[#006B3F] w-3.5 h-3.5 flex-shrink-0" />
                  <input value={f.text} onChange={e => setFeature(i, 'text', e.target.value)}
                    className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#C8102E]" />
                  <button onClick={() => removeFeature(i)} className="text-[#555] hover:text-[#C8102E]">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={() => onSave(p)} disabled={saving}
              className="flex items-center gap-2 bg-[#C8102E] hover:bg-[#a50d24] disabled:opacity-50 text-white px-4 py-2 text-xs rounded-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving…' : 'Save Plan'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
