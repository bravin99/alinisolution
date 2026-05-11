import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400','600','700','800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300','400','500'],
})

export const metadata: Metadata = {
  title:       'Alini Solutions | Premium Cloud & Managed Infrastructure Services in Kenya',
  description: 'Alini Solutions provides enterprise-grade managed infrastructure, cloud hosting, system automation, solution architecture, and AI/ML integration for premium clients across Kenya and East Africa.',
  keywords:    'cloud solutions Kenya, managed infrastructure Kenya, hosting Kenya, DevOps Kenya, AI ML integration Kenya, solution architect Nairobi',
  metadataBase: new URL('https://alinisolution.co.ke'),
  openGraph: {
    title:       'Alini Solutions | Premium Cloud & Managed Infrastructure',
    description: 'Enterprise-grade cloud infrastructure, managed hosting, automation and AI/ML services.',
    url:         'https://alinisolution.co.ke',
    siteName:    'Alini Solutions',
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="font-body bg-[#0a0a0a] text-[#d4cfc7] antialiased">
        {children}
      </body>
    </html>
  )
}
