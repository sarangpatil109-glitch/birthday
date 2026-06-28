import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import CTABanner from '@/components/landing/CTABanner';
import PricingFAQ from '@/components/landing/PricingFAQ';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <div id="features" style={{ scrollMarginTop: '60px' }}>
        <Features />
      </div>
      <div className="gold-divider" />
      <div id="how-it-works" style={{ scrollMarginTop: '60px' }}>
        <HowItWorks />
      </div>
      <div className="gold-divider" />
      <Testimonials />
      <div className="gold-divider" />
      <CTABanner />
      <div className="gold-divider" />
      <div id="pricing" style={{ scrollMarginTop: '60px' }}>
        <PricingFAQ />
      </div>
      <Footer />
    </main>
  );
}
