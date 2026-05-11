'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); return }
      localStorage.setItem('alini_admin', JSON.stringify(data.user))
      router.push('/admin')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* Flag bar top */}
      <div className="fixed top-0 inset-x-0 flex h-[3px]">
        {['#111','#C8102E','#e8e2d8','#006B3F','#111'].map((c,i) => (
          <div key={i} className="flex-1" style={{ background: c }} />
        ))}
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#E8601C]/20 rounded-sm flex items-center justify-center">
            <Flame className="w-5 h-5 text-[#E8601C]" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">
              Alini <span className="text-[#E8601C]">Solutions</span>
            </p>
            <p className="text-[11px] text-[#7a7570] uppercase tracking-widest">Admin</p>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm p-8">
          <h1 className="text-white font-bold text-xl mb-1">Sign in</h1>
          <p className="text-[#7a7570] text-sm mb-6">Access the admin dashboard</p>

          {error && (
            <div className="mb-4 px-3 py-2.5 bg-[#C8102E]/10 border border-[#C8102E]/30 rounded-sm text-sm text-[#e87070]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7a7570] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-3 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#C8102E] transition-colors"
                placeholder="admin@alinisolution.co.ke"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#7a7570] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-3 py-2.5 pr-10 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#C8102E] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8102E] hover:bg-[#a50d24] disabled:opacity-50 text-white py-2.5 text-sm font-medium rounded-sm transition-colors mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#555] mt-6">
          Alini Solutions · alinisolution.co.ke
        </p>
      </div>
    </div>
  )
}
