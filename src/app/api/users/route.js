export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseServer } from '@/lib/supabaseServerClient';

export async function POST(req) {
  try {
    const { email, username, password } = await req.json();
    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseServer
      .from('userdata')
      .insert({ email, username, password_hash })
      .select('id, email, username')
      .single();

    if (error) {
      // Postgres unique violation
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Email or username already exists' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'DB error', message: err?.message }, { status: 500 });
  }
}
