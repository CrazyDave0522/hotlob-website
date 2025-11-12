// app/our-locations/components/reviews/ReviewCard.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import RatingStars from "../rating-stars";

export interface ReviewItem {
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  review_text: string;
  photos?: string[]; // Array of photo URLs (max 5)
}

export default function ReviewCard({ author_name, author_photo_url, rating, review_text, photos }: ReviewItem) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Convert photo URLs to high-res versions for lightbox using URL parsing
  const highResPhotos = photos?.map(url => {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('maxWidthPx', '2000');
      return urlObj.toString();
    } catch {
      // Fallback if URL parsing fails
      return url;
    }
  }) || [];

  const handlePhotoClick = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };
  return (
    <div className="flex items-start gap-[13px] self-stretch">
      {/* Avatar */}
      {author_photo_url ? (
        <Image
          src={author_photo_url}
          alt={author_name}
          width={50}
          height={50}
          className="rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-[50px] h-[50px] rounded-full bg-gray-300 shrink-0" />
      )}

      {/* Content */}
      <div className="flex-1">
        <span className="text-black text-[20px] font-semibold uppercase">
          {author_name}
        </span>
        <div className="mt-2.5">
          <RatingStars rating={rating} />
        </div>
        <p className="text-[#4E5969] text-[18px] font-normal leading-normal mt-2 pb-[30px]">
          {review_text}
        </p>

        {/* Photos Section */}
        {photos && photos.length > 0 && (
          <>
            <div className="border-b border-[#E1E4E9]" />
            <div className="pt-[30px] flex gap-[30px] flex-wrap">
              {photos.map((photoUrl, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer transition-opacity hover:opacity-80"
                  style={{
                    width: '212px',
                    height: '141px',
                  }}
                  onClick={() => handlePhotoClick(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handlePhotoClick(index);
                    }
                  }}
                >
                  <Image
                    src={photoUrl}
                    alt={`Photo ${index + 1} by ${author_name}`}
                    fill
                    className="object-cover rounded-[10px]"
                    sizes="212px"
                  />
                </div>
              ))}
            </div>

            {/* Lightbox */}
            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              index={photoIndex}
              slides={highResPhotos.map(url => ({ src: url }))}
              carousel={{ finite: true }}
            />
          </>
        )}
      </div>
    </div>
  );
}
