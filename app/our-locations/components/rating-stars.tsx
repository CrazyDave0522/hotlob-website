import Image from "next/image";

interface RatingStarsProps {
  rating: number; // e.g., 4.5
  size?: "small" | "large" | "xl" | "responsive" | "fixed"; // fixed for store card (18px @ 750px, no scaling)
}

export default function RatingStars({ rating, size = "large" }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // For size="large" (used in home-store-item), use responsive scaling from 750px baseline
  const starSize = size === "small" ? 12 : size === "xl" ? 28 : size === "responsive" ? 28 : size === "fixed" ? 18 : size === "large" ? 18 : 18;
  const fontSize = size === "small" ? "text-[12px]" : size === "xl" ? "text-[22px]" : size === "responsive" ? "responsive-review-rating-text" : size === "fixed" ? "text-[16px]" : size === "large" ? "responsive-rating-text" : "text-[16px]";
  const gap = size === "small" ? "gap-[4px]" : size === "xl" ? "gap-[7px]" : size === "responsive" ? "gap-[7px]" : size === "fixed" ? "gap-[8px]" : size === "large" ? "responsive-rating-gap" : "gap-[7px]";
  const starClass = size === "responsive" ? "rating-star-responsive" : size === "fixed" ? "aspect-square" : size === "large" ? "rating-star-large" : "aspect-square";

  return (
    <div className={`flex items-center ${gap}`}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Image
          key={`full-${i}`}
          src="/images/icons/star-filled.svg"
          alt=""
          width={starSize}
          height={starSize}
          className={starClass}
          aria-hidden="true"
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <Image
          src="/images/icons/star-half.svg"
          alt=""
          width={starSize}
          height={starSize}
          className={starClass}
          aria-hidden="true"
        />
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Image
          key={`empty-${i}`}
          src="/images/icons/star-empty.svg"
          alt=""
          width={starSize}
          height={starSize}
          className={starClass}
          aria-hidden="true"
        />
      ))}

      <span className={`text-[#4E5969] ${fontSize} font-normal leading-normal`}>
        {rating.toFixed(1)}
      </span>
      <span className="sr-only">Rating {rating.toFixed(1)} out of 5</span>
    </div>
  );
}
