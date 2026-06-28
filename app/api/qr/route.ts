import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

// Only generate QR codes for trusted HeartNote URLs to prevent SSRF misuse
const ALLOWED_HOSTS = new Set([
  'heartnote.in',
  'www.heartnote.in',
  'localhost',
  '127.0.0.1',
]);

function isAllowedUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    // Allow any Vercel preview URLs for heartnote.in project
    if (parsed.hostname.endsWith('.vercel.app')) return true;
    return ALLOWED_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
  }

  try {
    const dataUrl = await QRCode.toDataURL(url, {
      type: 'image/png',
      width: 400,
      margin: 2,
      color: {
        dark: '#C9A96E',
        light: '#080810',
      },
      errorCorrectionLevel: 'M',
    });

    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    const bytes  = Buffer.from(base64, 'base64');
    const uint8  = new Uint8Array(bytes);

    return new NextResponse(uint8, {
      headers: {
        'Content-Type':   'image/png',
        'Content-Length': uint8.byteLength.toString(),
        'Cache-Control':  'public, max-age=86400, immutable',
      },
    });
  } catch (err) {
    console.error('QR generation error:', err);
    return NextResponse.json({ error: 'QR generation failed' }, { status: 500 });
  }
}
