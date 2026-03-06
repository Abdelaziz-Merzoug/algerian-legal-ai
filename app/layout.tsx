'use client';

import { useEffect, useState } from 'react';
import { Cairo } from 'next/font/google';
import { useLanguageStore } from '@/stores/language-store';
import ToastProvider from '@/components/ui/ToastProvider';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-cairo',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, direction, hydrate } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  // Prevent hydration mismatch by using default values until mounted
  const lang = mounted ? language : 'ar';
  const dir = mounted ? direction : 'rtl';

  return (
    <html lang={lang} dir={dir} className={cairo.variable} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>المستشار القانوني الجزائري | Algerian Legal AI</title>
        <meta
          name="description"
          content="المستشار القانوني الجزائري — مساعدك الذكي للاستشارات القانونية المبنية على النصوص القانونية الجزائرية. Algerian Legal AI Assistant — your smart guide to Algerian law."
        />
        <meta name="keywords" content="Algerian law, قانون جزائري, legal AI, مستشار قانوني, consultation, استشارة, Algeria, الجزائر" />
        <meta name="author" content="Algerian Legal AI" />
        <meta name="theme-color" content="#0a1628" />
        <meta name="color-scheme" content="dark" />
        <meta property="og:title" content="المستشار القانوني الجزائري | Algerian Legal AI" />
        <meta property="og:description" content="Get instant legal consultations based on real Algerian legal texts using AI" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_DZ" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Algerian Legal AI Assistant" />
        <meta name="twitter:description" content="Smart AI-powered legal consultations based on Algerian law" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚖️</text></svg>" />
      </head>
      <body
        className={`${cairo.className} antialiased flex flex-col min-h-screen`}
        style={{ fontFamily: 'var(--font-cairo)' }}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
