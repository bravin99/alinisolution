'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, Filter } from 'lucide-react'

const STATUSES = ['all','new','contacted','qualified','closed','spam'] as const
type Status = typeof STATUSES[number]

const STATUS_STYLES: Record<string, string> = {
  new:        'bg-[#C8102E]/20 text-[#e87070] border-[#C8102E]/20',
  contacted:  'bg-[#E8601C]/20 text-[#f0a070] border-[#E8601C]/20',
  qualified:  'bg-[#006B3F]/20 text-[#6dbf9d] border-[#006B3F]/20',
  closed:     'bg-[#333]/30    text-[#888]    border-[#333]',
  spam:       'bg-[#222]       text-[#555]    border-[#222]',
}

export default function LeadsPage() {
  const [leads,   setLeads]   = useState<any[]>([])
  const [filter,  setFilter]  = useState<Status>('all')
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '100' })
    if (filter !== 'all') params.set('status', filter)
    const data = await fetch(`/api/leads?${params}`).then(r => r.json())
    setLeads(data.leads || [])
    setLoading(false)
  }, [filter])

  useEffect(() => { load() }, [load])

  async function updateStatus(id: number, status: string) {
    await fetch('/api/leads', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id, status }),
    })
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    if (selected?.id === id) setSelected((p: any) => ({ ...p, status }))
  }

  const visible = leads.filter(l =>
    !search ||
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase()) ||
    l.company?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Leads</h1>
        <p className="text-sm text-[#7a7570] mt-0.5">{leads.length} total enquiries</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads…"
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-sm pl-8 pr-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#C8102E]"
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-sm border transition-colors ${
                filter === s
                  ? 'bg-[#C8102E] border-[#C8102E] text-white'
                  : 'bg-[#141414] border-[#2a2a2a] text-[#7a7570] hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-[11px] uppercase tracking-widest text-[#7a7570]">
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Service</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {loading ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-[#555]">Loading…</td></tr>
                ) : visible.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-[#555]">No leads found.</td></tr>
                ) : visible.map(lead => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className={`cursor-pointer transition-colors hover:bg-[#1a1a1a] ${selected?.id === lead.id ? 'bg-[#1e1e1e]' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-xs text-[#7a7570]">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[#7a7570] hidden md:table-cell">{lead.service || '—'}</td>
                    <td className="px-4 py-3 text-[#7a7570] text-xs hidden lg:table-cell">
                      {new Date(lead.created_at).toLocaleDateString('en-KE')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-1 rounded-sm border uppercase tracking-wider font-medium ${STATUS_STYLES[lead.status] || ''}`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-72 flex-shrink-0 bg-[#141414] border border-[#2a2a2a] rounded-sm p-5 self-start sticky top-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-white">{selected.name}</p>
                <p className="text-xs text-[#7a7570]">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#555] hover:text-white text-lg leading-none">×</button>
            </div>

            <div className="space-y-2 text-xs mb-4">
              {selected.company && <p><span className="text-[#555]">Company:</span> <span className="text-[#d4cfc7]">{selected.company}</span></p>}
              {selected.service && <p><span className="text-[#555]">Service:</span> <span className="text-[#d4cfc7]">{selected.service}</span></p>}
              <p><span className="text-[#555]">Date:</span> <span className="text-[#d4cfc7]">{new Date(selected.created_at).toLocaleString('en-KE')}</span></p>
            </div>

            <div className="bg-[#1a1a1a] border-l-2 border-[#C8102E] p-3 rounded-sm mb-4">
              <p className="text-xs text-[#d4cfc7] leading-relaxed">{selected.message}</p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#7a7570] mb-2">Update Status</p>
              <div className="flex flex-wrap gap-1.5">
                {(['new','contacted','qualified','closed','spam'] as const).map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className={`text-[10px] px-2 py-1 rounded-sm border uppercase tracking-wider transition-colors ${
                      selected.status === s
                        ? STATUS_STYLES[s]
                        : 'border-[#2a2a2a] text-[#555] hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <a href={`mailto:${selected.email}`}
              className="mt-4 block w-full text-center bg-[#C8102E] hover:bg-[#a50d24] text-white text-xs py-2 rounded-sm transition-colors"
            >
              Reply via email →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
