'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  src: string;
  isPreviewMode?: boolean; // True when rendered inside the creation form preview
}

export default function VideoPlayer({ src, isPreviewMode = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [aspect, setAspect] = useState<number | null>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'square'>('landscape');
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
                // Autoplay blocked by browser
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
    const ratio = width / height;

    setAspect(ratio);
    if (ratio < 0.85) {
      setOrientation('portrait');
    } else if (ratio >= 0.85 && ratio <= 1.2) {
      setOrientation('square');
    } else {
      setOrientation('landscape');
    }
    setLoaded(true);
  };

  // Layout-specific styling classes
  const getContainerStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'relative',
      overflow: 'hidden',
      margin: '0 auto',
      width: '100%',
      transition: 'max-width 0.5s ease',
    };

    if (orientation === 'portrait') {
      return {
        ...baseStyle,
        maxWidth: '380px',
        borderRadius: '24px',
        border: '1px solid rgba(201, 169, 110, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(201, 169, 110, 0.05)',
        background: 'rgba(255, 255, 255, 0.01)',
        backdropFilter: 'blur(20px)',
      };
    } else if (orientation === 'square') {
      return {
        ...baseStyle,
        maxWidth: '520px',
        borderRadius: '20px',
        border: '1px solid rgba(201, 169, 110, 0.2)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      };
    } else {
      // Landscape Layout
      return {
        ...baseStyle,
        maxWidth: '920px',
        borderRadius: '16px',
        border: '1px solid rgba(201, 169, 110, 0.15)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
      };
    }
  };

  return (
    <div style={{ padding: '0 1rem', width: '100%' }}>
      <div
        ref={containerRef}
        style={getContainerStyle()}
        className="vp-container-wrap"
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: aspect ? `${aspect}` : '16/9',
            background: '#030308',
            transition: 'aspect-ratio 0.5s ease',
          }}
        >
          {/* Blurred Placeholder */}
          <AnimatePresence>
            {!loaded && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #0d0d1a 0%, #030308 100%)',
                  filter: 'blur(10px)',
                  transform: 'scale(1.05)',
                }}
              >
                <div
                  style={{
                    color: '#C9A96E',
                    fontSize: '0.75rem',
                    fontFamily: 'Courier New, monospace',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    filter: 'blur(0px)', // keep text clean if possible
                  }}
                >
                  Loading Cinematic Memoir...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* HTML5 Video Element */}
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
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              cursor: 'pointer',
            }}
          />

          {/* Luxury Video Controls Overlays */}
          {loaded && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(3, 3, 8, 0.4) 0%, transparent 40%, rgba(3, 3, 8, 0.2) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem',
                pointerEvents: 'none',
              }}
              className="vp-controls-overlay"
            >
              {/* Top Bar - Volume/Mute Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
                <button
                  onClick={toggleMute}
                  style={{
                    background: 'rgba(8, 8, 16, 0.75)',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    color: '#C9A96E',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s',
                  }}
                  title={isMuted ? 'Unmute video' : 'Mute video'}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </div>

              {/* Bottom Center - Play/Pause status indicator overlay */}
              <div style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', pointerEvents: 'auto' }}>
                <button
                  onClick={handlePlayPause}
                  style={{
                    background: 'rgba(201, 169, 110, 0.9)',
                    border: 'none',
                    color: '#030308',
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.15rem',
                    boxShadow: '0 8px 25px rgba(201, 169, 110, 0.35)',
                    transition: 'transform 0.25s, opacity 0.25s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
              </div>

              {/* Bottom spacing dummy */}
              <div />
            </div>
          )}

          {/* Autoplay Blocked Big Play Button */}
          {loaded && playBlocked && !isPlaying && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(3, 3, 8, 0.5)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <button
                onClick={handlePlayPause}
                style={{
                  background: 'linear-gradient(135deg, #C9A96E 0%, #E8C987 100%)',
                  border: 'none',
                  color: '#030308',
                  padding: '0.9rem 1.8rem',
                  borderRadius: '50px',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(201, 169, 110, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <span>▶</span> UNMUTE & PLAY SURPRISE
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CSS Injection for hover control overlay visibility */}
      <style jsx global>{`
        .vp-container-wrap:hover .vp-controls-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
