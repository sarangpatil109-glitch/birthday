'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Props {
  slug: string;
  baseUrl: string;
}

export default function SuccessClient({ slug, baseUrl }: Props) {
  const [copied, setCopied]   = useState(false);
  const [qrUrl, setQrUrl]     = useState<string | null>(null);
  const [qrError, setQrError] = useState(false);

  const websiteUrl = `${baseUrl}/w/${slug}`;

  useEffect(() => {
    let objectUrl: string | null = null;
    fetch(`/api/qr?url=${encodeURIComponent(websiteUrl)}`)
      .then((r) => { if (!r.ok) throw new Error('QR generation failed'); return r.blob(); })
      .then((blob) => { objectUrl = URL.createObjectURL(blob); setQrUrl(objectUrl); })
      .catch(() => setQrError(true));
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [websiteUrl]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(websiteUrl);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = websiteUrl;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(
      `🎂 I created a beautiful birthday surprise for you! Open this link to see it: ${websiteUrl} ❤️`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  function downloadQr() {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `heartnote-${slug}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient gold glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Celebration mark */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.1, delay: 0.4, ease: 'easeInOut' }}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(212,175,55,0.1)',
            border: '1px solid rgba(212,175,55,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.75rem',
            fontSize: '1.75rem',
          }}
          aria-hidden="true"
        >
          🎉
        </motion.div>

        <span className="section-label" style={{ marginBottom: '1rem', display: 'block' }}>
          Website Published
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.9rem, 5vw, 3rem)',
            fontWeight: 300,
            color: 'var(--color-text-primary)',
            marginBottom: '0.85rem',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
          }}
        >
          Your birthday surprise is{' '}
          <em className="gold-text" style={{ fontStyle: 'italic' }}>live!</em>
        </h1>

        <p
          style={{
            color: 'var(--color-text-secondary)',
            lineHeight: 1.75,
            marginBottom: '2.5rem',
            fontSize: '0.92rem',
            fontWeight: 300,
          }}
        >
          Share the link with the birthday person and watch their face light up.
        </p>

        {/* URL row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-gold)',
            borderRadius: 'var(--radius)',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              color: 'var(--color-gold)',
              fontSize: '0.8rem',
              wordBreak: 'break-all',
              textAlign: 'left',
              fontFamily: 'var(--font-mono)',
              flex: 1,
            }}
          >
            {websiteUrl}
          </span>
          <button
            onClick={copyLink}
            style={{
              padding: '0.4rem 0.9rem',
              background: copied ? 'rgba(76,175,133,0.12)' : 'var(--color-gold-subtle)',
              border: `1px solid ${copied ? 'rgba(76,175,133,0.35)' : 'var(--color-border-gold)'}`,
              borderRadius: '50px',
              color: copied ? 'var(--color-success)' : 'var(--color-gold)',
              fontSize: '0.76rem',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.25s',
              fontWeight: 500,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ fontSize: '0.92rem', borderRadius: '12px', padding: '0.95rem' }}
          >
            Open Birthday Website
          </a>

          <button
            onClick={shareWhatsApp}
            style={{
              padding: '0.9rem',
              background: 'rgba(37,211,102,0.06)',
              border: '1px solid rgba(37,211,102,0.22)',
              borderRadius: '12px',
              color: '#25D366',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37,211,102,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(37,211,102,0.06)'; }}
          >
            Share on WhatsApp
          </button>

          <button
            onClick={downloadQr}
            disabled={!qrUrl && !qrError}
            style={{
              padding: '0.9rem',
              background: 'var(--color-glass)',
              border: `1px solid ${qrError ? 'rgba(224,85,85,0.3)' : 'var(--color-border)'}`,
              borderRadius: '12px',
              color: qrError ? 'var(--color-error)' : qrUrl ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              fontSize: '0.9rem',
              cursor: qrUrl ? 'pointer' : 'default',
              fontFamily: 'var(--font-sans)',
              transition: 'background 0.2s',
            }}
          >
            {qrError ? 'QR unavailable' : qrUrl ? 'Download QR Code' : 'Generating QR…'}
          </button>
        </div>

        {/* QR preview */}
        {qrUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
              marginBottom: '2.5rem',
              cursor: 'pointer',
            }}
            onClick={downloadQr}
            title="Click to download QR code"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="QR code to open the birthday website"
              style={{ width: '140px', height: '140px', borderRadius: '6px', display: 'block' }}
            />
            <p
              style={{
                color: 'var(--color-text-tertiary)',
                fontSize: '0.62rem',
                marginTop: '0.75rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Scan to open · click to save
            </p>
          </motion.div>
        )}

        {/* Gold divider */}
        <div className="gold-divider" style={{ marginBottom: '1.75rem' }} />

        {/* Footer nav */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              color: 'var(--color-text-tertiary)',
              fontSize: '0.82rem',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
          >
            ← Home
          </Link>
          <Link
            href="/create"
            style={{
              color: 'var(--color-gold)',
              fontSize: '0.82rem',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
            }}
          >
            Create another →
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
