import { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

import { ContentDetail } from '@/components/news/ContentDetail';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms & Conditions | Hotlob',
    description: 'Read Hotlob\'s terms and conditions to understand the rules and guidelines for using our services.',
  };
}

export default async function TermsAndConditionsPage() {
  const filePath = path.join(process.cwd(), 'public', 'legal-docs', 'terms-and-conditions.html');
  const htmlContent = await fs.readFile(filePath, 'utf8');

  return <ContentDetail htmlContent={htmlContent} title="Terms & Conditions" />;
}