'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Website } from '@/types';
import './template.css';

interface Props {
  website: Website;
  isPreview?: boolean;
}

const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800',
];

// Royalty-free audio from Pixabay CDN (no account needed, CC0)
const SONG_URLS: Record<string, string> = {
  piano:
    'https://cdn.pixabay.com/audio/2023/05/16/audio_a01fa3e53d.mp3',
  acoustic:
    'https://cdn.pixabay.com/audio/2022/10/25/audio_946f936742.mp3',
  jazz:
    'https://cdn.pixabay.com/audio/2022/08/23/audio_d16737dc28.mp3',
  cinematic:
    'https://cdn.pixabay.com/audio/2023/01/25/audio_7eed9c45db.mp3',
  lofi:
    'https://cdn.pixabay.com/audio/2022/10/27/audio_4b797e5f06.mp3',
};

export default function BirthdayTemplate({ website, isPreview }: Props) {
  const [letterOpen, setLetterOpen] = useState(false);
  const [candlesLit, setCandlesLit] = useState<boolean[]>([false, false, false]);
  const [giftOpen, setGiftOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    mins: '00',
    secs: '00',
  });
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicError, setMusicError] = useState(false);

  // Stable random confetti data (computed once)
  const [confettiPieces] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: [
        '#C9A96E',
        '#E8C987',
        '#FF6B6B',
        '#7EC8E3',
        '#A8E6CF',
        '#FFE0B2',
      ][Math.floor(Math.random() * 6)],
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      rotation: Math.random() * 360,
    }))
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const photos = website.photos?.length ? website.photos : DEFAULT_PHOTOS;
  const toName = website.to_name || 'You';
  const fromName = website.from_name || '';
  const message =
    website.message ||
    'Happy Birthday! Wishing you all the joy and love in the world.';
  const songUrl = SONG_URLS[website.song] || SONG_URLS.piano;

  // ── Countdown ──────────────────────────────────────────────────
  useEffect(() => {
    const getTarget = () => {
      const t = new Date();
      t.setMonth(11, 31);
      t.setHours(23, 59, 59, 0);
      if (t < new Date()) t.setFullYear(t.getFullYear() + 1);
      return t;
    };
    const target = getTarget();

    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ days: '00', hours: '00', mins: '00', secs: '00' });
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0'),
        secs: String(s).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Audio ──────────────────────────────────────────────────────
  // Use a ref to track playing state so the autoplay handler doesn't
  // capture a stale closure value of musicPlaying.
  const musicPlayingRef = useRef(false);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicPlayingRef.current) {
      audio.pause();
      musicPlayingRef.current = false;
      setMusicPlaying(false);
    } else {
      audio.volume = 0.35;
      audio.play()
        .then(() => {
          musicPlayingRef.current = true;
          setMusicPlaying(true);
        })
        .catch(() => {
          setMusicError(true);
          setMusicPlaying(false);
        });
    }
  }, []);

  // Attempt silent autoplay on first user interaction (respects browser policy).
  // Registered once — no deps that change after mount.
  useEffect(() => {
    const tryAutoplay = () => {
      const audio = audioRef.current;
      if (!audio || musicPlayingRef.current) return;
      audio.volume = 0.35;
      audio.play()
        .then(() => {
          musicPlayingRef.current = true;
          setMusicPlaying(true);
        })
        .catch(() => { /* browser blocked autoplay — user must tap the button */ });
      // Remove all listeners after first successful attempt
      window.removeEventListener('scroll', tryAutoplay);
      window.removeEventListener('click', tryAutoplay);
      window.removeEventListener('touchstart', tryAutoplay);
    };

    window.addEventListener('scroll', tryAutoplay, { passive: true });
    window.addEventListener('click',      tryAutoplay, { once: true });
    window.addEventListener('touchstart', tryAutoplay, { once: true });

    return () => {
      window.removeEventListener('scroll', tryAutoplay);
      window.removeEventListener('click',      tryAutoplay);
      window.removeEventListener('touchstart', tryAutoplay);
    };
  }, []); // intentionally empty — register once on mount only

  // ── Lightbox keyboard navigation ───────────────────────────────
  const navigateLightbox = useCallback(
    (dir: number) => {
      const newIdx = (lightboxIndex + dir + photos.length) % photos.length;
      setLightboxIndex(newIdx);
      setLightboxImg(photos[newIdx]);
    },
    [lightboxIndex, photos]
  );

  useEffect(() => {
    if (!lightboxImg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImg(null);
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxImg, navigateLightbox]);

  const openLightbox = (src: string, idx: number) => {
    setLightboxImg(src);
    setLightboxIndex(idx);
  };

  // ── Candles ────────────────────────────────────────────────────
  const lightCandle = (i: number) => {
    const next = [...candlesLit];
    next[i] = !next[i];
    setCandlesLit(next);
    if (next.every(Boolean)) {
      setTimeout(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4500);
      }, 300);
    }
  };

  const wishes = [
    {
      message: `"To the most wonderful ${toName}, your smile lights up every room. Wishing you the most magical birthday!"`,
      name: 'Amelia Vance',
      relation: 'Best Friend',
    },
    {
      message: `"Happy Birthday! Thank you for always being there. Have a fantastic, blissful year ahead!"`,
      name: 'Lucas Hayes',
      relation: 'College Buddy',
    },
    {
      message: `"Sending you warm vibes and tight hugs. You make the world a warmer place by just existing!"`,
      name: 'Chloe Thorne',
      relation: 'Sister',
    },
  ];

  const reasons = [
    {
      icon: '✨',
      num: '01',
      title: 'Your Radiant Joy',
      back: 'The effortless way you light up any room you walk into. Your laughter is my favourite symphony.',
    },
    {
      icon: '🌱',
      num: '02',
      title: 'Your Infinite Grace',
      back: 'Your boundless kindness and empathy toward every soul around you. You look at the world with soft, understanding eyes.',
    },
    {
      icon: '🌌',
      num: '03',
      title: 'Your Beautiful Dreams',
      back: 'The gorgeous way you dream, create, and inspire those around you. Being with you feels like exploring a limitless sky.',
    },
  ];

  return (
    <div className="template-root" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={songUrl}
        loop
        preload="none"
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {/* Floating music control */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        onClick={toggleMusic}
        title={musicPlaying ? 'Pause music' : 'Play music'}
        aria-label={musicPlaying ? 'Pause background music' : 'Play background music'}
        style={{
          position: 'fixed',
          bottom: isPreview ? '3.5rem' : '1.5rem',
          right: '1.5rem',
          zIndex: 9998,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: musicPlaying
            ? 'rgba(201,169,110,0.25)'
            : 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(201,169,110,0.3)',
          color: musicError ? '#9B97A0' : '#C9A96E',
          fontSize: '1.1rem',
          cursor: musicError ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.25s',
        }}
      >
        {musicError ? '🔇' : musicPlaying ? '🎵' : '🎶'}
      </motion.button>

      {/* Confetti */}
      {showConfetti && (
        <div aria-hidden="true">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="t-confetti-piece"
              style={{
                left: `${piece.left}vw`,
                background: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                transform: `rotate(${piece.rotation}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="t-hero">
        <div
          className="t-hero-orb"
          aria-hidden="true"
          style={{
            top: '-20%',
            left: '-15%',
            width: '60vw',
            height: '60vw',
            background:
              'radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)',
          }}
        />
        <div
          className="t-hero-orb"
          aria-hidden="true"
          style={{
            bottom: '-20%',
            right: '-15%',
            width: '50vw',
            height: '50vw',
            background:
              'radial-gradient(circle, rgba(100,60,200,0.05) 0%, transparent 70%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}
        >
          <div className="t-hero-tagline">✦ A Celebration of You ✦</div>
          <h1 className="t-hero-title">
            Happy Birthday,
            <br />
            <span>{toName}.</span>
          </h1>
          <p className="t-hero-sub">
            {fromName
              ? `A heartfelt tribute from ${fromName} — made with love, just for you.`
              : 'An immersive experience made with love, just for you.'}
          </p>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
            style={{ color: '#C9A96E', fontSize: '1.5rem' }}
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. GALLERY ──────────────────────────────────────────── */}
      <section className="t-section">
        <div className="t-section-header">
          <span className="t-section-tag">Visual Archives</span>
          <h2 className="t-section-title">Captured Heartbeats</h2>
          <div className="t-gold-divider" />
        </div>

        <div
          className="t-gallery-grid"
          style={{ maxWidth: '1100px', margin: '0 auto' }}
        >
          {photos.map((src, i) => (
            <motion.div
              key={`photo-${i}`}
              className="t-gallery-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => openLightbox(src, i)}
              role="button"
              tabIndex={0}
              aria-label={`View memory ${i + 1}`}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(src, i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="t-gallery-img"
                src={src}
                alt={`Memory ${i + 1}`}
                loading={i < 3 ? 'eager' : 'lazy'}
              />
              <div className="t-gallery-overlay">
                <div style={{ color: '#F0EDE6' }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.1rem',
                    }}
                  >
                    Memory {i + 1}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3. LOVE LETTER ──────────────────────────────────────── */}
      <section className="t-section">
        <div className="t-section-header">
          <span className="t-section-tag">A Sealed Message</span>
          <h2 className="t-section-title">From the Heart</h2>
          <div className="t-gold-divider" />
        </div>

        <div className="t-letter-wrap">
          {!letterOpen ? (
            <motion.div
              className="t-glass t-envelope"
              onClick={() => setLetterOpen(true)}
              whileHover={{ scale: 1.01 }}
              role="button"
              tabIndex={0}
              aria-label="Open sealed letter"
              onKeyDown={(e) => e.key === 'Enter' && setLetterOpen(true)}
            >
              <div className="t-wax-seal" aria-hidden="true">
                {(fromName[0] || '❤').toUpperCase()}
              </div>
              <p style={{ color: '#9B97A0', fontSize: '0.9rem' }}>
                Tap the seal to open your letter
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="t-glass t-letter-body"
            >
              <div
                style={{
                  fontStyle: 'italic',
                  color: '#C9A96E',
                  marginBottom: '1.5rem',
                  fontSize: '1rem',
                }}
              >
                Dear {toName},
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {message}
              </div>
              {fromName && (
                <div
                  style={{
                    marginTop: '2rem',
                    color: '#C9A96E',
                    fontStyle: 'italic',
                  }}
                >
                  With love,
                  <br />
                  <strong>{fromName}</strong>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── 4. REASONS ──────────────────────────────────────────── */}
      <section className="t-section">
        <div className="t-section-header">
          <span className="t-section-tag">Endless Reasons</span>
          <h2 className="t-section-title">Why You Are Cherished</h2>
          <div className="t-gold-divider" />
        </div>

        <div className="t-reasons-grid">
          {reasons.map((r, i) => (
            <motion.div
              key={`reason-${i}`}
              className="t-flip-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="t-flip-inner">
                <div className="t-flip-front">
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                    {r.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: '0.7rem',
                      letterSpacing: '0.1em',
                      color: '#C9A96E',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Reason {r.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.4rem',
                      fontWeight: 400,
                      color: '#F0EDE6',
                    }}
                  >
                    {r.title}
                  </h3>
                </div>
                <div className="t-flip-back">
                  <p
                    style={{
                      color: '#F0EDE6',
                      lineHeight: 1.6,
                      fontSize: '0.9rem',
                    }}
                  >
                    {r.back}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5. VIDEO ────────────────────────────────────────────── */}
      {website.video && (
        <section className="t-section">
          <div className="t-section-header">
            <span className="t-section-tag">Cinematic Memoir</span>
            <h2 className="t-section-title">A Video Message</h2>
            <div className="t-gold-divider" />
          </div>
          <div
            className="t-video-card t-glass"
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <video
              src={website.video}
              controls
              playsInline
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: '16px',
                display: 'block',
              }}
            />
          </div>
        </section>
      )}

      {/* ── 6. COUNTDOWN ────────────────────────────────────────── */}
      <section className="t-section">
        <div className="t-section-header">
          <span className="t-section-tag">The Anticipation</span>
          <h2 className="t-section-title">Till the Next Celebration</h2>
          <div className="t-gold-divider" />
        </div>

        <div className="t-countdown-grid">
          {[
            { num: countdown.days, label: 'Days' },
            { num: countdown.hours, label: 'Hours' },
            { num: countdown.mins, label: 'Mins' },
            { num: countdown.secs, label: 'Secs' },
          ].map((c) => (
            <div key={c.label} className="t-glass t-countdown-block">
              <div className="t-countdown-num">{c.num}</div>
              <div className="t-countdown-label">{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. CAKE ─────────────────────────────────────────────── */}
      <section className="t-section" style={{ textAlign: 'center' }}>
        <div className="t-section-header">
          <span className="t-section-tag">Celebration Ritual</span>
          <h2 className="t-section-title">Light the Candles</h2>
          <div className="t-gold-divider" />
        </div>

        <div className="t-cake-container">
          <div className="t-candle-row">
            {candlesLit.map((lit, i) => (
              <div
                key={`candle-${i}`}
                className="t-candle"
                onClick={() => lightCandle(i)}
                role="button"
                tabIndex={0}
                aria-label={
                  lit
                    ? `Candle ${i + 1} lit — tap to blow out`
                    : `Tap to light candle ${i + 1}`
                }
                aria-pressed={lit}
                onKeyDown={(e) => e.key === 'Enter' && lightCandle(i)}
              >
                <div className={`t-flame${lit ? ' lit' : ''}`} aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="t-cake-layer t-cake-top" />
          <div className="t-cake-layer t-cake-mid" />
          <div className="t-cake-layer t-cake-bot" />
        </div>

        <p
          role="status"
          aria-live="polite"
          style={{ color: '#9B97A0', fontSize: '0.9rem', marginTop: '1rem' }}
        >
          {candlesLit.every(Boolean)
            ? '🎉 All candles lit! Make a wish!'
            : 'Tap each candle to light them up!'}
        </p>
      </section>

      {/* ── 8. WISHES CAROUSEL ──────────────────────────────────── */}
      <section className="t-section">
        <div className="t-section-header">
          <span className="t-section-tag">Warm Whispers</span>
          <h2 className="t-section-title">Kind Words from Friends</h2>
          <div className="t-gold-divider" />
        </div>

        <div className="t-wishes-wrap">
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="t-glass t-wish-card"
              style={{ margin: '0 auto', maxWidth: '600px' }}
            >
              <div className="t-wish-quote" aria-hidden="true">
                &ldquo;
              </div>
              <p className="t-wish-message">
                {wishes[carouselIndex].message}
              </p>
              <div className="t-wish-author">
                <div
                  aria-hidden="true"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C9A96E, #8B6E3E)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#080810',
                    fontWeight: 700,
                    flexShrink: 0,
                    fontSize: '1.1rem',
                  }}
                >
                  {wishes[carouselIndex].name[0]}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 500,
                      color: '#F0EDE6',
                      fontSize: '0.95rem',
                    }}
                  >
                    {wishes[carouselIndex].name}
                  </div>
                  <div style={{ color: '#9B97A0', fontSize: '0.8rem' }}>
                    {wishes[carouselIndex].relation}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              marginTop: '1.5rem',
            }}
          >
            <button
              onClick={() =>
                setCarouselIndex(
                  (i) => (i - 1 + wishes.length) % wishes.length
                )
              }
              aria-label="Previous wish"
              style={{
                padding: '0.6rem 1.4rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,169,110,0.2)',
                borderRadius: '50px',
                color: '#C9A96E',
                cursor: 'pointer',
              }}
            >
              ←
            </button>
            <button
              onClick={() =>
                setCarouselIndex((i) => (i + 1) % wishes.length)
              }
              aria-label="Next wish"
              style={{
                padding: '0.6rem 1.4rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,169,110,0.2)',
                borderRadius: '50px',
                color: '#C9A96E',
                cursor: 'pointer',
              }}
            >
              →
            </button>
          </div>

          {/* Dot indicators */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.4rem',
              marginTop: '0.9rem',
            }}
            role="tablist"
            aria-label="Wishes navigation"
          >
            {wishes.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === carouselIndex}
                aria-label={`Wish ${i + 1} of ${wishes.length}`}
                onClick={() => setCarouselIndex(i)}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background:
                    i === carouselIndex
                      ? '#C9A96E'
                      : 'rgba(201,169,110,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. GIFT ─────────────────────────────────────────────── */}
      <section className="t-section" style={{ textAlign: 'center' }}>
        <div className="t-section-header">
          <span className="t-section-tag">A Token of Affection</span>
          <h2 className="t-section-title">Unwrap Your Surprise</h2>
          <div className="t-gold-divider" />
        </div>

        {!giftOpen ? (
          <motion.div
            className="t-gift-box"
            onClick={() => setGiftOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            role="button"
            tabIndex={0}
            aria-label="Tap to unwrap your gift"
            onKeyDown={(e) => e.key === 'Enter' && setGiftOpen(true)}
          >
            <div className="t-gift-lid">
              <div className="t-gift-ribbon-v" />
            </div>
            <div className="t-gift-body">
              <div className="t-gift-ribbon-v" />
              <div className="t-gift-ribbon-h" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="t-glass"
            style={{
              maxWidth: '480px',
              margin: '0 auto',
              padding: '2.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{ fontSize: '3rem', marginBottom: '1rem' }}
              aria-hidden="true"
            >
              🎁
            </div>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.8rem',
                fontWeight: 300,
                color: '#F0EDE6',
                marginBottom: '1rem',
              }}
            >
              A Surprise Just for You!
            </h3>
            <p style={{ color: '#9B97A0', lineHeight: 1.7 }}>
              {fromName
                ? `${fromName} has a very special surprise waiting for you!`
                : 'A beautiful surprise awaits you — check with your special person!'}
            </p>
          </motion.div>
        )}

        <p
          role="status"
          aria-live="polite"
          style={{
            color: '#9B97A0',
            fontSize: '0.85rem',
            marginTop: '1.5rem',
          }}
        >
          {giftOpen ? '🎉 Surprise revealed!' : 'Tap the gift to unwrap!'}
        </p>
      </section>

      {/* ── 10. FINAL WISH ──────────────────────────────────────── */}
      <section className="t-final">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: '700px', textAlign: 'center' }}
        >
          <div
            className="t-section-tag"
            style={{ marginBottom: '2rem', display: 'block' }}
          >
            Infinite Chapters Ahead
          </div>
          <h2 className="t-final-title">
            Happy Birthday,
            <br />
            <span>{toName}.</span>
          </h2>
          <div className="t-gold-divider" />
          <p
            style={{
              color: '#9B97A0',
              lineHeight: 1.8,
              fontSize: '1.05rem',
              marginTop: '2rem',
              maxWidth: '500px',
              margin: '2rem auto 0',
            }}
          >
            &ldquo;May this new year of your beautiful life bring you deeper
            joy, absolute serenity, and endless magical nights under stargazing
            skies.&rdquo;
          </p>
          {fromName && (
            <p
              style={{
                marginTop: '2.5rem',
                color: '#C9A96E',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.2rem',
                fontStyle: 'italic',
              }}
            >
              Made with unconditional love by {fromName} ♥
            </p>
          )}
        </motion.div>
      </section>

      {/* ── LIGHTBOX ────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            className="t-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImg(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
          >
            <button
              className="t-lightbox-close"
              onClick={() => setLightboxImg(null)}
              aria-label="Close photo viewer"
            >
              ✕
            </button>

            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox(-1);
                  }}
                  aria-label="Previous photo"
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#F0EDE6',
                    cursor: 'pointer',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '50%',
                    fontSize: '1.1rem',
                    zIndex: 1,
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox(1);
                  }}
                  aria-label="Next photo"
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#F0EDE6',
                    cursor: 'pointer',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '50%',
                    fontSize: '1.1rem',
                    zIndex: 1,
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  →
                </button>
              </>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="t-lightbox-img"
              src={lightboxImg}
              alt={`Memory ${lightboxIndex + 1} of ${photos.length}`}
              onClick={(e) => e.stopPropagation()}
            />

            {photos.length > 1 && (
              <p
                style={{
                  position: 'absolute',
                  bottom: '1.25rem',
                  color: 'rgba(240,237,230,0.55)',
                  fontSize: '0.82rem',
                  fontFamily: 'Courier New, monospace',
                  letterSpacing: '0.1em',
                }}
              >
                {lightboxIndex + 1} / {photos.length}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview badge */}
      {isPreview && (
        <div
          aria-label="Preview mode indicator"
          style={{
            position: 'fixed',
            bottom: '1rem',
            left: '1rem',
            background: 'rgba(201,169,110,0.12)',
            border: '1px solid rgba(201,169,110,0.25)',
            borderRadius: '6px',
            padding: '0.3rem 0.7rem',
            fontSize: '0.65rem',
            fontFamily: 'Courier New, monospace',
            letterSpacing: '0.12em',
            color: 'rgba(201,169,110,0.7)',
            zIndex: 9997,
          }}
        >
          PREVIEW
        </div>
      )}
    </div>
  );
}
