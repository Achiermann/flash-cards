export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServerClient';
import { getUserFromRequest } from '@/lib/authServer';

function toSlug(str = '') {
  return String(str).trim().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-').replace(/^-+|-+$/g, '');
}

export async function GET(req) {
  try {
    const me = getUserFromRequest(req);
    if (!me) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { data, error } = await supabaseServer
      .from('sets')
      .select('id, set_name, slug, words, "createdAt", "user"')
      .eq('user', me.id)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    // words is stored as VARCHAR in DB → parse here for the stores
    const parsed = (data ?? []).map((row) => {
      let words = [];
      try { words = JSON.parse(row.words ?? '[]'); } catch {}
      return {
        id: row.id,
        set_name: row.set_name,
        slug: row.slug,
        words,
        createdAt: row.createdAt,
        user: row.user,
      };
    });

    return NextResponse.json(parsed, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'DB error', message: err?.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const me = getUserFromRequest(req);
    if (!me) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { name, slug: incomingSlug, words = [] } = await req.json();
    const slug = incomingSlug || toSlug(name);

    // store as string in the VARCHAR column to match your schema/data flow
    const wordsString = JSON.stringify(Array.isArray(words) ? words : []);

    const insert = {
      set_name: name,
      slug,
      words: wordsString,
      user: me.id,
      createdAt: new Date().toISOString().replace('Z', ''), // timestamp without tz (matches your column type)
    };

    const { data, error } = await supabaseServer
      .from('sets')
      .insert(insert)
      .select('id, set_name, slug, words, "createdAt", "user"')
      .single();

    if (error) {
      if (error.code === '23505') {
        // if you have a unique on (user, slug), this will fire on duplicates
        return NextResponse.json({ error: 'Slug already exists for this user' }, { status: 409 });
      }
      throw error;
    }

    let wordsParsed = [];
    try { wordsParsed = JSON.parse(data.words ?? '[]'); } catch {}

    return NextResponse.json({
      id: data.id,
      set_name: data.set_name,
      slug: data.slug,
      words: wordsParsed,
      createdAt: data.createdAt,
      user: data.user,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'DB error', message: err?.message }, { status: 500 });
  }
}
