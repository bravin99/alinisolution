'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'

export default function ContentPage() {
  const [items,   setItems]   = useState<any[]>([])
  const [saving,  setSaving]  = useState<string | null>(null)
  const [msgs,    setMsgs]    = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(data => { setItems(data.content || []); setLoading(false) })
  }, [])

  function updateValue(key: string, value: string) {
    setItems(prev => prev.map(i => i.key === key ? { ...i, value } : i))
  }

  async function save(key: string, value: string) {
    setSaving(key)
    const res = await fetch('/api/admin/content', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ key, value }),
    })
    setMsgs(prev => ({ ...prev, [key]: res.ok ? '✓ Saved' : '✗ Failed' }))
    setSaving(null)
    setTimeout(() => setMsgs(prev => ({ ...prev, [key]: '' })), 2500)
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto">
      <div className="text-[#555] text-sm mt-10 text-center">Loading content…</div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Content Editor</h1>
        <p className="text-sm text-[#7a7570] mt-0.5">Edit homepage copy. Changes go live immediately after saving.</p>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.key} className="bg-[#141414] border border-[#2a2a2a] rounded-sm p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-white">{item.label || item.key}</p>
                <p className="text-[11px] text-[#555] font-mono">{item.key}</p>
              </div>
              {msgs[item.key] && (
                <span className={`text-xs px-2 py-0.5 rounded-sm ${msgs[item.key].startsWith('✓') ? 'text-[#6dbf9d] bg-[#006B3F]/10' : 'text-[#e87070] bg-[#C8102E]/10'}`}>
                  {msgs[item.key]}
                </span>
              )}
            </div>

            {item.value?.length > 80 ? (
              <textarea
                value={item.value}
                onChange={e => updateValue(item.key, e.target.value)}
                rows={3}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E] resize-none mb-3"
              />
            ) : (
              <input
                value={item.value}
                onChange={e => updateValue(item.key, e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C8102E] mb-3"
              />
            )}

            <button
              onClick={() => save(item.key, item.value)}
              disabled={saving === item.key}
              className="flex items-center gap-1.5 bg-[#C8102E] hover:bg-[#a50d24] disabled:opacity-50 text-white px-3 py-1.5 text-xs rounded-sm transition-colors"
            >
              <Save className="w-3 h-3" />
              {saving === item.key ? 'Saving…' : 'Save'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
