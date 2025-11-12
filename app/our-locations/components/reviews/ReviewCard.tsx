// app/our-locations/components/reviews/ReviewCard.tsx
import Image from "next/image";
import RatingStars from "../rating-stars";

export interface ReviewItem {
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  review_text: string;
}

export default function ReviewCard({ author_name, author_photo_url, rating, review_text }: ReviewItem) {
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
        <p className="text-[#4E5969] text-[18px] font-normal leading-normal mt-2">
          {review_text}
        </p>
      </div>
    </div>
  );
}
