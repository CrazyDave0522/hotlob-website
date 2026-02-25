import Image from "next/image";

import type { NewsArticle } from "@/types/news";
import { EditorJSRenderer } from "./EditorJSRenderer";

interface ContentDetailProps {
  news?: NewsArticle;
  htmlContent?: string;
  title?: string;
}

export function ContentDetail({ news, htmlContent, title }: ContentDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // If htmlContent is provided, render legal content
  if (htmlContent) {
    return (
      <section>
        <div className="ContentDetail-wrapper">
          {title && <h1 className="ContentDetail-title">{title}</h1>}
          <div 
            className="ContentDetail-content ContentDetail-content--html"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </section>
    );
  }

  // Otherwise render news content (existing behavior)
  if (!news) return null;

  return (
    <section>
      <div className="ContentDetail-wrapper">
        <h1 className="ContentDetail-title">{news.title}</h1>
        <div className="ContentDetail-meta">
          {news.author && <span className="ContentDetail-author">By {news.author}</span>}
          <time className="ContentDetail-date" dateTime={news.publish_date}>
            {formatDate(news.publish_date)}
          </time>
        </div>
        <hr className="ContentDetail-separator" />

        <div className="ContentDetail-image-container">
          <Image
            className="ContentDetail-image"
            src={news.cover_image_url}
            alt={news.title}
            width={900}
            height={420}
            priority
            sizes="(max-width: 768px) 100vw, 900px"
          />
        </div>

        <div className="ContentDetail-content">
          <EditorJSRenderer content={news.content} />
        </div>
      </div>
    </section>
  );
}