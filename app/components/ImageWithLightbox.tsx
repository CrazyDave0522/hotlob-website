"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface ImageWithLightboxProps {
  images: string[]; // 图片 URL 数组
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  layout?: 'single' | 'grid'; // 单张 or 网格布局
  maxImages?: number; // 最多显示几张图片
  size?: { width: number; height: number }; // 图片尺寸
  highResTransform?: (url: string) => string; // 高分辨率转换函数
  gridGap?: string; // 网格布局时的间距
  imageClassName?: string; // 图片的额外类名
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

  // 如果没有图片，返回空
  if (!images || images.length === 0) return null;

  // 限制显示的图片数量
  const displayImages = maxImages ? images.slice(0, maxImages) : images;

  // 转换高分辨率图片
  const highResImages = images.map(url => {
    if (highResTransform) {
      return highResTransform(url);
    }
    // 默认高分辨率转换（针对 Google Places API）
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

  // 单张图片布局
  if (layout === 'single' || displayImages.length === 1) {
    const imageUrl = displayImages[0];
    return (
      <>
        <div
          className={`relative cursor-pointer transition-opacity hover:opacity-80 ${className}`}
          style={size ? { width: size.width, height: size.height, ...style } : style}
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
            {...(size ? {
              width: size.width,
              height: size.height
            } : {
              fill: true
            })}
            className={`object-cover ${imageClassName}`}
            sizes={size ? `${size.width}px` : "100vw"}
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

  // 网格布局（多张图片）
  return (
    <>
      <div
        className={`flex items-start ${className}`}
        style={{ gap: gridGap, ...style }}
      >
        {displayImages.map((imageUrl, index) => (
          <div
            key={index}
            className={`relative cursor-pointer transition-opacity hover:opacity-80 ${imageClassName}`}
            style={size ? { width: size.width, height: size.height, flexShrink: 0 } : {}}
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
              {...(size ? {
                width: size.width,
                height: size.height
              } : {
                fill: true
              })}
              className="object-cover rounded-[10px]"
              sizes={size ? `${size.width}px` : "100vw"}
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