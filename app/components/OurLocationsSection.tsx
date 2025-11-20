import Image from "next/image";
import HomeStoreItem from "./home-store-item";
import ReviewBubble from "./ReviewBubble";
import type { StoreWithData } from "@/lib/getStores";
import type { ReviewData } from "@/lib/getReviews";

interface OurLocationsSectionProps {
  stores: StoreWithData[];
  reviews: ReviewData[];
}

export default function OurLocationsSection({
  stores,
  reviews,
}: OurLocationsSectionProps) {
  // Display top 2 stores
  const topStores = stores.slice(0, 2);

  // Get first 4 reviews for bubbles
  const bubbleReviews = reviews.slice(0, 4);

  return (
    <section className="relative w-full" style={{ display: "block" }}>
      {/* Background image */}
      <Image
        src="/images/home-bg-locations.png"
        alt="Our locations background"
        width={1920}
        height={720}
        className="w-full h-auto"
        priority
        style={{ aspectRatio: "1920/720", display: "block" }}
      />

      {/* Content overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          paddingLeft: "min(13.542vw, 260px)", // 260/1920
          paddingRight: "min(13.542vw, 260px)", // 260/1920
          paddingTop: "min(3.125vw, 60px)", // 60/1920
          boxSizing: "border-box",
        }}
      >
        {/* Main content: left side (title + stores) and right side (review) */}
        <div className="flex h-full" style={{ gap: "min(2.188vw, 42px)" }}> {/* 42/1920 */}
          {/* Left side: title and stores list */}
          <div className="flex flex-col" style={{ width: "min(35.938vw, 690px)" }}>
            {/* Title with icon */}
            <div
              className="flex items-center"
              style={{
                marginBottom: "min(2.604vw, 50px)", // 50/1920
                gap: "min(1.875vw, 36px)", // 36/1920
              }}
            >
              <Image src="/images/icons/store.svg" alt="" width={40} height={40} />
              <h2 className="text-[34px] font-semibold text-[#1D1E1F] leading-normal">
                Our Locations
              </h2>
            </div>

            {/* Stores list */}
            <div className="flex flex-col items-start">
              {topStores.map((store) => (
                <HomeStoreItem
                  key={store.id}
                  name={store.name}
                  street={store.street}
                  suburb={store.suburb}
                  state={store.state}
                  postcode={store.postcode}
                  photos={store.photos}
                  rating={store.rating}
                  openingHoursWeekdayText={store.openingHoursWeekdayText}
                />
              ))}
            </div>
          </div>

          {/* Right side: review container - full height, width adapts to aspect ratio */}
          <div className="flex-1 relative">
            <Image
              src="/images/home-bg-locations-review.png"
              alt="Customer reviews"
              fill
              className="object-cover"
            />

            {/* Review bubbles overlaid on image */}
            {bubbleReviews.length >= 4 && (
              <>
                <ReviewBubble review={bubbleReviews[0]} position="top" />
                <ReviewBubble review={bubbleReviews[1]} position="right" />
                <ReviewBubble review={bubbleReviews[2]} position="bottom" />
                <ReviewBubble review={bubbleReviews[3]} position="left" />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
