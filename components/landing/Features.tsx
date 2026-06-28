'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '🖼️',
    title: 'Photo Gallery',
    desc: 'Upload multiple photos that display in a stunning cinematic gallery with lightbox.',
  },
  {
    icon: '✉️',
    title: 'Personal Message',
    desc: 'Your heartfelt message displayed as an animated love letter, sealed with a wax seal.',
  },
  {
    icon: '🎵',
    title: 'Background Music',
    desc: 'Choose from curated ambient tracks that play softly throughout the experience.',
  },
  {
    icon: '🎂',
    title: 'Interactive Cake',
    desc: 'A delightful animated cake with candles the birthday person can light and blow out.',
  },
  {
    icon: '🔗',
    title: 'Unique URL',
    desc: 'Share a beautiful link like heartnote.in/w/ABCD1234 anywhere — forever.',
  },
  {
    icon: '📱',
    title: 'Mobile Perfect',
    desc: 'Fully responsive with smooth animations on every screen size.',
  },
];

export default function Features() {
  return (
    <section className="section" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="mono" style={{ marginBottom: '1rem' }}>What You Get</div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 300,
            color: '#F0EDE6',
          }}
        >
          Everything to make them{' '}
          <span className="gold-text" style={{ fontStyle: 'italic' }}>
            feel loved
          </span>
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass"
            style={{ padding: '2rem' }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.4rem',
                fontWeight: 400,
                marginBottom: '0.75rem',
                color: '#F0EDE6',
              }}
            >
              {f.title}
            </h3>
            <p style={{ color: '#9B97A0', lineHeight: 1.6, fontSize: '0.9rem' }}>
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
