'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    q: 'How long does the website stay live?',
    a: 'Your birthday website stays live indefinitely. Once published, it\'s yours forever.',
  },
  {
    q: 'Can I edit the website after publishing?',
    a: 'Currently, editing after publish is not supported. Please preview carefully before paying.',
  },
  {
    q: 'What file formats are supported?',
    a: 'Photos: JPG, PNG, WebP (up to 10 photos, 5MB each). Video: MP4, MOV (up to 100MB).',
  },
  {
    q: 'Is the payment secure?',
    a: 'Yes. We use Cashfree, a PCI DSS compliant payment gateway trusted by thousands of Indian businesses.',
  },
  {
    q: 'Can the birthday person see it on mobile?',
    a: 'Absolutely. The website is fully responsive and beautiful on all devices.',
  },
];

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      {/* Pricing */}
      <section className="section" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="mono" style={{ marginBottom: '1rem' }}>Simple Pricing</div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 300,
              color: '#F0EDE6',
            }}
          >
            One price.{' '}
            <span className="gold-text" style={{ fontStyle: 'italic' }}>
              Forever yours.
            </span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass"
          style={{
            padding: '3rem 2.5rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(201,169,110,0.06) 0%, rgba(255,255,255,0.03) 100%)',
          }}
        >
          <div
            className="gold-text"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '5rem',
              fontWeight: 300,
              lineHeight: 1,
            }}
          >
            ₹99
          </div>
          <div style={{ color: '#9B97A0', marginTop: '0.5rem', marginBottom: '2rem' }}>
            One-time · No subscription · Publish instantly
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '2rem',
              textAlign: 'left',
            }}
          >
            {[
              '✦  Full cinematic birthday website',
              '✦  Up to 10 photos + 1 video',
              '✦  Custom personal message',
              '✦  Background music selection',
              '✦  Unique shareable URL',
              '✦  QR code download',
              '✦  WhatsApp share button',
              '✦  Lives forever',
            ].map((item) => (
              <div key={item} style={{ color: '#C9A96E', fontSize: '0.9rem' }}>
                {item}
              </div>
            ))}
          </div>

          <Link href="/create">
            <button
              style={{
                width: '100%',
                padding: '1.1rem',
                background: 'linear-gradient(135deg, #C9A96E 0%, #E8C987 100%)',
                color: '#080810',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Create Birthday Website
            </button>
          </Link>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="mono" style={{ marginBottom: '1rem' }}>Questions</div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 300,
              color: '#F0EDE6',
            }}
          >
            Common questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass"
              style={{ padding: '1.25rem 1.5rem', cursor: 'pointer' }}
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
                <span style={{ fontWeight: 500, color: '#F0EDE6', fontSize: '0.95rem' }}>
                  {faq.q}
                </span>
                <span
                  style={{
                    color: '#C9A96E',
                    fontSize: '1.2rem',
                    transition: 'transform 0.2s',
                    transform: open === i ? 'rotate(45deg)' : 'none',
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </div>
              {open === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ marginTop: '0.75rem', color: '#9B97A0', lineHeight: 1.6, fontSize: '0.9rem' }}
                >
                  {faq.a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
