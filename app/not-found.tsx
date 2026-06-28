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
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
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
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '440px' }}>
        {/* 404 label */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
            marginBottom: '1.5rem',
          }}
        >
          404 — Page Not Found
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 300,
            color: 'var(--color-text-primary)',
            marginBottom: '1rem',
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
          }}
        >
          This page{' '}
          <em className="gold-text" style={{ fontStyle: 'italic' }}>
            doesn&apos;t exist
          </em>
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
          The birthday website you&apos;re looking for may have an incorrect link,
          or this page may not exist.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.85rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" className="btn-primary" style={{ fontSize: '0.88rem' }}>
            Go Home
          </Link>
          <Link href="/create" className="btn-ghost" style={{ fontSize: '0.88rem' }}>
            Create Website
          </Link>
        </div>
      </div>
    </main>
  );
}
