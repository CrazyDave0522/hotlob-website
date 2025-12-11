"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface ImageWithLightboxProps {
  images: string[]; // Image URL array
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  layout?: 'single' | 'grid'; // single or grid layout
  maxImages?: number; // maximum number of images to display
  size?: { width: number; height: number } | "responsive"; // fixed size or responsive
  highResTransform?: (url: string) => string; // high-res URL transformer
  gridGap?: string; // grid gap
  imageClassName?: string; // additional image className
}

export default function ImageWithLightbox({
  images,
  alt = "",
  className = "",
  style = {},
  layout = 'single',
  maxImages,
  size,
  highResTransform,
  gridGap = "10px",
  imageClassName = "",
}: ImageWithLightboxProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Visible images state (filters out broken images client-side)
  // NOTE: will be initialized after displayImages is computed below

  // Helper to generate a sessionStorage key for a photo
  const photoKey = useCallback((url: string) => {
    try {
      return `broken_photo_${encodeURIComponent(url)}`;
    } catch {
      return `broken_photo_${String(url)}`;
    }
  }, []);

  // (no early return here because hooks must be called in the same order)

  // Limit the number of displayed images
  const displayImages = maxImages ? images.slice(0, maxImages) : images;

  // Transform to high-resolution image URLs
  const highResImages = images.map(url => {
    if (highResTransform) {
      return highResTransform(url);
    }
    // Default high-res transform (for Google Places API)
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('maxWidthPx', '2000');
      return urlObj.toString();
    } catch {
      return url;
    }
  });

  // Initialize visibleImages using sessionStorage where available.
  const [visibleImages, setVisibleImages] = useState<string[]>(() => {
    try {
      const initial = (maxImages ? images.slice(0, maxImages) : images).filter((url) => {
        const key = photoKey(url);
        return !sessionStorage.getItem(key);
      });
      return initial;
    } catch {
      return (maxImages ? images.slice(0, maxImages) : images).slice();
    }
  });

  const handleImageClick = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  // Called when a specific image is detected as broken in the browser
  const markBroken = (url: string) => {
    try {
      sessionStorage.setItem(photoKey(url), '1');
    } catch {}
    setVisibleImages((prev) => prev.filter(u => u !== url));
  };

  // Single image layout
  if (layout === 'single' || displayImages.length === 1) {
    // use the first visible image; if none visible, return null (hide entirely)
    const imageUrl = visibleImages.length > 0 ? visibleImages[0] : null;
    const isResponsive = size === "responsive";
    const sizeStyle = isResponsive ? {} : (size ? { width: size.width, height: size.height } : {});
    const sizeClass = isResponsive ? "review-card-photo" : "";
    if (!imageUrl) return null;

    return (
      <>
        <div
          className={`button-click relative cursor-pointer transition-opacity hover:opacity-80 overflow-hidden rounded-[10px] ${className} ${sizeClass}`}
          style={{ ...sizeStyle, ...style }}
          onClick={() => handleImageClick(0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleImageClick(0);
            }
          }}
        >
          <Image
            src={imageUrl as string}
            alt={alt}
            fill
            className={`object-cover ${imageClassName}`}
            sizes={size && typeof size !== 'string' ? `${size.width}px` : "100vw"}
            onError={() => markBroken(imageUrl as string)}
          />
        </div>

        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={photoIndex}
          slides={highResImages.map(url => ({ src: url }))}
          carousel={{ finite: true }}
        />
      </>
    );
  }

  // Grid layout (multiple images)
  const isResponsive = size === "responsive";
  const sizeStyle = isResponsive ? {} : (size ? { width: size.width, height: size.height, flexShrink: 0 } : {});
  const sizeClass = isResponsive ? "review-card-photo" : "";
  
  // Filter highResImages to correspond to visibleImages order
  const visibleHighRes = visibleImages.map((url) => {
    // find corresponding highRes image by original index
    const idx = images.indexOf(url);
    return idx >= 0 ? highResImages[idx] : url;
  });

  return (
    <>
      <div
        className={`flex items-start ${className}`}
        style={{ gap: gridGap, ...style }}
      >
        {visibleImages.map((imageUrl, index) => (
          <div
            key={imageUrl}
            className={`relative cursor-pointer transition-opacity hover:opacity-80 overflow-hidden rounded-[10px] ${imageClassName} ${sizeClass}`}
            style={sizeStyle}
            onClick={() => handleImageClick(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleImageClick(index);
              }
            }}
          >
            <Image
              src={imageUrl}
              alt={`${alt} - Photo ${index + 1}`}
              fill
              className="object-cover"
              sizes={size && typeof size !== 'string' ? `${size.width}px` : "100vw"}
              onError={() => markBroken(imageUrl)}
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={photoIndex}
        slides={visibleHighRes.map(url => ({ src: url }))}
        carousel={{ finite: true }}
      />
    </>
  );
}