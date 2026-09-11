import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://identityexe.com'),
  title: {
    default: 'IdentityEXE | SailPoint Cloud Architecture & Performance Consulting',
    template: '%s | IdentityEXE',
  },
  description: 'Premier SailPoint Identity Security Cloud implementation and architecture consultancy specializing in complex workflows, forms, and IIQ migrations.',
  keywords: ['SailPoint', 'Identity Security Cloud', 'SailPoint ISC', 'IdentityIQ', 'IAM Consulting', 'SailPoint Expert Ambassador', 'Cybersecurity', 'Identity Governance', 'SailPoint Workflows'],
  alternates: {
    canonical: 'https://identityexe.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'IdentityEXE | SailPoint Performance Consulting',
    description: 'Premier direct-to-client SailPoint Identity Security Cloud consultancy specializing in IIQ migrations.',
    type: 'website',
    locale: 'en_US',
    url: 'https://identityexe.com',
    siteName: 'IdentityEXE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IdentityEXE | SailPoint Performance Consulting',
    description: 'Uncompromised identity ecosystems built by a SailPoint Expert Ambassador.',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,600;1,700;1,800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col text-slate-200 selection:bg-blue-500/30" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
