'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  src: string;
  isPreviewMode?: boolean; // True when rendered inside the creation form preview
}

export default function VideoPlayer({ src, isPreviewMode = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [playBlocked, setPlayBlocked] = useState(false);

  // Intersection Observer for autoplay/pause on viewport entry/exit
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isPreviewMode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play()
              .then(() => {
                setIsPlaying(true);
                setPlayBlocked(false);
              })
              .catch(() => {
                setPlayBlocked(true);
                setIsPlaying(false);
              });
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.unobserve(video);
  }, [isPreviewMode]);

  // Handle manual video play/pause
  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => {
          setIsPlaying(true);
          setPlayBlocked(false);
        })
        .catch(() => {
          setPlayBlocked(true);
          setIsPlaying(false);
        });
    }
  };

  // Handle volume mute/unmute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Video loaded metadata handler
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (width && height) {
      setAspectRatio(width / height);
    }
    setLoaded(true);
  };

  // Determine container maximum width dynamically:
  // If it's a portrait video (aspectRatio < 0.85), max-width: 420px.
  // If it's square (0.85 to 1.2), max-width: 520px.
  // If landscape, max-width: 900px.
  const getMaxWidth = () => {
    if (!aspectRatio) return '900px';
    if (aspectRatio < 0.85) return '420px'; // Portrait
    if (aspectRatio >= 0.85 && aspectRatio <= 1.2) return '520px'; // Square
    return '900px'; // Landscape
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0 1rem' }}>
      <div
        className={`vp-container-wrap ${aspectRatio ? (aspectRatio < 0.85 ? 'vp-phone-frame' : aspectRatio > 1.25 ? 'vp-cinema-frame' : 'vp-square-frame') : ''}`}
        style={{
          width: '100%',
          maxWidth: aspectRatio
            ? aspectRatio < 0.85
              ? "320px"
              : aspectRatio > 1.25
              ? "900px"
              : "520px"
            : "900px",
          position: 'relative',
          borderRadius: aspectRatio && aspectRatio < 0.85 ? '36px' : '20px',
          overflow: "hidden",
          background: 'rgba(5, 5, 10, 0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--color-border-gold)',
          boxShadow: 'var(--shadow-xl), var(--shadow-gold)',
          height: "auto",
          transition: "all .45s var(--ease-luxury)"
        }}
      >
        {/* Phone Speaker & Camera notches for portrait phone frame */}
        {aspectRatio && aspectRatio < 0.85 && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '110px',
              height: '24px',
              background: '#050505',
              borderRadius: '20px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div style={{ width: '40px', height: '3px', background: '#222', borderRadius: '2px', marginRight: '8px' }} />
            <div style={{ width: '6px', height: '6px', background: '#111122', borderRadius: '50%', border: '1px solid #333' }} />
          </div>
        )}

        {/* Blurred loading placeholder */}
        <AnimatePresence>
          {!loaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0d0d1a 0%, #030308 100%)',
              }}
            >
              <div
                style={{
                  color: '#C9A96E',
                  fontSize: '0.75rem',
                  fontFamily: 'Courier New, monospace',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Loading Cinematic Memoir...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Element */}
        <video
          ref={videoRef}
          src={src}
          muted={isMuted}
          loop
          playsInline
          autoPlay={!isPreviewMode}
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onClick={handlePlayPause}
          style={{
              width: "100%",
height: "auto",
display: "block",
objectFit: "contain",
background: "#000",
          }}
        />

        {/* Floating Custom Controls */}
        {loaded && (
          <div
            className="vp-controls-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(3, 3, 8, 0.5) 0%, transparent 40%, rgba(3, 3, 8, 0.25) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1rem',
              pointerEvents: 'none',
            }}
          >
            {/* Top Right: Volume control */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
              <button
                onClick={toggleMute}
                style={{
                  background: 'rgba(8, 8, 16, 0.75)',
                  border: '1px solid rgba(201, 169, 110, 0.3)',
                  color: '#C9A96E',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>

            {/* Center: Play/Pause overlay */}
            <div style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', pointerEvents: 'auto' }}>
              <button
                onClick={handlePlayPause}
                style={{
                  background: 'rgba(201, 169, 110, 0.9)',
                  border: 'none',
                  color: '#030308',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 20px rgba(201, 169, 110, 0.3)',
                }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>

            {/* Bottom spacer */}
            <div />
          </div>
        )}

        {/* Autoplay blocked fallback */}
        {loaded && playBlocked && !isPlaying && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(3, 3, 8, 0.6)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <button
              onClick={handlePlayPause}
              style={{
                background: 'linear-gradient(135deg, #C9A96E 0%, #E8C987 100%)',
                border: 'none',
                color: '#030308',
                padding: '0.8rem 1.6rem',
                borderRadius: '50px',
                fontFamily: 'Courier New, monospace',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(201, 169, 110, 0.35)',
              }}
            >
              ▶ PLAY VIDEO
            </button>
          </div>
        )}
            </div>
    </div>
  );
}
