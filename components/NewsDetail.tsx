import Image from "next/image";

import type { NewsArticle } from "@/types/news";
import { EditorJSRenderer } from "./EditorJSRenderer";

interface NewsDetailProps {
  news: NewsArticle;
}

export function NewsDetail({ news }: NewsDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section>
      <div className="NewsDetail-wrapper">
        <h1 className="NewsDetail-title">{news.title}</h1>
        <div className="NewsDetail-meta">
          {news.author && <span className="NewsDetail-author">By {news.author}</span>}
          <time className="NewsDetail-date" dateTime={news.publish_date}>
            {formatDate(news.publish_date)}
          </time>
        </div>
        <hr className="NewsDetail-separator" />

        <div className="NewsDetail-image-container">
          <Image
            className="NewsDetail-image"
            src={news.cover_image_url}
            alt={news.title}
            width={900}
            height={420}
            priority
            sizes="(max-width: 768px) 100vw, 900px"
          />
        </div>

        <div className="NewsDetail-content">
          <EditorJSRenderer content={news.content} />
        </div>
      </div>
    </section>
  );
}