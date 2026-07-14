export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/authServer';
import { supabaseServer } from '@/lib/supabaseServerClient';
import { signToken, SESSION_MAX_AGE } from '@/lib/auth';

// Sliding session: every authenticated call re-issues a fresh token+cookie,
// so the login only expires after SESSION_MAX_AGE without opening the app
function withRenewedSession(res, me) {
  const token = signToken({ id: me.id, username: me.username });
  res.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

export async function GET(req) {
  const me = getUserFromRequest(req);
  if (!me) {
    return NextResponse.json({ user: null }, { status: 200 }); // or 401 if you prefer
  }

  // Fetch latest row from DB (safe with service role; read-only)
  const { data: user, error } = await supabaseServer
    .from('userdata')
    .select('id, username, email, last_login, created_at')
    .eq('id', me.id)
    .single();

  if (error || !user) {
    // Fall back to token if row missing; keeps old behavior tolerant
    return withRenewedSession(NextResponse.json({ user: { id: me.id, username: me.username } }, { status: 200 }), me);
  }

  return withRenewedSession(NextResponse.json({ user }, { status: 200 }), me);
}
