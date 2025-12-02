"use client";

import Image from "next/image";
import { useState } from "react";
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

  // Return null if there are no images
  if (!images || images.length === 0) return null;

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

  const handleImageClick = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  // Single image layout
  if (layout === 'single' || displayImages.length === 1) {
    const imageUrl = displayImages[0];
    const isResponsive = size === "responsive";
    const sizeStyle = isResponsive ? {} : (size ? { width: size.width, height: size.height } : {});
    const sizeClass = isResponsive ? "review-card-photo" : "";
    
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
            src={imageUrl}
            alt={alt}
            fill
            className={`object-cover ${imageClassName}`}
            sizes={size && typeof size !== 'string' ? `${size.width}px` : "100vw"}
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
  
  return (
    <>
      <div
        className={`flex items-start ${className}`}
        style={{ gap: gridGap, ...style }}
      >
        {displayImages.map((imageUrl, index) => (
          <div
            key={index}
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
            />
          </div>
        ))}
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