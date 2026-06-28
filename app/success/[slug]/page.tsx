import SuccessClient from './SuccessClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '🎉 Birthday Website Published! — HeartNote',
  description: 'Your birthday website is live. Share the link and make their day special.',
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Resolve the base URL on the server so the client component
  // receives the correct value without needing a client-side effect.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'https://heartnote.in';

  return <SuccessClient slug={slug} baseUrl={baseUrl} />;
}
