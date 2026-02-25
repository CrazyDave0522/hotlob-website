"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CarouselIndicator } from "@/components/carousel/CarouselIndicator";
import { Store } from "lucide-react";
import ImageLightbox from "./ImageLightbox";
import "@/styles/components/store/store-image-carousel.css";

interface StoreImageCarouselProps {
  photos: Array<{ photo_url: string; display_order: number }>;
  storeName: string;
}

/**
 * StoreImageCarousel - A carousel component for displaying store images
 *
 * Features:
 * - Displays store photos in a carousel format
 * - Shows Store icon placeholder when no images available
 * - Maintains specified aspect ratio
 * - Auto-advance every 3 seconds (pauses on hover/focus/user interaction)
 * - Navigation with indicator dots
 * - Touch-friendly for mobile
 */
export function StoreImageCarousel({
  photos,
  storeName,
}: StoreImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sort photos by display_order
  const sortedPhotos = [...photos].sort(
    (a, b) => a.display_order - b.display_order,
  );
  const hasImages = sortedPhotos.length > 0;
  const hasMultipleImages = sortedPhotos.length > 1;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Pause auto-play on user interaction
  const handleUserInteraction = useCallback(() => {
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === sortedPhotos.length - 1 ? 0 : prevIndex + 1,
    );
    handleUserInteraction();
  }, [sortedPhotos.length, handleUserInteraction]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      handleUserInteraction();
    },
    [handleUserInteraction],
  );

  // Auto-advance functionality
  useEffect(() => {
    if (!hasMultipleImages || !isAutoPlaying) return;

    const interval = setInterval(() => {
      goToNext();
    }, 3000); // Advance every 3 seconds

    return () => clearInterval(interval);
  }, [goToNext, hasMultipleImages, isAutoPlaying]);

  if (!hasImages) {
    // Show placeholder with Store icon
    return (
      <div
        className="store-image-carousel store-image-carousel-placeholder"
        data-testid="store-image-carousel"
      >
        <div className="store-image-carousel-content">
          <Store size={48} className="store-image-carousel-icon" />
          <span className="store-image-carousel-placeholder-text">
            No images available
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="store-image-carousel"
      data-testid="store-image-carousel"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onFocus={() => setIsAutoPlaying(false)}
      onBlur={() => setIsAutoPlaying(true)}
    >
      <div className="store-image-carousel-container">
        {sortedPhotos.map((photo, index) => (
          <div
            key={index}
            className={`store-image-carousel-slide ${
              index === currentIndex ? "active" : ""
            }`}
            aria-hidden={index !== currentIndex}
            role="button"
            tabIndex={0}
            onClick={() => {
              setLightboxIndex(index);
              setLightboxOpen(true);
              handleUserInteraction();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setLightboxIndex(index);
                setLightboxOpen(true);
                handleUserInteraction();
              }
            }}
          >
            <Image
              src={photo.photo_url}
              alt={`${storeName} store photo ${index + 1}`}
              fill
              className="store-image-carousel-image"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {hasMultipleImages && (
        <div className="store-image-carousel-indicators">
          <CarouselIndicator
            total={sortedPhotos.length}
            current={currentIndex}
            onClick={goToSlide}
          />
        </div>
      )}

      {lightboxOpen && (
        <ImageLightbox
          images={sortedPhotos.map((p) => p.photo_url)}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
