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
     <>
    <h1
      style={{
        color: "red",
        textAlign: "center",
        fontSize: "40px",
      }}
    >
      NEW VIDEO PLAYER
    </h1>
    
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0 1rem' }}>
      <div
        className="vp-container-wrap"
        style={{
          width: '100%',
          maxWidth: aspectRatio
  ? aspectRatio < 1
    ? "420px"
    : aspectRatio > 1.2
    ? "900px"
    : "520px"
  : "900px",
          position: 'relative',
          borderRadius: '20px',
          overflow: "visible",
          background: 'rgba(5, 5, 10, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201, 169, 110, 0.2)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          height: "auto",
    transition: "all .35s ease"
        }}
      >
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
  </>
);
}
