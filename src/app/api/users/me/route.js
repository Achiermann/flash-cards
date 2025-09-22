export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/authServer';
import { supabaseServer } from '@/lib/supabaseServerClient';

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
    return NextResponse.json({ user: { id: me.id, username: me.username } }, { status: 200 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
