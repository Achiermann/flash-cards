export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseServer } from '@/lib/supabaseServerClient';
import { signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Support login with username OR email
    const isEmail = username.includes('@');
    const { data: user, error } = await supabaseServer
      .from('userdata')
      .select('id, email, username, password_hash')
      .eq(isEmail ? 'email' : 'username', username)
      .single();

    if (error || !user) {
      console.log('Login failed - user not found:', { username, error: error?.message });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('Login attempt:', {
      username,
      hasPasswordHash: !!user.password_hash,
      hashLength: user.password_hash?.length,
      hashPrefix: user.password_hash?.substring(0, 7)
    });

    const ok = await bcrypt.compare(password, user.password_hash);
    console.log('Password comparison result:', ok);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ id: user.id, username: user.username });

    const res = NextResponse.json({ id: user.id, email: user.email, username: user.username }, { status: 200 });
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'DB error', message: err?.message }, { status: 500 });
  }
}
