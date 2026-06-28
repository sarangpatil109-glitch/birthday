import { getSupabaseAdmin } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import BirthdayTemplate from '@/components/template/BirthdayTemplate';
import type { Metadata } from 'next';
import type { Website } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const admin = getSupabaseAdmin();

  const { data } = await admin
    .from('websites')
    .select('to_name, from_name')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!data) return { title: 'HeartNote' };

  return {
    title:       `Happy Birthday, ${data.to_name}! 🎂`,
    description: `A heartfelt birthday website created by ${data.from_name} for ${data.to_name}.`,
    openGraph: {
      title:       `Happy Birthday, ${data.to_name}! 🎂`,
      description: `A heartfelt birthday website created by ${data.from_name} for ${data.to_name}.`,
      type:        'website',
      url:         `https://heartnote.in/w/${slug}`,
    },
    twitter: {
      card:        'summary_large_image',
      title:       `Happy Birthday, ${data.to_name}! 🎂`,
      description: `A heartfelt birthday website created by ${data.from_name} for ${data.to_name}.`,
    },
  };
}

export default async function WebsitePage({ params }: Props) {
  const { slug } = await params;
  const admin = getSupabaseAdmin();

  const { data: website } = await admin
    .from('websites')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  // notFound() throws (typed as `never`), so TypeScript narrows website to non-null below
  if (!website) notFound();

  // Type the Supabase row to our interface — they match the DB schema exactly
  return (
    <main>
      <BirthdayTemplate website={website as Website} />
    </main>
  );
}
