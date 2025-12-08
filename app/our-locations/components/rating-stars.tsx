import Image from "next/image";

interface RatingStarsProps {
  rating: number; // e.g., 4.5
  variant?: "review-bubble" | "review-card" | "store-info";
}

export default function RatingStars({ rating, variant = "store-info" }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Variant-specific CSS classes
  const variantClasses = {
    "review-bubble": {
      starClass: "rating-star-bubble",
      textClass: "rating-text-bubble",
      gap: "gap-[4px]",
    },
    "review-card": {
      starClass: "rating-star-review-card",
      textClass: "rating-text-review-card",
      gap: "gap-[7px]",
    },
    "store-info": {
      starClass: "rating-star-store",
      textClass: "rating-text-store",
      gap: "gap-[8px]",
    },
  };

  const config = variantClasses[variant];

  return (
    <div className={`flex items-center ${config.gap}`}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Image
          key={`full-${i}`}
          src="/images/icons/star-filled.svg"
          alt=""
          width={28}
          height={28}
          className={config.starClass}
          aria-hidden="true"
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <Image
          src="/images/icons/star-half.svg"
          alt=""
          width={28}
          height={28}
          className={config.starClass}
          aria-hidden="true"
        />
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Image
          key={`empty-${i}`}
          src="/images/icons/star-empty.svg"
          alt=""
          width={28}
          height={28}
          className={config.starClass}
          aria-hidden="true"
        />
      ))}

      <span className={`text-[#4E5969] ${config.textClass} font-normal leading-normal`}>
        {rating.toFixed(1)}
      </span>
      <span className="sr-only">Rating {rating.toFixed(1)} out of 5</span>
    </div>
  );
}
