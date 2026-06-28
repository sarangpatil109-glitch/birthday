'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Props {
  slug: string;
  baseUrl: string; // resolved server-side so no client-side effect needed
}

export default function SuccessClient({ slug, baseUrl }: Props) {
  const [copied, setCopied]   = useState(false);
  const [qrUrl, setQrUrl]     = useState<string | null>(null);
  const [qrError, setQrError] = useState(false);

  const websiteUrl = `${baseUrl}/w/${slug}`;

  // Generate QR code
  useEffect(() => {
    let objectUrl: string | null = null;

    fetch(`/api/qr?url=${encodeURIComponent(websiteUrl)}`)
      .then((r) => {
        if (!r.ok) throw new Error('QR generation failed');
        return r.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setQrUrl(objectUrl);
      })
      .catch(() => setQrError(true));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [websiteUrl]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(websiteUrl);
    } catch {
      // Fallback for HTTP or restrictive browser contexts
      const ta = document.createElement('textarea');
      ta.value = websiteUrl;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
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
        background: 'var(--bg-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 65%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Celebration icon */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], rotate: [0, 6, -4, 0] }}
          transition={{ duration: 1.1, delay: 0.35, ease: 'easeInOut' }}
          style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}
          aria-hidden="true"
        >
          🎉
        </motion.div>

        <div className="mono" style={{ marginBottom: '0.6rem' }}>✦ Website Published!</div>

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            fontWeight: 300,
            color: '#F0EDE6',
            marginBottom: '0.75rem',
            lineHeight: 1.15,
          }}
        >
          Your birthday surprise is{' '}
          <span className="gold-text" style={{ fontStyle: 'italic' }}>live!</span>
        </h1>

        <p style={{ color: '#9B97A0', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.925rem' }}>
          Share the link with the birthday person and watch their face light up. ✨
        </p>

        {/* URL display */}
        <div
          className="glass"
          style={{
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '1.1rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              color: '#C9A96E',
              fontSize: '0.82rem',
              wordBreak: 'break-all',
              textAlign: 'left',
              fontFamily: 'Courier New, monospace',
            }}
          >
            {websiteUrl}
          </span>
          <button
            onClick={copyLink}
            style={{
              padding: '0.42rem 0.9rem',
              background: copied ? 'rgba(168,230,207,0.15)' : 'rgba(201,169,110,0.1)',
              border: `1px solid ${copied ? 'rgba(168,230,207,0.4)' : 'rgba(201,169,110,0.3)'}`,
              borderRadius: '50px',
              color: copied ? '#A8E6CF' : '#C9A96E',
              fontSize: '0.78rem',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.25s',
              fontWeight: 500,
            }}
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.75rem' }}>
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.95rem',
              background: 'linear-gradient(135deg, #C9A96E 0%, #E8C987 100%)',
              color: '#080810',
              borderRadius: '50px',
              fontSize: '0.95rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'block',
              letterSpacing: '0.02em',
            }}
          >
            🔗 Open Birthday Website
          </a>

          <button
            onClick={shareWhatsApp}
            style={{
              padding: '0.95rem',
              background: 'rgba(37,211,102,0.07)',
              border: '1px solid rgba(37,211,102,0.28)',
              borderRadius: '50px',
              color: '#25D366',
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            💬 Share on WhatsApp
          </button>

          <button
            onClick={downloadQr}
            disabled={!qrUrl}
            style={{
              padding: '0.95rem',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${qrError ? 'rgba(255,107,107,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '50px',
              color: qrError ? '#FF6B6B' : qrUrl ? '#F0EDE6' : '#9B97A0',
              fontSize: '0.95rem',
              cursor: qrUrl ? 'pointer' : 'default',
            }}
          >
            {qrError ? '⚠️ QR unavailable' : qrUrl ? '⬇️ Download QR Code' : '⏳ Generating QR…'}
          </button>
        </div>

        {/* QR preview */}
        {qrUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{
              padding: '1.35rem',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '16px',
              marginBottom: '2rem',
              cursor: 'pointer',
            }}
            onClick={downloadQr}
            title="Click to download QR code"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="QR code to open the birthday website"
              style={{ width: '150px', height: '150px', borderRadius: '8px', display: 'block' }}
            />
            <p style={{ color: '#9B97A0', fontSize: '0.7rem', marginTop: '0.55rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.05em' }}>
              SCAN TO OPEN · CLICK TO SAVE
            </p>
          </motion.div>
        )}

        {/* Divider */}
        <div style={{ width: '50px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.35), transparent)', margin: '0 auto 1.5rem' }} />

        {/* Footer links — use Next.js Link for internal routes */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#9B97A0', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Home
          </Link>
          <Link href="/create" style={{ color: '#C9A96E', fontSize: '0.85rem', textDecoration: 'none' }}>
            Create another website →
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
