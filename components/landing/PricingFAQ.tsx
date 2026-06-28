'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    q: 'How long does the website stay live?',
    a: 'Your birthday website stays live indefinitely. Once published, it\'s yours forever — no renewal fees.',
  },
  {
    q: 'Can I edit the website after publishing?',
    a: 'Currently, editing after publish is not supported. Please preview carefully before completing payment.',
  },
  {
    q: 'What file formats are supported?',
    a: 'Photos: JPG, PNG, WebP (up to 10 photos, 5MB each). Video: MP4, MOV, WebM (up to 100MB).',
  },
  {
    q: 'Is the payment secure?',
    a: 'Yes. We use Cashfree, a PCI DSS Level 1 compliant payment gateway trusted by thousands of Indian businesses.',
  },
  {
    q: 'Can the birthday person see it on mobile?',
    a: 'Absolutely. The website is fully responsive and renders beautifully on all screen sizes and devices.',
  },
];

const includedFeatures = [
  'Full cinematic birthday website',
  'Up to 10 photos + 1 video',
  'Custom personal message',
  'Background music selection',
  'Unique shareable URL',
  'QR code download',
  'WhatsApp share button',
  'Lives forever — no expiry',
];

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      {/* Pricing */}
      <section className="section" style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label"
          >
            Simple Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-heading"
          >
            One price.{' '}
            <em className="gold-text" style={{ fontStyle: 'italic' }}>
              Forever yours.
            </em>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-gold)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg), var(--shadow-gold)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background glow */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-40%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Price */}
          <div
            className="gold-text"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '5.5rem',
              fontWeight: 300,
              lineHeight: 1,
              marginBottom: '0.25rem',
              position: 'relative',
            }}
          >
            ₹99
          </div>
          <p
            style={{
              color: 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: '2.5rem',
            }}
          >
            One-time · No subscription · Publish instantly
          </p>

          {/* Features list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              marginBottom: '2.5rem',
              textAlign: 'left',
            }}
          >
            {includedFeatures.map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9rem',
                  fontWeight: 300,
                }}
              >
                {/* Checkmark */}
                <span
                  style={{
                    flexShrink: 0,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-gold)',
                    fontSize: '0.65rem',
                  }}
                >
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>

          <Link
            href="/create"
            className="btn-primary"
            style={{
              width: '100%',
              fontSize: '0.95rem',
              padding: '1.05rem',
              borderRadius: '12px',
            }}
          >
            Create Birthday Website
          </Link>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label"
          >
            Questions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-heading"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Common questions
          </motion.h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5px', background: 'var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              style={{
                background: open === i ? 'rgba(212,175,55,0.025)' : 'var(--color-bg)',
                padding: '1.35rem 1.6rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <span
                  style={{
                    fontWeight: 400,
                    color: open === i ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    fontSize: '0.93rem',
                    lineHeight: 1.55,
                    transition: 'color 0.2s',
                    letterSpacing: '-0.005em',
                  }}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    color: 'var(--color-gold)',
                    fontSize: '1rem',
                    transition: 'transform 0.25s var(--ease-luxury)',
                    transform: open === i ? 'rotate(45deg)' : 'none',
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
              </div>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p
                      style={{
                        marginTop: '0.85rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.75,
                        fontSize: '0.88rem',
                        fontWeight: 300,
                      }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
