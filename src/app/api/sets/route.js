export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request) {
  try {const [rows] = await pool.query(
'SELECT id, set_name, words, slug, `createdAt` FROM sets ORDER BY `createdAt` DESC');
for (const r of rows) {
try { r.words = JSON.parse(r.words ?? '[]'); } catch { r.words = []; }}
    return NextResponse.json(rows); }  catch (err) {
  console.error('[GET /api/sets] DB error:', err);
  return NextResponse.json({ error: 'DB error', code: err?.code, message: err?.message }, { status: 500 });
}
}

function toSlug(str = '') {
  return String(str).trim().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-').replace(/^-+|-+$/g, '');
}

export async function POST(req) {
  try {
    const body = await req.json();
    const name = (body?.name ?? '').trim();
    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const slug = body?.slug ? toSlug(body.slug) : toSlug(name);
    const words = JSON.stringify(body?.words ?? []);

    // 1) Ensure we have a user id to satisfy FK on sets.`user`
    let userId = null;
    const [urows] = await pool.query('SELECT id FROM userdata ORDER BY id LIMIT 1');
    if (Array.isArray(urows) && urows.length > 0) {
      userId = urows[0].id;
    } else {
      // create a minimal dev user once
      const [uinsert] = await pool.execute(
        'INSERT INTO userdata (username, email, password_hash) VALUES (?, ?, ?)',
        ['dev', 'dev@example.com', 'x']
      );
      userId = uinsert.insertId;
    }

    // 2) Insert the set (note the backticks around `user`)
    const [result] = await pool.execute(
      'INSERT INTO sets (set_name, words, `user`, slug) VALUES (?, ?, ?, ?)',
      [name, words, userId, slug]
    );

    // 3) Return the inserted row
    const insertId = result.insertId;
    const [rows] = await pool.execute(
      'SELECT id, set_name, words, slug, `createdAt` FROM sets WHERE id = ?',
      [insertId]
    );
    const row = rows[0];
    try { row.words = JSON.parse(row.words ?? '[]'); } catch { row.words = []; }

    return NextResponse.json(row, { status: 201 });
  }  catch (err) {
  console.error('[GET /api/sets] DB error:', err);
  return NextResponse.json({ error: 'DB error', code: err?.code, message: err?.message }, { status: 500 });
}
}

