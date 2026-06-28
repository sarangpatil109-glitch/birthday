import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { generateSlug } from '@/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { to_name?: unknown; from_name?: unknown };

    // Sanitise inputs — these are stored on the draft but updated again in /create
    const to_name   = (typeof body.to_name   === 'string' ? body.to_name   : '').trim().slice(0, 100);
    const from_name = (typeof body.from_name === 'string' ? body.from_name : '').trim().slice(0, 100);

    const admin = getSupabaseAdmin();

    // Generate a unique slug (collision-safe, 10 attempts)
    let slug = generateSlug();
    for (let i = 0; i < 10; i++) {
      const { data } = await admin
        .from('websites')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (!data) break;
      slug = generateSlug();
    }

    const { data, error } = await admin
      .from('websites')
      .insert({
        slug,
        to_name,
        from_name,
        message: '',
        photos: [],
        video: null,
        song: 'piano',
        status: 'draft',
      })
      .select('id, slug')
      .single();

    if (error) {
      console.error('Draft insert error:', error);
      throw new Error(error.message);
    }

    return NextResponse.json({ id: data.id, slug: data.slug });
  } catch (err) {
    console.error('Draft error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create draft' },
      { status: 500 }
    );
  }
}
