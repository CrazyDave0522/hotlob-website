"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { NewsCarouselItemProps } from "@/types/carousel";
import {
  getDesktopImageSize,
  getMobileImageSize,
  getDesktopTitleFontSize,
  getMobileTitleFontSize,
  getDesktopExcerptFontSize,
  getMobileExcerptFontSize,
} from "@/utils/carousel-sizing";

/**
 * NewsCarouselItem - Individual carousel item component
 *
 * Displays a news article with responsive image sizing, typography scaling,
 * and click handling that opens the article in a new tab.
 *
 * @param props - Component props
 * @param props.newsItem - The news article data to display
 *
 * @example
 * ```tsx
 * import { NewsCarouselItem } from '@/components/NewsCarouselItem';
 * import type { NewsListItem } from '@/types/news';
 *
 * const newsItem: NewsListItem = {
 *   id: '1',
 *   title: 'Breaking News Story',
 *   excerpt: 'This is a summary of the news article...',
 *   imageUrl: '/images/news/breaking-news.jpg',
 *   url: 'https://example.com/news/breaking-news'
 * };
 *
 * return <NewsCarouselItem newsItem={newsItem} />;
 * ```
 */
export function NewsCarouselItem({ newsItem }: NewsCarouselItemProps) {
  const [viewportWidth, setViewportWidth] = useState(768); // Default to desktop
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setIsDesktop(width >= 768);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const imageSize = isDesktop
    ? getDesktopImageSize(viewportWidth)
    : getMobileImageSize(viewportWidth);

  const titleFontSize = isDesktop
    ? getDesktopTitleFontSize(viewportWidth)
    : getMobileTitleFontSize(viewportWidth);

  const excerptFontSize = isDesktop
    ? getDesktopExcerptFontSize(viewportWidth)
    : getMobileExcerptFontSize(viewportWidth);

  const handleClick = () => {
    window.open(`/hotlob-news/${newsItem.slug}`, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={`news-carousel-item ${isDesktop ? "desktop-layout" : "mobile-layout"}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Read news article: ${newsItem.title}`}
    >
      <div className="news-carousel-image">
        <Image
          src={newsItem.cover_image_url}
          alt={newsItem.title}
          width={imageSize.width}
          height={imageSize.height}
          style={{
            width: `${imageSize.width}px`,
            height: `${imageSize.height}px`,
          }}
        />
      </div>
      <div className="news-carousel-content">
        <h3
          className="news-carousel-title"
          style={{ fontSize: `${titleFontSize}px` }}
        >
          {newsItem.title}
        </h3>
        {newsItem.excerpt && (
          <p
            className="news-carousel-excerpt"
            style={{ fontSize: `${excerptFontSize}px` }}
          >
            {newsItem.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
