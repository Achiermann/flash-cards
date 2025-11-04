export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseServer } from '@/lib/supabaseServerClient';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const { data: user, error: fetchError } = await supabaseServer
      .from('userdata')
      .select('id, email, username')
      .eq('email', email)
      .single();

    if (fetchError || !user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      }, { status: 200 });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store token in database
    const { error: updateError } = await supabaseServer
      .from('userdata')
      .update({
        reset_token: resetToken,
        reset_token_expires: resetTokenExpires.toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Send email
    const emailResult = await sendPasswordResetEmail(user.email, resetUrl);

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error);
      return NextResponse.json({
        error: 'Failed to send reset email. Please try again later.'
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.'
    }, { status: 200 });

  } catch (err) {
    console.error('Password reset error:', err);
    return NextResponse.json({
      error: 'An error occurred',
      message: err?.message
    }, { status: 500 });
  }
}
