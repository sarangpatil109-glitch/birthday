'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTABanner() {
  return (
    <section
      style={{
        padding: '6rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gold radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* Horizontal rule top */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-border-gold), transparent)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span className="section-label" style={{ marginBottom: '1.25rem', display: 'block' }}>
          Ready to begin
        </span>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            fontWeight: 300,
            lineHeight: 1.07,
            letterSpacing: '-0.025em',
            color: 'var(--color-text-primary)',
            marginBottom: '1.5rem',
          }}
        >
          Give them a birthday{' '}
          <em className="gold-text" style={{ fontStyle: 'italic' }}>
            they&apos;ll never forget.
          </em>
        </h2>

        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '1rem',
            fontWeight: 300,
            lineHeight: 1.8,
            marginBottom: '2.5rem',
          }}
        >
          Five minutes. One payment. A memory that lasts forever.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/create"
            className="btn-primary"
            style={{ fontSize: '0.95rem', padding: '1rem 2.4rem' }}
          >
            Create Birthday Website
          </Link>
          <a
            href="#how-it-works"
            className="btn-ghost"
            style={{ fontSize: '0.88rem' }}
          >
            See how it works
          </a>
        </div>

        <p
          style={{
            color: 'var(--color-text-tertiary)',
            fontSize: '0.72rem',
            marginTop: '1.25rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.1em',
          }}
        >
          ₹99 one-time · No account · Preview free
        </p>
      </motion.div>
    </section>
  );
}
