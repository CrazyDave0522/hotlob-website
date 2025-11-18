// app/our-locations/components/reviews/ReviewsSection.tsx
import ReviewCard, { ReviewItem } from "./ReviewCard";

interface ReviewsSectionProps {
  reviews: ReviewItem[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section
      className="w-full pb-5 pt-[60px]"
      style={{
        background: "linear-gradient(180deg, #FBF3F3 0%, #FFF 100%)",
      }}
    >
      <div className="mx-auto flex flex-col items-center" style={{ width: '72.917%', maxWidth: '1400px' }}>
        <h2 className="text-[32px] font-semibold text-black mb-5">See what people are saying</h2>
        <div className="w-full rounded-[20px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.12)] p-[30px] flex flex-col gap-10">
          {reviews.map((r, idx) => (
            <ReviewCard key={idx} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}