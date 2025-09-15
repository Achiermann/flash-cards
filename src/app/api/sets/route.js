export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getUserFromRequest } from '@/lib/authServer';

/**
 * /api/sets
 *
 * Handles list + creation of sets for the authenticated user.
 * - GET: Returns all sets belonging to the logged-in user (scoped by user.id).
 * - POST: Creates a new set (set_name, slug, words) owned by the logged-in user.
 *
 * Requires a valid JWT (auth_token cookie). Each set row is linked via `sets.user` FK.
 */


function toSlug(str = '') {
  return String(str).trim().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-').replace(/^-+|-+$/g, '');
}

// GET /api/sets — list sets for current user
export async function GET(req) {
  try {
    const me = getUserFromRequest(req);
    if (!me) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const [rows] = await pool.query(
      'SELECT id, set_name, words, slug, `createdAt` FROM sets WHERE `user` = ? ORDER BY `createdAt` DESC',
      [me.id]
    );

    for (const r of rows) {
      try { r.words = JSON.parse(r.words ?? '[]'); } catch { r.words = []; }
    }
    return NextResponse.json(rows);
  } catch (err) {
    console.error('[GET /api/sets] DB error:', err);
    return NextResponse.json({ error: 'DB error', code: err?.code, message: err?.message }, { status: 500 });
  }
}

// POST /api/sets — create a set for current user
export async function POST(req) {
  try {
    const me = getUserFromRequest(req);
    if (!me) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const name = (body?.name ?? '').trim();
    if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });

    const slug = body?.slug ? toSlug(body.slug) : toSlug(name);
    const words = JSON.stringify(body?.words ?? []);

    const [result] = await pool.execute(
      'INSERT INTO sets (set_name, words, `user`, slug) VALUES (?, ?, ?, ?)',
      [name, words, me.id, slug]
    );

    const insertId = result.insertId;
    const [rows] = await pool.execute(
      'SELECT id, set_name, words, slug, `createdAt` FROM sets WHERE id = ? AND `user` = ?',
      [insertId, me.id]
    );

    const row = rows[0];
    try { row.words = JSON.parse(row.words ?? '[]'); } catch { row.words = []; }

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    if (err?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Slug already exists for this user', code: err.code }, { status: 409 });
    }
    console.error('[POST /api/sets] DB error:', err);
    return NextResponse.json({ error: 'DB error', code: err?.code, message: err?.message }, { status: 500 });
  }
}
