import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { getOrderStatus } from '@/lib/cashfree';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId  = searchParams.get('order_id');
  const websiteId = searchParams.get('website_id');
  const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'https://heartnote.in';

  // Both params are required
  if (!orderId || !websiteId) {
    return NextResponse.redirect(new URL('/create?error=missing_params', baseUrl));
  }

  // Validate UUID format to prevent injection / unnecessary DB calls
  if (!UUID_RE.test(websiteId)) {
    return NextResponse.redirect(new URL('/create?error=invalid_params', baseUrl));
  }

  const admin = getSupabaseAdmin();

  try {
    // Idempotency: if already published, go straight to success
    const { data: existingWebsite } = await admin
      .from('websites')
      .select('status, slug')
      .eq('id', websiteId)
      .maybeSingle();                       // safe: no throw on not-found

    if (existingWebsite?.status === 'published' && existingWebsite.slug) {
      return NextResponse.redirect(
        new URL(`/success/${existingWebsite.slug}`, baseUrl)
      );
    }

    // Verify the order status with Cashfree
    const order = await getOrderStatus(orderId);

    if (order.order_status !== 'PAID') {
      await admin
        .from('payments')
        .update({ status: 'failed' })
        .eq('cashfree_order_id', orderId);

      return NextResponse.redirect(
        new URL(`/preview/${websiteId}?payment=failed`, baseUrl)
      );
    }

    // Record successful payment
    await admin
      .from('payments')
      .update({
        status: 'success',
        cashfree_payment_id: order.cf_order_id.toString(),
      })
      .eq('cashfree_order_id', orderId);

    // Publish the website (updated_at handled by DB trigger)
    const { data: website, error: updateError } = await admin
      .from('websites')
      .update({ status: 'published' })
      .eq('id', websiteId)
      .select('slug')
      .single();

    if (updateError || !website?.slug) {
      console.error('Failed to publish website:', updateError);
      return NextResponse.redirect(
        new URL(`/preview/${websiteId}?payment=error`, baseUrl)
      );
    }

    return NextResponse.redirect(
      new URL(`/success/${website.slug}`, baseUrl)
    );
  } catch (err) {
    console.error('Verify payment error:', err);
    return NextResponse.redirect(
      new URL(`/preview/${websiteId}?payment=error`, baseUrl)
    );
  }
}
