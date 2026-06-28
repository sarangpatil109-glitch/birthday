import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found — HeartNote',
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--bg-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(201,169,110,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🌙</div>

        <div
          style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C9A96E',
            marginBottom: '1rem',
          }}
        >
          404 — Page Not Found
        </div>

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 300,
            color: '#F0EDE6',
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}
        >
          This page doesn&apos;t exist
        </h1>

        <p style={{ color: '#9B97A0', lineHeight: 1.7, marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          The birthday website you&apos;re looking for may have an incorrect link, or this page may not exist.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '0.8rem 2rem',
              background: 'linear-gradient(135deg, #C9A96E 0%, #E8C987 100%)',
              color: '#080810',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Go Home
          </Link>
          <Link
            href="/create"
            style={{
              padding: '0.8rem 2rem',
              background: 'transparent',
              color: '#C9A96E',
              border: '1px solid rgba(201,169,110,0.3)',
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            Create Website
          </Link>
        </div>
      </div>
    </main>
  );
}
