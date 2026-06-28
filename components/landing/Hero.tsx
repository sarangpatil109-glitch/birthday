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
        padding: '8rem 1.5rem 5rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-bg)',
      }}
    >
      {/* Deep ambient radial glow — warm gold, very subtle */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          maxWidth: '900px',
          height: '80vw',
          maxHeight: '900px',
          background:
            'radial-gradient(ellipse at center, rgba(212,175,55,0.045) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* Grain texture overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          pointerEvents: 'none',
          opacity: 0.4,
        }}
      />

      {/* Thin horizontal rule at very top */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.35) 50%, transparent 100%)',
          transformOrigin: 'center',
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          maxWidth: '760px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(212,175,55,0.07)',
            border: '1px solid rgba(212,175,55,0.18)',
            borderRadius: '50px',
            padding: '0.35rem 1rem',
            marginBottom: '2.5rem',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'var(--color-gold)',
              display: 'inline-block',
            }}
          />
          <span className="mono" style={{ fontSize: '0.62rem', letterSpacing: '0.22em' }}>
            Premium Birthday Experiences
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.85 }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(3rem, 8.5vw, 6.5rem)',
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: '-0.025em',
            marginBottom: '1.75rem',
            color: 'var(--color-text-primary)',
          }}
        >
          Turn love into a{' '}
          <em className="gold-text" style={{ fontStyle: 'italic' }}>
            living memory
          </em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.85,
            color: 'var(--color-text-secondary)',
            maxWidth: '480px',
            margin: '0 auto 3rem',
            fontWeight: 300,
            letterSpacing: '0.01em',
          }}
        >
          Create a cinematic birthday website with photos, a personal letter,
          and background music — in under five minutes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '5rem',
          }}
        >
          <Link href="/create" className="btn-primary" style={{ fontSize: '0.95rem', padding: '1rem 2.4rem' }}>
            Create Birthday Website
          </Link>
          <a href="#how-it-works" className="btn-ghost" style={{ fontSize: '0.88rem' }}>
            See how it works
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="hero-stats-row"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="hero-stat-col"
              style={{
                borderRight: i < stats.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div
                className="gold-text"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.65rem',
                  fontWeight: 400,
                  lineHeight: 1,
                  marginBottom: '0.35rem',
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        <style>{`
          .hero-stats-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
          }
          .hero-stat-col {
            text-align: center;
            padding: 0 2.5rem;
          }
          @media (max-width: 600px) {
            .hero-stats-row {
              flex-direction: column;
              gap: 1.25rem;
            }
            .hero-stat-col {
              padding: 0 0 1.25rem 0 !important;
              border-right: none !important;
              border-bottom: 1px solid var(--color-border);
              width: 100%;
              max-width: 200px;
            }
            .hero-stat-col:last-child {
              border-bottom: none;
              padding-bottom: 0 !important;
            }
          }
        `}</style>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '32px',
            background: 'linear-gradient(to bottom, var(--color-gold), transparent)',
          }}
        />
      </motion.div>
    </section>
  );
}
