import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { createOrder, generateOrderId } from '@/lib/cashfree';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { websiteId?: unknown };
    const websiteId = typeof body.websiteId === 'string' ? body.websiteId.trim() : '';

    if (!websiteId) {
      return NextResponse.json({ error: 'Missing websiteId' }, { status: 400 });
    }
    if (!UUID_RE.test(websiteId)) {
      return NextResponse.json({ error: 'Invalid websiteId' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    const { data: website, error: websiteError } = await admin
      .from('websites')
      .select('id, to_name, from_name, status, slug')
      .eq('id', websiteId)
      .single();

    if (websiteError || !website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    if (website.status === 'published') {
      return NextResponse.json(
        { error: 'Website is already published' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'https://heartnote.in';
    const orderId = generateOrderId('HN');
    const amount  = 99;

    const order = await createOrder({
      orderId,
      amount,
      customerId:    websiteId.replace(/-/g, '').slice(0, 32),
      customerName:  website.from_name || 'HeartNote User',
      customerEmail: 'noreply@heartnote.in',
      customerPhone: '9999999999',
      returnUrl:     `${baseUrl}/api/verify-payment?order_id=${orderId}&website_id=${websiteId}`,
      notifyUrl:     `${baseUrl}/api/cashfree-webhook`,
      orderNote:     `HeartNote Birthday Website for ${website.to_name}`,
    });

    // Record the payment intent — non-fatal if this fails
    const { error: paymentError } = await admin.from('payments').insert({
      website_id:       websiteId,
      cashfree_order_id: orderId,
      amount,
      status:           'pending',
    });
    if (paymentError) {
      console.error('Failed to save payment record:', paymentError);
    }

    return NextResponse.json({
      orderId,
      paymentSessionId: order.payment_session_id,
    });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
