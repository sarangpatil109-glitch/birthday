'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stats = [
  { num: '2,400+', label: 'Websites Created' },
  { num: '₹99', label: 'One-time Payment' },
  { num: '5 min', label: 'To Create' },
];

export default function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient blobs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          maxWidth: '700px',
          maxHeight: '700px',
          background:
            'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          maxWidth: '600px',
          maxHeight: '600px',
          background:
            'radial-gradient(circle, rgba(139,71,169,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          maxWidth: '820px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mono"
          style={{ marginBottom: '1.5rem' }}
        >
          ✦ Premium Birthday Websites ✦
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2.8rem, 8vw, 6rem)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            color: '#F0EDE6',
          }}
        >
          Turn love into a{' '}
          <span className="gold-text" style={{ fontStyle: 'italic' }}>
            living memory
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.75,
            color: '#9B97A0',
            maxWidth: '540px',
            margin: '0 auto 2.5rem',
          }}
        >
          Create a cinematic birthday website with your photos, a personal message,
          and a shareable link — in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 }}
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3.5rem',
          }}
        >
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '1rem 2.5rem',
                background:
                  'linear-gradient(135deg, #C9A96E 0%, #E8C987 100%)',
                color: '#080810',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.02em',
                boxShadow: '0 4px 24px rgba(201,169,110,0.25)',
              }}
            >
              Create Birthday Website
            </motion.button>
          </Link>
          <a href="#how-it-works" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '1rem 2.5rem',
                background: 'transparent',
                color: '#C9A96E',
                border: '1px solid rgba(201,169,110,0.4)',
                borderRadius: '50px',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              See How It Works
            </motion.button>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
            flexWrap: 'wrap',
          }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              {i > 0 && (
                <div
                  aria-hidden="true"
                  style={{
                    display: 'none',
                  }}
                />
              )}
              <div
                className="gold-text"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#9B97A0',
                  marginTop: '0.2rem',
                  fontFamily: 'Courier New, monospace',
                  letterSpacing: '0.05em',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ color: 'rgba(201,169,110,0.5)', fontSize: '1.25rem' }}
          aria-hidden="true"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
