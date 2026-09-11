import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workflow Scope Analyzer (SailPoint PAT Least Privilege Tool)',
  description: 'Free developer utility: upload your SailPoint ISC workflow JSON to instantly calculate the exact HTTP action API scopes required for your Personal Access Tokens (PAT).',
  alternates: {
    canonical: 'https://identityexe.com/tools/workflow-scope-analyzer',
  },
  openGraph: {
    title: 'Workflow Scope Analyzer (SailPoint PAT Least Privilege Tool) | IdentityEXE',
    description: 'Calculate least-privilege Personal Access Token (PAT) API scopes for SailPoint ISC Workflows.',
    url: 'https://identityexe.com/tools/workflow-scope-analyzer',
    type: 'website',
  },
};

export default function WorkflowScopeAnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
