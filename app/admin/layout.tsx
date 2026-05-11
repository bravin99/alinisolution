'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Mail, DollarSign, FileText,
  LogOut, Flame, Menu, X, ChevronRight
} from 'lucide-react'

const NAV = [
  { href: '/admin',          label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/leads',    label: 'Leads',      icon: Mail },
  { href: '/admin/pricing',  label: 'Pricing',    icon: DollarSign },
  { href: '/admin/content',  label: 'Content',    icon: FileText },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser]  = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const u = localStorage.getItem('alini_admin')
    if (u) setUser(JSON.parse(u))
  }, [])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('alini_admin')
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4cfc7] flex">

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#141414] border-r border-[#2a2a2a]
        flex flex-col transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#2a2a2a]">
          <div className="w-8 h-8 bg-[#E8601C]/20 rounded flex items-center justify-center">
            <Flame className="w-4 h-4 text-[#E8601C]" />
          </div>
          <div>
            <p className="font-bold text-white text-sm font-display leading-none">Alini</p>
            <p className="text-[10px] text-[#7a7570] uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors
                  ${active
                    ? 'bg-[#C8102E]/15 text-white border border-[#C8102E]/20'
                    : 'text-[#7a7570] hover:text-white hover:bg-[#1a1a1a]'}
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto text-[#C8102E]" />}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-[#2a2a2a]">
          {user && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs text-white font-medium truncate">{user.name}</p>
              <p className="text-[11px] text-[#7a7570] truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[#7a7570] hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* ── Overlay (mobile) ── */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 px-6 py-4 bg-[#141414] border-b border-[#2a2a2a]">
          <button onClick={() => setOpen(true)} className="lg:hidden text-[#7a7570] hover:text-white">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1">
            <p className="text-sm text-[#7a7570]">
              <a href="/" target="_blank" className="hover:text-white transition-colors">
                ↗ View site
              </a>
            </p>
          </div>
          {/* Kenyan flag strip */}
          <div className="flex h-5 w-20 rounded overflow-hidden gap-px">
            <div className="flex-1 bg-[#111]" />
            <div className="flex-1 bg-[#C8102E]" />
            <div className="flex-1 bg-[#e8e2d8]" />
            <div className="flex-1 bg-[#006B3F]" />
            <div className="flex-1 bg-[#111]" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
