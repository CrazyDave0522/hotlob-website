import { NextResponse } from 'next/server';
import { sendCateringOrderEmail } from '@/lib/cateringOrderEmail';
import { supabaseServer } from '@/lib/supabaseServer';

type CateringOrderPayload = {
  storeId: string;
  cateringDate: string;
  pickupTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  submittedAt: string;
};

const STORE_FIELDS = 'name,email';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function POST(request: Request) {
  let payload: Partial<CateringOrderPayload>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  if (
    !isNonEmptyString(payload.storeId) ||
    !isNonEmptyString(payload.cateringDate) ||
    !isNonEmptyString(payload.pickupTime) ||
    !isNonEmptyString(payload.firstName) ||
    !isNonEmptyString(payload.lastName) ||
    !isNonEmptyString(payload.email) ||
    !isNonEmptyString(payload.phone) ||
    !isNonEmptyString(payload.submittedAt)
  ) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const { data: order, error: insertError } = await supabaseServer
    .from('catering_orders')
    .insert({
      store_id: payload.storeId,
      catering_date: payload.cateringDate,
      pickup_time: payload.pickupTime,
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      phone: payload.phone,
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('Failed to insert catering order', insertError);
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }

  const { data: store, error: storeError } = await supabaseServer
    .from('store')
    .select(STORE_FIELDS)
    .eq('id', payload.storeId)
    .maybeSingle();

  if (storeError) {
    console.error('Failed to load store details for catering order', storeError);
  }

  const storeEmail = store?.email?.trim() ?? '';

  if (storeEmail) {
    const storeName = store?.name?.trim() || 'Store';
    const submittedAt = payload.submittedAt;

    sendCateringOrderEmail({
      to: storeEmail,
      storeName,
      cateringDate: payload.cateringDate,
      pickupTime: payload.pickupTime,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      submittedAt,
    }).catch((error) => {
      console.error('Failed to send catering order email', error);
    });
  }

  return NextResponse.json({ success: true, id: order?.id ?? null });
}
