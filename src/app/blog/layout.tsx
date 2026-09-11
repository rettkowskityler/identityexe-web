import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SailPoint Engineering Insights & Architecture Blueprints',
  description: 'Deep architectural breakdowns, custom workflow templates, and Identity Security Cloud implementations written by a SailPoint Expert Ambassador.',
  alternates: {
    canonical: 'https://identityexe.com/blog',
  },
  openGraph: {
    title: 'SailPoint Engineering Insights & Architecture Blueprints | IdentityEXE',
    description: 'Deep architectural breakdowns, custom workflow templates, and Identity Security Cloud implementations written by a SailPoint Expert Ambassador.',
    url: 'https://identityexe.com/blog',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
