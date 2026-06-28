import { Suspense } from 'react';
import PreviewClient from './PreviewClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preview Your Birthday Website — HeartNote',
  description: 'Preview your birthday website before publishing.',
  robots: { index: false, follow: false },
};

function LoadingFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-deep)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌙</div>
        <div
          style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}
        >
          Loading your website...
        </div>
      </div>
    </div>
  );
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PreviewClient websiteId={id} />
    </Suspense>
  );
}
