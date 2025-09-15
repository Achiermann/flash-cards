export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

/**
 * /api/users/logout
 *
 * Handles user logout.
 * - POST: Clears the `auth_token` cookie by setting it to an expired value.
 * - Returns { ok: true }.
 *
 * After calling this, the user is effectively logged out.
 */

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });
  return res;
}
