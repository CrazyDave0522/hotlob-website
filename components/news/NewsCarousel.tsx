"use client";

import { useState, useEffect, useCallback } from "react";
import { NewsCarouselProps } from "@/types/carousel";
import { NewsCarouselItem } from "./NewsCarouselItem";
import { CarouselIndicator } from "@/components/carousel/CarouselIndicator";

/**
 * NewsCarousel - A responsive carousel component for displaying news articles
 *
 * Features:
 * - Responsive layouts (desktop left-right, mobile top-bottom)
 * - Looping navigation with swipe gestures and indicator dots
 * - Auto-advance every 3 seconds (pauses on hover/focus/user interaction)
 * - Clickable items that open news articles in new tabs
 * - Conditional UI (no indicators for single items)
 * - Keyboard navigation support
 * - Accessibility features (ARIA labels, focus management)
 *
 * @param props - Component props
 * @param props.news - Array of news items to display (max 5)
 *
 * @examples
 * ```tsx
 * import { NewsCarousel } from '@/components/news/NewsCarousel';
 * import { fetchNewsListItems } from '@/lib/news';
 *
 * // In an async component
 * const newsItems = await fetchNewsListItems(5);
 *
 * return (
 *   <section>
 *     <h2>Latest News</h2>
 *     <NewsCarousel news={newsItems} />
 *   </section>
 * );
 * ```
 */
export function NewsCarousel({ news }: NewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Limit to 5 items max
  const displayNews = news?.slice(0, 5) || [];
  const hasMultipleItems = displayNews.length > 1;

  // Pause auto-play on user interaction
  const handleUserInteraction = useCallback(() => {
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === displayNews.length - 1 ? 0 : prevIndex + 1,
    );
    handleUserInteraction();
  }, [displayNews.length, handleUserInteraction]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayNews.length - 1 : prevIndex - 1,
    );
    handleUserInteraction();
  }, [displayNews.length, handleUserInteraction]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      handleUserInteraction();
    },
    [handleUserInteraction],
  );

  // Handle swipe gestures for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  // Auto-advance functionality
  useEffect(() => {
    if (!hasMultipleItems || !isAutoPlaying) return;

    const interval = setInterval(() => {
      goToNext();
    }, 3000); // Advance every 3 seconds

    return () => clearInterval(interval);
  }, [goToNext, hasMultipleItems, isAutoPlaying]);

  // Don't render if no news data
  if (!news || news.length === 0) {
    return null;
  }

  return (
    <div
      className="news-carousel"
      role="region"
      aria-label="News carousel"
      aria-live="polite"
      tabIndex={0}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onFocus={() => setIsAutoPlaying(false)}
      onBlur={() => setIsAutoPlaying(true)}
    >
      <div className="news-carousel-container">
        <div
          className="news-carousel-track"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {displayNews.map((newsItem) => (
            <NewsCarouselItem
              key={newsItem.id}
              newsItem={newsItem}
              // pass index to help with any focus/aria needs in tests
            />
          ))}
        </div>

        {/* Indicators - only show with multiple items */}
        {hasMultipleItems && (
          <CarouselIndicator
            total={displayNews.length}
            current={currentIndex}
            onClick={goToSlide}
          />
        )}
      </div>
    </div>
  );
}
