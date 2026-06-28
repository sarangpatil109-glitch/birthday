import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/w/'],
      disallow: ['/api/', '/preview/', '/success/'],
    },
    sitemap: 'https://heartnote.in/sitemap.xml',
  };
}
