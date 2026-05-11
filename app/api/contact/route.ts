import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { mutate } from '@/lib/db'
import { sendLeadNotification, sendLeadAutoReply } from '@/lib/email'

const MIN_ELAPSED_MS = 3_000   // must take at least 3s to fill the form

const schema = z.object({
  name:       z.string().min(2).max(100),
  email:      z.string().email().max(255),
  company:    z.string().max(150).optional().default(''),
  service:    z.string().max(100).optional().default(''),
  message:    z.string().min(10).max(5000),
  // spam fields
  _hp:        z.string().optional(),   // honeypot — must be empty
  _ts:        z.number().optional(),   // timestamp form was loaded
  _challenge: z.number().optional(),   // correct answer
  _answer:    z.number().optional(),   // user's answer
})

function spamResponse() {
  // Return 200 so bots think they succeeded — don't reveal the rejection
  return NextResponse.json({ success: true, code: 'SPAM' }, { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // ── Server-side spam checks ────────────────────────────────────────────

    // 1. Honeypot filled → bot
    if (data._hp && data._hp.length > 0) return spamResponse()

    // 2. Submitted too fast → bot
    if (data._ts && Date.now() - data._ts < MIN_ELAPSED_MS) return spamResponse()

    // 3. Math challenge wrong → bot (or user, show error)
    if (
      data._challenge !== undefined &&
      data._answer    !== undefined &&
      data._answer    !== data._challenge
    ) {
      return NextResponse.json({ error: 'Verification failed', code: 'CHALLENGE' }, { status: 422 })
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    // Save to DB
    const result = await mutate(
      `INSERT INTO leads (name, email, company, service, message, ip_address, status)
       VALUES (?, ?, ?, ?, ?, ?, 'new')`,
      [data.name, data.email, data.company, data.service, data.message, ip]
    )

    // Fire emails non-blocking
    Promise.allSettled([
      sendLeadNotification(data),
      sendLeadAutoReply({ name: data.name, email: data.email }),
    ]).catch(console.error)

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 })

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: err.errors }, { status: 422 })
    }
    console.error('[contact] Error:', err)
    return NextResponse.json({ error: 'Server error, please try again.' }, { status: 500 })
  }
}
