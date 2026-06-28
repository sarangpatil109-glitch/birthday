import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HeartNote — Premium Birthday Websites',
  description: 'Create a cinematic, heartfelt birthday website for someone you love.',
  openGraph: {
    title:       'HeartNote — Premium Birthday Websites',
    description: 'Create a cinematic, heartfelt birthday website for someone you love.',
    type:        'website',
    url:         'https://heartnote.in',
    siteName:    'HeartNote',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'HeartNote — Premium Birthday Websites',
    description: 'Create a cinematic, heartfelt birthday website for someone you love.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#050505',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Mrs+Saint+Delafield&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
