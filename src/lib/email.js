import { Resend } from 'resend';

export async function sendPasswordResetEmail(email, resetUrl) {
  try {
    // Always log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('====================================');
      console.log('PASSWORD RESET EMAIL');
      console.log('====================================');
      console.log('To:', email);
      console.log('Reset URL:', resetUrl);
      console.log('====================================');
    }

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return { success: false, error: 'Email service not configured' };
    }

    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'FLASH CARDS APP <onboarding@resend.dev>',
      to: email,
      subject: 'Password Reset Request - FLASH CARDS APP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Request</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #2c3e50; padding: 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px;">FLASH CARDS APP</h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 20px;">Password Reset Request</h2>
                      <p style="margin: 0 0 15px 0; color: #555555; font-size: 16px; line-height: 1.5;">
                        We received a request to reset your password for your FLASH CARDS APP account.
                      </p>
                      <p style="margin: 0 0 25px 0; color: #555555; font-size: 16px; line-height: 1.5;">
                        Click the button below to reset your password. This link will expire in 1 hour.
                      </p>

                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 15px 40px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Reset Password</a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 25px 0 15px 0; color: #555555; font-size: 14px; line-height: 1.5;">
                        If the button doesn't work, copy and paste this link into your browser:
                      </p>
                      <p style="margin: 0 0 25px 0; color: #3498db; font-size: 14px; word-break: break-all;">
                        ${resetUrl}
                      </p>

                      <p style="margin: 0; color: #777777; font-size: 14px; line-height: 1.5;">
                        If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} FLASH CARDS APP. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Password reset email sent successfully:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
}
