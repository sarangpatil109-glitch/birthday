'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const steps = [
  {
    step: '01',
    title: 'Fill the Form',
    desc: "Enter the birthday person's name, write your heartfelt message, upload photos, optionally add a video, and pick a background song.",
    time: '~2 min',
  },
  {
    step: '02',
    title: 'Preview Instantly',
    desc: 'See a full live preview of the cinematic website with all your content before paying a single rupee.',
    time: '~1 min',
  },
  {
    step: '03',
    title: 'Pay Once',
    desc: 'One simple ₹99 payment via Cashfree. No subscription, no account required, no hidden fees ever.',
    time: '~1 min',
  },
  {
    step: '04',
    title: 'Share the Link',
    desc: 'Get your unique URL, a downloadable QR code, and a one-tap WhatsApp share button. Watch them smile.',
    time: 'Instantly',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section"
      style={{ maxWidth: '820px', margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-label"
        >
          Simple Process
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="section-heading"
        >
          Ready in{' '}
          <em className="gold-text" style={{ fontStyle: 'italic' }}>
            four steps
          </em>
        </motion.h2>
      </div>

      {/* Steps */}
      <div style={{ position: 'relative' }}>
        {/* Vertical connector line */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '26px',
            top: '52px',
            bottom: '52px',
            width: '1px',
            background: 'linear-gradient(to bottom, var(--color-border-gold), transparent)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.5rem',
                padding: '1.75rem',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                transition: 'border-color 0.22s, background 0.22s',
                position: 'relative',
              }}
              whileHover={{ borderColor: 'rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.018)' } as never}
            >
              {/* Step number bubble */}
              <div
                style={{
                  flexShrink: 0,
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: i === 0 ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${i === 0 ? 'rgba(212,175,55,0.4)' : 'var(--color-border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.05rem',
                  color: i === 0 ? 'var(--color-gold)' : 'var(--color-text-tertiary)',
                  fontWeight: 300,
                  transition: 'all 0.22s',
                }}
              >
                {s.step}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: '0.1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.75rem',
                    marginBottom: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.3rem',
                      fontWeight: 400,
                      color: 'var(--color-text-primary)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {s.title}
                  </h3>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-tertiary)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '50px',
                      padding: '0.2rem 0.6rem',
                    }}
                  >
                    {s.time}
                  </span>
                </div>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                    fontSize: '0.88rem',
                    fontWeight: 300,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ textAlign: 'center', marginTop: '3.5rem' }}
      >
        <Link href="/create" className="btn-primary" style={{ fontSize: '0.95rem', padding: '1rem 2.4rem' }}>
          Start Creating — ₹99
        </Link>
        <p
          style={{
            color: 'var(--color-text-tertiary)',
            fontSize: '0.75rem',
            marginTop: '1rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em',
          }}
        >
          No account needed · Preview free · Pay only to publish
        </p>
      </motion.div>
    </section>
  );
}
