import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';

// 60s is the max on Vercel Hobby; upgrade to Pro for longer video uploads.
export const maxDuration = 60;

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

// Allowed video MIME types
const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/quicktime',
  'video/webm',
]);

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;   // 5 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_PHOTOS = 10;

async function uploadToSupabase(
  buffer: Buffer,
  path: string,
  bucket: string,
  contentType: string
): Promise<string> {
  const admin = getSupabaseAdmin();
  const { error } = await admin.storage
    .from(bucket)
    .upload(path, buffer, { contentType, upsert: false });

  if (error) throw new Error(`Upload to ${bucket} failed: ${error.message}`);

  const { data } = admin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const websiteId = (formData.get('websiteId') as string | null)?.trim();
    const to_name   = ((formData.get('to_name')   as string | null) ?? '').trim().slice(0, 100);
    const from_name = ((formData.get('from_name') as string | null) ?? '').trim().slice(0, 100);
    const message   = ((formData.get('message')   as string | null) ?? '').trim().slice(0, 2000);
    const song      = ((formData.get('song')       as string | null) ?? 'piano').trim().slice(0, 50);

    if (!websiteId) {
      return NextResponse.json({ error: 'Missing website ID' }, { status: 400 });
    }

    // Basic UUID format check to avoid unnecessary DB calls
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(websiteId)) {
      return NextResponse.json({ error: 'Invalid website ID' }, { status: 400 });
    }

    // Upload photos
    const photoFiles = formData.getAll('photos') as File[];
    if (photoFiles.length > MAX_PHOTOS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_PHOTOS} photos allowed` },
        { status: 400 }
      );
    }

    const photoUrls: string[] = [];
    for (const file of photoFiles) {
      if (!file || file.size === 0) continue;

      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: `Invalid image type: ${file.type}` },
          { status: 400 }
        );
      }
      if (file.size > MAX_PHOTO_BYTES) {
        return NextResponse.json(
          { error: `Photo "${file.name}" exceeds 5MB limit` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
      const safePath = `${websiteId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const url = await uploadToSupabase(buffer, safePath, 'photos', file.type);
      photoUrls.push(url);
    }

    // Upload video (optional)
    let videoUrl: string | null = null;
    const videoFile = formData.get('video') as File | null;
    if (videoFile && videoFile.size > 0) {
      if (!ALLOWED_VIDEO_TYPES.has(videoFile.type)) {
        return NextResponse.json(
          { error: `Invalid video type: ${videoFile.type}` },
          { status: 400 }
        );
      }
      if (videoFile.size > MAX_VIDEO_BYTES) {
        return NextResponse.json(
          { error: 'Video exceeds 100MB limit' },
          { status: 400 }
        );
      }

      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = (videoFile.name.split('.').pop() ?? 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '');
      const safePath = `${websiteId}/${Date.now()}.${ext}`;
      videoUrl = await uploadToSupabase(buffer, safePath, 'videos', videoFile.type);
    }

    // Update the draft record with all content
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('websites')
      .update({
        to_name,
        from_name,
        message,
        photos: photoUrls,
        video: videoUrl,
        song,
        updated_at: new Date().toISOString(),
      })
      .eq('id', websiteId)
      .select('id, slug')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(error.message);
    }

    return NextResponse.json({ id: data.id, slug: data.slug });
  } catch (err) {
    console.error('Create website error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create website' },
      { status: 500 }
    );
  }
}
