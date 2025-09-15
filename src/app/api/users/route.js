export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';

/**
 * (signup)
 * Handles new user registration.
 * - POST: Creates a new user in `userdata` with a hashed password.
 * - Returns basic user info (id, email, username).
 * * Note: Does not log the user in; login is handled by /api/users/login. */

export async function POST(req) {
  try {
    const { email, username, password } = await req.json();
    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO userdata (email, username, password_hash) VALUES (?, ?, ?)',
      [email, username, password_hash]
    );

    return NextResponse.json({ id: result.insertId, email, username }, { status: 201 });
  } catch (err) {
    if (err?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email or username already exists' }, { status: 409 });
    }
    console.error('[POST /api/users] DB error:', err);
    return NextResponse.json({ error: 'DB error', message: err?.message }, { status: 500 });
  }
}
