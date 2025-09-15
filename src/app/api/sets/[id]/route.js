export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getUserFromRequest } from '@/lib/authServer';

/**
 * /api/sets/:id
 *
 * Handles operations on a single set, scoped to the authenticated user.
 * - PATCH: Update fields of a set (set_name, slug, words) if owned by user.
 * - DELETE: Remove a set if owned by user.
 *
 * All operations first verify that the set belongs to the logged-in user.
 * Requires a valid JWT (auth_token cookie).
 */

// PATCH /api/sets/:id — update name/slug/words (any subset)
export async function PATCH(req, { params }) {
  try {
    const me = getUserFromRequest(req);
    if (!me) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const id = Number(params.id);
    const body = await req.json();

    // Ensure the set belongs to this user
    const [check] = await pool.execute('SELECT id FROM sets WHERE id = ? AND `user` = ?', [id, me.id]);
    if (!check.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const fields = [];
    const values = [];

    if (body.name !== undefined) { fields.push('set_name = ?'); values.push(body.name); }
    if (body.slug !== undefined) { fields.push('slug = ?'); values.push(body.slug); }
    if (body.words !== undefined) { fields.push('words = ?'); values.push(JSON.stringify(body.words)); }

    if (!fields.length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

    values.push(id, me.id);
    await pool.execute(`UPDATE sets SET ${fields.join(', ')} WHERE id = ? AND \`user\` = ?`, values);

    const [rows] = await pool.execute(
      'SELECT id, set_name, words, slug, `createdAt` FROM sets WHERE id = ? AND `user` = ?',
      [id, me.id]
    );
    const row = rows[0];
    try { row.words = JSON.parse(row.words ?? '[]'); } catch { row.words = []; }

    return NextResponse.json(row);
  } catch (err) {
    if (err?.code === 'ER_DATA_TOO_LONG') {
      return NextResponse.json({ error: 'Words payload too large', code: err.code }, { status: 413 });
    }
    if (err?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Slug already exists for this user', code: err.code }, { status: 409 });
    }
    console.error('[PATCH /api/sets/:id] DB error:', err);
    return NextResponse.json({ error: 'DB error', code: err?.code, message: err?.message }, { status: 500 });
  }
}

// DELETE /api/sets/:id — delete a set
export async function DELETE(req, { params }) {
  try {
    const me = getUserFromRequest(req);
    if (!me) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const id = Number(params.id);

    const [check] = await pool.execute('SELECT id FROM sets WHERE id = ? AND `user` = ?', [id, me.id]);
    if (!check.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await pool.execute('DELETE FROM sets WHERE id = ? AND `user` = ?', [id, me.id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/sets/:id] DB error:', err);
    return NextResponse.json({ error: 'DB error', code: err?.code, message: err?.message }, { status: 500 });
  }
}
