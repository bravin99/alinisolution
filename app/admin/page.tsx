'use client'

import { useEffect, useState } from 'react'
import { Mail, DollarSign, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

interface Stats {
  total: number; new: number; contacted: number; qualified: number; closed: number; spam: number
}

function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number | string; icon: React.ElementType; color: string
}) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] uppercase tracking-widest text-[#7a7570]">{label}</p>
        <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: color + '20' }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats,  setStats]  = useState<Stats | null>(null)
  const [leads,  setLeads]  = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch('/api/leads?limit=5')
        const data = await res.json()
        setLeads(data.leads || [])

        // Count by status
        const all = await fetch('/api/leads?limit=1000').then(r => r.json())
        const rows: any[] = all.leads || []
        const s: Stats = { total: rows.length, new: 0, contacted: 0, qualified: 0, closed: 0, spam: 0 }
        rows.forEach((r: any) => { if (r.status in s) (s as any)[r.status]++ })
        setStats(s)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-[#7a7570] mt-0.5">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard label="Total Leads"  value={stats?.total     ?? '—'} icon={TrendingUp}   color="#E8601C" />
        <StatCard label="New"          value={stats?.new       ?? '—'} icon={AlertCircle}  color="#C8102E" />
        <StatCard label="Contacted"    value={stats?.contacted ?? '—'} icon={Mail}         color="#7a7570" />
        <StatCard label="Qualified"    value={stats?.qualified ?? '—'} icon={Clock}        color="#006B3F" />
        <StatCard label="Closed"       value={stats?.closed    ?? '—'} icon={CheckCircle2} color="#006B3F" />
        <StatCard label="Spam"         value={stats?.spam      ?? '—'} icon={DollarSign}   color="#555" />
      </div>

      {/* Recent leads */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <h2 className="font-semibold text-white text-sm">Recent Leads</h2>
          <a href="/admin/leads" className="text-[11px] text-[#C8102E] hover:underline uppercase tracking-widest">
            View all →
          </a>
        </div>

        {loading ? (
          <div className="px-5 py-8 text-center text-[#555] text-sm">Loading…</div>
        ) : leads.length === 0 ? (
          <div className="px-5 py-8 text-center text-[#555] text-sm">No leads yet.</div>
        ) : (
          <div className="divide-y divide-[#2a2a2a]">
            {leads.map((lead: any) => (
              <div key={lead.id} className="px-5 py-3.5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8102E] to-[#006B3F] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {lead.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{lead.name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-medium ${
                      lead.status === 'new'       ? 'bg-[#C8102E]/20 text-[#e87070]' :
                      lead.status === 'qualified' ? 'bg-[#006B3F]/20 text-[#6dbf9d]' :
                      lead.status === 'closed'    ? 'bg-[#555]/20    text-[#888]'    :
                      'bg-[#2a2a2a] text-[#7a7570]'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#7a7570] truncate">
                    {lead.email} {lead.service ? `· ${lead.service}` : ''}
                  </p>
                </div>
                <p className="text-[11px] text-[#555] flex-shrink-0">
                  {new Date(lead.created_at).toLocaleDateString('en-KE')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
        {[
          { href: '/admin/leads',   label: 'Manage Leads',   sub: 'View, filter & update status', color: '#C8102E' },
          { href: '/admin/pricing', label: 'Edit Pricing',   sub: 'Update plans & prices',        color: '#E8601C' },
          { href: '/admin/content', label: 'Edit Content',   sub: 'Change homepage copy',         color: '#006B3F' },
        ].map(l => (
          <a key={l.href} href={l.href}
            className="bg-[#141414] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-sm p-4 transition-colors group"
          >
            <p className="text-sm font-semibold text-white group-hover:text-[#E8601C] transition-colors">{l.label}</p>
            <p className="text-xs text-[#7a7570] mt-0.5">{l.sub}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
