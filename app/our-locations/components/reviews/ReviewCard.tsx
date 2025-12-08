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

export default function ReviewCard({ author_name, author_photo_url, rating, review_text, review_time, photos }: ReviewItem) {
  return (
    <div className="flex items-start self-stretch" style={{ gap: "clamp(6.5px, calc(13/750*100vw), 13px)" }}>
      {/* Avatar */}
      {author_photo_url ? (
        <Image
          src={author_photo_url}
          alt={author_name}
          width={80}
          height={80}
          className="review-card-avatar"
        />
      ) : (
        <div className="review-card-avatar-placeholder" />
      )}

      {/* Content */}
      <div className="flex-1">
        <span className="review-card-author">
          {author_name}
        </span>
        <div className="review-card-date">
          {formatAUDate(review_time)}
        </div>
        <div style={{ marginTop: "clamp(7px, calc(14/750*100vw), 14px)" }}>
          <RatingStars rating={rating} variant="review-card" />
        </div>
        <p className="review-card-text">
          {review_text}
        </p>

        {/* Photos Section */}
        {photos && photos.length > 0 && (
          <>
            <div className="border-b border-[#E1E4E9]" />
            <div className="review-card-photos">
              <ImageWithLightbox
                images={photos}
                alt={`Photo by ${author_name}`}
                layout="grid"
                size="responsive"
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
