'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Website } from '@/types';
import VideoPlayer from './VideoPlayer';
import './template.css';
import {
  PREMIUM_QUOTES,
  PHOTO_CAPTIONS,
  SECTION_TITLES,
  ENDING_MESSAGES,
  generateEmotionalStory,
  type RelationshipType,
} from '@/utils/storyTemplates';

interface Props {
  website: Website;
  isPreview?: boolean;
}

const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800',
];

// Premium Royalty-Free Audio CDN Links
const SONG_URLS: Record<string, { url: string; title: string; artist: string }> = {
  piano: {
    url: 'https://cdn.pixabay.com/audio/2023/05/16/audio_a01fa3e53d.mp3',
    title: 'Gentle Piano Solitude',
    artist: 'Sergei Chetvertnykh',
  },
  acoustic: {
    url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_946f936742.mp3',
    title: 'Warm Acoustic Breeze',
    artist: 'Oleksii Kaplunskyi',
  },
  jazz: {
    url: 'https://cdn.pixabay.com/audio/2022/08/23/audio_d16737dc28.mp3',
    title: 'Soft Midnight Jazz',
    artist: 'Mikhail Smusev',
  },
  cinematic: {
    url: 'https://cdn.pixabay.com/audio/2023/01/25/audio_7eed9c45db.mp3',
    title: 'Cinematic Orchestral',
    artist: 'Samuel Francis Johnson',
  },
  lofi: {
    url: 'https://cdn.pixabay.com/audio/2022/10/27/audio_4b797e5f06.mp3',
    title: 'Lo-Fi Chill Memories',
    artist: 'FASSounds',
  },
};

function useMagnetic() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<any>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < 90) {
      setPosition({ x: distanceX * 0.28, y: distanceY * 0.28 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return { ref, position, handleMouseLeave };
}

export default function BirthdayTemplate({ website, isPreview }: Props) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [letterExpanded, setLetterExpanded] = useState(false);
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
  const [volume, setVolume] = useState(0.4);
  const [musicProgress, setMusicProgress] = useState(0);
  const [playerExpanded, setPlayerExpanded] = useState(false);
  
  // Custom interactive engine states
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);

  // Hook calls for luxury magnetic transitions
  const heroBtnMagnetic = useMagnetic();
  const surpriseBtnMagnetic = useMagnetic();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Parallax mouse position state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const photos = website.photos?.length ? website.photos : DEFAULT_PHOTOS;
  const toName = website.to_name || 'You';
  const fromName = website.from_name || '';
  const rawMessage = website.message || 'Happy Birthday! Wishing you all the joy and love in the world.';
  const currentSong = SONG_URLS[website.song] || SONG_URLS.piano;

  // JSON Story engine parser
  const parsedData = useMemo(() => {
    try {
      const parsed = JSON.parse(rawMessage);
      if (parsed && typeof parsed === 'object' && parsed.generatedStory) {
        return {
          relationship: (parsed.relationship || 'other') as RelationshipType,
          personalMessage: parsed.personalMessage || '',
          generatedStory: parsed.generatedStory as string,
        };
      }
    } catch {
      // Return fallback defaults for legacy messages
    }
    return {
      relationship: 'other' as RelationshipType,
      personalMessage: rawMessage,
      generatedStory: rawMessage,
    };
  }, [rawMessage]);

  const { relationship, personalMessage, generatedStory } = parsedData;

  // Stable Memoized Story Engine Selections (V3 Phase 4)
  const stableCaptions = useMemo(() => {
    return photos.map(() => {
      const rand = Math.floor(Math.random() * PHOTO_CAPTIONS.length);
      return PHOTO_CAPTIONS[rand];
    });
  }, [photos]);

  const stableQuotes = useMemo(() => {
    // Generate 3 unique random quotes from local database
    const selected: string[] = [];
    const pool = [...PREMIUM_QUOTES];
    for (let j = 0; j < 3; j++) {
      const idx = Math.floor(Math.random() * pool.length);
      selected.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return selected;
  }, []);

  const stableTitles = useMemo(() => {
    const tagRand = Math.floor(Math.random() * SECTION_TITLES.taglines.length);
    const headRand = Math.floor(Math.random() * SECTION_TITLES.headings.length);
    return {
      tag: SECTION_TITLES.taglines[tagRand],
      heading: SECTION_TITLES.headings[headRand]
    };
  }, []);

  const stableEndingMessage = useMemo(() => {
    const endRand = Math.floor(Math.random() * ENDING_MESSAGES.length);
    return ENDING_MESSAGES[endRand];
  }, []);


  // Parallax mouse move and absolute cursor tracking handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMousePos({ x, y });
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Audio progress updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setMusicProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  // Countdown timer calculation
  useEffect(() => {
    const target = new Date();
    target.setFullYear(target.getFullYear() + (target.getMonth() === 11 && target.getDate() === 31 ? 1 : 0));
    target.setMonth(11, 31);
    target.setHours(23, 59, 59, 0);

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
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Wishes carousel auto slide (pausable on hover)
  useEffect(() => {
    if (isHoveringCarousel) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHoveringCarousel]);

  // Audio Playback Helpers
  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio.volume = volume;
      audio.play()
        .then(() => setMusicPlaying(true))
        .catch(() => {
          setMusicPlaying(false);
        });
    }
  }, [musicPlaying, volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVol = parseFloat(e.target.value);
    setVolume(nextVol);
    if (audioRef.current) {
      audioRef.current.volume = nextVol;
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * audio.duration;
    setMusicProgress(percentage * 100);
  };

  // Autoplay handler on first user interaction
  useEffect(() => {
    const tryAutoplay = () => {
      const audio = audioRef.current;
      if (!audio || musicPlaying) return;
      audio.volume = volume;
      audio.play()
        .then(() => setMusicPlaying(true))
        .catch(() => {});

      window.removeEventListener('scroll', tryAutoplay);
      window.removeEventListener('click', tryAutoplay);
      window.removeEventListener('touchstart', tryAutoplay);
    };

    window.addEventListener('scroll', tryAutoplay, { passive: true });
    window.addEventListener('click', tryAutoplay, { once: true });
    window.addEventListener('touchstart', tryAutoplay, { once: true });

    return () => {
      window.removeEventListener('scroll', tryAutoplay);
      window.removeEventListener('click', tryAutoplay);
      window.removeEventListener('touchstart', tryAutoplay);
    };
  }, [musicPlaying, volume]);

  // Lightbox keyboard navigation
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

  // Handwritten message typewriter reveal logic
  const [typedMessage, setTypedMessage] = useState('');
  useEffect(() => {
    if (!letterExpanded) {
      setTypedMessage('');
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      setTypedMessage(generatedStory.slice(0, i + 1));
      i++;
      if (i >= generatedStory.length) {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [letterExpanded, generatedStory]);

  // Candle interactions
  const lightCandle = (i: number) => {
    const next = [...candlesLit];
    next[i] = !next[i];
    setCandlesLit(next);
    if (next.every(Boolean)) {
      setTimeout(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }, 200);
    }
  };

  // Preset memories for the luxury timeline
  const timelineMilestones = [
    {
      year: '2023',
      title: 'Beautiful Days & Bright Smiles',
      desc: 'Remembering the warmth of laughing together, sharing stories that lasted until midnight, and finding comfort in every single day.',
      photo: photos[0],
    },
    {
      year: '2024',
      title: 'Journeys Taken & Places Explored',
      desc: 'Wandering through scenic paths, capturing every sunrise, and creating footprints in lands that felt new yet so familiar with you.',
      photo: photos[1] || photos[0],
    },
    {
      year: '2025',
      title: 'Endless Horizons & Shared Dreams',
      desc: 'Building promises, trusting in the stars above us, and realizing that every beautiful story of mine begins and ends with you.',
      photo: photos[2] || photos[0],
    },
  ];

  // Preset wishes for carousel
  const wishesList = [
    {
      message: `"To the person who makes the universe feel smaller, warmer, and full of stardust. May your special day bring you as much light as you bring to everyone else."`,
      name: 'Elena Rostova',
      relation: 'Lifelong Friend',
    },
    {
      message: `"Another orbit around the sun completed. I wish you another year filled with cinema nights, warm tea, long drives, and beautiful memories to treasure."`,
      name: 'Aidan Mitchell',
      relation: 'Close Friend',
    },
    {
      message: `"Happy Birthday! Thank you for the countless laughs, silent hugs, and infinite understanding. You deserve the entire galaxy today."`,
      name: 'Sophia Sterling',
      relation: 'Partner in Crime',
    },
  ];

  // Love Reasons
  const loveReasons = [
    {
      num: '01',
      icon: '✨',
      title: 'Your Radiant Presence',
      back: 'The effortless way you brighten the darkest rooms and make everyone around you feel warm and noticed. You carry grace wherever you walk.',
    },
    {
      num: '02',
      icon: '🌊',
      title: 'Your Boundless Compassion',
      back: 'How deeply you care, listen, and offer comfort to those in need. Your heart is a sanctuary where people find peace and healing.',
    },
    {
      num: '03',
      icon: '🌌',
      title: 'Your Infinite Imagination',
      back: 'The unique, poetic lens through which you look at life. Talking to you feels like tracing beautiful constellations on a clear summer night.',
    },
  ];

  // Interactive mouse over hook for magnetic and cursor scaling effects
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.classList.contains('t-gallery-card') ||
        target.classList.contains('t-flip-card');
      setIsHoveringInteractive(!!isInteractive);
    };
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="template-root">
      {/* Luxury Scroll Progress Bar Indicator */}
      <div
        className="luxury-scroll-indicator"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: '3px',
          background: 'linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-light) 100%)',
          zIndex: 1000001,
          willChange: 'width',
        }}
      />

      {/* Luxury Custom Solid Cursor Dot (Desktop Only) */}
      <div
        className={`luxury-cursor-dot ${isHoveringInteractive ? 'hovering' : ''}`}
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          opacity: cursorPos.x === -100 ? 0 : 1,
        }}
      />

      {/* Luxury Custom Cursor Glow (Desktop Only) */}
      <div
        className="luxury-cursor-glow"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: `translate(-50%, -50%) scale(${isHoveringInteractive ? 1.4 : 1})`,
          opacity: cursorPos.x === -100 ? 0 : 1,
        }}
      />

      {/* Floating Fireflies & Golden Dust Particles Overlay */}
      <div className="luxury-fireflies" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => {
          const delay = Math.random() * 8;
          const duration = 12 + Math.random() * 12;
          const left = Math.random() * 100;
          const size = 3 + Math.random() * 5;
          return (
            <div
              key={`firefly-${i}`}
              className="firefly-particle"
              style={{
                left: `${left}vw`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          );
        })}
      </div>

      {/* Background Audio */}
      <audio ref={audioRef} src={currentSong.url} loop preload="auto" style={{ display: 'none' }} />

      {/* Floating Luxury Player */}
      <div className={`floating-luxury-player ${playerExpanded ? 'expanded' : ''}`}>
        <button
          className={`player-disk-btn ${musicPlaying ? 'spinning' : ''}`}
          onClick={() => {
            setPlayerExpanded(!playerExpanded);
            if (!musicPlaying) toggleMusic();
          }}
          aria-label="Expand player controls"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {musicPlaying ? (
            <div className="music-wave-bars">
              <span className="wave-bar bar-1"></span>
              <span className="wave-bar bar-2"></span>
              <span className="wave-bar bar-3"></span>
            </div>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          )}
        </button>

        <div className="player-controls-expanded">
          <div className="player-track-info">
            <div className="player-track-name">{currentSong.title}</div>
            <div className="player-track-artist">{currentSong.artist}</div>
          </div>

          <div
            className="player-progress-bar"
            onClick={handleProgressBarClick}
            role="progressbar"
            aria-valuenow={musicProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Music progress"
          >
            <div className="player-progress-filled" style={{ width: `${musicProgress}%` }} />
          </div>

          <button
            className="player-btn"
            onClick={toggleMusic}
            aria-label={musicPlaying ? 'Pause' : 'Play'}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {musicPlaying ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="player-volume-control" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9B97A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="player-volume-slider"
              aria-label="Volume slider"
            />
          </div>
        </div>
      </div>

      {/* Confetti Explosion */}
      {showConfetti && (
        <div aria-hidden="true">
          {Array.from({ length: 80 }).map((_, i) => {
            const delay = Math.random() * 1.5;
            const duration = 2.5 + Math.random() * 2;
            const left = Math.random() * 100;
            const size = 5 + Math.random() * 8;
            const rotate = Math.random() * 360;
            const color = ['#C9A96E', '#F5E6C8', '#A8E6CF', '#FFD3B6', '#FF8B94'][Math.floor(Math.random() * 5)];
            return (
              <div
                key={`confetti-${i}`}
                className="t-confetti-piece"
                style={{
                  left: `${left}vw`,
                  width: `${size}px`,
                  height: `${size}px`,
                  background: color,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  transform: `rotate(${rotate}deg)`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ── 1. LUXURY HERO ── */}
      <section className="t-hero" ref={heroRef}>
        <div
          className="t-ambient-glow"
          style={{
            top: '-20%',
            left: '-10%',
            width: '70vw',
            height: '70vw',
            background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)',
            transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
          }}
        />
        <div
          className="t-ambient-glow"
          style={{
            bottom: '-15%',
            right: '-10%',
            width: '60vw',
            height: '60vw',
            background: 'radial-gradient(circle, rgba(140,80,250,0.04) 0%, transparent 70%)',
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          }}
        />

        {/* Floating dust particles */}
        <div className="particles-container">
          {Array.from({ length: 25 }).map((_, idx) => {
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const scale = 0.5 + Math.random() * 1.5;
            return (
              <motion.div
                key={`particle-${idx}`}
                className="particle"
                style={{ top: `${top}%`, left: `${left}%` }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.1, 0.6, 0.1],
                  scale: [scale, scale * 1.2, scale],
                }}
                transition={{
                  duration: 8 + Math.random() * 6,
                  repeat: Infinity,
                  delay,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </div>

        <div className="t-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="t-hero-tagline"
          >
            ✦ A Premium Celebration of You ✦
          </motion.div>

          <h1 className="t-hero-title">
            <motion.span
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Happy Birthday,
            </motion.span>
            <br />
            <motion.span
              initial={{ filter: 'blur(10px)', opacity: 0 }}
              animate={{ filter: 'blur(0px)', opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.7 }}
              style={{ display: 'inline-block' }}
            >
              {toName}.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="t-hero-sub"
          >
            {fromName
              ? `A cinematic birthday tribute lovingly curated by ${fromName} to honor your presence in this world.`
              : 'An exquisite collection of memories and heartfelt wishes crafted uniquely for you.'}
          </motion.p>

          <div ref={heroBtnMagnetic.ref} onMouseLeave={heroBtnMagnetic.handleMouseLeave}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                x: heroBtnMagnetic.position.x,
                y: heroBtnMagnetic.position.y,
              }}
              transition={{ duration: 0.8, delay: 1.5 }}
              onClick={() => {
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#C9A96E',
                fontSize: '0.85rem',
                fontFamily: 'Courier New, monospace',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(201,169,110,0.3)',
                paddingBottom: '0.25rem',
              }}
            >
              Begin Journey
            </motion.div>
          </div>

          {/* Premium Bouncing Scroll Indicator Pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 2, duration: 1 }}
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div
              style={{
                width: '20px',
                height: '32px',
                border: '1.5px solid rgba(201,169,110,0.4)',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '6px'
              }}
            >
              <motion.div
                animate={{
                  y: [0, 8, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  width: '3px',
                  height: '6px',
                  background: '#C9A96E',
                  borderRadius: '20px'
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. LUXURY LOVE LETTER ENVELOPE ── */}
      <section className="t-section" style={{ background: '#05050c' }}>
        <div className="t-section-header">
          <span className="t-section-tag">A Sealed Message</span>
          <h2 className="t-section-title serif-heading">From the Heart</h2>
          <div className="t-gold-divider" />
        </div>

        <div
          className={`envelope-container ${envelopeOpen ? 'open' : ''}`}
          onClick={() => {
            if (!envelopeOpen) {
              setEnvelopeOpen(true);
            } else {
              setLetterExpanded(true);
            }
          }}
        >
          <div className="envelope-wrapper">
            <div className="envelope-flap" />
            <div className="envelope-pocket" />
            
            <div className="envelope-letter">
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '0.85rem', color: '#1a1a24', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                Dear {toName},
              </div>
              <div
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                  color: '#444455',
                  overflow: 'hidden',
                  maxHeight: '75px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {personalMessage}
              </div>
            </div>

            <div className="wax-seal">
              {(fromName[0] || '❤').toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ color: '#9B97A0', fontSize: '0.85rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.05em' }}>
            {envelopeOpen 
              ? 'CLICK ON THE EMERGENCE TO EXPAND & READ' 
              : 'CLICK ON THE WAX SEAL TO OPEN THE ENVELOPE'}
          </p>
        </div>

        {/* Fullscreen expanded letter overlay */}
        <AnimatePresence>
          {letterExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="letter-expanded-overlay"
              onClick={() => setLetterExpanded(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                className="letter-paper"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="letter-close-btn" onClick={() => setLetterExpanded(false)} aria-label="Close letter">
                  ✕
                </button>

                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.25rem', color: '#d4af37', marginBottom: '2rem' }}>
                  Dear {toName},
                </div>

                <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', lineHeight: 1.85, color: '#2a2a35', whiteSpace: 'pre-wrap', marginBottom: '3rem' }}>
                  {typedMessage}
                  {typedMessage.length < generatedStory.length && <span className="handwriting-cursor">|</span>}
                </div>

                {fromName && (
                  <div style={{ textAlign: 'right', paddingRight: '2rem' }}>
                    <div style={{ fontFamily: 'Georgia, serif', color: '#888899', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0.25rem' }}>
                      With all my love,
                    </div>
                    <div className="handwritten-text" style={{ color: '#C9A96E' }}>
                      {fromName}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── 3. CHRONOLOGICAL TIMELINE (Memory Journey) ── */}
      <section className="t-section">
        <div className="t-section-header">
          <span className="t-section-tag">Chronology of Affection</span>
          <h2 className="t-section-title serif-heading">Memory Timeline</h2>
          <div className="t-gold-divider" />
        </div>

        <div className="timeline-container">
          <div className="timeline-line" />
          {timelineMilestones.map((milestone, idx) => (
            <div key={`milestone-${idx}`} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-col">
                <motion.div
                  initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.8 }}
                  className="timeline-content-card"
                >
                  <div className="timeline-year">{milestone.year}</div>
                  <h3 className="timeline-title">{milestone.title}</h3>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={milestone.photo}
                    alt={milestone.title}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '1.25rem',
                      border: '1px solid rgba(201,169,110,0.1)',
                    }}
                  />
                  <p className="timeline-desc">{milestone.desc}</p>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3b. MAGAZINE LAYOUT ── */}
      <section className="t-section" style={{ background: '#05050c' }}>
        <div className="t-section-header">
          <span className="t-section-tag">Editorial Highlight</span>
          <h2 className="t-section-title serif-heading">A Magazine Masterpiece</h2>
          <div className="t-gold-divider" />
        </div>

        <div className="magazine-grid">
          <div className="magazine-photo-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[3] || photos[0]}
              alt="Cinematic cover memory"
              className="magazine-img-large"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[4] || photos[1] || photos[0]}
              alt="Detail close-up memory"
              className="magazine-img-small"
            />
          </div>

          <div className="magazine-content-col">
            <span className="t-section-tag" style={{ marginBottom: '0.5rem' }}>Chapter Four</span>
            <h3 className="luxury-title" style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#C9A96E' }}>
              Quiet Moments & Splendid Wonders
            </h3>
            <p className="magazine-quote">
              &ldquo;Life consists not of events, but of the silent heartbeats that connect them. To look at you is to look at a horizon that never ceases to inspire.&rdquo;
            </p>
            <p style={{ color: '#9B97A0', lineHeight: 1.8, fontSize: '0.95rem', fontWeight: 300 }}>
              Of all the chapters in our story, the simplest ones remain the most cinematic. Holding coffee cups on quiet rainy days, sharing songs in late-night drives, and seeing you dream.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3c. REASONS I LOVE YOU ── */}
      <section className="t-section" style={{ background: '#05050c' }}>
        <div className="t-section-header">
          <span className="t-section-tag">Endless Reasons</span>
          <h2 className="t-section-title serif-heading">Why You Are Cherished</h2>
          <div className="t-gold-divider" />
        </div>

        <div className="t-reasons-grid">
          {loveReasons.map((r, i) => (
            <motion.div
              key={`reason-${i}`}
              className="t-flip-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="t-flip-inner">
                <div className="t-flip-front">
                  <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{r.icon}</div>
                  <div
                    style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: '0.75rem',
                      letterSpacing: '0.15em',
                      color: '#C9A96E',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Reason {r.num}
                  </div>
                  <h3 className="luxury-title" style={{ fontSize: '1.25rem', color: '#F0EDE6' }}>
                    {r.title}
                  </h3>
                </div>

                <div className="t-flip-back">
                  <p style={{ color: '#F0EDE6', fontSize: '0.88rem', lineHeight: 1.7, fontWeight: 300 }}>
                    {r.back}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3d. BIRTHDAY WISHES CAROUSEL ── */}
      <section className="t-section">
        <div className="t-section-header">
          <span className="t-section-tag">Warm Whispers</span>
          <h2 className="t-section-title serif-heading">Kind Words from Friends</h2>
          <div className="t-gold-divider" />
        </div>

        <div className="wishes-carousel-container"
          onMouseEnter={() => setIsHoveringCarousel(true)}
          onMouseLeave={() => setIsHoveringCarousel(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0, scale: 0.98, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: -20 }}
              transition={{ duration: 0.4 }}
              className="t-glass t-wish-card"
              style={{ padding: '3rem 2.5rem' }}
            >
              <div className="t-wish-quote" aria-hidden="true" style={{ fontSize: '3rem', color: '#D4AF37', opacity: 0.35, lineHeight: 0.1 }}>
                &ldquo;
              </div>
              <p className="t-wish-message" style={{ fontSize: '1.15rem', color: '#F0EDE6', fontStyle: 'italic', lineHeight: 1.75, fontFamily: 'Georgia, serif' }}>
                &ldquo;{stableQuotes[carouselIndex]}&rdquo;
              </p>
              <div className="t-wish-author" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '2rem' }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-light))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#050505',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  ✦
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: '#F0EDE6', fontSize: '0.9rem' }}>A Voice of Affection</div>
                  <div style={{ color: '#9B97A0', fontSize: '0.75rem' }}>Cinematic Quote</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.75rem' }}>
            {stableQuotes.map((_, i) => (
              <button
                key={`dot-${i}`}
                onClick={() => setCarouselIndex(i)}
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: i === carouselIndex ? '#C9A96E' : 'rgba(201,169,110,0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background 0.3s',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PREMIUM MASONRY GALLERY ── */}
      <section className="t-section" id="gallery">
        <div className="t-section-header">
          <span className="t-section-tag">{stableTitles.tag}</span>
          <h2 className="t-section-title serif-heading">{stableTitles.heading}</h2>
          <div className="t-gold-divider" />
        </div>

        <div className="t-gallery-masonry">
          {photos.map((src, i) => (
            <motion.div
              key={`masonry-photo-${i}`}
              className="t-gallery-card"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              onClick={() => openLightbox(src, i)}
            >
              <div className="t-gallery-img-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="t-gallery-img"
                  src={src}
                  alt={`Memory ${i + 1}`}
                  loading="lazy"
                />
                <div className="t-gallery-overlay">
                  <div className="t-gallery-title">{stableCaptions[i]}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4b. PHOTO WALL (Pinterest Scroller) ── */}
      <section className="t-section" style={{ padding: '8rem 0' }}>
        <div className="t-section-header">
          <span className="t-section-tag">Infinite Canvas</span>
          <h2 className="t-section-title serif-heading">Our Memory Wall</h2>
          <div className="t-gold-divider" />
        </div>

        <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
          <div className="photo-wall-track">
            {/* Repeat list to create infinite loop effect */}
            {[...photos, ...photos, ...photos].map((src, i) => (
              <img
                key={`wall-${i}`}
                src={src}
                alt="Wall memory item"
                className="photo-wall-img"
                onClick={() => openLightbox(src, i % photos.length)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. INTELLIGENT VIDEO MEMORIES ── */}
      {website.video && (
        <section className="t-section">
          <div className="t-section-header">
            <span className="t-section-tag">Cinematic Memoir</span>
            <h2 className="t-section-title serif-heading">A Video Message</h2>
            <div className="t-gold-divider" />
          </div>

          <VideoPlayer src={website.video} />
        </section>
      )}

      {/* ── 6. COUNTDOWN BLOCK ── */}
      <section className="t-section" style={{ background: '#05050c' }}>
        <div className="t-section-header">
          <span className="t-section-tag">Anticipation</span>
          <h2 className="t-section-title serif-heading">Till the Next Celebration</h2>
          <div className="t-gold-divider" />
        </div>

        <div className="t-countdown-grid">
          {[
            { num: countdown.days, label: 'Days' },
            { num: countdown.hours, label: 'Hours' },
            { num: countdown.mins, label: 'Mins' },
            { num: countdown.secs, label: 'Secs' },
          ].map((c) => (
            <div key={c.label} className="t-glass t-countdown-block" style={{ border: '1px solid rgba(201,169,110,0.15)' }}>
              <div className="t-countdown-num glow-num">{c.num}</div>
              <div className="t-countdown-label">{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. BIRTHDAY RITUAL & CAKE ── */}
      <section className="t-section" style={{ background: '#05050c', textAlign: 'center' }}>
        <div className="t-section-header">
          <span className="t-section-tag">Interactive Ritual</span>
          <h2 className="t-section-title serif-heading">Light the Birthday Candles</h2>
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
                aria-label={`Light candle ${i + 1}`}
                onKeyDown={(e) => e.key === 'Enter' && lightCandle(i)}
              >
                <div className={`t-flame ${lit ? 'lit' : ''}`} />
              </div>
            ))}
          </div>
          <div className="t-cake-layer t-cake-top" />
          <div className="t-cake-layer t-cake-mid" />
          <div className="t-cake-layer t-cake-bot" />
        </div>

        <div style={{ marginTop: '3.5rem' }}>
          <AnimatePresence>
            {candlesLit.every(Boolean) ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="t-glass"
                style={{
                  maxWidth: '540px',
                  margin: '0 auto',
                  padding: '3rem 2rem',
                  border: '1px solid rgba(201,169,110,0.3)',
                  boxShadow: '0 0 40px rgba(201,169,110,0.15)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px rgba(201,169,110,0.35))' }}>
                    <rect x="3" y="8" width="18" height="4" rx="1" />
                    <path d="M12 8V22M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s-1-5-4.5-5z" />
                    <path d="M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8s1-5 4.5-5z" />
                  </svg>
                </div>
                <h3 className="luxury-title" style={{ fontSize: '1.6rem', color: '#C9A96E', marginBottom: '1rem' }}>
                  A Lifetime of Marvels Waiting for You
                </h3>
                <p style={{ color: '#F0EDE6', lineHeight: 1.7, fontSize: '0.95rem', fontWeight: 300 }}>
                  Make a silent wish. As you orbit the sun once more, may every single dream of yours flourish and light your path with infinite joy.
                </p>
                <div ref={surpriseBtnMagnetic.ref} onMouseLeave={surpriseBtnMagnetic.handleMouseLeave}>
                  <motion.button
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        navigator.vibrate([100, 50, 100]);
                      }
                      setShowConfetti(true);
                      setTimeout(() => setShowConfetti(false), 5000);
                      setSurpriseOpen(true);
                    }}
                    animate={{
                      x: surpriseBtnMagnetic.position.x,
                      y: surpriseBtnMagnetic.position.y,
                    }}
                    className="btn-primary"
                    style={{
                      marginTop: '1.5rem',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      border: 'none',
                      padding: '0.8rem 1.5rem',
                    }}
                  >
                    ✨ Reveal Special Wish
                  </motion.button>
                </div>
                {fromName && (
                  <p style={{ marginTop: '2.5rem', color: '#C9A96E', fontFamily: 'Mrs Saint Delafield', fontSize: '3rem', margin: '2rem 0 0' }}>
                    {fromName}
                  </p>
                )}
              </motion.div>
            ) : (
              <p style={{ color: '#9B97A0', fontSize: '0.9rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.05em' }}>
                TAP EACH CANDLE TO LIGHT THEM AND REVEAL THE UNCONDITIONAL SURPRISE
              </p>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── 8. FINAL WISH EPILOGUE (Final Surprise) ── */}
      <section className="t-final">
        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
          <div className="t-section-tag" style={{ marginBottom: '2rem' }}>Infinite Chapters Ahead</div>
          <h2 className="t-final-title serif-heading">
            Happy Birthday,
            <br />
            <span>{toName}.</span>
          </h2>
          <div className="t-gold-divider" />
          <p
            style={{
              color: '#9B97A0',
              lineHeight: 1.9,
              fontSize: '1.1rem',
              marginTop: '2.5rem',
              maxWidth: '560px',
              margin: '2.5rem auto 0',
              fontWeight: 300,
            }}
          >
            &ldquo;May this new year of your beautiful journey be filled with soft moments, absolute serenity, and infinite reasons to laugh and feel cherished.&rdquo;
          </p>
          {fromName && (
            <p
              style={{
                marginTop: '3.5rem',
                color: '#C9A96E',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.25rem',
                fontStyle: 'italic',
              }}
            >
              {stableEndingMessage}, {fromName}
            </p>
          )}
        </div>
      </section>

      {/* ── LIGHTBOX OVERLAY ── */}
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
            <button className="t-lightbox-close" onClick={() => setLightboxImg(null)}>
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
                    left: '1.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#F0EDE6',
                    cursor: 'pointer',
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                    right: '1.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#F0EDE6',
                    cursor: 'pointer',
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
              alt="Lightbox memory"
              onClick={(e) => e.stopPropagation()}
            />

            {photos.length > 1 && (
              <p
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  color: 'rgba(240,237,230,0.6)',
                  fontSize: '0.85rem',
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

      {/* Luxury Secret Surprise Pop-up Modal */}
      <AnimatePresence>
        {surpriseOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="surprise-modal-overlay"
            onClick={() => setSurpriseOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 190 }}
              className="surprise-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="surprise-close-btn"
                onClick={() => setSurpriseOpen(false)}
                aria-label="Close surprise"
              >
                ✕
              </button>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.4))' }}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3
                className="serif-heading"
                style={{ fontSize: '1.8rem', color: 'var(--color-gold)', marginBottom: '1.25rem', fontWeight: 300 }}
              >
                Our Sacred Bond
              </h3>
              <p
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  fontWeight: 300,
                  marginBottom: '2rem',
                }}
              >
                &ldquo;Through every changing season, every sunrise we chase, and every quiet night we share, my promise remains constant: to stand by you, laugh with you, and cherish you forever.&rdquo;
              </p>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Wishing you the happiest birthday of all.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview indicator */}
      {isPreview && (
        <div
          style={{
            position: 'fixed',
            bottom: '1rem',
            left: '1rem',
            background: 'rgba(201,169,110,0.15)',
            border: '1px solid rgba(201,169,110,0.3)',
            borderRadius: '6px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.68rem',
            fontFamily: 'Courier New, monospace',
            letterSpacing: '0.12em',
            color: 'rgba(201,169,110,0.85)',
            zIndex: 9997,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          }}
        >
          PREVIEW MODE
        </div>
      )}
    </div>
  );
}
