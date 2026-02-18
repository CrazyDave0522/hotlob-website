import Image from "next/image";
import { fetchReviews } from "../lib/reviews";
import type { CuratedReview } from "../types/review";
import Bubble from "./Bubble";

// Server component: fetch reviews server-side and render mobile-first layout
export default async function ReviewShowcase() {
  let reviews: CuratedReview[] = [];
  try {
    reviews = await fetchReviews();
  } catch {
    reviews = [];
  }

  const topThree = reviews.slice(0, 3);
  const topTwo = reviews.slice(0, 2);


  return (
    <>
      {/* Mobile-first: mobile background and bottom row of bubbles (show only top 2 on mobile) */}
      <div className="relative md:hidden aspect-4/3">
        <Image
          src="/images/section-bg/home-bg-locations-review-mb.png"
          alt="Locations and reviews background mobile"
          fill
          sizes="100vw"
          className="object-contain"
        />

        {topTwo.length > 0 && (
          <div className="absolute inset-0 pointer-events-none rs-overlay-frame">
            <div className="absolute inset-0 flex flex-col items-center justify-evenly gap-4 pointer-events-auto">
              {topTwo.map((r) => (
                <div
                  key={r.id}
                  className="relative flex items-center justify-center w-full"
                >
                  <Bubble
                    authorName={r.author_name}
                    authorPhotoUrl={r.author_photo_url}
                    rating={r.rating}
                    text={r.review_text}
                    size="sm"
                    className="w-[90%]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: right-side background with positioned bubbles (stacked) */}
      <div className="hidden md:block relative">
        <Image
          src="/images/section-bg/home-bg-locations-review.png"
          alt="Locations and reviews background"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain"
        />

        {topThree.length > 0 && (
          <div className="absolute inset-0 pointer-events-none rs-overlay-frame">
            {/* Full-height column with evenly spaced, centered reviews */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-evenly items-center">
              {topThree.map((r, idx) => {
                if (!r) return null;

                const right = idx === 1;
                const headerLeft = idx === 1;

                return (
                  <div
                    className="pointer-events-auto rs-bubble-wrap w-[90%]"
                    key={r.id}
                  >
                    <Bubble
                      authorName={r.author_name}
                      authorPhotoUrl={r.author_photo_url}
                      rating={r.rating}
                      text={r.review_text}
                      size="md"
                      right={right}
                      headerLeft={headerLeft}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Provide a named export for consumers that import { ReviewShowcase }
export { ReviewShowcase };
