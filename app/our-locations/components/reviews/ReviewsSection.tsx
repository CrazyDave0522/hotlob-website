// app/our-locations/components/reviews/ReviewsSection.tsx
import ReviewCard, { ReviewItem } from "./ReviewCard";

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  isMobile?: boolean;
}

export default function ReviewsSection({ reviews, isMobile = false }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section
      className={`w-full pb-5 ${isMobile ? 'pt-10' : 'pt-[60px]'}`}
      style={{
        background: "linear-gradient(180deg, #FBF3F3 0%, #FFF 100%)",
      }}
    >
      <div className="mx-auto flex flex-col items-center" style={isMobile ? { width: '100%', maxWidth: '100%' } : { width: '72.917%', maxWidth: '1400px' }}>
        <h2 className="font-semibold text-black mb-5" style={{ fontSize: isMobile ? '34px' : 'clamp(22px, 1.667vw, 32px)' }}>See what people are saying</h2>
        <div className={`${isMobile ? 'mx-auto' : 'w-full'} rounded-[20px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.12)] p-[30px] flex flex-col gap-10`} style={isMobile ? { width: '690px' } : {}}>
          {reviews.map((r, idx) => (
            <ReviewCard key={idx} {...r} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}