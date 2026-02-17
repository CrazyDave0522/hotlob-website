import Image from "next/image";
import { fetchReviews } from "../lib/reviews";
import type { CuratedReview } from "../types/review";
import Avatar from "./Avatar";
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

  // truncate helper moved to utils/truncate.ts

  return (
    <>
      {/* Mobile-first: mobile background and bottom row of bubbles (show only top 2 on mobile) */}
      <div className="relative md:hidden aspect-4/3">
        <Image
          src="/images/section-bg/home-bg-locations-review-mb.png"
          alt="Locations and reviews background mobile"
          fill
          className="object-contain"
        />

        {topTwo.length > 0 && (
          <div className="absolute inset-0 flex items-end px-4 pb-4 pointer-events-none">
            <div className="w-full flex flex-col gap-3 pointer-events-auto">
              {topTwo.map((r, idx) => (
                <div key={r.id} className="relative w-full flex items-center">
                  {/* Avatar positioned to overlap its bubble corner */}
                  <Avatar
                    photoUrl={r.author_photo_url}
                    name={r.author_name ?? undefined}
                    size="sm"
                    className={`rs-avatar--abs ${
                      idx === 0
                        ? "rs-avatar-pos-left-top"
                        : "rs-avatar-pos-right-top"
                    } shrink-0`}
                  />

                  <Bubble
                    authorName={r.author_name}
                    rating={r.rating}
                    text={r.review_text}
                    size="sm"
                    className="w-full"
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
          className="object-contain"
        />

        {topThree.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Use a full-height flex column so items are positioned relatively
                Top / middle / bottom are achieved with `justify-between` and
                horizontal placement with `self-start` / `self-end` + margins. */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
              {topThree.map((r, idx) => {
                if (!r) return null;

                const horizontalClass =
                  idx === 1 ? "self-end mr-8" : "self-start ml-6";
                const avatarClass =
                  idx === 0
                    ? "rs-avatar--abs rs-avatar-desktop-top-left"
                    : idx === 1
                      ? "rs-avatar--abs rs-avatar-desktop-bottom-right"
                      : "rs-avatar--abs rs-avatar-desktop-bottom-left";
                const right = idx === 1;
                const headerLeft = idx === 1;

                return (
                  <div
                    className={`pointer-events-auto rs-bubble-wrap ${horizontalClass}`}
                    key={r.id}
                  >
                    <div className="relative">
                      <Avatar
                        photoUrl={r.author_photo_url}
                        name={r.author_name ?? undefined}
                        size="md"
                        className={avatarClass}
                      />

                      <Bubble
                        authorName={r.author_name}
                        rating={r.rating}
                        text={r.review_text}
                        size="md"
                        right={right}
                        headerLeft={headerLeft}
                      />
                    </div>
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
