// app/our-locations/components/reviews/ReviewCard.tsx
"use client";

import Image from "next/image";
import RatingStars from "../rating-stars";
import ImageWithLightbox from "@/app/components/ImageWithLightbox";
import { formatAUDate } from "@/lib/utils/formatDate";

export interface ReviewItem {
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  review_text: string;
  review_time: string;
  photos?: string[]; // Array of photo URLs (max 5)
}

export default function ReviewCard({ author_name, author_photo_url, rating, review_text, review_time, photos, isMobile = false }: ReviewItem & { isMobile?: boolean }) {
  return (
    <div className="flex items-start gap-[13px] self-stretch">
      {/* Avatar */}
      {author_photo_url ? (
        <Image
          src={author_photo_url}
          alt={author_name}
          width={isMobile ? 80 : 50}
          height={isMobile ? 80 : 50}
          className="rounded-full object-cover shrink-0"
        />
      ) : (
        <div className={`${isMobile ? 'w-20 h-20' : 'w-[50px] h-[50px]'} rounded-full bg-gray-300 shrink-0`} />
      )}

      {/* Content */}
      <div className="flex-1">
        <span className="text-black font-semibold uppercase" style={{ fontSize: isMobile ? '30px' : '20px' }}>
          {author_name}
        </span>
        <div className="text-[#86909C] font-normal leading-normal" style={{ fontSize: isMobile ? '18px' : '14px', marginTop: '10px' }}>
          {formatAUDate(review_time)}
        </div>
        <div className={isMobile ? 'mt-3.5' : 'mt-3.5'}>
          <RatingStars rating={rating} size={isMobile ? "xl" : "large"} />
        </div>
        <p className="text-[#4E5969] font-normal leading-normal" style={{ fontSize: isMobile ? '26px' : '18px', marginTop: '14px', paddingBottom: '20px' }}>
          {review_text}
        </p>

        {/* Photos Section */}
        {photos && photos.length > 0 && (
          <>
            <div className="border-b border-[#E1E4E9]" />
            <div style={{ paddingTop: isMobile ? '20px' : '30px' }}>
              <ImageWithLightbox
                images={photos}
                alt={`Photo by ${author_name}`}
                layout="grid"
                size={isMobile ? { width: 160, height: 120 } : { width: 212, height: 141 }}
                gridGap="30px"
                highResTransform={(url) => {
                  try {
                    const urlObj = new URL(url);
                    urlObj.searchParams.set('maxWidthPx', '2000');
                    return urlObj.toString();
                  } catch {
                    return url;
                  }
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
