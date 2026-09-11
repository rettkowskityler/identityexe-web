import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact a SailPoint Expert',
  description: 'Book a direct architecture consultation with Tyler, a SailPoint Expert Ambassador specializing in Identity Security Cloud and complex IIQ migrations.',
  alternates: {
    canonical: 'https://identityexe.com/contact',
  },
  openGraph: {
    title: 'Contact a SailPoint Expert | IdentityEXE',
    description: 'Book a direct architecture consultation with Tyler, a SailPoint Expert Ambassador.',
    url: 'https://identityexe.com/contact',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
