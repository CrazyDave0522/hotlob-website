import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

interface CateringOrderData {
  storeName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cateringDate: string;
  pickupTime: string;
}

export async function POST(request: NextRequest) {
  try {
    const { storeEmail, orderData }: { storeEmail: string; orderData: CateringOrderData } = await request.json();

    // Read template
    const templatePath = path.join(process.cwd(), 'lib/email-templates/catering-order.html');
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders
    Object.entries(orderData).forEach(([key, value]) => {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    await resend.emails.send({
      from: 'Hotlob <onboarding@resend.dev>', // Using Resend's test domain for now
      to: storeEmail,
      subject: 'New Catering Order',
      html: template,
    });

    console.log(`Catering order email sent to ${storeEmail}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send catering order email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}