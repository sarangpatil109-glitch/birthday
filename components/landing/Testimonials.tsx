'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "I sent this to my sister on her birthday and she cried happy tears. The website looked more beautiful than anything I could have made.",
    name: 'Priya M.',
    detail: 'Mumbai · Gift for sister',
  },
  {
    quote: "My girlfriend was completely surprised. She showed it to all her friends. Worth every rupee. This is genuinely premium.",
    name: 'Arjun S.',
    detail: 'Bangalore · Gift for girlfriend',
  },
  {
    quote: "Creating it took less than 5 minutes and it looked cinematic. I've used it three times already for different people.",
    name: 'Sneha R.',
    detail: 'Delhi · Gift for mom',
  },
];

const starRow = (
  <div style={{ display: 'flex', gap: '3px', marginBottom: '1.1rem' }} aria-label="5 stars">
    {[...Array(5)].map((_, i) => (
      <span key={i} style={{ color: 'var(--color-gold)', fontSize: '0.8rem' }}>★</span>
    ))}
  </div>
);

export default function Testimonials() {
  return (
    <section className="section" style={{ maxWidth: '1060px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-label"
        >
          What People Say
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="section-heading"
        >
          They said{' '}
          <em className="gold-text" style={{ fontStyle: 'italic' }}>
            happy tears
          </em>
        </motion.h2>
      </div>

      {/* Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.55 }}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color 0.22s, transform 0.22s',
            }}
            whileHover={{ borderColor: 'rgba(212,175,55,0.25)', y: -3 } as never}
          >
            {starRow}

            {/* Quote */}
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.05rem',
                fontWeight: 300,
                lineHeight: 1.75,
                color: 'var(--color-text-primary)',
                letterSpacing: '0.01em',
                marginBottom: '1.5rem',
                flex: 1,
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Author */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              {/* Avatar circle */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--color-gold-subtle)',
                  border: '1px solid var(--color-border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1rem',
                  fontWeight: 400,
                  flexShrink: 0,
                }}
              >
                {t.name.charAt(0)}
              </div>
              <div>
                <div
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: '0.87rem',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    color: 'var(--color-text-tertiary)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.08em',
                    marginTop: '0.1rem',
                  }}
                >
                  {t.detail}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
