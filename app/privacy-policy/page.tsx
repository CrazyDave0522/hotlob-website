import { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

import { ContentDetail } from '@/components/news/ContentDetail';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy | Hotlob',
    description: 'Read Hotlob\'s privacy policy to understand how we collect, use, and protect your personal information.',
  };
}

export default async function PrivacyPolicyPage() {
  const filePath = path.join(process.cwd(), 'public', 'legal-docs', 'privacy-policy.html');
  const htmlContent = await fs.readFile(filePath, 'utf8');

  return <ContentDetail htmlContent={htmlContent} title="Privacy Policy" />;
}