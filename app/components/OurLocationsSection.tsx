"use client";

import Image from "next/image";
import HomeStoreItem from "./home-store-item";
import ReviewBubble from "./ReviewBubble";
import { SectionTitle } from "./SectionTitle";
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
    <section className="our-locations-section">
      {/* Mobile background - rotated */}
      <div className="our-locations-bg-mobile-wrapper">
        <Image
          src="/images/home-bg-locations.png"
          alt="Our locations background"
          width={750}
          height={2000}
          className="our-locations-bg-mobile"
          priority
        />
      </div>
      
      {/* Desktop background */}
      <Image
        src="/images/home-bg-locations.png"
        alt="Our locations background"
        width={1920}
        height={720}
        className="our-locations-bg-desktop"
        priority
      />

      {/* Content overlay */}
      <div className="our-locations-content">
        {/* Main content wrapper */}
        <div className="our-locations-main">
          {/* Mobile stores section */}
          <div className="our-locations-stores-mobile">
            <div className="our-locations-stores-mobile-inner">
              <div className="our-locations-title-mobile">
                <SectionTitle
                  icon={{
                    src: "/images/icons/store.svg",
                    alt: "Store icon",
                    width: 32,
                    height: 32
                  }}
                >
                  Our Locations
                </SectionTitle>
              </div>

              <div className="our-locations-stores-list-mobile">
                {topStores.map((store, index) => (
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
                    isLast={index === topStores.length - 1}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop stores section */}
          <div className="our-locations-stores-desktop">
            <div className="our-locations-title-desktop">
              <SectionTitle
                className="justify-start"
                icon={{
                  src: "/images/icons/store.svg",
                  alt: "Store icon",
                  width: 40,
                  height: 40
                }}
              >
                Our Locations
              </SectionTitle>
            </div>

            <div className="flex flex-col items-start">
              {topStores.map((store, index) => (
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
                  isLast={index === topStores.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Reviews section */}
          <div className="our-locations-reviews">
            {/* Mobile review image */}
            <Image
              src="/images/home-bg-locations-review-mb.png"
              alt="Customer reviews"
              width={750}
              height={826}
              className="our-locations-review-mobile"
              priority
            />
            
            {/* Desktop review image */}
            <Image
              src="/images/home-bg-locations-review.png"
              alt="Customer reviews"
              fill
              sizes="(max-width:1023px) 0vw, (max-width:1200px) 50vw, 40vw"
              className="our-locations-review-desktop"
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
