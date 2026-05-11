import type { Metadata } from 'next'
import HomeClient from '@/components/HomeClient'

export const metadata: Metadata = {
  title: 'Alini Solutions | Premium Cloud & Managed Infrastructure Services in Kenya',
  description:
    'Alini Solutions provides enterprise-grade managed infrastructure, cloud hosting, system automation, solution architecture, and AI/ML integration for premium clients across Kenya and East Africa.',
  keywords:
    'cloud solutions Kenya, managed infrastructure Kenya, hosting Kenya, DevOps Kenya, AI ML integration Kenya, solution architect Nairobi, server management Kenya',
  alternates: { canonical: 'https://alinisolution.co.ke' },
  openGraph: {
    title:       'Alini Solutions | Premium Cloud & Managed Infrastructure',
    description: 'Enterprise-grade cloud infrastructure, managed hosting, automation and AI/ML services for premium clients.',
    url:         'https://alinisolution.co.ke',
    siteName:    'Alini Solutions',
    type:        'website',
  },
}

export default function Home() {
  return <HomeClient />
}
