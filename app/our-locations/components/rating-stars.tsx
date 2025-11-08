import Image from "next/image";

interface RatingStarsProps {
  rating: number; // e.g., 4.5
  totalReviews?: number; // e.g., 123
}

export default function RatingStars({ rating, totalReviews }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-[7px]">
      <div className="flex items-center gap-1">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Image
            key={`full-${i}`}
            src="/images/icons/star-filled.svg"
            alt=""
            width={18}
            height={18}
            className="aspect-square"
            aria-hidden="true"
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <Image
            src="/images/icons/star-half.svg"
            alt=""
            width={18}
            height={18}
            className="aspect-square"
            aria-hidden="true"
          />
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Image
            key={`empty-${i}`}
            src="/images/icons/star-empty.svg"
            alt=""
            width={18}
            height={18}
            className="aspect-square"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Rating text */}
      {totalReviews !== undefined && (
        <span className="text-[#4E5969] text-[16px] font-normal leading-normal">
          {rating.toFixed(1)}
        </span>
      )}
      <span className="sr-only">Rating {rating.toFixed(1)} out of 5</span>
    </div>
  );
}
