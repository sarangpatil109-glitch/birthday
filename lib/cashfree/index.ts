/**
 * Cashfree Payment Gateway helper utilities
 * Server-side only — do not import in client components
 */

const CASHFREE_API_URL =
  (process.env.CASHFREE_ENV || process.env.CF_ENV) === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

const API_VERSION = '2023-08-01';

function getHeaders(): Record<string, string> {
  const appId = process.env.CASHFREE_APP_ID || process.env.CF_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY || process.env.CF_SECRET_KEY;

  if (!appId || !secretKey) {
    throw new Error('Cashfree credentials not configured');
  }

  return {
    'Content-Type': 'application/json',
    'x-api-version': API_VERSION,
    'x-client-id': appId,
    'x-client-secret': secretKey,
  };
}

export interface CashfreeOrderRequest {
  orderId: string;
  amount: number;
  currency?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  notifyUrl: string;
  orderNote?: string;
}

export interface CashfreeOrderResponse {
  order_id: string;
  order_status: string;
  payment_session_id: string;
  cf_order_id: number;
}

export interface CashfreeOrderStatus {
  order_id: string;
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED' | 'CANCELLED' | 'PARTIALLY_PAID';
  order_amount: number;
  cf_order_id: number;
  message?: string;
}

export async function createOrder(
  req: CashfreeOrderRequest
): Promise<CashfreeOrderResponse> {
  const res = await fetch(`${CASHFREE_API_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      order_id: req.orderId,
      order_amount: req.amount,
      order_currency: req.currency || 'INR',
      customer_details: {
        customer_id: req.customerId,
        customer_name: req.customerName,
        customer_email: req.customerEmail,
        customer_phone: req.customerPhone,
      },
      order_meta: {
        return_url: req.returnUrl,
        notify_url: req.notifyUrl,
      },
      order_note: req.orderNote,
    }),
  });

  const data = await res.json() as CashfreeOrderResponse & { message?: string };

  if (!res.ok) {
    throw new Error(data.message || `Cashfree error: ${res.status}`);
  }

  return data;
}

export async function getOrderStatus(orderId: string): Promise<CashfreeOrderStatus> {
  const res = await fetch(`${CASHFREE_API_URL}/orders/${orderId}`, {
    headers: getHeaders(),
  });

  const data = await res.json() as CashfreeOrderStatus & { message?: string };

  if (!res.ok) {
    throw new Error(data.message || `Cashfree error: ${res.status}`);
  }

  return data;
}

export function generateOrderId(prefix = 'HN'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
