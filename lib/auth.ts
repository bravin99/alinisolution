import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET  = process.env.JWT_SECRET  || 'change-me-in-production'
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '8h'
const COOKIE_NAME = 'alini_admin_token'

export interface AdminPayload {
  id:    number
  email: string
  role:  string
}

// ── Token ──────────────────────────────────────────────────────────────────
export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES } as jwt.SignOptions)
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload
  } catch {
    return null
  }
}

// ── Password ────────────────────────────────────────────────────────────────
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

// ── Cookie (server-side) — Next.js 15: cookies() is async ──────────────────
export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}

export async function getAdminFromCookie(): Promise<AdminPayload | null> {
  const token = await getTokenFromCookie()
  if (!token) return null
  return verifyToken(token)
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME
