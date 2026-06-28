'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Website } from '@/types';
import BirthdayTemplate from '@/components/template/BirthdayTemplate';
import { useSearchParams } from 'next/navigation';

// Cashfree JS SDK v3 type declaration
declare global {
  interface Window {
    Cashfree?: (config: { mode: string }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget: string;
      }) => Promise<{ error?: { message?: string } }>;
    };
  }
}

export default function PreviewClient({ websiteId }: { websiteId: string }) {
  const [website, setWebsite]           = useState<Website | null>(null);
  const [loading, setLoading]           = useState(true);
  const [paying, setPaying]             = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Track SDK load state via ref so handlePay can read it without a stale closure
  const sdkLoadedRef = useRef(false);
  const websiteRef   = useRef<Website | null>(null);

  const searchParams = useSearchParams();

  // ── Derive payment error from URL once on mount ─────────────────
  // Read search params synchronously on first render instead of in an effect,
  // eliminating the set-state-in-effect lint error.
  const initialPaymentError = (() => {
    const p = searchParams.get('payment');
    if (p === 'failed') return 'Payment was not completed. Please try again.';
    if (p === 'error')  return 'An error occurred during payment. Please try again.';
    return null;
  })();

  // Initialise paymentError state once from the URL (runs only on mount)
  const [derivedError, setDerivedError] = useState<string | null>(initialPaymentError);

  // ── Fetch website data ──────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/websites/${websiteId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch');
        return r.json() as Promise<Website & { error?: string }>;
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setWebsite(data);
          websiteRef.current = data;
        }
      })
      .catch(() => setError('Failed to load website. Please try again.'))
      .finally(() => setLoading(false));
  }, [websiteId]);

  // ── Load Cashfree SDK via script tag ────────────────────────────
  useEffect(() => {
    // Already loaded
    if (document.querySelector('script[data-cashfree]')) {
      sdkLoadedRef.current = true;
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.setAttribute('data-cashfree', 'true');
    script.onload = () => { sdkLoadedRef.current = true; };
    script.onerror = () => { console.error('Failed to load Cashfree SDK'); };
    document.head.appendChild(script);
    // Do not remove the script on cleanup — it should persist across re-renders
  }, []);

  // ── Handle payment ──────────────────────────────────────────────
  // Not wrapped in useCallback — the React Compiler rule flags useCallback with
  // mismatched inferred deps; a plain async function is correct here.
  async function handlePay() {
    if (!sdkLoadedRef.current) {
      setDerivedError('Payment system is loading. Please wait a moment and try again.');
      return;
    }

    setPaying(true);
    setDerivedError(null);
    setPaymentError(null);

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId }),
      });

      const data = await res.json() as {
        paymentSessionId?: string;
        orderId?: string;
        error?: string;
      };

      if (!res.ok || data.error) {
        // Already published — redirect to success page
        if (res.status === 400 && data.error?.includes('already published')) {
          const slug = websiteRef.current?.slug ?? '';
          window.location.href = `/success/${slug}`;
          return;
        }
        throw new Error(data.error ?? 'Failed to create payment order');
      }

      if (!data.paymentSessionId) {
        throw new Error('Invalid payment session received');
      }

      const Cf = window.Cashfree;
      if (!Cf) throw new Error('Payment SDK not loaded. Please refresh and try again.');

      const mode = process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production'
        ? 'production'
        : 'sandbox';

      const cashfree = Cf({ mode });
      const result = await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_self',
      });

      if (result?.error) {
        throw new Error(result.error.message ?? 'Payment failed');
      }
      // On success Cashfree redirects to the return_url automatically
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setPaying(false);
    }
  }

  const shownError = paymentError ?? derivedError;

  // ── Loading state ───────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-deep)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
          >
            🌙
          </motion.div>
          <div className="mono">Loading your website…</div>
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────
  if (error || !website) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-deep)',
          padding: '2rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>😔</div>
          <div className="mono" style={{ color: '#FF6B6B', marginBottom: '1rem' }}>
            {error ?? 'Website not found'}
          </div>
          <a
            href="/create"
            style={{
              color: '#C9A96E',
              display: 'inline-block',
              marginTop: '0.5rem',
              textDecoration: 'none',
              border: '1px solid rgba(201,169,110,0.3)',
              borderRadius: '50px',
              padding: '0.6rem 1.5rem',
              fontSize: '0.9rem',
            }}
          >
            Create a new website →
          </a>
        </div>
      </div>
    );
  }

  // ── Preview ─────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative' }}>
      {/* Preview Banner */}
      <motion.div
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'rgba(8,8,16,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(201,169,110,0.2)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <div className="mono" style={{ fontSize: '0.65rem', marginBottom: '0.15rem' }}>
            ✦ Preview Mode
          </div>
          <p style={{ color: '#9B97A0', fontSize: '0.78rem', margin: 0 }}>
            Exactly how it looks when published
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="/create"
            style={{
              padding: '0.55rem 1.1rem',
              background: 'transparent',
              border: '1px solid rgba(201,169,110,0.3)',
              borderRadius: '50px',
              color: '#C9A96E',
              fontSize: '0.82rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            ← Edit
          </a>
          <button
            onClick={handlePay}
            disabled={paying}
            style={{
              padding: '0.55rem 1.4rem',
              background: paying
                ? 'rgba(201,169,110,0.35)'
                : 'linear-gradient(135deg, #C9A96E 0%, #E8C987 100%)',
              color: '#080810',
              border: 'none',
              borderRadius: '50px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: paying ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {paying ? '⏳ Processing…' : '🔓 Publish for ₹99'}
          </button>
        </div>
      </motion.div>

      {/* Payment error banner */}
      {shownError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            zIndex: 9998,
            background: 'rgba(255,107,107,0.1)',
            borderBottom: '1px solid rgba(255,107,107,0.3)',
            padding: '0.6rem 1.5rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#FF6B6B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <span>{shownError}</span>
          <button
            onClick={() => { setPaymentError(null); setDerivedError(null); }}
            aria-label="Dismiss error"
            style={{
              background: 'none',
              border: 'none',
              color: '#FF6B6B',
              cursor: 'pointer',
              fontSize: '1rem',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Template */}
      <div style={{ paddingTop: '60px' }}>
        <BirthdayTemplate website={website} isPreview />
      </div>
    </div>
  );
}
