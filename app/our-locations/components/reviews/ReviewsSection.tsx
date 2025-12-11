// app/our-locations/components/reviews/ReviewsSection.tsx
import ReviewCard, { ReviewItem } from "./ReviewCard";

interface ReviewsSectionProps {
  reviews: ReviewItem[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="w-full pb-5 pt-10 md:pt-[60px] reviews-section-bg">
      <div className="mx-auto flex flex-col items-center w-full max-w-full md:w-[72.917%] md:max-w-[1400px]">
        <h2 className="font-semibold text-black mb-5 text-[clamp(19px,calc(36/750*100vw),36px)] md:text-[clamp(17px,calc(34/1920*100vw),34px)]">See what people are saying</h2>
        <div className="reviews-container mx-auto w-[clamp(345px,calc(690/750*100vw),690px)] max-w-full md:w-full rounded-[20px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.12)] p-[clamp(15px,calc(30/750*100vw),30px)] flex flex-col">
          {reviews.map((r, idx) => (
            <ReviewCard key={idx} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}