import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IdentityEXE | SailPoint Performance Consulting',
  description: 'Premier direct-to-client SailPoint Identity Security Cloud and SailPoint IdentityIQ consultancy creating uncompromised identity ecosystems.',
  keywords: ['SailPoint', 'Identity Security Cloud', 'IdentityIQ', 'IAM Consulting', 'SailPoint Expert Ambassador', 'Cybersecurity', 'Identity Governance'],
  openGraph: {
    title: 'IdentityEXE | SailPoint Performance Consulting',
    description: 'Premier direct-to-client SailPoint Identity Security Cloud and SailPoint IdentityIQ consultancy.',
    type: 'website',
    locale: 'en_US',
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
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col text-slate-200 selection:bg-blue-500/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
