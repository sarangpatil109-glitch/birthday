import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import crypto from 'crypto';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  try {
    const body      = await req.text();
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');
    const secret    = process.env.CASHFREE_WEBHOOK_SECRET || process.env.CF_WEBHOOK_SECRET;

    // Verify HMAC-SHA256 signature when secret is configured
    if (secret && signature && timestamp) {
      const expected = crypto
        .createHmac('sha256', secret)
        .update(`${timestamp}${body}`)
        .digest('base64');

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        // Return 200 anyway to stop Cashfree from retrying; log the mismatch
        console.error('Cashfree webhook signature mismatch — ignoring event');
        return NextResponse.json({ ok: true });
      }
    }

    type WebhookEvent = {
      type?: string;
      data?: {
        order?:   { order_id?: string };
        payment?: { cf_payment_id?: string | number };
      };
    };

    const event = JSON.parse(body) as WebhookEvent;

    if (event.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const orderId = event.data?.order?.order_id;
      if (!orderId) return NextResponse.json({ ok: true });

      const admin = getSupabaseAdmin();

      const { data: payment } = await admin
        .from('payments')
        .select('website_id, status')
        .eq('cashfree_order_id', orderId)
        .maybeSingle();

      // Only act if not already processed and websiteId is a valid UUID
      if (payment && payment.status !== 'success' && UUID_RE.test(payment.website_id as string)) {
        await admin
          .from('payments')
          .update({
            status:              'success',
            cashfree_payment_id: event.data?.payment?.cf_payment_id?.toString() ?? orderId,
          })
          .eq('cashfree_order_id', orderId);

        await admin
          .from('websites')
          .update({ status: 'published' })   // updated_at handled by DB trigger
          .eq('id', payment.website_id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    // Always 200 so Cashfree does not keep retrying
    return NextResponse.json({ ok: true });
  }
}
