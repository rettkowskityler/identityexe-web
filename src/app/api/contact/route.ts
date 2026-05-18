import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, company, details } = await request.json();

    if (!name || !email || !details) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // The domain has been verified, so we can send from identityexe.com to identityexe.com
    const { data, error } = await resend.emails.send({
      from: 'IdentityEXE Contact Form <contact@identityexe.com>',
      to: ['tyler@identityexe.com'], 
      subject: `New Consultation Inquiry from ${name}`,
      replyTo: email,
      text: `
You have a new inquiry from the IdentityEXE website.

Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}

Project Details:
${details}
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
