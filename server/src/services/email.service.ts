import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `${process.env.FROM_NAME || 'Mémoire'} <${process.env.FROM_EMAIL || 'noreply@memoire.app'}>`;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export const sendVerificationEmail = async (email: string, token: string, name: string) => {
  const link = `${APP_URL}/verify-email?token=${token}`;
  
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your Mémoire account',
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #1a0a2e; color: #f0e6d3; padding: 40px; border-radius: 16px;">
        <h1 style="color: #e8c4b8; font-size: 32px; text-align: center; margin-bottom: 8px;">Mémoire</h1>
        <p style="text-align: center; color: #c4a882; margin-bottom: 32px;">Where memories become art</p>
        <h2 style="color: #f0e6d3;">Welcome, ${name} ✨</h2>
        <p>Thank you for joining Mémoire. Please verify your email to begin creating beautiful memories.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${link}" style="background: linear-gradient(135deg, #e8c4b8, #c4a882); color: #1a0a2e; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; display: inline-block;">
            Verify Email →
          </a>
        </div>
        <p style="color: #888; font-size: 14px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string, name: string) => {
  const link = `${APP_URL}/reset-password?token=${token}`;
  
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your Mémoire password',
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #1a0a2e; color: #f0e6d3; padding: 40px; border-radius: 16px;">
        <h1 style="color: #e8c4b8; font-size: 32px; text-align: center;">Mémoire</h1>
        <h2 style="color: #f0e6d3;">Password Reset, ${name}</h2>
        <p>You requested a password reset. Click below to create a new password:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${link}" style="background: linear-gradient(135deg, #e8c4b8, #c4a882); color: #1a0a2e; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; display: inline-block;">
            Reset Password →
          </a>
        </div>
        <p style="color: #888; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};
