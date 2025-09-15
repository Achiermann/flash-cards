export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

/**
 * /api/users/me
 *
 * Returns the currently authenticated user (decoded from JWT).
 * - GET: Reads the `auth_token` cookie, verifies it, and returns the user payload.
 * - If no token or invalid token, returns 401.
 *
 * Useful for checking session state on the frontend.
 */

export async function GET(req) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  return NextResponse.json({ user: decoded });
}
