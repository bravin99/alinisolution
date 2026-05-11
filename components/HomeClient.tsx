'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// ── Types ──────────────────────────────────────────────────────────────────
interface PricingTab    { id: string; label: string; icon: string; highlight?: boolean }
interface PlanFeature   { text: string; included: boolean }
interface Plan          { id: number; tab_id: string; badge: string; name: string; description: string; price: string; period: string; is_featured: boolean; cta_label: string; features: PlanFeature[] }
interface DomainRow     { extension: string; badge?: string; registration: string; renewal: string; includes_text: string; is_featured: boolean; cta_label: string }
interface Bundle        { id: number; icon: string; name: string; tagline: string; price: string; period: string; saving: string; best_for: string; color: string; is_featured: boolean; cta_label: string; features: string[] }
interface PricingData   { tabs: PricingTab[]; plans: Record<string, Plan[]>; domains: DomainRow[]; bundles: Bundle[]; vatNote: string }

// ── Reveal hook ─────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 70)
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// ── Flag Bar ─────────────────────────────────────────────────────────────────
function FlagBar({ opacity = 1 }: { opacity?: number }) {
  return (
    <div className="flex h-[4px] w-full" style={{ opacity }}>
      {['#111','#C8102E','#e8e2d8','#006B3F','#111'].map((c, i) => (
        <div key={i} className="flex-1" style={{ background: c }} />
      ))}
    </div>
  )
}

// ── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#services', label: 'Services' },
    { href: '#why',      label: 'About'    },
    { href: '#process',  label: 'Process'  },
    { href: '#pricing',  label: 'Pricing'  },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a]' : 'bg-transparent'}`}>
      <FlagBar />
      <div className="flex items-center justify-between px-10 lg:px-16 py-4 w-full">
        <a href="/" className="flex items-center gap-3">
          <img src="/alini_favicon.png" alt="Alini Solutions" className="h-9 w-auto" />
          <span className="font-display font-extrabold text-xl text-white">
            Alini <span className="text-[#E8601C]">Solutions</span>
          </span>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex gap-8 list-none">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-[#7a7570] hover:text-white text-sm uppercase tracking-widest transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a href="/admin/login" className="text-[#7a7570] hover:text-white text-xs uppercase tracking-widest transition-colors">
            Admin
          </a>
          <a href="#contact" className="bg-[#C8102E] hover:bg-[#a50d24] text-white text-sm font-medium px-5 py-2 transition-colors">
            Get Started
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-1">
          <div className={`w-5 h-px bg-white mb-1.5 transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-5 h-px bg-white mb-1.5 transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-px bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#141414] border-t border-[#2a2a2a] px-8 py-4 flex flex-col gap-4">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              className="text-[#d4cfc7] text-sm uppercase tracking-widest">
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMobileOpen(false)}
            className="bg-[#C8102E] text-white text-sm font-medium px-5 py-2.5 text-center mt-2">
            Get Started
          </a>
        </div>
      )}
    </nav>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center px-10 lg:px-16 pt-36 pb-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[55vw] h-full pointer-events-none"
        style={{ background: 'linear-gradient(145deg, rgba(200,16,46,0.05) 0%, rgba(0,107,63,0.06) 60%, transparent 100%)', clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />

      {/* Flame watermark */}
      <img src="/alini_favicon.png" alt="" aria-hidden
        className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[22vw] max-w-[340px] opacity-[0.12] pointer-events-none"
        style={{ animation: 'flamePulse 4s ease-in-out infinite' }} />

      <p className="flex items-center gap-3 text-[#E8601C] text-xs uppercase tracking-[0.2em] font-medium mb-6">
        <span className="w-8 h-px bg-[#E8601C]" />
        Nairobi · East Africa · Global
      </p>

      <h1 className="font-display font-extrabold text-white leading-[1.05] mb-7"
        style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}>
        Infrastructure that<br />
        <span className="text-[#C8102E]">scales</span> with<br />
        <span className="text-[#006B3F]">ambition</span>
      </h1>

      <p className="text-[#d4cfc7] text-lg leading-relaxed max-w-xl mb-10">
        Alini Solutions delivers enterprise-grade managed cloud infrastructure, automation, and AI-powered systems — so your team can focus on building, not babysitting servers.
      </p>

      <div className="flex gap-4 flex-wrap">
        <a href="#contact" className="bg-[#C8102E] hover:bg-[#a50d24] text-white px-9 py-4 font-medium text-sm tracking-wider transition-all hover:-translate-y-px">
          Start a Project
        </a>
        <a href="#services" className="border border-[#2a2a2a] hover:border-white text-white px-9 py-4 text-sm tracking-wider transition-all hover:-translate-y-px">
          Explore Services
        </a>
      </div>

      {/* Stats */}
      <div className="flex gap-12 flex-wrap mt-16 pt-10 border-t border-[#2a2a2a]">
        {[
          { num: '99', suffix: '.9%', label: 'Uptime SLA' },
          { num: '24', suffix: '/7',  label: 'Monitoring' },
          { num: '60', suffix: '+',   label: 'Clients Served' },
        ].map(s => (
          <div key={s.label}>
            <p className="font-display font-extrabold text-white text-4xl leading-none">
              {s.num}<span className="text-[#E8601C]">{s.suffix}</span>
            </p>
            <p className="text-[#7a7570] text-xs uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: '🖥️', title: 'Managed Infrastructure',  desc: 'Full lifecycle server management — provisioning, hardening, patching, and monitoring across cloud or on-premise environments. We keep your systems healthy around the clock.',  tag: 'Core Service', color: 'red'    },
  { icon: '☁️', title: 'Premium Hosting Setup',    desc: 'High-performance hosting architectures built for reliability. Load balancing, CDN configuration, SSL/TLS management, and multi-region redundancy tailored to your traffic.',   tag: 'Hosting',      color: 'green'  },
  { icon: '🏗️', title: 'Solution Architecture',   desc: 'We design systems that grow with you. Cloud-native blueprints, microservice design, database strategy, and infrastructure-as-code for technical teams and founders alike.',      tag: 'Architecture', color: 'orange' },
  { icon: '⚙️', title: 'Automation & DevOps',     desc: 'CI/CD pipelines, containerisation with Docker & Kubernetes, and infrastructure automation with Terraform and Ansible. Ship faster with zero manual bottlenecks.',              tag: 'DevOps',       color: 'red'    },
  { icon: '🤖', title: 'AI / ML Integration',     desc: 'Readiness assessments, model deployment, data pipeline architecture, and MLOps setup. We bridge the gap between AI potential and production-grade implementation.',             tag: 'Intelligence', color: 'green'  },
  { icon: '🛡️', title: 'Security & Compliance',  desc: 'Vulnerability scanning, firewall management, access control audits, and compliance alignment (ISO 27001, SOC 2 readiness). Your data stays safe, always.',                     tag: 'Security',     color: 'orange' },
  { icon: '📧', title: 'Email Hosting',           desc: 'Professional branded email with Google Workspace or Microsoft 365 setup, migration from existing mail, spam protection, and ongoing management for your team.',                  tag: 'Email',        color: 'red'    },
  { icon: '🗄️', title: 'File Storage',           desc: 'Secure, scalable cloud file storage with team folders, versioning, audit logs, and S3-compatible object storage for data-intensive workloads and compliance needs.',              tag: 'Storage',      color: 'green'  },
  { icon: '🔗', title: 'Domain & DNS Services',  desc: 'Full domain lifecycle management — acquisition, DNS configuration, SSL setup, redirects, and ongoing management for .co.ke, .com, .ke, and more.',                              tag: 'Domains',      color: 'orange' },
]

function Services() {
  return (
    <section id="services" className="py-28 bg-[#141414]">
      <div className="px-10 lg:px-16">
        <div className="flex justify-between items-end mb-16 flex-wrap gap-8">
          <div>
            <p className="flex items-center gap-3 text-[#006B3F] text-xs uppercase tracking-[0.22em] font-medium mb-4">
              <span className="w-6 h-px bg-[#006B3F]" />What We Offer
            </p>
            <h2 className="font-display font-bold text-white text-4xl md:text-5xl leading-tight">
              End-to-end cloud<br />expertise
            </h2>
          </div>
          <p className="text-[#7a7570] max-w-sm leading-relaxed">
            From bare-metal provisioning to AI integration, we handle every layer of your technical stack with precision and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2a2a2a] border border-[#2a2a2a]">
          {SERVICES.map((s, i) => (
            <div key={i} className="reveal bg-[#141414] p-10 group relative overflow-hidden hover:bg-[#1a1a1a] transition-colors">
              <div className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500"
                style={{ background: s.color === 'red' ? '#C8102E' : s.color === 'green' ? '#006B3F' : '#E8601C' }} />
              <div className="text-3xl mb-6">{s.icon}</div>
              <h3 className="font-display font-bold text-white text-lg mb-3">{s.title}</h3>
              <p className="text-[#7a7570] text-sm leading-[1.8]">{s.desc}</p>
              <span className="inline-block mt-5 text-[11px] uppercase tracking-[0.15em] text-[#E8601C] border border-[#E8601C]/30 px-2.5 py-1">
                {s.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Why Alini ─────────────────────────────────────────────────────────────────
const WHY_ITEMS = [
  { title: 'Africa-native expertise',      desc: 'We understand the local infrastructure landscape — bandwidth realities, data sovereignty requirements, and regional cloud footprints — and design accordingly.' },
  { title: 'Senior-only engineers',        desc: 'No juniors on your account. Every engagement is handled by experienced architects and DevOps engineers with proven track records in production environments.' },
  { title: 'Transparent, predictable costs', desc: 'Fixed retainers, clear scope, no surprise invoices. We operate with full financial transparency so your budget planning is never disrupted.' },
  { title: 'Proactive, not reactive',      desc: "We don't wait for incidents. Our monitoring stacks catch anomalies before they become outages, with documented runbooks for every critical system." },
]

function WhyAlini() {
  return (
    <section id="why" className="py-28 bg-[#0a0a0a]">
      <div className="px-10 lg:px-16">
        <p className="flex items-center gap-3 text-[#006B3F] text-xs uppercase tracking-[0.22em] font-medium mb-4">
          <span className="w-6 h-px bg-[#006B3F]" />Why Alini Solutions
        </p>
        <h2 className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-16">
          Built for precision.<br />Delivered with care.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-0">
            {WHY_ITEMS.map((w, i) => (
              <div key={i} className="reveal flex gap-6 py-8 border-b border-[#2a2a2a] last:border-0">
                <span className="font-display font-extrabold text-[#2a2a2a] text-4xl leading-none pt-1 min-w-[2rem]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display font-semibold text-white text-base mb-2">{w.title}</h3>
                  <p className="text-[#7a7570] text-sm leading-[1.8]">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shield SVG */}
          <div className="reveal hidden lg:flex items-center justify-center">
            <svg viewBox="0 0 320 420" xmlns="http://www.w3.org/2000/svg" className="w-72 opacity-50">
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#C8102E" stopOpacity="0.7" />
                  <stop offset="50%"  stopColor="#0a0a0a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#006B3F" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <path d="M160 10 L310 80 L310 200 Q310 340 160 410 Q10 340 10 200 L10 80 Z" fill="url(#sg)" stroke="#2a2a2a" strokeWidth="1.5" />
              <path d="M160 10 L310 80 L310 140 Q230 130 160 125 Q90 130 10 140 L10 80 Z" fill="#C8102E" opacity="0.35" />
              <path d="M10 260 Q90 270 160 275 Q230 270 310 260 L310 200 Q230 190 160 185 Q90 190 10 200 Z" fill="#006B3F" opacity="0.35" />
              <line x1="160" y1="30" x2="160" y2="390" stroke="#e8e2d8" strokeWidth="3" opacity="0.2" />
              <polygon points="160,15 152,50 168,50" fill="#e8e2d8" opacity="0.25" />
              <polyline points="100,160 130,190 160,160 190,190 220,160" fill="none" stroke="#e8e2d8" strokeWidth="1.5" opacity="0.15" />
              <polyline points="100,210 130,240 160,210 190,240 220,210" fill="none" stroke="#e8e2d8" strokeWidth="1.5" opacity="0.12" />
              <circle cx="160" cy="190" r="22" fill="none" stroke="#E8601C" strokeWidth="1.5" opacity="0.5" />
              <text x="160" y="197" textAnchor="middle" fontSize="20" fill="#E8601C" opacity="0.7">🔥</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Process ───────────────────────────────────────────────────────────────────
const STEPS = [
  { num: '01', title: 'Discovery',       color: '#C8102E', desc: 'We map your current infrastructure, identify gaps, risks, and opportunities during an in-depth technical audit.' },
  { num: '02', title: 'Architecture',    color: '#2a2a2a', desc: 'We design a tailored solution — from topology diagrams to IaC code — before a single server is touched.' },
  { num: '03', title: 'Deployment',      color: '#006B3F', desc: 'Automated, reproducible deployments with staged rollouts, rollback plans, and zero-downtime migration strategies.' },
  { num: '04', title: 'Manage & Evolve', color: '#E8601C', desc: 'Ongoing monitoring, incident response, quarterly reviews, and continuous optimisation as your needs grow.' },
]

function Process() {
  return (
    <section id="process" className="py-28 bg-[#141414]">
      <div className="px-10 lg:px-16">
        <p className="flex items-center gap-3 text-[#006B3F] text-xs uppercase tracking-[0.22em] font-medium mb-4">
          <span className="w-6 h-px bg-[#006B3F]" />How We Work
        </p>
        <h2 className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-4">
          A process you can rely on
        </h2>
        <p className="text-[#7a7570] mb-16">Every engagement follows a structured path — no surprises, no wasted time.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="absolute top-5 left-[10%] right-[10%] h-px bg-[#2a2a2a] hidden lg:block" />
          {STEPS.map((s, i) => (
            <div key={i} className="reveal relative z-10">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-extrabold text-sm text-white mb-6"
                style={{ background: s.color, border: s.color === '#2a2a2a' ? '1px solid #3a3a3a' : 'none' }}>
                {s.num}
              </div>
              <h3 className="font-display font-bold text-white mb-2">{s.title}</h3>
              <p className="text-[#7a7570] text-sm leading-[1.75]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function PricingCards({ plans }: { plans: Plan[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2a2a2a] border border-[#2a2a2a]">
      {plans.map(p => (
        <div key={p.id} className={`reveal flex flex-col p-10 ${p.is_featured ? 'bg-[#1a1a1a] border-t-2 border-[#C8102E]' : 'bg-[#141414]'}`}>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#C8102E] font-semibold mb-3">{p.badge}</span>
          <h3 className="font-display font-bold text-white text-xl mb-2">{p.name}</h3>
          <p className="text-[#7a7570] text-sm leading-relaxed mb-5">{p.description}</p>
          <div className="font-display font-extrabold text-white mb-6 leading-none"
            style={{ fontSize: p.price === 'Custom' ? '2rem' : '2.5rem' }}>
            {p.price === 'Custom' ? 'Custom' : <><sup className="text-base font-normal text-[#7a7570]">KES </sup>{p.price}<sub className="text-base font-light text-[#7a7570]">{p.period}</sub></>}
          </div>
          <ul className="flex flex-col gap-3 flex-1 mb-8">
            {p.features.map((f, i) => (
              <li key={i} className={`flex items-start gap-2.5 text-sm ${f.included ? 'text-[#d4cfc7]' : 'text-[#555] line-through'}`}>
                <span className={`mt-0.5 text-xs flex-shrink-0 ${f.included ? 'text-[#006B3F]' : 'text-[#333]'}`}>{f.included ? '✓' : '–'}</span>
                {f.text}
              </li>
            ))}
          </ul>
          <a href="#contact" className={`text-center text-sm font-medium py-3 transition-colors ${p.is_featured ? 'bg-[#C8102E] hover:bg-[#a50d24] text-white' : 'border border-[#2a2a2a] hover:border-white text-white'}`}>
            {p.cta_label}
          </a>
        </div>
      ))}
    </div>
  )
}

function PricingDomains({ rows }: { rows: DomainRow[] }) {
  return (
    <>
      <div className="bg-[#141414] border border-[#2a2a2a] flex gap-4 items-start p-6 mb-2">
        <span className="text-2xl">🔗</span>
        <div>
          <p className="font-display font-bold text-white mb-1">Domain Acquisition & Setup</p>
          <p className="text-[#7a7570] text-sm">We handle the full domain lifecycle — registration, DNS configuration, SSL, redirects, and ongoing management.</p>
        </div>
      </div>
      <div className="border border-[#2a2a2a] overflow-hidden">
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_2.5fr_1fr] bg-[#1a1a1a] px-5 py-3 text-[11px] uppercase tracking-widest text-[#7a7570] hidden md:grid">
          <span>Extension</span><span>Registration</span><span>Renewal</span><span>Includes</span><span />
        </div>
        {rows.map((r, i) => (
          <div key={i} className={`grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_2.5fr_1fr] items-center px-5 py-3.5 border-t border-[#2a2a2a] text-sm gap-2 ${r.is_featured ? 'border-l-2 border-l-[#C8102E] bg-[#141414]' : 'bg-[#0f0f0f]'}`}>
            <span className="font-display font-bold text-white">
              {r.extension}
              {r.badge && <span className="ml-2 text-[10px] bg-[#C8102E] text-white px-1.5 py-0.5 uppercase tracking-wider">{r.badge}</span>}
            </span>
            <span className="text-[#E8601C] font-semibold">{r.registration}</span>
            <span className="text-[#7a7570]">{r.renewal}</span>
            <span className="text-[#7a7570] hidden md:block">{r.includes_text}</span>
            <a href="#contact" className={`text-xs text-center py-1.5 px-3 border transition-colors ${r.is_featured ? 'bg-[#C8102E] border-[#C8102E] text-white hover:bg-[#a50d24]' : 'border-[#2a2a2a] text-white hover:border-white'}`}>
              {r.cta_label}
            </a>
          </div>
        ))}
      </div>
    </>
  )
}

function PricingBundles({ bundles }: { bundles: Bundle[] }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    red:    { bg: 'rgba(200,16,46,0.12)',  text: '#e87070' },
    orange: { bg: 'rgba(232,96,28,0.12)',  text: '#f0a070' },
    green:  { bg: 'rgba(0,107,63,0.12)',   text: '#6dbf9d' },
  }
  return (
    <>
      <div className="bg-[#141414] border border-[#2a2a2a] flex gap-4 items-start p-6 mb-2">
        <span className="text-2xl">🔥</span>
        <div>
          <p className="font-display font-bold text-white mb-1">Recommended Bundles</p>
          <p className="text-[#7a7570] text-sm">Our most popular service combinations, packaged for maximum value. Everything your business needs — under one roof.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2a2a2a] border border-[#2a2a2a]">
        {bundles.map(b => {
          const c = colorMap[b.color] || colorMap.red
          return (
            <div key={b.id} className={`reveal flex flex-col ${b.is_featured ? 'bg-[#1a1a1a]' : 'bg-[#141414]'}`}>
              <div className="flex items-center gap-3 px-8 py-5" style={{ background: c.bg }}>
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="font-display font-bold text-white">{b.name}</p>
                  <p className="text-xs text-[#7a7570]">{b.tagline}</p>
                </div>
              </div>
              <div className="px-8 pt-5 pb-8 flex flex-col flex-1">
                <div className="font-display font-extrabold text-white text-4xl leading-none mb-1">
                  <sup className="text-base font-normal text-[#7a7570]">KES </sup>{b.price}<sub className="text-base font-light text-[#7a7570]">{b.period}</sub>
                </div>
                <p className="text-[#006B3F] text-xs mb-5">{b.saving}</p>
                <ul className="flex flex-col gap-2.5 flex-1 mb-4">
                  {b.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#d4cfc7]">
                      <span className="text-[#006B3F] text-xs mt-0.5 flex-shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <p className="text-[#E8601C] text-xs italic mb-5">Best for: {b.best_for}</p>
                <a href="#contact" className={`text-center text-sm font-medium py-3 transition-colors ${b.is_featured ? 'bg-[#C8102E] hover:bg-[#a50d24] text-white' : 'border border-[#2a2a2a] hover:border-white text-white'}`}>
                  {b.cta_label}
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

function Pricing() {
  const [data,   setData]   = useState<PricingData | null>(null)
  const [active, setActive] = useState('hosting')
  const [error,  setError]  = useState(false)

  useEffect(() => {
    fetch('/api/pricing')
      .then(r => r.json())
      .then(d => { setData(d); })
      .catch(() => setError(true))
  }, [])

  const tabs = data?.tabs || []

  return (
    <section id="pricing" className="py-28 bg-[#0a0a0a]">
      <div className="px-10 lg:px-16">
        <p className="flex items-center gap-3 text-[#006B3F] text-xs uppercase tracking-[0.22em] font-medium mb-4">
          <span className="w-6 h-px bg-[#006B3F]" />Pricing
        </p>
        <h2 className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-3">
          Simple pricing,<br />real value
        </h2>
        <p className="text-[#7a7570] mb-10">Choose the services your business needs. All plans include setup, onboarding, and support.</p>

        {/* Tabs */}
        {tabs.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-8">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActive(t.id)}
                className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                  active === t.id
                    ? t.highlight ? 'bg-[#E8601C] border-[#E8601C] text-white' : 'bg-[#C8102E] border-[#C8102E] text-white'
                    : t.highlight ? 'border-[#E8601C]/40 text-[#E8601C] hover:text-white hover:border-white' : 'border-[#2a2a2a] text-[#7a7570] hover:text-white hover:border-white'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Panel */}
        {error && <p className="text-[#7a7570] text-sm py-10 text-center">Unable to load pricing. Please <a href="#contact" className="text-[#C8102E]">contact us</a> for a quote.</p>}

        {!data && !error && (
          <div className="py-20 text-center text-[#555] text-sm animate-pulse">Loading pricing…</div>
        )}

        {data && (
          <>
            {active === 'domains' && <PricingDomains rows={data.domains} />}
            {active === 'bundle'  && <PricingBundles bundles={data.bundles} />}
            {active !== 'domains' && active !== 'bundle' && data.plans[active] && (
              <PricingCards plans={data.plans[active]} />
            )}
          </>
        )}

        {data && (
          <p className="text-center text-[#555] text-xs mt-6">
            {data.vatNote} <a href="#contact" className="text-[#E8601C] hover:underline">Talk to us →</a>
          </p>
        )}
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: 'Alini transformed our chaotic server setup into a clean, automated infrastructure. We went from weekly outages to zero incidents in six months.', name: 'James Mwangi',  role: 'CTO, FinTech Startup · Nairobi'              },
  { quote: "The team's solution architecture work saved us from a costly migration mistake. Their East Africa experience is genuinely invaluable for compliance and latency planning.", name: 'Amara Osei', role: 'VP Engineering, Logistics Platform · Mombasa' },
  { quote: 'We trusted Alini with our AI deployment infrastructure and they exceeded every expectation. The MLOps pipeline they built runs like clockwork.',  name: 'Sarah Kamau',  role: 'Head of Data Science, AgriTech · Kisumu'     },
]

function Testimonials() {
  return (
    <section id="testimonials" className="py-28 bg-[#141414]">
      <div className="px-10 lg:px-16">
        <p className="flex items-center gap-3 text-[#006B3F] text-xs uppercase tracking-[0.22em] font-medium mb-4">
          <span className="w-6 h-px bg-[#006B3F]" />Client Voices
        </p>
        <h2 className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-16">
          Trusted by ambitious teams
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2a2a2a] border border-[#2a2a2a]">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="reveal bg-[#141414] p-10">
              <p className="text-[#C8102E] font-serif text-4xl leading-none mb-4">"</p>
              <p className="text-[#d4cfc7] text-sm leading-[1.85] italic mb-8">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #C8102E, #006B3F)' }}>
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-display font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-[#7a7570] text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Spam protection helpers ───────────────────────────────────────────────────
function genChallenge() {
  const a = Math.floor(Math.random() * 9) + 1
  const b = Math.floor(Math.random() * 9) + 1
  const ops = [
    { q: `${a} + ${b}`,          answer: a + b },
    { q: `${a + b} − ${b}`,      answer: a     },
    { q: `${a} × ${b}`,          answer: a * b },
  ]
  const op = ops[Math.floor(Math.random() * ops.length)]
  return { question: `What is ${op.q}?`, answer: op.answer }
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [form,       setForm]       = useState({ name: '', email: '', company: '', service: '', message: '' })
  const [honeypot,   setHoneypot]   = useState('')          // must stay empty
  const [challenge,  setChallenge]  = useState(() => genChallenge())
  const [mathAnswer, setMathAnswer] = useState('')
  const [mathError,  setMathError]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [status,     setStatus]     = useState<'idle' | 'success' | 'error'>('idle')
  const [loadedAt]                  = useState(() => Date.now())   // track form-open time

  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  function refreshChallenge() {
    setChallenge(genChallenge())
    setMathAnswer('')
    setMathError(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // ── Client-side checks (fast feedback) ──
    // 1. Honeypot — if filled, silently pretend success
    if (honeypot) { setStatus('success'); return }

    // 2. Too fast — under 3 seconds is almost certainly a bot
    if (Date.now() - loadedAt < 3000) { setStatus('success'); return }

    // 3. Math challenge
    if (parseInt(mathAnswer, 10) !== challenge.answer) {
      setMathError(true)
      refreshChallenge()
      return
    }

    setLoading(true); setStatus('idle'); setMathError(false)
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ...form,
          _hp:        honeypot,               // server checks this too
          _ts:        loadedAt,               // server checks elapsed time
          _challenge: challenge.answer,       // server verifies answer
          _answer:    parseInt(mathAnswer, 10),
        }),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', company: '', service: '', message: '' })
        setMathAnswer('')
        refreshChallenge()
      } else {
        const data = await res.json()
        if (data.code === 'SPAM') { setStatus('success'); return } // silent for bots
        setStatus('error')
      }
    } catch { setStatus('error') }
    finally { setLoading(false) }
  }

  const inputCls = "w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#C8102E] transition-colors"
  const labelCls = "block text-[11px] uppercase tracking-widest text-[#7a7570] mb-1.5"

  return (
    <section id="contact" className="py-28 bg-[#0a0a0a]">
      <div className="px-10 lg:px-16">
        <p className="flex items-center gap-3 text-[#006B3F] text-xs uppercase tracking-[0.22em] font-medium mb-4">
          <span className="w-6 h-px bg-[#006B3F]" />Get In Touch
        </p>
        <h2 className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-3">
          Let's build something<br />extraordinary
        </h2>
        <p className="text-[#7a7570] mb-16">Tell us about your challenges. We'll respond within one business day.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info */}
          <div className="space-y-8">
            {[
              { icon: '🌐', label: 'Website',       value: 'alinisolution.co.ke' },
              { icon: '📧', label: 'Email',         value: 'hello@alinisolution.co.ke' },
              { icon: '📍', label: 'Location',      value: 'Nairobi, Kenya\nServing East Africa & globally' },
              { icon: '⏱️', label: 'Response Time', value: 'Within 1 business day\nSame-day for urgent client issues' },
            ].map(c => (
              <div key={c.label} className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-[#C8102E]/10 flex items-center justify-center text-lg flex-shrink-0">{c.icon}</div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#7a7570] mb-0.5">{c.label}</p>
                  <p className="text-white text-sm whitespace-pre-line">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Honeypot — hidden from real users, bots fill it ── */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden', tabIndex: -1 } as React.CSSProperties}>
              <label>Leave this empty</label>
              <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Full Name</label><input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Jane Wanjiru" className={inputCls} /></div>
              <div><label className={labelCls}>Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="jane@company.co.ke" className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Company</label><input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Your Organisation" className={inputCls} /></div>
            <div>
              <label className={labelCls}>Service Interest</label>
              <select value={form.service} onChange={e => set('service', e.target.value)} className={inputCls + ' bg-[#1a1a1a]'}>
                <option value="">Select a service…</option>
                {['Managed Infrastructure','Premium Hosting Setup','Email Hosting','File Storage','Domain Services','Solution Architecture','Automation & DevOps','AI / ML Integration','Security & Compliance','General Enquiry'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Tell us about your project</label>
              <textarea value={form.message} onChange={e => set('message', e.target.value)} required rows={5} placeholder="Describe your current infrastructure, challenges, or goals…" className={inputCls + ' resize-none'} />
            </div>

            {/* ── Math challenge ── */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-sm p-4 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-[#7a7570] text-xs uppercase tracking-widest flex-shrink-0">Verify:</span>
                <span className="font-display font-bold text-white text-base">{challenge.question}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={mathAnswer}
                  onChange={e => { setMathAnswer(e.target.value); setMathError(false) }}
                  required
                  placeholder="Answer"
                  className={`w-24 bg-[#1a1a1a] border px-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none transition-colors ${mathError ? 'border-[#C8102E] animate-shake' : 'border-[#2a2a2a] focus:border-[#E8601C]'}`}
                />
                <button type="button" onClick={refreshChallenge}
                  title="New question"
                  className="text-[#555] hover:text-[#7a7570] transition-colors text-lg leading-none select-none">
                  ↻
                </button>
              </div>
              {mathError && (
                <p className="w-full text-xs text-[#e87070] mt-1">
                  Incorrect — try the new question above.
                </p>
              )}
            </div>

            {status === 'success' && (
              <div className="bg-[#006B3F]/10 border border-[#006B3F]/30 text-[#6dbf9d] text-sm px-4 py-3">
                ✓ Message sent! We'll be in touch within one business day.
              </div>
            )}
            {status === 'error' && (
              <div className="bg-[#C8102E]/10 border border-[#C8102E]/30 text-[#e87070] text-sm px-4 py-3">
                Something went wrong. Please email us directly at hello@alinisolution.co.ke
              </div>
            )}

            <button type="submit" disabled={loading}
              className="bg-[#C8102E] hover:bg-[#a50d24] disabled:opacity-50 text-white px-10 py-4 text-sm font-medium tracking-wider transition-all hover:-translate-y-px">
              {loading ? 'Sending…' : 'Send Enquiry →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#141414] border-t border-[#2a2a2a]">
      <FlagBar opacity={0.4} />
      <div className="px-10 lg:px-16 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14 pb-14 border-b border-[#2a2a2a]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/alini_favicon.png" alt="Alini Solutions" className="h-9 w-auto" />
              <span className="font-display font-extrabold text-white text-lg">
                Alini <span className="text-[#E8601C]">Solutions</span>
              </span>
            </div>
            <p className="text-[#7a7570] text-sm leading-relaxed max-w-[240px]">
              Premium cloud infrastructure and managed services for ambitious organisations across Kenya and East Africa.
            </p>
          </div>

          {[
            { title: 'Services', links: ['Managed Infrastructure','Cloud Hosting','Email Hosting','File Storage','Domain Services','Solution Architecture','DevOps & Automation','AI/ML Integration'] },
            { title: 'Company',  links: ['About Us','Our Process','Pricing','Clients','Contact'] },
            { title: 'Connect',  links: ['hello@alinisolution.co.ke','alinisolution.co.ke','LinkedIn','Twitter / X','GitHub'] },
          ].map(col => (
            <div key={col.title}>
              <p className="font-display font-bold text-white text-xs uppercase tracking-widest mb-5">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-[#7a7570] hover:text-white text-sm transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[#555] text-xs">© 2024 Alini Solutions. All rights reserved.</p>
          <div className="flex gap-2">
            {['in','𝕏','⌥'].map(s => (
              <a key={s} href="#" className="w-9 h-9 border border-[#2a2a2a] hover:border-[#C8102E] flex items-center justify-center text-[#7a7570] hover:text-white text-xs transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function HomeClient() {
  useReveal()

  return (
    <>
      <style>{`
        @keyframes flamePulse {
          0%,100% { transform:translateY(-50%) scale(1);   opacity:.10; }
          50%      { transform:translateY(-52%) scale(1.04); opacity:.16; }
        }
        .font-display { font-family: var(--font-syne), sans-serif; }
      `}</style>

      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Alini Solutions',
        url: 'https://alinisolution.co.ke',
        description: 'Premium cloud solutions provider offering managed infrastructure, hosting, automation, and AI/ML integration.',
        address: { '@type': 'PostalAddress', addressCountry: 'KE' },
        areaServed: ['Kenya','East Africa'],
        serviceType: ['Managed Infrastructure','Cloud Hosting','DevOps','AI/ML Integration','Solution Architecture'],
      })}} />

      <Nav />
      <main>
        <Hero />
        <Services />
        <WhyAlini />
        <Process />
        <Pricing />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
