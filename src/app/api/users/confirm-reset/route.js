export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseServer } from '@/lib/supabaseServerClient';

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    console.log('Confirm reset request:', { token: token?.substring(0, 10) + '...', passwordLength: newPassword?.length });

    if (!token || !newPassword) {
      console.log('Missing token or password');
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Find user with valid token
    const { data: user, error: fetchError } = await supabaseServer
      .from('userdata')
      .select('id, email, username, reset_token_expires')
      .eq('reset_token', token)
      .single();

    if (fetchError || !user) {
      console.log('Token lookup failed:', fetchError?.message || 'User not found');
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(user.reset_token_expires);

    if (now > expiresAt) {
      console.log('Token expired:', { now, expiresAt });
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    // Hash new password
    const password_hash = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    const { error: updateError } = await supabaseServer
      .from('userdata')
      .update({
        password_hash,
        reset_token: null,
        reset_token_expires: null
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      message: 'Password has been reset successfully'
    }, { status: 200 });

  } catch (err) {
    console.error('Confirm reset error:', err);
    return NextResponse.json({
      error: 'An error occurred',
      message: err?.message
    }, { status: 500 });
  }
}
