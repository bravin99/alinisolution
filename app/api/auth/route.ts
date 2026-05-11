import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query, mutate } from '@/lib/db'
import { signToken, verifyPassword, COOKIE_NAME_EXPORT } from '@/lib/auth'
import type { RowDataPacket } from 'mysql2'

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = loginSchema.parse(body)

    const rows = await query<RowDataPacket[]>(
      'SELECT id, email, name, role, password_hash FROM admin_users WHERE email = ? LIMIT 1',
      [email]
    )

    const user = rows[0]
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Update last login
    await mutate('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id])

    const token = signToken({ id: user.id, email: user.email, role: user.role })

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })

    res.cookies.set(COOKIE_NAME_EXPORT, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 8, // 8 hours
      path:     '/',
    })

    return res
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 422 })
    }
    console.error('[auth/login]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
