import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Emlak Serkan | Arsa, Ev, Villa Satış',
    template: '%s | Emlak Serkan',
  },
  description:
    'Çatalca, Silivri, Kocaeli, Tekirdağ ve çevresinde arsa, ev, villa ve tarla satışı. Güvenilir emlak danışmanlığı. Serkan Güner ile hayalinizdeki mülkü bulun.',
  keywords: [
    'emlak',
    'arsa',
    'ev',
    'villa',
    'tarla',
    'satılık',
    'Çatalca',
    'Silivri',
    'Kocaeli',
    'Tekirdağ',
    'Kapaklı',
    'emlak serkan',
    'Serkan Güner',
  ],
  authors: [{ name: 'Emlak Serkan' }],
  creator: 'Emlak Serkan',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Emlak Serkan',
    title: 'Emlak Serkan | Arsa, Ev, Villa Satış',
    description:
      'Çatalca, Silivri, Kocaeli, Tekirdağ ve çevresinde arsa, ev, villa ve tarla satışı.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
