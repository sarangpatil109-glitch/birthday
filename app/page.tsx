import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import PricingFAQ from '@/components/landing/PricingFAQ';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg-deep)', minHeight: '100vh' }}>
      <Hero />
      <div className="gold-divider" />
      <Features />
      <div className="gold-divider" />
      <HowItWorks />
      <div className="gold-divider" />
      <PricingFAQ />
      <Footer />
    </main>
  );
}
