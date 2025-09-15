export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// PATCH /api/sets/:id  — update name/slug/words (any subset)
export async function PATCH(req, { params }) {
  try {
    const id = Number(params.id);
    const body = await req.json(); // { name?, slug?, words? }

    const fields = [];
    const values = [];

    if (body.name !== undefined) { fields.push('set_name = ?'); values.push(body.name); }
    if (body.slug !== undefined) { fields.push('slug = ?');     values.push(body.slug); }
    if (body.words !== undefined) { // store as JSON string
      fields.push('words = ?'); values.push(JSON.stringify(body.words));
    }

    if (!fields.length) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    await pool.execute(`UPDATE sets SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.execute(
      'SELECT id, set_name, words, slug, `createdAt` FROM sets WHERE id = ?',
      [id]
    );
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const row = rows[0];
    try { row.words = JSON.parse(row.words ?? '[]'); } catch { row.words = []; }
    return NextResponse.json(row);
  } catch (err) {
  if (err?.code === 'ER_DATA_TOO_LONG') {
    return NextResponse.json({ error: 'Words payload too large', code: err.code }, { status: 413 });
  }
  if (err?.code === 'ER_DUP_ENTRY') {
    return NextResponse.json({ error: 'Slug already exists', code: err.code }, { status: 409 });
  }
  console.error('[PATCH /api/sets/:id] DB error:', err);
  return NextResponse.json({ error: 'DB error', code: err?.code, message: err?.message }, { status: 500 });
}
}

// DELETE /api/sets/:id — delete a set
export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    await pool.execute('DELETE FROM sets WHERE id = ?', [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
  if (err?.code === 'ER_DATA_TOO_LONG') {
    return NextResponse.json({ error: 'Words payload too large', code: err.code }, { status: 413 });
  }
  if (err?.code === 'ER_DUP_ENTRY') {
    return NextResponse.json({ error: 'Slug already exists', code: err.code }, { status: 409 });
  }
  console.error('[PATCH /api/sets/:id] DB error:', err);
  return NextResponse.json({ error: 'DB error', code: err?.code, message: err?.message }, { status: 500 });
}

  
}


