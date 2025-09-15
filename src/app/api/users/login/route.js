export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/auth';

/**
 * Handles user login.
 * - POST: Verifies username + password against DB (bcrypt).
 * - Issues a JWT if valid and sets it as an httpOnly cookie `auth_token`.
 * - Returns user info (id, username, email).
 *
 * The httpOnly cookie is automatically sent with future requests,
 * and cannot be accessed from frontend JS for security.
 */


export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const [rows] = await pool.execute(
      'SELECT id, username, email, password_hash FROM userdata WHERE username = ? LIMIT 1',
      [username]
    );
    if (!rows.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ id: user.id, username: user.username });

    const res = NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error('[POST /api/users/login] DB error:', err);
    return NextResponse.json({ error: 'DB error', message: err?.message }, { status: 500 });
  }
}
