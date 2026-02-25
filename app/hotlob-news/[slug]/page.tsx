import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { fetchNewsBySlug } from '@/lib/news';
import { ContentDetail } from '@/components/news/ContentDetail';

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await fetchNewsBySlug(slug);

  if (!news) {
    return {
      title: 'News Not Found | Hotlob',
    };
  }

  return {
    title: `${news.title} | Hotlob News`,
    description: news.excerpt || `Read ${news.title} on Hotlob News`,
    openGraph: {
      title: news.title,
      description: news.excerpt || `Read ${news.title} on Hotlob News`,
      images: [news.cover_image_url],
      url: `https://hotlob.com/hotlob-news/${news.slug}`,
      type: 'article',
      publishedTime: news.publish_date,
      modifiedTime: news.updated_at,
      authors: news.author ? [news.author] : [],
      siteName: 'Hotlob',
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.excerpt || `Read ${news.title} on Hotlob News`,
      images: [news.cover_image_url],
      site: '@hotlob',
    },
    other: {
      'article:published_time': news.publish_date,
      'article:modified_time': news.updated_at,
      'article:author': news.author || '',
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = await fetchNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.excerpt || `Read ${news.title} on Hotlob News`,
    image: [news.cover_image_url],
    datePublished: news.publish_date,
    dateModified: news.updated_at,
    author: {
      '@type': 'Person',
      name: news.author || 'Hotlob Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hotlob',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hotlob.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://hotlob.com/hotlob-news/${news.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentDetail news={news} />
    </>
  );
}

export async function generateStaticParams() {
  // For ISR, we could pre-generate some popular articles
  // For now, we'll use dynamic generation
  return [];
}