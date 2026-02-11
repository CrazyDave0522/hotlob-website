import Image from "next/image";
import Link from "next/link";

import type { NewsListItem } from "@/types/news";

interface NewsItemProps {
  news: NewsListItem;
}

export function NewsItem({ news }: NewsItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link
      href={`/hotlob-news/${news.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="NewsItem"
    >
      <article className="NewsItem-wrapper">
        <div className="NewsItem-image-container">
          <Image
            className="NewsItem-image"
            src={news.cover_image_url}
            alt={news.title}
            width={280}
            height={160}
            sizes="(max-width: 768px) 200px, 280px"
          />
        </div>
        <div className="NewsItem-content">
          <h3 className="NewsItem-title">{news.title}</h3>
          {news.excerpt && (
            <p className="NewsItem-excerpt">{news.excerpt}</p>
          )}
          <div className="NewsItem-meta">
            <span className="NewsItem-date">{formatDate(news.publish_date)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}