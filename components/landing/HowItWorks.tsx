'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const steps = [
  {
    step: '01',
    title: 'Fill the Form',
    desc: "Enter the birthday person's name, write your heartfelt message, upload photos, optionally add a video, and pick a background song.",
    icon: '✍️',
  },
  {
    step: '02',
    title: 'Preview Instantly',
    desc: 'See a live preview of the full cinematic website with all your content before paying anything.',
    icon: '👁️',
  },
  {
    step: '03',
    title: 'Pay ₹99',
    desc: 'One simple payment via Cashfree. No subscription, no account, no hidden fees.',
    icon: '💳',
  },
  {
    step: '04',
    title: 'Share the Link',
    desc: 'Get your unique URL, a QR code, and a one-tap WhatsApp share button. Send it and watch them smile.',
    icon: '🔗',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section"
      style={{ maxWidth: '860px', margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="mono" style={{ marginBottom: '1rem' }}>
          Simple Process
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 300,
            color: '#F0EDE6',
          }}
        >
          Ready in{' '}
          <span className="gold-text" style={{ fontStyle: 'italic' }}>
            four steps
          </span>
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass"
            style={{
              padding: '1.6rem 2rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.5rem',
            }}
          >
            <div
              className="gold-text"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.75rem',
                fontWeight: 300,
                lineHeight: 1,
                minWidth: '3rem',
                opacity: 0.65,
                flexShrink: 0,
              }}
            >
              {s.step}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.4rem',
                    fontWeight: 400,
                    color: '#F0EDE6',
                  }}
                >
                  {s.title}
                </h3>
              </div>
              <p style={{ color: '#9B97A0', lineHeight: 1.65, fontSize: '0.9rem' }}>
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginTop: '2.5rem' }}
      >
        <Link href="/create">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '1rem 2.75rem',
              background: 'linear-gradient(135deg, #C9A96E 0%, #E8C987 100%)',
              color: '#080810',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            Start Creating — ₹99
          </motion.button>
        </Link>
        <p style={{ color: '#9B97A0', fontSize: '0.78rem', marginTop: '0.75rem' }}>
          No account needed · Preview free · Pay only to publish
        </p>
      </motion.div>
    </section>
  );
}
