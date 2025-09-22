export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServerClient';
import { getUserFromRequest } from '@/lib/authServer';

export async function PATCH(req, { params }) {
  try {
    const me = getUserFromRequest(req);
    if (!me) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const id = Number(params.id);
    const patch = await req.json();

    // ownership check
    const { data: owned, error: checkErr } = await supabaseServer
      .from('sets')
      .select('id')
      .eq('id', id)
      .eq('user', me.id)
      .single();

    if (checkErr || !owned) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // if words provided as array, stringify for the VARCHAR column
    if (Array.isArray(patch.words)) {
      patch.words = JSON.stringify(patch.words);
    }

    const { data, error } = await supabaseServer
      .from('sets')
      .update(patch)
      .eq('id', id)
      .select('id, set_name, slug, words, "createdAt", "user"')
      .single();

    if (error) throw error;

    let wordsParsed = [];
    try { wordsParsed = JSON.parse(data.words ?? '[]'); } catch {}

    return NextResponse.json({
      id: data.id,
      set_name: data.set_name,
      slug: data.slug,
      words: wordsParsed,
      createdAt: data.createdAt,
      user: data.user,
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'DB error', message: err?.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const me = getUserFromRequest(req);
    if (!me) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const id = Number(params.id);

    const { data: owned, error: checkErr } = await supabaseServer
      .from('sets')
      .select('id')
      .eq('id', id)
      .eq('user', me.id)
      .single();

    if (checkErr || !owned) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { error } = await supabaseServer
      .from('sets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'DB error', message: err?.message }, { status: 500 });
  }
}
