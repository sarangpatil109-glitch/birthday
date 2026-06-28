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
          background: 'var(--color-bg)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontSize: '1.35rem',
            }}
          >
            ✦
          </motion.div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
            }}
          >
            Loading website…
          </div>
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
          background: 'var(--color-bg)',
          padding: '2rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-error)',
              marginBottom: '1.25rem',
            }}
          >
            {error ?? 'Website not found'}
          </div>
          <a
            href="/create"
            className="btn-ghost"
            style={{ fontSize: '0.85rem' }}
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
          background: 'rgba(5,5,5,0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--color-border-gold)',
          padding: '0.7rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '0.15rem',
            }}
          >
            Preview Mode
          </div>
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', margin: 0, fontWeight: 300 }}>
            Exactly how it looks when published
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="/create"
            className="btn-ghost"
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            ← Edit
          </a>
          <button
            onClick={handlePay}
            disabled={paying}
            className="btn-primary"
            style={{
              fontSize: '0.85rem',
              padding: '0.55rem 1.35rem',
              cursor: paying ? 'not-allowed' : 'pointer',
              opacity: paying ? 0.6 : 1,
            }}
          >
            {paying ? 'Processing…' : 'Publish for ₹99'}
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
            top: '56px',
            left: 0,
            right: 0,
            zIndex: 9998,
            background: 'var(--color-error-bg)',
            borderBottom: '1px solid rgba(224,85,85,0.2)',
            padding: '0.6rem 1.5rem',
            textAlign: 'center',
            fontSize: '0.82rem',
            fontWeight: 300,
            color: 'var(--color-error)',
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
              color: 'var(--color-error)',
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
