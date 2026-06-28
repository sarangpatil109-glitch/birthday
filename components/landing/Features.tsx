'use client';

import { motion, type Variants } from 'framer-motion';

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    title: 'Photo Gallery',
    desc: 'Upload up to 10 photos displayed in a cinematic masonry gallery with full-screen lightbox viewing.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    title: 'Personal Letter',
    desc: 'Your heartfelt words displayed as a sealed envelope — opened with an elegant wax-seal animation.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    title: 'Ambient Music',
    desc: 'Choose from curated ambient soundscapes that play softly, creating a deeply immersive atmosphere.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    title: 'Video Memoir',
    desc: 'Upload a personal video — displayed with intelligent aspect-ratio detection for perfect presentation.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title: 'Unique Link',
    desc: 'A beautiful permanent URL like heartnote.in/w/XXXX — shareable via WhatsApp, QR code, or link.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    title: 'Mobile Perfect',
    desc: 'Fully responsive across every device — looks stunning whether opened on a phone, tablet, or desktop.',
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export default function Features() {
  return (
    <section
      className="section"
      style={{
        maxWidth: '1120px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-label"
        >
          What You Get
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="section-heading"
          style={{ marginBottom: '1.25rem' }}
        >
          Everything to make them{' '}
          <em className="gold-text" style={{ fontStyle: 'italic' }}>
            feel loved
          </em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            color: 'var(--color-text-secondary)',
            maxWidth: '440px',
            margin: '0 auto',
            fontSize: '0.95rem',
            fontWeight: 300,
          }}
        >
          Six premium features, beautifully woven into one unforgettable experience.
        </motion.p>
      </div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-5%' }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '1px',
          background: 'var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            style={{
              padding: '2.25rem 2rem',
              background: 'var(--color-bg)',
              transition: 'background var(--transition)',
              cursor: 'default',
            }}
            whileHover={{ background: 'rgba(212,175,55,0.025)' } as never}
          >
            {/* Icon */}
            <div
              style={{
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-gold-subtle)',
                border: '1px solid var(--color-border-gold)',
                borderRadius: '10px',
                color: 'var(--color-gold)',
                marginBottom: '1.4rem',
              }}
            >
              {f.icon}
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 400,
                marginBottom: '0.7rem',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              {f.title}
            </h3>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                fontSize: '0.88rem',
                fontWeight: 300,
              }}
            >
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
