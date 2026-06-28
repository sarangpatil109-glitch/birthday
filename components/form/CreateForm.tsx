'use client';
/* eslint-disable react-hooks/refs */
/* The React Compiler rule 'react-hooks/refs' incorrectly flags refs that are
   accessed only in event handlers (photoInputRef, videoInputRef, xhrRef).
   These refs are never read during render — only in onClick/onKeyDown/onSubmit. */

import { useState, useCallback, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from '../template/VideoPlayer';
import { SONG_OPTIONS } from '@/utils';
import { generateEmotionalStory, type RelationshipType } from '@/utils/storyTemplates';

const schema = z.object({
  to_name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  from_name: z.string().min(1, 'Your name is required').max(50, 'Name too long'),
  relationship: z.string().min(1, 'Relationship is required'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message too long (max 1000 characters)'),
  song: z.string().min(1, 'Please select a song'),
});

type FormValues = z.infer<typeof schema>;

const MAX_PHOTOS = 10;
const MAX_PHOTO_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 100;

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.9rem 1.1rem',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.07)',
  borderRadius: '9px',
  color: 'var(--color-text-primary)',
  fontSize: '0.92rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  transition: 'border-color 0.22s, box-shadow 0.22s, background 0.22s',
  WebkitTextFillColor: 'var(--color-text-primary)',
};

const inputFocusStyle: React.CSSProperties = {
  borderColor: 'rgba(212,175,55,0.4)',
  background: 'rgba(212,175,55,0.03)',
  boxShadow: '0 0 0 3px rgba(212,175,55,0.08)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--color-gold)',
  marginBottom: '0.55rem',
};

const errorStyle: React.CSSProperties = {
  color: 'var(--color-error)',
  fontSize: '0.78rem',
  marginTop: '0.4rem',
  fontWeight: 300,
};

function renderSongIcon(songId: string) {
  switch (songId) {
    case 'piano':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <path d="M6 3v12M10 3v12M14 3v12M18 3v12" />
          <path d="M2 15h20M6 15v6M10 15v6M14 15v6M18 15v6" />
        </svg>
      );
    case 'acoustic':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
          <path d="M18 2a2 2 0 0 0-2 2v2.24A4 4 0 0 0 14.76 10l-6.3 6.3a3 3 0 1 0 4.24 4.24l6.3-6.3A4 4 0 0 0 19 12.24V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="1.5" />
          <path d="M9 15v2M12 18v2M15 9l3-3" />
        </svg>
      );
    case 'jazz':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      );
    case 'cinematic':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'lofi':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function CreateForm() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { song: 'piano', relationship: 'other' },
  });

  const selectedSong = useWatch({ control, name: 'song' });

  const addPhotos = useCallback(
    (files: FileList | File[]) => {
      setFormError(null);
      const fileArray = Array.from(files).filter((f) => {
        if (!f.type.startsWith('image/')) return false;
        if (f.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
          setFormError(`"${f.name}" exceeds ${MAX_PHOTO_SIZE_MB}MB limit`);
          return false;
        }
        return true;
      });
      const remaining = MAX_PHOTOS - photos.length;
      const toAdd = fileArray.slice(0, remaining);
      if (fileArray.length > remaining) {
        setFormError(`Maximum ${MAX_PHOTOS} photos allowed. ${fileArray.length - remaining} photo(s) skipped.`);
      }
      setPhotos((prev) => [...prev, ...toAdd]);
      const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
      setPhotoPreviews((prev) => [...prev, ...newPreviews]);
    },
    [photos.length]
  );

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addPhotos(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      setFormError(`Video must be under ${MAX_VIDEO_SIZE_MB}MB`);
      e.target.value = '';
      return;
    }
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
    setFormError(null);
  };

  const removeVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideo(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const onSubmit = async (values: FormValues) => {
    setFormError(null);

    if (photos.length === 0) {
      setFormError('Please upload at least 1 photo');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStage('Creating website...');

    try {
      // Step 1: Create draft record to get an ID
      const draftRes = await fetch('/api/websites/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_name: values.to_name,
          from_name: values.from_name,
        }),
      });

      if (!draftRes.ok) {
        const err = await draftRes.json() as { error?: string };
        throw new Error(err.error || 'Failed to create website draft');
      }

      const draft = await draftRes.json() as { id?: string; error?: string };
      if (!draft.id) throw new Error('Failed to get website ID');

      // Generate the premium emotional story locally (No paid AI APIs)
      const storyText = generateEmotionalStory({
        toName: values.to_name,
        fromName: values.from_name,
        relationship: values.relationship as RelationshipType,
        personalMessage: values.message,
      });

      const packedMessage = JSON.stringify({
        relationship: values.relationship,
        personalMessage: values.message,
        generatedStory: storyText,
      });

      // Step 2: Build FormData and upload everything
      setUploadStage('Uploading your memories...');

      const formData = new FormData();
      photos.forEach((p) => formData.append('photos', p));
      if (video) formData.append('video', video);
      formData.append('websiteId', draft.id);
      formData.append('to_name', values.to_name);
      formData.append('from_name', values.from_name);
      formData.append('message', packedMessage);
      formData.append('song', values.song);

      const uploadResult = await new Promise<{ id: string; slug: string }>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhrRef.current = xhr;

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setUploadProgress(Math.round((e.loaded / e.total) * 90)); // 0-90%
            }
          };

          xhr.onload = () => {
            setUploadProgress(100);
            try {
              const res = JSON.parse(xhr.responseText) as { id?: string; slug?: string; error?: string };
              if (xhr.status >= 200 && xhr.status < 300 && res.id) {
                resolve({ id: res.id, slug: res.slug || '' });
              } else {
                reject(new Error(res.error || `Upload failed (${xhr.status})`));
              }
            } catch {
              reject(new Error('Invalid server response'));
            }
          };

          xhr.onerror = () => reject(new Error('Network error. Please check your connection.'));
          xhr.onabort = () => reject(new Error('Upload cancelled'));
          xhr.open('POST', '/api/websites/create');
          xhr.send(formData);
        }
      );

      setUploadStage('Almost ready...');
      router.push(`/preview/${uploadResult.id}`);
    } catch (err) {
      console.error('Submit error:', err);
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setUploading(false);
      setUploadProgress(0);
      setUploadStage('');
    }
  };

  const cancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setUploading(false);
    setUploadProgress(0);
    setUploadStage('');
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '5rem 1.5rem 4rem' }}>
      {/* Header */}
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--color-text-tertiary)',
          fontSize: '0.8rem',
          textDecoration: 'none',
          marginBottom: '3rem',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
      >
        ← Home
      </Link>

      <div style={{ marginBottom: '3.5rem' }}>
        <span className="section-label" style={{ marginBottom: '1rem', display: 'block' }}>Create Birthday Website</span>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
          }}
        >
          Make them feel{' '}
          <em className="gold-text" style={{ fontStyle: 'italic' }}>
            extraordinary
          </em>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.9rem', fontSize: '0.92rem', lineHeight: 1.7, fontWeight: 300 }}>
          Fill in the details below. You can preview the website before paying.
        </p>
      </div>

      {/* Global form error */}
      <AnimatePresence>
        {formError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              background: 'var(--color-error-bg)',
              border: '1px solid rgba(224,85,85,0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.9rem 1.1rem',
              marginBottom: '1.5rem',
              color: 'var(--color-error)',
              fontSize: '0.85rem',
              fontWeight: 300,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <span>{formError}</span>
            <button
              type="button"
              onClick={() => setFormError(null)}
              style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: 0, flexShrink: 0 }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--color-border)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem' }}>
        {/* Section 1: Details */}
        <div style={{ padding: '2.25rem 2rem', background: 'var(--color-bg)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              fontWeight: 400,
              marginBottom: '1.75rem',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            The Details
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <label htmlFor="to_name" style={labelStyle}>
                Birthday Person&apos;s Name *
              </label>
              <input
                id="to_name"
                {...register('to_name')}
                placeholder="e.g. Sophia"
                style={{
                  ...inputStyle,
                  borderColor: errors.to_name ? 'rgba(224,85,85,0.5)' : 'rgba(255,255,255,0.07)',
                }}
                autoComplete="off"
              />
              {errors.to_name && <p style={errorStyle}>{errors.to_name.message}</p>}
            </div>
            <div>
              <label htmlFor="from_name" style={labelStyle}>
                Your Name *
              </label>
              <input
                id="from_name"
                {...register('from_name')}
                placeholder="e.g. Arjun"
                style={{
                  ...inputStyle,
                  borderColor: errors.from_name ? 'rgba(224,85,85,0.5)' : 'rgba(255,255,255,0.07)',
                }}
                autoComplete="off"
              />
              {errors.from_name && <p style={errorStyle}>{errors.from_name.message}</p>}
            </div>
            <div>
              <label htmlFor="relationship" style={labelStyle}>
                Relationship *
              </label>
              <select
                id="relationship"
                {...register('relationship')}
                style={{
                  ...inputStyle,
                  borderColor: errors.relationship ? 'rgba(224,85,85,0.5)' : 'rgba(255,255,255,0.07)',
                  background: 'rgba(5, 5, 5, 0.95)',
                  cursor: 'pointer',
                  color: 'var(--color-text-primary)'
                }}
              >
                <option value="girlfriend">Girlfriend</option>
                <option value="boyfriend">Boyfriend</option>
                <option value="bestfriend">Best Friend</option>
                <option value="husband">Husband</option>
                <option value="wife">Wife</option>
                <option value="mother">Mother</option>
                <option value="father">Father</option>
                <option value="brother">Brother</option>
                <option value="sister">Sister</option>
                <option value="son">Son</option>
                <option value="daughter">Daughter</option>
                <option value="other">Other</option>
              </select>
              {errors.relationship && <p style={errorStyle}>{errors.relationship.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="message" style={labelStyle}>
              Your Personal Message *
            </label>
            <textarea
              id="message"
              {...register('message')}
              placeholder="Write from the heart... Tell them what they mean to you, your favourite memories, what you wish for them."
              rows={5}
              style={{
                ...inputStyle,
                resize: 'vertical',
                lineHeight: 1.65,
                borderColor: errors.message ? 'rgba(224,85,85,0.5)' : 'rgba(255,255,255,0.07)',
                minHeight: '130px',
              }}
            />
            {errors.message && <p style={errorStyle}>{errors.message.message}</p>}
          </div>
        </div>

        {/* Section 2: Photos */}
        <div style={{ padding: '2.25rem 2rem', background: 'var(--color-bg)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              fontWeight: 400,
              marginBottom: '0.35rem',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            Photos *
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 300, marginBottom: '1.5rem' }}>
            Upload up to {MAX_PHOTOS} photos (max {MAX_PHOTO_SIZE_MB}MB each).
          </p>

          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => photoInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload photos"
            onKeyDown={(e) => e.key === 'Enter' && photoInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? 'var(--color-gold)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              cursor: photos.length >= MAX_PHOTOS ? 'not-allowed' : 'pointer',
              transition: 'border-color 0.22s, background 0.22s',
              background: dragging ? 'var(--color-gold-subtle)' : 'transparent',
              marginBottom: photoPreviews.length > 0 ? '1.25rem' : '0',
              opacity: photos.length >= MAX_PHOTOS ? 0.55 : 1,
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--color-gold-subtle)',
                border: '1px solid var(--color-border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.85rem',
                fontSize: '1.1rem',
              }}
            >
              ⬆
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: '0.3rem', fontWeight: 300 }}>
              {photos.length >= MAX_PHOTOS
                ? 'Maximum photos reached'
                : 'Drag & drop photos here, or click to browse'}
            </p>
            <p style={{ color: 'var(--color-gold)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              {photos.length}/{MAX_PHOTOS} photos
            </p>
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                addPhotos(e.target.files);
                e.target.value = '';
              }
            }}
            aria-label="Photo file input"
          />

          {/* Photo previews grid */}
          {photoPreviews.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                gap: '0.5rem',
              }}
            >
              {photoPreviews.map((src, i) => (
                <div
                  key={`preview-${i}`}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Photo ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                    aria-label={`Remove photo ${i + 1}`}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(5,5,5,0.75)',
                      color: 'var(--color-text-primary)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Video */}
        <div style={{ padding: '2.25rem 2rem', background: 'var(--color-bg)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              fontWeight: 400,
              marginBottom: '0.35rem',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            Video{' '}
            <span style={{ color: 'var(--color-text-tertiary)', fontSize: '1rem', fontWeight: 300 }}>
              (optional)
            </span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 300, marginBottom: '1.5rem' }}>
            Upload a personal video message — MP4, MOV or WebM, up to {MAX_VIDEO_SIZE_MB}MB.
          </p>

          {!video ? (
            <div
              onClick={() => videoInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload video"
              onKeyDown={(e) => e.key === 'Enter' && videoInputRef.current?.click()}
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.22s, background 0.22s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--color-gold-subtle)',
                  border: '1px solid var(--color-border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.85rem',
                  fontSize: '1.1rem',
                }}
              >
                ▶
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', fontWeight: 300 }}>Click to upload a video</p>
              <p style={{ color: 'var(--color-gold)', fontSize: '0.75rem', marginTop: '0.3rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                MP4 · MOV · WebM · Max {MAX_VIDEO_SIZE_MB}MB
              </p>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <VideoPlayer src={videoPreview!} isPreviewMode={true} />
              <button
                type="button"
                onClick={removeVideo}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(5,5,5,0.82)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '0.35rem 0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.76rem',
                  fontWeight: 500,
                  zIndex: 10,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                ✕ Remove
              </button>
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                {video.name} ({(video.size / 1024 / 1024).toFixed(1)}MB)
              </p>
            </div>
          )}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            style={{ display: 'none' }}
            onChange={handleVideoChange}
            aria-label="Video file input"
          />
        </div>

        {/* Section 4: Song */}
        <div style={{ padding: '2.25rem 2rem', background: 'var(--color-bg)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              fontWeight: 400,
              marginBottom: '0.35rem',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            Background Song *
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 300, marginBottom: '1.5rem' }}>
            Plays softly in the background when they open their website.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {SONG_OPTIONS.map((song) => {
              const isSelected = selectedSong === song.id;
              return (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => setValue('song', song.id, { shouldValidate: true })}
                  style={{
                    padding: '1rem 0.75rem',
                    background: isSelected ? 'var(--color-gold-subtle)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isSelected ? 'var(--color-gold)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    outline: isSelected ? '2px solid rgba(212,175,55,0.2)' : 'none',
                    outlineOffset: '2px',
                  }}
                >
                  <div style={{ color: isSelected ? 'var(--color-gold)' : 'var(--color-text-tertiary)', marginBottom: '0.6rem', display: 'flex', justifyContent: 'center' }}>
                    {renderSongIcon(song.id)}
                  </div>
                  <div
                    style={{
                      color: isSelected ? 'var(--color-gold)' : 'var(--color-text-tertiary)',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 500 : 400,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.04em',
                      transition: 'color 0.2s',
                    }}
                  >
                    {song.label}
                  </div>
                </button>
              );
            })}
          </div>
          {errors.song && <p style={errorStyle}>{errors.song.message}</p>}
        </div>

        {/* Upload Progress */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', padding: '1.5rem 2rem', background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}
            >
              <div
                style={{
                  background: 'var(--color-gold-subtle)',
                  border: '1px solid var(--color-border-gold)',
                  borderRadius: 'var(--radius)',
                  padding: '1.1rem 1.25rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.65rem',
                    gap: '1rem',
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-gold)', fontWeight: 500, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                    {uploadStage || 'Uploading...'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {uploadProgress}%
                    </span>
                    <button
                      type="button"
                      onClick={cancelUpload}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-tertiary)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        padding: '0 0.25rem',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--color-border)',
                    borderRadius: '4px',
                    height: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-light))',
                      height: '100%',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Submit Button */}

        <motion.button
          type="submit"
          disabled={uploading}
          whileHover={!uploading ? { opacity: 0.9, y: -1 } : {}}
          whileTap={!uploading ? { scale: 0.99 } : {}}
          className="btn-primary"
          style={{
            width: '100%',
            fontSize: '0.95rem',
            padding: '1.05rem',
            borderRadius: '12px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.55 : 1,
            pointerEvents: uploading ? 'none' : 'auto',
          }}
        >
          {uploading ? 'Uploading...' : 'Preview Website'}
        </motion.button>

        <p
          style={{
            textAlign: 'center',
            color: 'var(--color-text-tertiary)',
            fontSize: '0.72rem',
            marginTop: '1rem',
            lineHeight: 1.6,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em',
          }}
        >
          Free preview · No account needed · Pay ₹99 only to publish
        </p>
      </form>
    </div>
  );
}
