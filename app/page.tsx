'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchHero from '@/components/landing/SearchHero';
import CategoriesGrid from '@/components/landing/CategoriesGrid';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import DynamicStats from '@/components/landing/DynamicStats';
import RecentDocuments from '@/components/landing/RecentDocuments';
import TrustSection from '@/components/landing/TrustSection';
import CTASection from '@/components/landing/CTASection';
import AnnouncementBanner from '@/components/ui/AnnouncementBanner';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <AnnouncementBanner />
      <Navbar />
      <main>
        <SearchHero />
        <CategoriesGrid />
        <FeaturesSection />
        <HowItWorksSection />
        <DynamicStats />
        <RecentDocuments />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
